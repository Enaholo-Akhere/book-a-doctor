import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export const MAX_VOICE_SECONDS = 5 * 60;

export interface VoiceRecording {
  blob: Blob;
  durationSec: number;
  fileName: string;
}

// Chrome/Firefox record webm/opus; Safari only supports mp4/aac.
const MIME_CANDIDATES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];

const pickMimeType = () =>
  typeof MediaRecorder !== 'undefined' ? MIME_CANDIDATES.find((t) => MediaRecorder.isTypeSupported(t)) : undefined;

const extensionFor = (mime: string) => (mime.includes('mp4') ? 'm4a' : mime.includes('ogg') ? 'ogg' : 'webm');

/**
 * Records a voice note with MediaRecorder.
 * `stop(true)` resolves with the recording; `stop(false)` discards it.
 * Recording auto-stops at MAX_VOICE_SECONDS and calls `onAutoStop`.
 */
export const useVoiceRecorder = (onAutoStop?: (rec: VoiceRecording) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const resolveRef = useRef<((rec: VoiceRecording | null) => void) | null>(null);
  const keepRef = useRef(false);
  const onAutoStopRef = useRef(onAutoStop);
  onAutoStopRef.current = onAutoStop;

  const cleanup = useCallback(() => {
    clearInterval(tickRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
    setIsRecording(false);
    setElapsed(0);
  }, []);

  const stop = useCallback(
    (keep: boolean): Promise<VoiceRecording | null> => {
      const recorder = recorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        cleanup();
        return Promise.resolve(null);
      }
      keepRef.current = keep;
      return new Promise((resolve) => {
        resolveRef.current = resolve;
        recorder.stop(); // fires onstop once the last chunk is flushed
      });
    },
    [cleanup]
  );

  const start = useCallback(async () => {
    if (recorderRef.current) return;
    const mimeType = pickMimeType();
    if (!navigator.mediaDevices?.getUserMedia || !mimeType) {
      toast.error('Voice messages are not supported in this browser');
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    } catch (err) {
      const name = err instanceof DOMException ? err.name : '';
      toast.error(name === 'NotAllowedError' ? 'Allow microphone access to record voice messages' : 'Could not access your microphone');
      return;
    }

    const recorder = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 32_000 });
    streamRef.current = stream;
    recorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const durationSec = Math.min((Date.now() - startedAtRef.current) / 1000, MAX_VOICE_SECONDS);
      const type = recorder.mimeType || mimeType;
      const blob = new Blob(chunksRef.current, { type: type.split(';')[0] });
      const recording =
        keepRef.current && blob.size && durationSec >= 0.5
          ? { blob, durationSec, fileName: `voice-message.${extensionFor(type)}` }
          : null;
      cleanup();
      const resolve = resolveRef.current;
      resolveRef.current = null;
      if (resolve) resolve(recording);
      else if (recording) onAutoStopRef.current?.(recording); // auto-stopped at the limit
    };

    recorder.start(250);
    startedAtRef.current = Date.now();
    setIsRecording(true);
    tickRef.current = setInterval(() => {
      const secs = Math.floor((Date.now() - startedAtRef.current) / 1000);
      setElapsed(secs);
      if (secs >= MAX_VOICE_SECONDS && recorder.state === 'recording') {
        keepRef.current = true;
        recorder.stop();
      }
    }, 250);
  }, [cleanup]);

  // Never leave the microphone on after the chat closes.
  useEffect(
    () => () => {
      resolveRef.current = null;
      keepRef.current = false;
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
      cleanup();
    },
    [cleanup]
  );

  return { isRecording, elapsed, start, stop };
};
