import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoCall, IoMicOffOutline, IoMicOutline, IoVideocam, IoVideocamOffOutline, IoVideocamOutline } from 'react-icons/io5';
import { MdCallEnd } from 'react-icons/md';
import { Circle, Square } from 'lucide-react';
import { useRecordingConfig } from '@/Hook/useConsultations';
import avatarIconAsset from '@/assets/images/avatar-icon.png';
import { RecordingPrompt, useCall } from './callContext';

const avatarIcon: string = avatarIconAsset.src;

/**
 * True once the stream has a video track that is actually receiving frames.
 * Remote tracks exist (muted) as soon as they're negotiated, long before any
 * frame arrives, so the track's mute/unmute events are the real signal.
 */
const useHasLiveVideo = (stream: MediaStream | null) => {
  const check = () => Boolean(stream?.getVideoTracks().some((t) => t.readyState === 'live' && !t.muted));
  const [live, setLive] = useState(check);

  useEffect(() => {
    if (!stream) return setLive(false);
    const update = () => setLive(Boolean(stream.getVideoTracks().some((t) => t.readyState === 'live' && !t.muted)));
    const bound = new Set<MediaStreamTrack>();
    const bindTracks = () => {
      stream.getVideoTracks().forEach((t) => {
        if (bound.has(t)) return;
        bound.add(t);
        t.addEventListener('mute', update);
        t.addEventListener('unmute', update);
        t.addEventListener('ended', update);
      });
      update();
    };
    bindTracks();
    stream.addEventListener('addtrack', bindTracks);
    stream.addEventListener('removetrack', update);
    return () => {
      stream.removeEventListener('addtrack', bindTracks);
      stream.removeEventListener('removetrack', update);
      bound.forEach((t) => {
        t.removeEventListener('mute', update);
        t.removeEventListener('unmute', update);
        t.removeEventListener('ended', update);
      });
    };
  }, [stream]);

  return live;
};

const MediaView = ({
  stream,
  muted = false,
  mirrored = false,
  className = '',
}: {
  stream: MediaStream;
  muted?: boolean;
  mirrored?: boolean;
  className?: string;
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);

  const play = () => {
    ref.current
      ?.play()
      .then(() => setBlocked(false))
      .catch((err: unknown) => {
        // Mobile browsers may refuse unmuted autoplay; ask for a tap instead.
        if (err instanceof DOMException && err.name === 'NotAllowedError') setBlocked(true);
      });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.srcObject !== stream) el.srcObject = stream;
    play();
  }, [stream]);

  return (
    <>
      <video ref={ref} autoPlay playsInline muted={muted} className={`${className} ${mirrored ? '-scale-x-100' : ''}`} />
      {blocked && (
        <button
          type='button'
          onClick={play}
          className='absolute inset-0 z-30 flex items-center justify-center bg-black/60 text-lg font-semibold cursor-pointer'
        >
          Tap to start video
        </button>
      )}
    </>
  );
};

const AudioSink = ({ stream }: { stream: MediaStream }) => {
  const ref = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (ref.current && ref.current.srcObject !== stream) ref.current.srcObject = stream;
  }, [stream]);
  return <audio ref={ref} autoPlay />;
};

const formatDuration = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
};

const CallTimer = ({ since }: { since: number }) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className='tabular-nums'>{formatDuration(now - since)}</span>;
};

const ControlButton = ({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}) => (
  <div className='flex flex-col items-center gap-2'>
    <button
      type='button'
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`h-14 w-14 md:h-16 md:w-16 rounded-full flex items-center justify-center text-2xl transition cursor-pointer ${className}`}
    >
      {children}
    </button>
    <span className='text-xs text-white/80'>{label}</span>
  </div>
);

/** Asks the patient, in-call, whether the doctor may record. */
const RecordingConsentDialog = ({
  prompt,
  onAnswer,
}: {
  prompt: RecordingPrompt;
  onAnswer: (accept: boolean) => void;
}) => (
  <div className='absolute inset-0 z-40 flex items-end sm:items-center justify-center bg-black/60 p-4'>
    <div
      role='alertdialog'
      aria-labelledby='rec-consent-title'
      aria-describedby='rec-consent-text'
      className='w-full max-w-md rounded-2xl bg-white p-6 text-slate-800 shadow-2xl'
    >
      <h3 id='rec-consent-title' className='text-lg font-semibold text-headingColor'>
        {prompt.doctorName} would like to record this call
      </h3>
      <p id='rec-consent-text' className='mt-3 text-sm leading-6 text-slate-600'>
        {prompt.notice.text}
      </p>
      <div className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
        <button
          type='button'
          onClick={() => onAnswer(false)}
          className='cursor-pointer rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50'
        >
          Don&apos;t record
        </button>
        <button
          type='button'
          onClick={() => onAnswer(true)}
          className='cursor-pointer rounded-xl bg-primaryColor px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90'
        >
          Allow recording
        </button>
      </div>
    </div>
  </div>
);

const CallOverlay = () => {
  const {
    status,
    session,
    localStream,
    remoteStream,
    isMuted,
    isCameraOff,
    connectedAt,
    isReconnecting,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleCamera,
    recording,
    recordingPrompt,
    requestRecording,
    answerRecording,
    stopRecording,
  } = useCall();

  // Hooks must run before the early return below.
  const remoteHasVideo = useHasLiveVideo(remoteStream);
  const isDoctor = session?.peer.role === 'patient';
  const { data: recordingConfig } = useRecordingConfig(isDoctor && status === 'active');

  if (status === 'idle' || !session) return null;

  const { peer, callType } = session;
  const isVideo = callType === 'video';
  const inCall = status === 'connecting' || status === 'active';
  const showRemoteVideo = isVideo && inCall && remoteHasVideo;
  const showLocalVideo = isVideo && Boolean(localStream) && !isCameraOff;

  const statusText = isReconnecting
    ? 'Reconnecting…'
    : status === 'incoming'
      ? `Incoming ${isVideo ? 'video' : 'voice'} call`
      : status === 'outgoing'
        ? session.callId
          ? session.notified
            ? 'Notifying their device…'
            : 'Ringing…'
          : 'Calling…'
        : status === 'connecting'
          ? 'Connecting…'
          : null;

  return createPortal(
    <div
      role='dialog'
      aria-modal='true'
      aria-label={`${isVideo ? 'Video' : 'Voice'} call with ${peer.name}`}
      className='fixed inset-0 z-[1000] bg-gradient-to-b from-slate-900 to-[#0b3d39] text-white overflow-hidden'
    >
      {/* Remote media */}
      {/* Video calls keep ONE element for the remote stream (it also plays the
          audio), hidden until frames arrive, so playback is never interrupted
          by swapping elements mid-call. */}
      {remoteStream &&
        (isVideo ? (
          <MediaView
            stream={remoteStream}
            className={`absolute inset-0 h-full w-full object-cover bg-black ${showRemoteVideo ? '' : 'opacity-0 pointer-events-none'}`}
          />
        ) : (
          <AudioSink stream={remoteStream} />
        ))}

      {/* Local camera: full-screen preview while ringing, picture-in-picture once connected */}
      {showLocalVideo && localStream && (
        <MediaView
          stream={localStream}
          muted
          mirrored
          className={
            inCall
              ? 'absolute right-4 top-4 md:top-auto md:bottom-32 w-28 md:w-56 aspect-[3/4] md:aspect-video rounded-xl object-cover shadow-2xl border-2 border-white/30 z-10 bg-black'
              : 'absolute inset-0 h-full w-full object-cover opacity-40'
          }
        />
      )}

      {/* Peer identity */}
      {showRemoteVideo ? (
        <div className='absolute left-4 top-4 z-10 rounded-full bg-black/40 px-4 py-2 text-sm backdrop-blur'>
          <span className='font-semibold'>{peer.name}</span>
          {connectedAt && (
            <span className='ml-2 text-white/80'>
              <CallTimer since={connectedAt} />
            </span>
          )}
        </div>
      ) : (
        <div className='relative z-0 flex h-full flex-col items-center pt-[18vh] px-6 text-center'>
          <div className='relative h-28 w-28 md:h-36 md:w-36'>
            {(status === 'incoming' || status === 'outgoing') && (
              <span className='absolute inset-0 rounded-full bg-primaryColor/40 animate-ping' />
            )}
            <img
              src={peer.photo || avatarIcon}
              alt={peer.name}
              className='relative h-full w-full rounded-full object-cover border-4 border-white/20'
            />
          </div>
          <h2 className='mt-6 text-2xl md:text-3xl font-semibold'>{peer.name}</h2>
          {peer.specialization && <p className='text-sm text-white/70'>{peer.specialization}</p>}
          <p className='mt-3 text-white/80'>
            {statusText ?? (connectedAt ? <CallTimer since={connectedAt} /> : null)}
          </p>
        </div>
      )}

      {/* Recording indicator, shown to both people on the call */}
      {(recording === 'on' || recording === 'requesting') && (
        <div
          role='status'
          className='absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/50 px-4 py-1.5 text-sm font-medium backdrop-blur'
        >
          {recording === 'on' ? (
            <>
              <span className='h-2.5 w-2.5 animate-pulse rounded-full bg-red-500' />
              {isDoctor ? 'Recording for the patient’s health record' : 'Recording for your health record'}
            </>
          ) : (
            'Waiting for the patient to allow recording…'
          )}
        </div>
      )}

      {recording === 'prompt' && recordingPrompt && (
        <RecordingConsentDialog prompt={recordingPrompt} onAnswer={answerRecording} />
      )}

      {/* Controls */}
      <div className='absolute inset-x-0 bottom-0 z-20 flex justify-center gap-8 md:gap-12 pb-10 pt-6 bg-gradient-to-t from-black/60 to-transparent'>
        {status === 'incoming' ? (
          <>
            <ControlButton label='Decline' onClick={rejectCall} className='bg-red-600 hover:bg-red-700'>
              <MdCallEnd />
            </ControlButton>
            <ControlButton label='Accept' onClick={acceptCall} className='bg-green-600 hover:bg-green-700 animate-bounce'>
              {isVideo ? <IoVideocam /> : <IoCall />}
            </ControlButton>
          </>
        ) : (
          <>
            <ControlButton
              label={isMuted ? 'Unmute' : 'Mute'}
              onClick={toggleMute}
              className={isMuted ? 'bg-white text-slate-900' : 'bg-white/15 hover:bg-white/25'}
            >
              {isMuted ? <IoMicOffOutline /> : <IoMicOutline />}
            </ControlButton>
            {isVideo && (
              <ControlButton
                label={isCameraOff ? 'Camera on' : 'Camera off'}
                onClick={toggleCamera}
                className={isCameraOff ? 'bg-white text-slate-900' : 'bg-white/15 hover:bg-white/25'}
              >
                {isCameraOff ? <IoVideocamOffOutline /> : <IoVideocamOutline />}
              </ControlButton>
            )}
            {status === 'active' &&
              (recording === 'on' || recording === 'requesting' ? (
                <ControlButton
                  label={recording === 'on' ? 'Stop recording' : 'Cancel request'}
                  onClick={stopRecording}
                  className='bg-white text-red-600'
                >
                  <Square size={22} fill='currentColor' />
                </ControlButton>
              ) : (
                isDoctor &&
                recordingConfig?.enabled && (
                  <ControlButton label='Record' onClick={requestRecording} className='bg-white/15 hover:bg-white/25'>
                    <Circle size={24} className='text-red-400' fill='currentColor' />
                  </ControlButton>
                )
              ))}
            <ControlButton label='End' onClick={endCall} className='bg-red-600 hover:bg-red-700'>
              <MdCallEnd />
            </ControlButton>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default CallOverlay;
