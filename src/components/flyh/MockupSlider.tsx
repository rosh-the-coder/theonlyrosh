'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { mockupScenes } from '@/data/flyh/content';

export default function FlyHMockupSlider() {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const root = scroller.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-scene]'));
    const next = Math.max(0, Math.min(cards.length - 1, index));
    cards[next]?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
    setActive(next);
  }, []);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-scene]'));
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
      startX = event.clientX;
      startLeft = root.scrollLeft;
      root.setPointerCapture(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      root.scrollLeft = startLeft - (event.clientX - startX);
    };
    const onUp = () => {
      dragging = false;
    };

    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerup', onUp);
    root.addEventListener('pointercancel', onUp);
    return () => {
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerup', onUp);
      root.removeEventListener('pointercancel', onUp);
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
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#5E6862]" aria-live="polite">
          {mockupScenes[active]?.name} · {active + 1} of {mockupScenes.length}
        </p>
        <div className="flex gap-2">
          <button type="button" className="inline-flex h-11 items-center rounded-md border border-[#CBD0CC] bg-white px-3 text-sm font-medium disabled:opacity-40" onClick={() => scrollToIndex(active - 1)} disabled={active === 0}>
            Previous
          </button>
          <button type="button" className="inline-flex h-11 items-center rounded-md border border-[#CBD0CC] bg-white px-3 text-sm font-medium disabled:opacity-40" onClick={() => scrollToIndex(active + 1)} disabled={active === mockupScenes.length - 1}>
            Next
          </button>
        </div>
      </div>
      <div
        ref={scroller}
        className="flyh-slider cursor-grab active:cursor-grabbing"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Shipped FlyH scene names"
        onKeyDown={onKeyDown}
      >
        {mockupScenes.map((scene, index) => (
          <article
            key={scene.id}
            data-scene={scene.id}
            aria-current={index === active ? 'true' : undefined}
            className={`flyh-slider-card flex min-h-[360px] flex-col justify-between rounded-xl border bg-[#F7F6F2] p-5 ${index === active ? 'is-active border-[#145C46]' : 'border-[#DFE2DE]'}`}
          >
            {scene.image ? (
              <div
                className="mb-4 h-40 rounded-lg bg-[#F2F1ED] bg-cover bg-center"
                style={{ backgroundImage: `url(${scene.image})` }}
                role="img"
                aria-label={scene.name}
              />
            ) : (
              <div className="mb-6 flex h-40 items-end rounded-lg border border-[#DFE2DE] bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#858E88]">{scene.arrangement}</p>
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold tracking-[-0.03em]">{scene.name}</h3>
              <p className="mt-2 text-sm text-[#5E6862]">{scene.room} · {scene.artworkAreas} artwork {scene.artworkAreas === 1 ? 'area' : 'areas'}</p>
              <p className="mt-3 text-xs leading-5 text-[#858E88]">{scene.styles.join(' · ')}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
