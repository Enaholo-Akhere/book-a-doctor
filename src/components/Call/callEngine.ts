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
  isReconnecting: boolean;
}

const IDLE: CallState = {
  status: 'idle',
  session: null,
  localStream: null,
  remoteStream: null,
  isMuted: false,
  isCameraOff: false,
  connectedAt: null,
  isReconnecting: false,
};

const FALLBACK_ICE: RTCIceServer[] = [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }];
const SIGNAL_TIMEOUT_MS = 10_000;
/** While media is down, renegotiate (ICE restart) this often until it recovers or the user hangs up. */
const ICE_RETRY_MS = 8_000;
/** Hint the user if a call hasn't connected after this long (it keeps trying). */
const SLOW_CONNECT_HINT_MS = 15_000;
/**
 * Video is sized for real-world links (mobile uplinks, TURN relays), not LAN:
 * 640x480 and a bitrate cap keep frames flowing where 720p would stall.
 */
const VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  width: { ideal: 640 },
  height: { ideal: 480 },
  frameRate: { ideal: 24, max: 30 },
  facingMode: 'user',
};
const VIDEO_MAX_BITRATE = 600_000;

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

/** Caps outgoing video so it degrades gracefully instead of stalling on slow links. */
const capVideoBitrate = async (pc: RTCPeerConnection) => {
  for (const sender of pc.getSenders()) {
    if (sender.track?.kind !== 'video') continue;
    const params = sender.getParameters();
    if (!params.encodings?.length) params.encodings = [{}];
    params.encodings[0].maxBitrate = VIDEO_MAX_BITRATE;
    await sender.setParameters(params).catch(() => undefined);
  }
};

/**
 * Logs how the call connected (direct vs TURN relay) and, a few seconds in,
 * whether video frames are actually flowing. Open the console to diagnose.
 */
const logCallRoute = async (pc: RTCPeerConnection) => {
  try {
    const stats = await pc.getStats();
    let pairId: string | undefined;
    stats.forEach((r) => {
      if (r.type === 'transport' && r.selectedCandidatePairId) pairId = r.selectedCandidatePairId;
    });
    stats.forEach((r) => {
      if (!pairId && r.type === 'candidate-pair' && r.nominated && r.state === 'succeeded') pairId = r.id;
    });
    const pair = pairId ? stats.get(pairId) : undefined;
    const local = pair && stats.get(pair.localCandidateId);
    const remote = pair && stats.get(pair.remoteCandidateId);
    console.info('[call] connected via', {
      local: local && `${local.candidateType}/${local.protocol}`,
      remote: remote && `${remote.candidateType}/${remote.protocol}`,
      relayed: local?.candidateType === 'relay' || remote?.candidateType === 'relay',
    });

    setTimeout(async () => {
      if (pc.connectionState === 'closed') return;
      const later = await pc.getStats();
      later.forEach((r) => {
        if (r.kind !== 'video') return;
        if (r.type === 'inbound-rtp') {
          console.info('[call] video in', { framesDecoded: r.framesDecoded, packetsLost: r.packetsLost, size: `${r.frameWidth}x${r.frameHeight}` });
        } else if (r.type === 'outbound-rtp') {
          console.info('[call] video out', { framesSent: r.framesSent, limitedBy: r.qualityLimitationReason, size: `${r.frameWidth}x${r.frameHeight}` });
        }
      });
    }, 5_000);
  } catch {
    // diagnostics only
  }
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
  /** Socket dropped during an answered call; re-bind it on reconnect. */
  private awaitingResume = false;
  private iceRetryTimer: ReturnType<typeof setInterval> | undefined;
  private slowConnectTimer: ReturnType<typeof setTimeout> | undefined;

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
    // Socket replaced/removed (logout, account switch): hang up so the peer knows.
    if (this.state.status !== 'idle') this.endCall();
    this.detachSocket?.();
    this.detachSocket = null;
    this.socket = socket;
    if (!socket) return;

    socket.on('call:incoming', this.onIncoming);
    socket.on('call:accepted', this.onAccepted);
    socket.on('call:dismissed', this.onDismissed);
    socket.on('call:ended', this.onEnded);
    socket.on('call:signal', this.onSignal);
    socket.on('disconnect', this.onDisconnect);
    socket.on('connect', this.onReconnect);
    this.detachSocket = () => {
      socket.off('call:incoming', this.onIncoming);
      socket.off('call:accepted', this.onAccepted);
      socket.off('call:dismissed', this.onDismissed);
      socket.off('call:ended', this.onEnded);
      socket.off('call:signal', this.onSignal);
      socket.off('disconnect', this.onDisconnect);
      socket.off('connect', this.onReconnect);
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

  /**
   * A dropped socket doesn't stop peer-to-peer media, so an answered call is
   * never ended here: it waits for Socket.IO to reconnect and `onReconnect`
   * re-binds it. Only the user (or the server's safety net) ends it. Calls
   * still ringing can't be resumed and end immediately.
   */
  private onDisconnect = () => {
    const { status, session } = this.state;
    if (status === 'idle') return;

    if ((status === 'connecting' || status === 'active') && session?.callId) {
      this.awaitingResume = true;
      this.set({ isReconnecting: true });
      return;
    }

    this.teardown();
    toast.error('Connection lost. The call has ended.');
  };

  private onReconnect = () => {
    const callId = this.state.session?.callId;
    if (!this.awaitingResume || !callId) return;

    this.socket?.timeout(SIGNAL_TIMEOUT_MS).emit('call:resume', { callId }, (err, res) => {
      if (this.state.session?.callId !== callId) return;
      if (err) return; // still flaky; the next reconnect retries
      if (!res.ok) {
        // The server already closed it (peer hung up, or safety net expired).
        this.teardown();
        toast('Call ended', { icon: '📞' });
        return;
      }
      this.awaitingResume = false;
      this.set({ isReconnecting: this.isMediaDown() });
      // Signals sent while offline were dropped; renegotiate if media is down too.
      if (this.isMediaDown()) this.restartIce();
    });
  };

  /** Closing or reloading the tab is an intentional hang-up. */
  handlePageHide = () => {
    if (this.state.status !== 'idle') this.endCall();
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
      switch (pc.connectionState) {
        case 'connected':
          void capVideoBitrate(pc);
          void logCallRoute(pc);
          this.stopIceRetry();
          clearTimeout(this.slowConnectTimer);
          this.set({
            status: 'active',
            connectedAt: this.state.connectedAt ?? Date.now(),
            isReconnecting: this.awaitingResume,
          });
          break;
        case 'disconnected': // often recovers on its own (network switch, brief loss)
        case 'failed': // needs new candidates: keep renegotiating until it's back
          this.startIceRetry(pc.connectionState === 'failed');
          break;
      }
    };

    clearTimeout(this.slowConnectTimer);
    this.slowConnectTimer = setTimeout(() => {
      if (this.pc === pc && pc.connectionState !== 'connected') {
        toast('Still connecting… a weak network can slow this down. You can hang up anytime.', { icon: '⏳' });
      }
    }, SLOW_CONNECT_HINT_MS);

    this.pc = pc;
    return pc;
  }

  private isMediaDown() {
    const state = this.pc?.connectionState;
    return state === 'disconnected' || state === 'failed';
  }

  /** Keeps trying to bring media back; never hangs up on its own. */
  private startIceRetry(restartNow: boolean) {
    if (this.state.status === 'active') this.set({ isReconnecting: true });
    if (restartNow) this.restartIce();
    if (this.iceRetryTimer) return;
    this.iceRetryTimer = setInterval(() => {
      if (this.isMediaDown()) this.restartIce();
      else this.stopIceRetry();
    }, ICE_RETRY_MS);
  }

  private stopIceRetry() {
    clearInterval(this.iceRetryTimer);
    this.iceRetryTimer = undefined;
  }

  /** Only the caller sends offers, which avoids offer glare. */
  private restartIce() {
    const pc = this.pc;
    const callId = this.state.session?.callId;
    if (!pc || !callId || this.state.session?.direction !== 'outgoing' || !this.socket?.connected) return;
    this.enqueue(async () => {
      if (this.pc !== pc || pc.signalingState !== 'stable') return;
      const offer = await pc.createOffer({ iceRestart: true });
      await pc.setLocalDescription(offer);
      this.socket?.emit('call:signal', { callId, description: pc.localDescription!.toJSON() });
    });
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
        video: callType === 'video' ? VIDEO_CONSTRAINTS : false,
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
    this.stopIceRetry();
    clearTimeout(this.slowConnectTimer);
    this.awaitingResume = false;
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
