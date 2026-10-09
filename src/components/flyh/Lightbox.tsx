'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type LightImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  subreddit?: string;
  title?: string;
  href?: string | null;
  signal?: boolean;
};

export default function FlyHLightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: LightImage[];
  index: number | null;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const open = index != null && items[index] != null;
  const indexRef = useRef(index);
  const onIndexRef = useRef(onIndex);
  const onCloseRef = useRef(onClose);
  indexRef.current = index;
  onIndexRef.current = onIndex;
  onCloseRef.current = onClose;

  useEffect(() => {
    setZoomed(false);
  }, [index]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const root = document.getElementById('flyh-lightbox');
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const hold = () => {
      if (window.scrollX !== scrollX || window.scrollY !== scrollY) window.scrollTo(scrollX, scrollY);
    };
    const stopBackground = (event: Event) => {
      if (event.target instanceof Node && root?.contains(event.target)) return;
      event.preventDefault();
    };
    const focusable = () =>
      Array.from(root?.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])') ?? []);
    const onKey = (event: KeyboardEvent) => {
      const current = indexRef.current ?? 0;
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onIndexRef.current(Math.min(items.length - 1, current + 1));
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onIndexRef.current(Math.max(0, current - 1));
        return;
      }
      if (event.key !== 'Tab') return;
      const nodes = focusable();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    window.addEventListener('scroll', hold, true);
    window.addEventListener('wheel', stopBackground, { passive: false });
    window.addEventListener('touchmove', stopBackground, { passive: false });
    document.addEventListener('keydown', onKey);
    window.setTimeout(() => document.getElementById('flyh-lightbox-close')?.focus({ preventScroll: true }), 0);
    hold();
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', stopBackground);
      window.removeEventListener('touchmove', stopBackground);
      previous?.focus({ preventScroll: true });
      hold();
      window.setTimeout(() => window.removeEventListener('scroll', hold, true), 0);
    };
  }, [open, items.length]);

  if (!open || index == null) return null;
  const item = items[index];

  return createPortal(
    <div className="fixed inset-0 z-[70] bg-[#111613]/80">
      <div
        id="flyh-lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={item.title || item.alt}
        className="flex h-full min-h-0 flex-col px-3 py-3 sm:px-6 sm:py-5"
      >
        <div className="mb-3 flex shrink-0 items-center justify-between gap-3 text-[#F2F4F2]">
          <p className="text-sm">{items.length > 1 ? `${index + 1} of ${items.length}` : 'Evidence'}</p>
          <div className="flex items-center gap-2">
            {items.length > 1 ? (
              <>
                <button type="button" className="grid h-11 w-11 place-items-center rounded-md border border-white/30" onClick={() => onIndex(Math.max(0, index - 1))} disabled={index === 0} aria-label="Previous screenshot">←</button>
                <button type="button" className="grid h-11 w-11 place-items-center rounded-md border border-white/30" onClick={() => onIndex(Math.min(items.length - 1, index + 1))} disabled={index === items.length - 1} aria-label="Next screenshot">→</button>
              </>
            ) : null}
            <button type="button" className="h-11 rounded-md border border-white/30 px-3 text-sm" onClick={() => setZoomed((value) => !value)} aria-pressed={zoomed}>
              {zoomed ? 'Fit' : 'Larger'}
            </button>
            <button id="flyh-lightbox-close" type="button" className="grid h-11 w-11 place-items-center rounded-md bg-[#145C46]" onClick={onClose} aria-label="Close">×</button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          <img
            src={item.src}
            width={item.width}
            height={item.height}
            alt={item.alt}
            className={`flyh-lightbox-img mx-auto ${zoomed ? 'is-zoomed' : ''}`}
          />
        </div>
        <div className="mt-3 shrink-0 text-[#F2F4F2]">
          {item.subreddit ? <p className="text-xs font-semibold tracking-[0.12em] text-[#D66A4A]">{item.subreddit}</p> : null}
          {item.title ? <p className="mt-1 max-w-[70ch] text-sm font-medium">{item.title}</p> : null}
          {item.signal ? <p className="mt-1 text-xs text-[#949D97]">Community signal</p> : null}
          {item.href ? (
            <a href={item.href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-sm font-medium text-[#F2F4F2] underline">
              View original thread ↗
            </a>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
