import { useEffect, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

interface CountUpProps {
  to: number;
  suffix?: string;
  /** Seconds to wait before counting (lets the entrance animation land first). */
  delay?: number;
  duration?: number;
  format?: (value: number) => string;
}

const defaultFormat = (v: number) => Math.round(v).toLocaleString('en-US', { useGrouping: false });

/** Counts from 0 to `to` once on mount; jumps straight to the value for reduced-motion users. */
const CountUp = ({ to, suffix = '', delay = 0, duration = 2, format = defaultFormat }: CountUpProps) => {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? to : 0);

  useEffect(() => {
    if (reduceMotion) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      delay,
      duration,
      ease: [0.16, 1, 0.3, 1], // fast start, gentle landing
      onUpdate: setValue,
    });
    return () => controls.stop();
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
