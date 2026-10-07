'use client';

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sectionOffset: ['start 92%', 'start 58%'] = ['start 92%', 'start 58%'];
const visualOffset: ['start 94%', 'start 55%'] = ['start 94%', 'start 55%'];
const staggerViewport = { once: true, amount: 0.22 } as const;

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

export type ZoomShot = {
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
  caption?: string;
};

type LightboxRequest = {
  images: ZoomShot[];
  index: number;
  trigger: HTMLElement | null;
};

const LightboxContext = createContext<((request: LightboxRequest) => void) | null>(null);

export function useLightbox() {
  const open = useContext(LightboxContext);
  if (!open) {
    throw new Error('CareerOS lightbox is only available inside the case study.');
  }
  return open;
}

const hintClass =
  'pointer-events-none absolute right-3 top-3 z-10 rounded-full border border-white/20 bg-[#0B0B0B]/75 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-[#f4f0e6] opacity-90 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100';

export function ViewLargerHint() {
  return (
    <span aria-hidden="true" className={hintClass}>
      View larger
    </span>
  );
}

export function CaseStudyMotion({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<LightboxRequest | null>(null);
  const [session, setSession] = useState(0);
  const open = useCallback((next: LightboxRequest) => {
    setSession((current) => current + 1);
    setRequest(next);
  }, []);

  return (
    <MotionConfig reducedMotion="never" transition={{ duration: 0.8, ease: EASE }}>
      <LightboxContext.Provider value={open}>
        {children}
        <AnimatePresence>
          {request && (
            <Lightbox
              key={session}
              request={request}
              onClose={() => setRequest(null)}
            />
          )}
        </AnimatePresence>
      </LightboxContext.Provider>
    </MotionConfig>
  );
}

export function Entrance({
  children,
  className = '',
  delay = 0,
  y = 30,
  x = 0,
  scale = 1,
  duration = 1,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={`careeros-reveal ${className}`}
      initial={{ opacity: 0, x, y, scale }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function ScrollLink({
  children,
  className = '',
  offset,
  y,
  opacity,
  scale,
  x = 0,
}: {
  children: ReactNode;
  className?: string;
  offset: ['start 92%', 'start 58%'] | ['start 94%', 'start 55%'];
  y: number;
  opacity: number;
  scale: number;
  x?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const yV = useTransform(scrollYProgress, [0, 1], [y, 0]);
  const xV = useTransform(scrollYProgress, [0, 1], [x, 0]);
  const opacityV = useTransform(scrollYProgress, [0, 1], [opacity, 1]);
  const scaleV = useTransform(scrollYProgress, [0, 1], [scale, 1]);

  return (
    <motion.div
      ref={ref}
      data-scroll-link=""
      className={`careeros-reveal ${className}`}
      style={{ y: yV, x: xV, opacity: opacityV, scale: scaleV, transformOrigin: 'center top' }}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <ScrollLink className={className} offset={sectionOffset} y={70} opacity={0.08} scale={0.98}>
      {children}
    </ScrollLink>
  );
}

export function MediaReveal({
  children,
  className = '',
  from = 0,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
}) {
  return (
    <ScrollLink className={className} offset={visualOffset} y={60} opacity={0.1} scale={0.965} x={from}>
      {children}
    </ScrollLink>
  );
}

export function Stagger({
  children,
  className = '',
  step = 0.07,
  as = 'div',
  itemClassName,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
  as?: 'div' | 'ol' | 'ul';
  itemClassName?: string;
  ariaLabel?: string;
}) {
  const MotionTag = as === 'ol' ? motion.ol : as === 'ul' ? motion.ul : motion.div;
  const ItemTag = as === 'div' ? motion.div : motion.li;
  const itemClass = itemClassName ?? (as === 'div' ? 'min-w-0' : undefined);

  return (
    <MotionTag
      className={className}
      aria-label={ariaLabel}
      initial="hidden"
      whileInView="show"
      viewport={staggerViewport}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: step } },
      }}
    >
      {Children.map(children, (child, index) => (
        <ItemTag key={index} className={`careeros-reveal ${itemClass ?? ''}`} variants={riseVariants}>
          {child}
        </ItemTag>
      ))}
    </MotionTag>
  );
}

export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        observer.disconnect();
        const duration = 800;
        const start = performance.now();
        setDisplay(0);
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - progress) ** 3;
          setDisplay(progress === 1 ? value : Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

export function ZoomImage({
  image,
  gallery,
  index = 0,
  hint = true,
  children,
  className = '',
}: {
  image: ZoomShot;
  gallery?: ZoomShot[];
  index?: number;
  hint?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const open = useLightbox();
  const ref = useRef<HTMLButtonElement>(null);
  const images = gallery ?? [image];

  return (
    <div className={`group relative ${className}`}>
      <button
        ref={ref}
        type="button"
        aria-label={`View larger. ${image.alt}`}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => open({ images, index, trigger: ref.current })}
        className="block cursor-zoom-in text-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6F135]"
      >
        {children}
      </button>
      {hint && <ViewLargerHint />}
    </div>
  );
}

function Lightbox({ request, onClose }: { request: LightboxRequest; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [index, setIndex] = useState(request.index);
  const triggerRef = useRef(request.trigger);
  const image = request.images[index];
  const multiple = request.images.length > 1;
  const fadeDuration = 0.28;
  const shellDuration = 0.58;

  useEffect(() => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const root = document.documentElement;
    const previous = {
      overflowAnchor: root.style.overflowAnchor,
      scrollBehavior: root.style.scrollBehavior,
    };
    root.style.overflowAnchor = 'none';
    root.style.scrollBehavior = 'auto';

    const hold = () => {
      if (window.scrollX !== scrollX || window.scrollY !== scrollY) {
        window.scrollTo(scrollX, scrollY);
      }
    };
    const stopBackgroundScroll = (event: Event) => {
      const panel = panelRef.current;
      if (panel && event.target instanceof Node && panel.contains(event.target)) return;
      event.preventDefault();
    };
    const stopBackgroundKeys = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'PageUp' || event.key === 'PageDown' || event.key === 'Home' || event.key === 'End' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
      }
    };

    window.addEventListener('scroll', hold, true);
    window.addEventListener('wheel', stopBackgroundScroll, { passive: false });
    window.addEventListener('touchmove', stopBackgroundScroll, { passive: false });
    window.addEventListener('keydown', stopBackgroundKeys);
    closeRef.current?.focus({ preventScroll: true });
    hold();

    return () => {
      window.removeEventListener('wheel', stopBackgroundScroll);
      window.removeEventListener('touchmove', stopBackgroundScroll);
      window.removeEventListener('keydown', stopBackgroundKeys);
      triggerRef.current?.focus({ preventScroll: true });
      hold();
      window.setTimeout(() => {
        hold();
        window.removeEventListener('scroll', hold, true);
        root.style.overflowAnchor = previous.overflowAnchor;
        root.style.scrollBehavior = previous.scrollBehavior;
      }, 0);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (multiple && event.key === 'ArrowRight') {
        event.preventDefault();
        setIndex((current) => (current + 1) % request.images.length);
      }
      if (multiple && event.key === 'ArrowLeft') {
        event.preventDefault();
        setIndex((current) => (current - 1 + request.images.length) % request.images.length);
      }
      if (event.key !== 'Tab') return;
      const root = panelRef.current;
      if (!root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')).filter(
        (node) => !node.hasAttribute('disabled'),
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [multiple, onClose, request.images.length]);

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[80] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shellDuration, ease: EASE }}
    >
      <motion.div
        className="absolute inset-0 bg-black/[0.85]"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: fadeDuration, ease: EASE }}
      />
      <div className="relative flex h-full items-center justify-center p-4" onClick={onClose}>
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative z-10 max-h-[90vh] w-[min(960px,calc(100vw-2rem))] overflow-auto rounded-2xl border border-white/15 bg-[#10140c] p-4 text-white"
          onClick={(event) => event.stopPropagation()}
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.95 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <p id={titleId} className="text-base font-medium text-[#f4f0e6]">
                {image.title || 'CareerOS'}
              </p>
              {image.caption && <p className="mt-1 text-sm leading-6 text-[#9c9c94]">{image.caption}</p>}
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="inline-flex h-11 shrink-0 items-center rounded-full border border-white/20 px-4 text-sm text-white transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#C6F135] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6F135]"
            >
              Close
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.32, ease: EASE }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="960px"
                style={{ width: '100%', height: 'auto' }}
                className="h-auto w-full rounded-xl border border-white/10"
              />
            </motion.div>
          </AnimatePresence>
          {multiple && (
            <div className="mt-3 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => setIndex((current) => (current - 1 + request.images.length) % request.images.length)}
                className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-4 text-sm text-white transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#C6F135] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6F135]"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setIndex((current) => (current + 1) % request.images.length)}
                className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-4 text-sm text-white transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#C6F135] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6F135]"
              >
                Next
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>,
    document.body,
  );
}
