import React from 'react';
import { cn } from '../../utils/cn';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
}

type Phase = 'static' | 'hidden' | 'shown';

/**
 * Fades content in as it scrolls into view.
 *
 * The server-rendered HTML is always fully visible. Hiding happens only after mount, only for
 * content still below the screen, and only when the visitor has not asked for reduced motion.
 * So nothing is ever stuck invisible: not without JavaScript, not with reduced motion, and not
 * if hydration is slow.
 */
const Reveal: React.FC<RevealProps> = ({ children, className }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [phase, setPhase] = React.useState<Phase>('static');

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setPhase('hidden');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase('shown');
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -80px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        className,
        phase !== 'static' && 'transition-[opacity,transform] duration-300 ease-out',
        phase === 'hidden' && 'opacity-0 translate-y-3'
      )}
    >
      {children}
    </div>
  );
};

export default Reveal;
