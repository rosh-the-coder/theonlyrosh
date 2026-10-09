'use client';

import { useEffect, useRef, useState } from 'react';
import PanelBody from '@/components/rvv/Drawers';
import { panelMeta, type PanelId } from '@/data/rvvCaseStudy';

const panelWidth: Record<PanelId, string> = {
  survey: 'md:w-[72vw] xl:w-[min(52vw,960px)]',
  competitors: 'md:w-[72vw] xl:w-[min(52vw,960px)]',
  explorations: 'md:w-[72vw] xl:w-[min(52vw,960px)]',
  pivot: 'md:w-[72vw] xl:w-[min(52vw,960px)]',
  testing: 'md:w-[72vw] xl:w-[min(52vw,960px)]',
  ia: 'md:w-[72vw] xl:w-[min(52vw,960px)]',
  'design-system': 'md:w-[72vw] xl:w-[min(52vw,960px)]',
  scope: 'md:w-[72vw] xl:w-[min(52vw,960px)]',
};

const PANEL_MS = 520;

export default function EvidenceOverlay({
  panel,
  onClose,
  onPresenceChange,
}: {
  panel: PanelId | null;
  onClose: () => void;
  onPresenceChange?: (present: boolean) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const openRef = useRef(false);
  const [current, setCurrent] = useState<PanelId | null>(panel);
  const [open, setOpen] = useState(false);
  const onPresenceRef = useRef(onPresenceChange);
  onPresenceRef.current = onPresenceChange;
  onCloseRef.current = onClose;

  useEffect(() => {
    let cancelled = false;
    if (panel) {
      setCurrent(panel);
      if (openRef.current) return;
      setOpen(false);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled) return;
          openRef.current = true;
          setOpen(true);
        });
      });
      return () => {
        cancelled = true;
        cancelAnimationFrame(frame);
      };
    }
    openRef.current = false;
    setOpen(false);
    const timer = window.setTimeout(() => setCurrent(null), PANEL_MS);
    return () => window.clearTimeout(timer);
  }, [panel]);

  useEffect(() => {
    onPresenceRef.current?.(current !== null);
    scrollerRef.current?.scrollTo(0, 0);
  }, [current]);

  useEffect(() => {
    if (!current) return;
    const root = dialogRef.current;
    if (!root) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const doc = document.documentElement;
    const previous = {
      overflowAnchor: doc.style.overflowAnchor,
      scrollBehavior: doc.style.scrollBehavior,
    };
    doc.style.overflowAnchor = 'none';
    doc.style.scrollBehavior = 'auto';
    const hold = () => {
      if (window.scrollX !== scrollX || window.scrollY !== scrollY) window.scrollTo(scrollX, scrollY);
    };
    const stopBackgroundScroll = (event: Event) => {
      if (event.target instanceof Node && root.contains(event.target)) return;
      event.preventDefault();
    };
    const focusable = () =>
      Array.from(root.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])'));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key === ' ' || event.key === 'PageUp' || event.key === 'PageDown' || event.key === 'Home' || event.key === 'End') {
        if (!(event.target instanceof Node) || !root.contains(event.target)) event.preventDefault();
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
    window.addEventListener('wheel', stopBackgroundScroll, { passive: false });
    window.addEventListener('touchmove', stopBackgroundScroll, { passive: false });
    document.addEventListener('keydown', onKey);
    focusable()[0]?.focus({ preventScroll: true });
    hold();
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', stopBackgroundScroll);
      window.removeEventListener('touchmove', stopBackgroundScroll);
      previouslyFocused?.focus({ preventScroll: true });
      hold();
      window.setTimeout(() => {
        hold();
        window.removeEventListener('scroll', hold, true);
        doc.style.overflowAnchor = previous.overflowAnchor;
        doc.style.scrollBehavior = previous.scrollBehavior;
      }, 0);
    };
  }, [current]);

  if (!current) return null;
  const meta = panelMeta[current];

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close panel"
        className={`rvv-evidence-backdrop absolute inset-0 bg-black/60 backdrop-blur-sm ${open ? 'is-open' : ''}`}
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rvv-panel-title"
        className={`rvv-evidence-drawer absolute bottom-0 left-0 right-0 flex max-h-[100dvh] min-h-0 w-full flex-col rounded-t-2xl bg-[#0f0f0f] pb-[env(safe-area-inset-bottom)] md:left-auto md:top-0 md:h-full md:max-h-none md:rounded-none ${panelWidth[current]} ${open ? 'is-open rvv-evidence-open' : ''}`}
      >
        <header className="rvv-evidence-piece flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#1a1a1a] px-5 py-3">
          <h2 id="rvv-panel-title" className="min-w-0 text-lg font-semibold text-white">{meta.title}</h2>
          <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#FF4B4B] text-lg text-white">
            <span aria-hidden>×</span>
            <span className="sr-only">Close</span>
          </button>
        </header>
        <div id="rvv-panel-scroll" ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div key={current} className="rvv-evidence-content">
            <PanelBody id={current} />
          </div>
        </div>
      </div>
    </div>
  );
}
