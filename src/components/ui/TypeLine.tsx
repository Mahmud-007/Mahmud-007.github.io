import React from 'react';
import { useReducedMotion } from 'framer-motion';

interface TypeLineProps {
  text: string;
  startDelay?: number;
  speed?: number;
  className?: string;
  onDone?: () => void;
}

const TypeLine: React.FC<TypeLineProps> = ({
  text,
  startDelay = 0,
  speed = 28,
  className,
  onDone,
}) => {
  const reduced = useReducedMotion();
  const [shown, setShown] = React.useState(reduced ? text.length : 0);

  React.useEffect(() => {
    if (reduced) {
      onDone?.();
      return;
    }
    let index = 0;
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        index += 1;
        setShown(index);
        if (index >= text.length) {
          clearInterval(interval);
          onDone?.();
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
    // onDone is intentionally excluded; callers pass inline closures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, startDelay, speed, reduced]);

  return <span className={className}>{text.slice(0, shown)}</span>;
};

export default TypeLine;
