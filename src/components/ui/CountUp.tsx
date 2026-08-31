import React from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface CountUpProps {
  value: string;
  className?: string;
  duration?: number;
}

const LEADING_NUMBER = /^(\d+(?:\.\d+)?)(.*)$/s;

const CountUp: React.FC<CountUpProps> = ({ value, className, duration = 900 }) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = useReducedMotion();

  const match = value.match(LEADING_NUMBER);
  const target = match ? parseFloat(match[1]) : null;
  const suffix = match ? match[2] : '';
  const decimals = match && match[1].includes('.') ? 1 : 0;

  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (target === null || reduced || !inView) return;
    const started = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - started) / duration, 1);
      setCurrent(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, reduced, inView, duration]);

  if (target === null || reduced) {
    return <span ref={ref} className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {(inView ? current : 0).toFixed(decimals)}
      {suffix}
    </span>
  );
};

export default CountUp;
