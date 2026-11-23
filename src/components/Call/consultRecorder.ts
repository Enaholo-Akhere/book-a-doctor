/**
 * Records a consultation in the doctor's browser, as two audio-only tracks:
 * the doctor's microphone and the patient's incoming audio. Separate tracks
 * let the server label who said what in the transcript.
 *
 * Audio only (never video), mono Opus at a low bitrate: ~11 MB per hour per
 * track, well under the server's 25 MB limit.
 */

const BITRATE = 24_000;
/** Flush a chunk every 10s so a long recording isn't one giant buffer. */
const TIMESLICE_MS = 10_000;

const pickMimeType = () =>
  ['audio/webm;codecs=opus', 'audio/ogg;codecs=opus', 'audio/mp4'].find(
    (t) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)
  );

class TrackRecorder {
  private chunks: Blob[] = [];
  private recorder: MediaRecorder;
  private done: Promise<Blob>;

  constructor(track: MediaStreamTrack, mimeType: string | undefined) {
    // Clone so muting or stopping the call's track can't break the recording mid-way.
    this.recorder = new MediaRecorder(new MediaStream([track.clone()]), {
      ...(mimeType && { mimeType }),
      audioBitsPerSecond: BITRATE,
    });
    this.recorder.ondataavailable = (e) => {
      if (e.data.size) this.chunks.push(e.data);
    };
    this.done = new Promise((resolve) => {
      this.recorder.onstop = () => {
        this.recorder.stream.getTracks().forEach((t) => t.stop());
        resolve(new Blob(this.chunks, { type: this.recorder.mimeType || mimeType || 'audio/webm' }));
      };
    });
    this.recorder.start(TIMESLICE_MS);
  }

  stop(): Promise<Blob> {
    if (this.recorder.state !== 'inactive') this.recorder.stop();
    return this.done;
  }
}

export interface RecordingResult {
  doctor?: Blob;
  patient?: Blob;
  durationSec: number;
}

export class ConsultRecorder {
  private doctor: TrackRecorder | null;
  private patient: TrackRecorder | null;
  private startedAt = Date.now();
  private stopped: Promise<RecordingResult> | null = null;

  /** Throws if the browser can't record, or neither side has audio. */
  constructor(localStream: MediaStream | null, remoteStream: MediaStream | null) {
    if (typeof MediaRecorder === 'undefined') throw new Error('This browser cannot record audio');
    const mimeType = pickMimeType();
    const mine = localStream?.getAudioTracks()[0];
    const theirs = remoteStream?.getAudioTracks()[0];
    if (!mine && !theirs) throw new Error('No call audio to record');
    this.doctor = mine ? new TrackRecorder(mine, mimeType) : null;
    this.patient = theirs ? new TrackRecorder(theirs, mimeType) : null;
  }

  /** Safe to call more than once; every caller gets the same result. */
  stop(): Promise<RecordingResult> {
    this.stopped ??= Promise.all([this.doctor?.stop(), this.patient?.stop()]).then(([doctor, patient]) => ({
      doctor: doctor?.size ? doctor : undefined,
      patient: patient?.size ? patient : undefined,
      durationSec: (Date.now() - this.startedAt) / 1000,
    }));
    return this.stopped;
  }
}
