'use client';

import { Children, type ReactNode } from 'react';
import { MotionConfig, motion, type Variants } from 'framer-motion';

export const FLYH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: FLYH_EASE } },
};

export function FlyHMotion({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.75, ease: FLYH_EASE }}>
      {children}
    </MotionConfig>
  );
}

export function Entrance({
  children,
  className = '',
  delay = 0,
  y = 22,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay, ease: FLYH_EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({
  children,
  className = '',
  y = 18,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.7, ease: FLYH_EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className = '',
  step = 0.06,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  step?: number;
  as?: 'div' | 'ol' | 'ul';
}) {
  const MotionTag = as === 'ol' ? motion.ol : as === 'ul' ? motion.ul : motion.div;
  const ItemTag = as === 'div' ? motion.div : motion.li;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.22 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: step } } }}
    >
      {Children.map(children, (child, index) => (
        <ItemTag key={index} className="min-w-0" variants={riseVariants}>
          {child}
        </ItemTag>
      ))}
    </MotionTag>
  );
}
