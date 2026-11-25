'use client';
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface CountUpProps {
  to: number;
  suffix?: string;
  /** Seconds to wait before counting (lets the entrance animation land first). */
  delay?: number;
  duration?: number;
  format?: (value: number) => string;
}

const defaultFormat = (v: number) => Math.round(v).toLocaleString('en-US', { useGrouping: false });

// Fast start, gentle landing; close to the cubic-bezier(0.16, 1, 0.3, 1) the hero uses.
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Counts from 0 to `to` once on mount; jumps straight to the value for reduced-motion users. */
const CountUp = ({ to, suffix = '', delay = 0, duration = 2, format = defaultFormat }: CountUpProps) => {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? to : 0);

  useEffect(() => {
    if (reduceMotion) {
      setValue(to);
      return;
    }
    // A small requestAnimationFrame loop, so the hero doesn't pull in framer's animation engine.
    let frame = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now + delay * 1000;
      const t = Math.max(0, (now - start) / (duration * 1000));
      setValue(to * easeOutExpo(t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to, delay, duration, reduceMotion]);

  return (
    <span className='tabular-nums' aria-label={`${format(to)}${suffix}`}>
      <span aria-hidden>
        {format(value)}
        {suffix}
      </span>
    </span>
  );
};

export default CountUp;
