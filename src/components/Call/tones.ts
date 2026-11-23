// Served from /public/sounds (Next can't bundle .wav imports).
const ringtoneUrl = '/sounds/ringtone.wav';
const ringbackUrl = '/sounds/ringback.wav';

/**
 * Ringtone (incoming) and ringback (outgoing) playback via Web Audio.
 *
 * Browsers block audio until the user has interacted with the page. One
 * shared AudioContext is created and resumed on the first tap/keypress
 * anywhere in the app (`unlockAudioOnFirstGesture`), so a call arriving
 * later can ring without a fresh gesture.
 */
type ToneKind = 'incoming' | 'outgoing';

const SOURCES: Record<ToneKind, { url: string; gain: number }> = {
  incoming: { url: ringtoneUrl, gain: 0.9 },
  outgoing: { url: ringbackUrl, gain: 0.5 },
};

let ctx: AudioContext | null = null;
const buffers = new Map<ToneKind, Promise<AudioBuffer | null>>();

const getContext = (): AudioContext | null => {
  if (ctx) return ctx;
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  ctx = Ctx ? new Ctx() : null;
  return ctx;
};

const loadBuffer = (kind: ToneKind) => {
  let pending = buffers.get(kind);
  if (!pending) {
    pending = fetch(SOURCES[kind].url)
      .then((r) => r.arrayBuffer())
      .then((data) => getContext()?.decodeAudioData(data) ?? null)
      .catch(() => {
        buffers.delete(kind); // retry next time
        return null;
      });
    buffers.set(kind, pending);
  }
  return pending;
};

/** Call once at startup: primes audio on the first user gesture. */
export const unlockAudioOnFirstGesture = () => {
  const unlock = () => {
    const c = getContext();
    if (!c) return;
    void c.resume().then(() => {
      if (c.state !== 'running') return;
      events.forEach((e) => window.removeEventListener(e, unlock, true));
      void loadBuffer('incoming');
      void loadBuffer('outgoing');
    });
  };
  const events = ['pointerdown', 'keydown', 'touchend'] as const;
  events.forEach((e) => window.addEventListener(e, unlock, true));
};

/** Starts a looping tone; returns a function that stops it. */
export const playTone = (kind: ToneKind): (() => void) => {
  const c = getContext();
  if (!c) return () => undefined;

  let stopped = false;
  let source: AudioBufferSourceNode | null = null;

  void (async () => {
    await c.resume().catch(() => undefined);
    const buffer = await loadBuffer(kind);
    if (stopped || !buffer || c.state !== 'running') return; // still blocked: visual + vibration only
    const gain = c.createGain();
    gain.gain.value = SOURCES[kind].gain;
    gain.connect(c.destination);
    source = c.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gain);
    source.start();
  })();

  return () => {
    stopped = true;
    try {
      source?.stop();
    } catch {
      // already stopped
    }
    source?.disconnect();
  };
};

/** Repeats a vibration pattern (Android; ignored elsewhere). Returns a stop function. */
export const startVibration = (pattern: number[]): (() => void) => {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return () => undefined;
  const cycle = pattern.reduce((a, b) => a + b, 0);
  navigator.vibrate(pattern);
  const timer = setInterval(() => navigator.vibrate(pattern), cycle);
  return () => {
    clearInterval(timer);
    navigator.vibrate(0);
  };
};
