'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import FlyHLightbox from '@/components/flyh/Lightbox';
import { communitySignals } from '@/data/flyh/content';

export default function CommunityCarousel() {
  const scroller = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  const scrollToIndex = useCallback((index: number) => {
    const root = scroller.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-signal]'));
    const next = Math.max(0, Math.min(cards.length - 1, index));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    cards[next]?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
    setActive(next);
  }, []);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-signal]'));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = cards.indexOf(visible.target as HTMLElement);
        if (index >= 0) setActive(index);
      },
      { root, threshold: [0.55, 0.75] },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    let startX = 0;
    let startLeft = 0;
    let dragging = false;

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      dragging = true;
      dragged.current = false;
      startX = event.clientX;
      startLeft = root.scrollLeft;
    };
    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 6) dragged.current = true;
      root.scrollLeft = startLeft - delta;
    };
    const onUp = () => {
      dragging = false;
    };

    root.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      root.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollToIndex(active + 1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollToIndex(active - 1);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-end gap-2">
        <button type="button" className="grid h-11 w-11 place-items-center rounded-md border border-[#CBD0CC] bg-white" onClick={() => scrollToIndex(active - 1)} disabled={active === 0} aria-label="Previous screenshot">←</button>
        <button type="button" className="grid h-11 w-11 place-items-center rounded-md border border-[#CBD0CC] bg-white" onClick={() => scrollToIndex(active + 1)} disabled={active === communitySignals.length - 1} aria-label="Next screenshot">→</button>
      </div>
      <div
        ref={scroller}
        className="flyh-signals"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Community signals"
        onKeyDown={onKeyDown}
      >
        {communitySignals.map((signal, index) => (
          <button
            key={signal.id}
            type="button"
            data-signal={signal.id}
            className="flyh-signal-card overflow-hidden rounded-xl border border-[#DFE2DE] bg-white text-left"
            onClick={() => {
              if (dragged.current) return;
              setOpen(index);
            }}
            aria-label={`Open screenshot: ${signal.title}`}
          >
            <img
              src={signal.image.src}
              width={signal.image.width}
              height={signal.image.height}
              alt={signal.image.alt}
              loading="lazy"
              decoding="async"
              className="h-auto w-full"
            />
            <span className="block px-3 py-3">
              <span className="block text-xs font-semibold text-[#145C46]">{signal.subreddit}</span>
              <span className="mt-1 block text-sm font-medium leading-5">{signal.title}</span>
            </span>
          </button>
        ))}
      </div>
      <FlyHLightbox
        items={communitySignals.map((signal) => ({
          src: signal.image.src,
          width: signal.image.width,
          height: signal.image.height,
          alt: signal.image.alt,
          subreddit: signal.subreddit,
          title: signal.title,
          href: signal.href,
          signal: true,
        }))}
        index={open}
        onIndex={setOpen}
        onClose={() => setOpen(null)}
      />
    </div>
  );
}
