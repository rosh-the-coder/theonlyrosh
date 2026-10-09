'use client';

import { MotionConfig, motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { Children, useRef, type ReactNode } from 'react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const sectionOffset: ['start 92%', 'start 58%'] = ['start 92%', 'start 58%'];
const visualOffset: ['start 94%', 'start 55%'] = ['start 94%', 'start 55%'];
const staggerViewport = { once: true, amount: 0.22 } as const;

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

export function CaseStudyMotion({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="never" transition={{ duration: 0.8, ease: EASE }}>
      {children}
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
      className={className}
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
      className={className}
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

export function MediaReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <ScrollLink className={className} offset={visualOffset} y={60} opacity={0.1} scale={0.965}>
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
}: {
  children: ReactNode;
  className?: string;
  step?: number;
  as?: 'div' | 'ol' | 'ul';
  itemClassName?: string;
}) {
  const MotionTag = as === 'ol' ? motion.ol : as === 'ul' ? motion.ul : motion.div;
  const ItemTag = as === 'div' ? motion.div : motion.li;
  const itemClass = itemClassName ?? (as === 'div' ? 'min-w-0' : undefined);

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={staggerViewport}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: step } },
      }}
    >
      {Children.map(children, (child, index) => (
        <ItemTag key={index} className={itemClass} variants={riseVariants}>
          {child}
        </ItemTag>
      ))}
    </MotionTag>
  );
}
