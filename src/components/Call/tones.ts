/**
 * Ring / ringback tones synthesised with Web Audio (no audio assets).
 * Browsers may keep the AudioContext suspended until the user has
 * interacted with the page; in that case the tone is silently skipped.
 */
type ToneKind = 'incoming' | 'outgoing';

const PATTERNS: Record<ToneKind, { freqs: number[]; onMs: number; offMs: number; gain: number }> = {
  incoming: { freqs: [440, 554], onMs: 1200, offMs: 1800, gain: 0.12 },
  outgoing: { freqs: [440, 480], onMs: 2000, offMs: 4000, gain: 0.06 },
};

export const playTone = (kind: ToneKind): (() => void) => {
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return () => undefined;

  const ctx = new Ctx();
  const { freqs, onMs, offMs, gain } = PATTERNS[kind];
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const beep = () => {
    if (stopped) return;
    const out = ctx.createGain();
    out.gain.value = gain;
    out.connect(ctx.destination);
    const end = ctx.currentTime + onMs / 1000;
    freqs.forEach((f) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = f;
      osc.connect(out);
      osc.start();
      osc.stop(end);
    });
    timer = setTimeout(beep, onMs + offMs);
  };

  ctx.resume().then(beep).catch(() => undefined);

  return () => {
    stopped = true;
    clearTimeout(timer);
    ctx.close().catch(() => undefined);
  };
};
