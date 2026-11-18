import toast from 'react-hot-toast';
import { getIceServers } from '@/services/chat.service';
import type { AppSocket, CallEndReason, SignalPayload } from '@/library/socket/events';
import type { CallType, ChatPeer } from '@/types/chat';
import type { CallSession, CallStatus } from './callContext';
import { playTone } from './tones';

/**
 * Framework-agnostic WebRTC call controller (1:1 calls).
 *
 * Signalling runs over the app socket; media is peer-to-peer. The caller
 * creates the offer once the callee accepts, the callee answers, and ICE
 * candidates trickle both ways. All signalling work is serialised through a
 * promise queue so candidates never race the remote description.
 *
 * React subscribes via `subscribe`/`getState` (useSyncExternalStore).
 */

export interface CallState {
  status: CallStatus;
  session: CallSession | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isCameraOff: boolean;
  connectedAt: number | null;
}

const IDLE: CallState = {
  status: 'idle',
  session: null,
  localStream: null,
  remoteStream: null,
  isMuted: false,
  isCameraOff: false,
  connectedAt: null,
};

const FALLBACK_ICE: RTCIceServer[] = [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }];
const SIGNAL_TIMEOUT_MS = 10_000;

const typeLabel = (t: CallType) => (t === 'video' ? 'video' : 'voice');

const endMessage = (reason: CallEndReason, s: CallSession): string | null => {
  const name = s.peer.name;
  if (reason === 'ended') return 'Call ended';
  if (reason === 'failed' || reason === 'disconnected') return 'Call dropped';
  if (s.direction === 'incoming') return `Missed ${typeLabel(s.callType)} call from ${name}`;
  if (reason === 'rejected') return `${name} declined the call`;
  if (reason === 'missed') return `${name} didn't answer`;
  return null;
};

const mediaErrorMessage = (err: unknown, callType: CallType) => {
  const name = err instanceof DOMException ? err.name : '';
  const devices = callType === 'video' ? 'camera and microphone' : 'microphone';
  if (name === 'NotAllowedError') return `Allow access to your ${devices} to make calls`;
  if (name === 'NotFoundError') return `No ${devices} found`;
  if (name === 'NotReadableError') return `Your ${devices} is being used by another app`;
  return `Could not access your ${devices}`;
};

export class CallEngine {
  private state: CallState = IDLE;
  private listeners = new Set<() => void>();
  private socket: AppSocket | null = null;
  private detachSocket: (() => void) | null = null;
  private pc: RTCPeerConnection | null = null;
  private pendingCandidates: RTCIceCandidateInit[] = [];
  private signalQueue: Promise<void> = Promise.resolve();
  private stopTone: (() => void) | null = null;
  private iceServers: Promise<RTCIceServer[]> | null = null;

  // ── store ─────────────────────────────────────────────────────────
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getState = () => this.state;

  private set(patch: Partial<CallState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  }

  // ── socket wiring ─────────────────────────────────────────────────
  attach(socket: AppSocket | null) {
    this.detachSocket?.();
    this.detachSocket = null;
    if (this.state.status !== 'idle') this.teardown();
    this.socket = socket;
    if (!socket) return;

    socket.on('call:incoming', this.onIncoming);
    socket.on('call:accepted', this.onAccepted);
    socket.on('call:dismissed', this.onDismissed);
    socket.on('call:ended', this.onEnded);
    socket.on('call:signal', this.onSignal);
    socket.on('disconnect', this.onDisconnect);
    this.detachSocket = () => {
      socket.off('call:incoming', this.onIncoming);
      socket.off('call:accepted', this.onAccepted);
      socket.off('call:dismissed', this.onDismissed);
      socket.off('call:ended', this.onEnded);
      socket.off('call:signal', this.onSignal);
      socket.off('disconnect', this.onDisconnect);
    };
  }

  // ── public actions ────────────────────────────────────────────────
  startCall = async (peer: ChatPeer, callType: CallType) => {
    if (this.state.status !== 'idle') return void toast.error('You are already on a call');
    const socket = this.socket;
    if (!socket?.connected) return void toast.error('You are offline. Check your connection and try again.');

    // Claim the line before awaiting permissions so double-clicks are ignored.
    this.set({ status: 'outgoing', session: { callId: null, peer, callType, direction: 'outgoing' } });
    void this.loadIceServers();

    const media = await this.getMedia(callType);
    // Re-read state after the await (the user may have hung up meanwhile).
    const current = this.getState();
    if (current.status !== 'outgoing' || current.session?.callId !== null) {
      media?.stream.getTracks().forEach((t) => t.stop()); // cancelled meanwhile
      return;
    }
    if (!media) return this.teardown();

    this.set({ localStream: media.stream, isCameraOff: media.cameraOff });
    this.playTone('outgoing');

    socket.timeout(SIGNAL_TIMEOUT_MS).emit('call:invite', { otherUserId: peer._id, callType }, (err, res) => {
      const stillWaiting =
        this.state.status === 'outgoing' && this.state.session?.peer._id === peer._id && !this.state.session.callId;

      if (err || !res.ok) {
        if (stillWaiting) {
          toast.error(err ? 'Could not reach the server' : !res.ok ? res.error : 'Call failed');
          this.teardown();
        }
        return;
      }
      // Hung up before the server answered: cancel the call it just created.
      if (!stillWaiting) return void socket.emit('call:end', { callId: res.callId });
      this.set({ session: { ...this.state.session!, callId: res.callId } });
    });
  };

  acceptCall = async () => {
    const { status, session } = this.state;
    if (status !== 'incoming' || !session?.callId) return;
    const { callId } = session;

    this.stopToneNow();
    this.set({ status: 'connecting' });

    const media = await this.getMedia(session.callType);
    if (this.state.session?.callId !== callId) {
      media?.stream.getTracks().forEach((t) => t.stop()); // caller hung up meanwhile
      return;
    }
    if (!media) {
      this.socket?.emit('call:reject', { callId });
      return this.teardown();
    }
    this.set({ localStream: media.stream, isCameraOff: media.cameraOff });

    // Peer must exist before accepting: the caller sends its offer right after.
    if (!(await this.createPeer(callId, media.stream))) return;

    this.socket?.timeout(SIGNAL_TIMEOUT_MS).emit('call:accept', { callId }, (err, res) => {
      if (err || !res.ok) {
        if (this.state.session?.callId !== callId) return;
        toast.error(err ? 'Could not reach the server' : !res.ok ? res.error : 'Call failed');
        this.teardown();
      }
    });
  };

  rejectCall = () => {
    const { status, session } = this.state;
    if (status !== 'incoming' || !session?.callId) return;
    this.socket?.emit('call:reject', { callId: session.callId });
    this.teardown();
  };

  endCall = () => {
    const { status, session } = this.state;
    if (status === 'idle') return;
    if (status === 'incoming') return this.rejectCall();
    if (session?.callId) this.socket?.emit('call:end', { callId: session.callId });
    this.teardown();
  };

  toggleMute = () => {
    const tracks = this.state.localStream?.getAudioTracks() ?? [];
    if (!tracks.length) return;
    const muted = !this.state.isMuted;
    tracks.forEach((t) => (t.enabled = !muted));
    this.set({ isMuted: muted });
  };

  toggleCamera = () => {
    const tracks = this.state.localStream?.getVideoTracks() ?? [];
    if (!tracks.length) return;
    const off = !this.state.isCameraOff;
    tracks.forEach((t) => (t.enabled = !off));
    this.set({ isCameraOff: off });
  };

  // ── socket events ─────────────────────────────────────────────────
  private onIncoming = ({ callId, callType, from }: { callId: string; callType: CallType; from: ChatPeer }) => {
    if (this.state.status !== 'idle') return; // server already guards busy lines
    this.set({ status: 'incoming', session: { callId, peer: from, callType, direction: 'incoming' } });
    this.playTone('incoming');
    void this.loadIceServers();
  };

  private onAccepted = async ({ callId }: { callId: string }) => {
    const { status, session, localStream } = this.state;
    if (status !== 'outgoing' || session?.callId !== callId) return;
    if (!localStream) return this.endCall();

    this.stopToneNow();
    this.set({ status: 'connecting' });

    const pc = await this.createPeer(callId, localStream);
    if (!pc) return;
    this.enqueue(async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      this.socket?.emit('call:signal', { callId, description: pc.localDescription!.toJSON() });
    });
  };

  private onSignal = (payload: SignalPayload) => {
    this.enqueue(() => this.handleSignal(payload));
  };

  private onDismissed = ({ callId }: { callId: string }) => {
    if (this.state.session?.callId === callId) this.teardown();
  };

  private onEnded = ({ callId, reason }: { callId: string; reason: CallEndReason }) => {
    const session = this.state.session;
    if (!session || session.callId !== callId) return;
    const message = endMessage(reason, session);
    this.teardown();
    if (message) toast(message, { icon: '📞' });
  };

  private onDisconnect = () => {
    if (this.state.status === 'idle') return;
    this.teardown();
    toast.error('Connection lost. The call has ended.');
  };

  // ── WebRTC ────────────────────────────────────────────────────────
  private async handleSignal({ callId, description, candidate }: SignalPayload) {
    const pc = this.pc;
    if (!pc || this.state.session?.callId !== callId) return;

    if (description) {
      await pc.setRemoteDescription(description);
      if (description.type === 'offer') {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        this.socket?.emit('call:signal', { callId, description: pc.localDescription!.toJSON() });
      }
      for (const queued of this.pendingCandidates.splice(0)) {
        await pc.addIceCandidate(queued).catch(() => undefined);
      }
    } else if (candidate) {
      if (pc.remoteDescription) await pc.addIceCandidate(candidate).catch(() => undefined);
      else this.pendingCandidates.push(candidate);
    }
  }

  private async createPeer(callId: string, stream: MediaStream): Promise<RTCPeerConnection | null> {
    const iceServers = await this.loadIceServers();
    if (this.state.session?.callId !== callId) return null; // ended while loading

    const pc = new RTCPeerConnection({ iceServers });
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.ontrack = (e) => {
      const remote = e.streams[0] ?? new MediaStream([...(this.state.remoteStream?.getTracks() ?? []), e.track]);
      this.set({ remoteStream: remote });
    };
    pc.onicecandidate = (e) => {
      if (e.candidate) this.socket?.emit('call:signal', { callId, candidate: e.candidate.toJSON() });
    };
    pc.onconnectionstatechange = () => {
      if (this.pc !== pc) return;
      if (pc.connectionState === 'connected' && this.state.status !== 'active') {
        this.set({ status: 'active', connectedAt: this.state.connectedAt ?? Date.now() });
      } else if (pc.connectionState === 'failed') {
        toast.error('Could not connect the call. Check your network.');
        this.endCall();
      }
    };

    this.pc = pc;
    return pc;
  }

  private enqueue(task: () => Promise<void>) {
    this.signalQueue = this.signalQueue.then(task).catch((err) => console.error('[call] signalling error', err));
  }

  private async getMedia(callType: CallType): Promise<{ stream: MediaStream; cameraOff: boolean } | null> {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error('Calls need a secure (https) connection and a modern browser');
      return null;
    }
    const audio = { echoCancellation: true, noiseSuppression: true };
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio,
        video: callType === 'video' ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' } : false,
      });
      return { stream, cameraOff: false };
    } catch (err) {
      // No usable camera: still join a video call with audio only.
      const name = err instanceof DOMException ? err.name : '';
      if (callType === 'video' && (name === 'NotFoundError' || name === 'NotReadableError' || name === 'OverconstrainedError')) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio });
          toast('Camera unavailable. Continuing with audio only.', { icon: '🎙️' });
          return { stream, cameraOff: true };
        } catch (audioErr) {
          toast.error(mediaErrorMessage(audioErr, 'audio'));
          return null;
        }
      }
      toast.error(mediaErrorMessage(err, callType));
      return null;
    }
  }

  private loadIceServers(): Promise<RTCIceServer[]> {
    if (!this.iceServers) {
      this.iceServers = getIceServers().catch(() => {
        this.iceServers = null; // retry next call
        return FALLBACK_ICE;
      });
    }
    return this.iceServers;
  }

  private playTone(kind: 'incoming' | 'outgoing') {
    this.stopToneNow();
    this.stopTone = playTone(kind);
  }

  private stopToneNow() {
    this.stopTone?.();
    this.stopTone = null;
  }

  private teardown() {
    this.stopToneNow();
    if (this.pc) {
      this.pc.ontrack = null;
      this.pc.onicecandidate = null;
      this.pc.onconnectionstatechange = null;
      this.pc.close();
      this.pc = null;
    }
    this.state.localStream?.getTracks().forEach((t) => t.stop());
    this.pendingCandidates = [];
    this.signalQueue = Promise.resolve();
    this.set(IDLE);
  }
}
