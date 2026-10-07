'use client';

import { useEffect, useRef } from 'react';

export default function ScrollFrame({
  children,
  label,
  align = 'start',
  className = '',
}: {
  children: React.ReactNode;
  label: string;
  align?: 'start' | 'center';
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = ref.current;
    if (!frame || align !== 'center') return;
    const extra = frame.scrollWidth - frame.clientWidth;
    if (extra > 8) frame.scrollLeft = extra / 2;
  }, [align]);

  return (
    <div
      ref={ref}
      tabIndex={0}
      aria-label={label}
      className={`overflow-auto rounded-2xl border border-white/10 bg-[#10140c] transition-[border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:group-hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6F135] ${className}`}
    >
      {children}
    </div>
  );
}
