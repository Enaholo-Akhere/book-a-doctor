import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoCall, IoMicOffOutline, IoMicOutline, IoVideocam, IoVideocamOffOutline, IoVideocamOutline } from 'react-icons/io5';
import { MdCallEnd } from 'react-icons/md';
import avatarIcon from '@/assets/images/avatar-icon.png';
import { useCall } from './callContext';

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
  useEffect(() => {
    if (ref.current && ref.current.srcObject !== stream) ref.current.srcObject = stream;
  }, [stream]);
  return (
    <video ref={ref} autoPlay playsInline muted={muted} className={`${className} ${mirrored ? '-scale-x-100' : ''}`} />
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

const CallOverlay = () => {
  const {
    status,
    session,
    localStream,
    remoteStream,
    isMuted,
    isCameraOff,
    connectedAt,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleCamera,
  } = useCall();

  if (status === 'idle' || !session) return null;

  const { peer, callType } = session;
  const isVideo = callType === 'video';
  const inCall = status === 'connecting' || status === 'active';
  const showRemoteVideo = isVideo && inCall && Boolean(remoteStream?.getVideoTracks().length);
  const showLocalVideo = isVideo && Boolean(localStream) && !isCameraOff;

  const statusText =
    status === 'incoming'
      ? `Incoming ${isVideo ? 'video' : 'voice'} call`
      : status === 'outgoing'
        ? session.callId
          ? 'Ringing…'
          : 'Calling…'
        : status === 'connecting'
          ? 'Connecting…'
          : null;

  return createPortal(
    <div
      role='dialog'
      aria-modal='true'
      aria-label={`${isVideo ? 'Video' : 'Voice'} call with ${peer.name}`}
      className='fixed inset-0 z-[1000] bg-gradient-to-b from-gray-900 to-[#0b3d39] text-white overflow-hidden'
    >
      {/* Remote media */}
      {remoteStream &&
        (showRemoteVideo ? (
          <MediaView stream={remoteStream} className='absolute inset-0 h-full w-full object-cover bg-black' />
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
              className={isMuted ? 'bg-white text-gray-900' : 'bg-white/15 hover:bg-white/25'}
            >
              {isMuted ? <IoMicOffOutline /> : <IoMicOutline />}
            </ControlButton>
            {isVideo && (
              <ControlButton
                label={isCameraOff ? 'Camera on' : 'Camera off'}
                onClick={toggleCamera}
                className={isCameraOff ? 'bg-white text-gray-900' : 'bg-white/15 hover:bg-white/25'}
              >
                {isCameraOff ? <IoVideocamOffOutline /> : <IoVideocamOutline />}
              </ControlButton>
            )}
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
