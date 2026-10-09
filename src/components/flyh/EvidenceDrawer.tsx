'use client';

import { useEffect, useRef, useState } from 'react';
import DrawerBody from '@/components/flyh/Drawers';
import { drawerMeta, type DrawerId } from '@/data/flyh/content';

const PANEL_MS = 520;

export default function FlyHEvidenceDrawer({
  panel,
  onClose,
}: {
  panel: DrawerId | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const openRef = useRef(false);
  const [current, setCurrent] = useState<DrawerId | null>(panel);
  const [shown, setShown] = useState(false);
  onCloseRef.current = onClose;

  useEffect(() => {
    let cancelled = false;
    if (panel) {
      setCurrent(panel);
      if (openRef.current) return;
      setShown(false);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled) return;
          openRef.current = true;
          setShown(true);
        });
      });
      return () => {
        cancelled = true;
        cancelAnimationFrame(frame);
      };
    }
    openRef.current = false;
    setShown(false);
    const timer = window.setTimeout(() => setCurrent(null), PANEL_MS);
    return () => window.clearTimeout(timer);
  }, [panel]);

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
  const title = drawerMeta[current].title;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close panel"
        className={`flyh-backdrop absolute inset-0 bg-[#111613]/55 ${shown ? 'is-open' : ''}`}
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="flyh-drawer-title"
        className={`flyh-drawer absolute bottom-0 left-0 right-0 flex max-h-[100dvh] min-h-0 w-full flex-col rounded-t-xl bg-[#F7F6F2] pb-[env(safe-area-inset-bottom)] md:left-auto md:top-0 md:h-full md:max-h-none md:w-[min(640px,92vw)] md:rounded-none ${shown ? 'is-open flyh-drawer-open' : ''}`}
      >
        <header className="flyh-drawer-piece flex shrink-0 items-center justify-between gap-3 border-b border-[#DFE2DE] bg-white px-5 py-3">
          <h2 id="flyh-drawer-title" className="min-w-0 text-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-[#145C46] text-[#F2F4F2]">
            <span aria-hidden>×</span>
            <span className="sr-only">Close</span>
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div key={current} className="flyh-drawer-content">
            <DrawerBody id={current} />
          </div>
        </div>
      </div>
    </div>
  );
}
