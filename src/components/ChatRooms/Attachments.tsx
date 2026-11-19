import { useEffect, useRef, useState } from 'react';
import { IoPause, IoPlay } from 'react-icons/io5';
import { FaRegFileAlt, FaRegFileExcel, FaRegFilePdf, FaRegFileWord } from 'react-icons/fa';
import { MdOutlineFileDownload } from 'react-icons/md';
import type { ChatMessage } from '@/types/chat';
import { formatBytes, formatSeconds } from './attachmentUtils';

const fileIconFor = (mime: string, name: string) => {
  if (mime === 'application/pdf' || name.endsWith('.pdf')) return FaRegFilePdf;
  if (mime.includes('word') || /\.docx?$/i.test(name)) return FaRegFileWord;
  if (mime.includes('excel') || mime.includes('spreadsheet') || /\.xlsx?$/i.test(name)) return FaRegFileExcel;
  return FaRegFileAlt;
};

/** Cloudinary download URL that forces "save as" with the original name. */
const downloadUrl = (url: string, name: string) =>
  url.includes('res.cloudinary.com') ? url.replace('/upload/', `/upload/fl_attachment:${encodeURIComponent(name.replace(/\.[^.]+$/, ''))}/`) : url;

const UploadProgress = ({ msg, light }: { msg: ChatMessage; light: boolean }) =>
  msg.pending ? (
    <div className={`mt-1 h-1 w-full overflow-hidden rounded-full ${light ? 'bg-white/30' : 'bg-gray-200'}`}>
      <div
        className={`h-full transition-[width] ${light ? 'bg-white' : 'bg-primaryColor2'}`}
        style={{ width: `${msg.progress ?? 0}%` }}
      />
    </div>
  ) : null;

const ImageAttachment = ({ msg }: { msg: ChatMessage }) => {
  const a = msg.attachment!;
  const aspect = a.width && a.height ? `${a.width} / ${a.height}` : undefined;
  const img = (
    <img
      src={a.url}
      alt={a.name}
      loading='lazy'
      style={{ aspectRatio: aspect }}
      className={`block max-h-64 w-full max-w-[240px] rounded-xl object-cover bg-black/5 ${msg.pending ? 'opacity-60' : ''}`}
    />
  );
  return msg.pending || msg.failed ? (
    img
  ) : (
    <a href={a.url} target='_blank' rel='noopener noreferrer' title='Open image'>
      {img}
    </a>
  );
};

const FileAttachment = ({ msg, mine }: { msg: ChatMessage; mine: boolean }) => {
  const a = msg.attachment!;
  const Icon = fileIconFor(a.mimeType, a.name);
  const body = (
    <div className='flex items-center gap-3 min-w-0'>
      <Icon className='size-8 shrink-0' />
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>{a.name}</p>
        <p className={`text-[11px] ${mine ? 'text-white/80' : 'text-gray-500'}`}>{formatBytes(a.size)}</p>
      </div>
      {!msg.pending && !msg.failed && <MdOutlineFileDownload className='size-6 shrink-0' />}
    </div>
  );
  return msg.pending || msg.failed ? (
    body
  ) : (
    <a href={downloadUrl(a.url, a.name)} target='_blank' rel='noopener noreferrer' title={`Download ${a.name}`}>
      {body}
    </a>
  );
};

const AudioAttachment = ({ msg, mine }: { msg: ChatMessage; mine: boolean }) => {
  const a = msg.attachment!;
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  // Recorded webm has no duration metadata (reports Infinity): prefer the stored value.
  const [duration, setDuration] = useState(a.durationSec ?? 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTime = () => setCurrent(el.currentTime);
    const onMeta = () => Number.isFinite(el.duration) && el.duration > 0 && setDuration(el.duration);
    const onEnd = () => {
      setPlaying(false);
      setCurrent(0);
    };
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('durationchange', onMeta);
    el.addEventListener('ended', onEnd);
    el.addEventListener('pause', onPause);
    el.addEventListener('play', onPlay);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('durationchange', onMeta);
      el.removeEventListener('ended', onEnd);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('play', onPlay);
    };
  }, [a.url]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      // Only one voice note plays at a time.
      document.querySelectorAll('audio[data-voice-note]').forEach((other) => other !== el && (other as HTMLAudioElement).pause());
      void el.play().catch(() => setPlaying(false));
    } else el.pause();
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (ref.current) ref.current.currentTime = Number(e.target.value);
    setCurrent(Number(e.target.value));
  };

  return (
    <div className='flex items-center gap-2 w-[220px]'>
      <audio ref={ref} src={a.url} preload='metadata' data-voice-note />
      <button
        type='button'
        onClick={toggle}
        disabled={msg.failed}
        aria-label={playing ? 'Pause' : 'Play'}
        className={`flex size-9 shrink-0 items-center justify-center rounded-full cursor-pointer disabled:cursor-not-allowed ${mine ? 'bg-white text-primaryColor2' : 'bg-primaryColor2 text-white'}`}
      >
        {playing ? <IoPause size={16} /> : <IoPlay size={16} className='ml-0.5' />}
      </button>
      <div className='flex-1 min-w-0'>
        <input
          type='range'
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(current, duration || 0)}
          onChange={seek}
          disabled={!duration || msg.failed}
          aria-label='Seek'
          className={`w-full h-1 cursor-pointer ${mine ? 'accent-white' : 'accent-[#0d8c81]'}`}
        />
        <p className={`text-[11px] tabular-nums ${mine ? 'text-white/80' : 'text-gray-500'}`}>
          {formatSeconds(playing || current ? current : duration)}
        </p>
      </div>
    </div>
  );
};

/** Bubble body for file/voice messages (time + ticks are rendered by the caller). */
export const AttachmentBody = ({ msg, mine }: { msg: ChatMessage; mine: boolean }) => {
  const a = msg.attachment;
  if (!a) return <p className='text-sm italic opacity-70'>Attachment unavailable</p>;

  const isAudio = msg.type === 'voice' || a.mimeType.startsWith('audio/');
  return (
    <div className='flex flex-col gap-1'>
      {a.resourceType === 'image' ? (
        <ImageAttachment msg={msg} />
      ) : isAudio ? (
        <AudioAttachment msg={msg} mine={mine} />
      ) : (
        <FileAttachment msg={msg} mine={mine} />
      )}
      {msg.content && <p className='text-sm whitespace-pre-wrap break-words'>{msg.content}</p>}
      <UploadProgress msg={msg} light={mine} />
    </div>
  );
};
