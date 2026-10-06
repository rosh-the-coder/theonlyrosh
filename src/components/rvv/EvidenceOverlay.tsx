'use client';

import { useEffect, useRef, useState } from 'react';
import { AppMap, ClarityCompare, CreatorFlow, PlatformPreference, VisitorFlow } from '@/components/rvv/Diagrams';
import ReportFigure from '@/components/rvv/ReportFigure';
import {
  competitorHeaders,
  competitors,
  explorations,
  iaBranches,
  metrics,
  panelMeta,
  type PanelId,
} from '@/data/rvvCaseStudy';

const panelWidth: Record<PanelId, string> = {
  survey: 'md:w-[560px]',
  competitors: 'md:w-[960px]',
  explorations: 'md:w-[760px]',
  testing: 'md:w-[760px]',
  ia: 'md:w-[880px]',
  'design-system': 'md:w-[720px]',
  scope: 'md:w-[880px]',
};

function Dots({ filled }: { filled: number }) {
  return (
    <div className="flex flex-wrap gap-1.5" aria-hidden>
      {Array.from({ length: 14 }, (_, index) => (
        <span
          key={index}
          className={`h-3.5 w-3.5 rounded-full border ${index < filled ? 'border-[#FF4B4B] bg-[#FF4B4B]' : 'border-[#aaa] bg-[#272727]'}`}
        />
      ))}
    </div>
  );
}

function PanelBody({ id }: { id: PanelId }) {
  if (id === 'survey') {
    return (
      <div className="space-y-5">
        {metrics.map((metric) => (
          <div key={metric.figure}>
            <p className="text-lg font-semibold text-white">{metric.figure} {metric.label}</p>
            <p className="mt-1 text-sm text-[#aaa]">{metric.support}</p>
            <div className="mt-2"><Dots filled={metric.filled} /></div>
          </div>
        ))}
        <div>
          <p className="font-semibold text-white">Walkthrough</p>
          <div className="mt-2 flex h-7 overflow-hidden rounded-lg" aria-hidden>
            <div className="bg-[#FF4B4B]" style={{ width: `${(8 / 14) * 100}%` }} />
            <div className="bg-[#737373]" style={{ width: `${(5 / 14) * 100}%` }} />
            <div className="bg-[#272727]" style={{ width: `${(1 / 14) * 100}%` }} />
          </div>
          <p className="mt-2 text-sm text-[#aaa]">8 Smooth · 5 Acceptable · 1 Laggy</p>
        </div>
        <p className="text-sm text-[#aaa]">13 of 14 said they would recommend it, rating likelihood 4 or 5 out of 5.</p>
        <p className="text-sm text-[#aaa]">The submitted report counted 13 responses. The sheet I used later has 14. An earlier survey of 9 people, and a mid-fidelity round of 3, are different stages. This panel uses the later sheet and a 4-or-5 threshold.</p>
        <p className="text-sm text-[#aaa]">Post-prototype survey · 14 responses · what people reported after trying the MVP.</p>
      </div>
    );
  }

  if (id === 'competitors') {
    return (
      <div>
        <p className="text-sm leading-6 text-[#aaa]">I reviewed these six products myself in 2025. This is a design comparison, not a test with participants.</p>
        <div className="mt-4 hidden md:grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)] md:gap-3">
          {competitorHeaders.map((header) => (
            <p key={header} className="text-sm font-semibold text-white">{header}</p>
          ))}
          {competitors.flatMap((row) => row.map((cell, index) => (
            <p key={`${row[0]}-${index}`} className={`min-w-0 border-t border-white/10 pt-3 text-sm leading-5 ${index === 0 ? 'font-medium text-white' : 'text-[#aaa]'}`}>{cell}</p>
          )))}
        </div>
        <div className="mt-4 space-y-3 md:hidden">
          {competitors.map((row) => (
            <article key={row[0]} className="rounded-xl bg-[#1a1a1a] p-3">
              {competitorHeaders.map((field, index) => (
                <p key={field} className="mt-2 first:mt-0 text-sm leading-5">
                  <span className="font-medium text-[#FF4B4B]">{field}. </span>
                  <span className="text-white">{row[index]}</span>
                </p>
              ))}
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm leading-5 text-[#aaa]">Pinterest suggested visual categorisation. Behance suggested contextual artist information. Social patterns informed light engagement. Those were adjacent notes, not the six references above.</p>
      </div>
    );
  }

  if (id === 'explorations') {
    return (
      <div className="space-y-4">
        <PlatformPreference />
        <div className="grid gap-4">
          <ReportFigure file="42" caption="Mobile mid-fidelity, including a gallery-information stop I later dropped." />
          <ReportFigure file="43" caption="Sketches after that round." />
          <ReportFigure file="44" caption="Mobile high-fidelity." />
          <ReportFigure file="45" caption="The mobile room. This artwork view still offers a profile and a purchase. The current gallery does neither from that view." />
          <ReportFigure file="46" caption="The first web pass: a marketing page, not the signed-in app." />
        </div>
        {explorations.map((stage) => (
          <article key={stage[0]} className="rounded-xl bg-[#1a1a1a] p-4">
            <h3 className="font-semibold text-white">{stage[0]}</h3>
            <p className="mt-2 text-sm text-white">{stage[1]}</p>
            <p className="mt-1 text-sm leading-6 text-[#aaa]">{stage[2]}</p>
          </article>
        ))}
      </div>
    );
  }

  if (id === 'testing') {
    const stages = ['Early paper and low-fi sessions with peers', 'Moderated mobile mid-fi, three people', 'Live browser and Unity iteration', 'Later MVP rounds with peers and a remote task list', 'A separate survey after the prototype'];
    const cards = [
      ['Getting in', 'A crowded Home and a muddled path into the gallery.', 'The current build opens the room from the gallery card.', 'In the current build'],
      ['Moving around', 'People wanted deliberate camera control, and help when they entered the room.', 'The finished report describes a controls overlay and calmer movement.', 'Described in the report'],
      ['Knowing what is loading', 'A silent wait made the room feel broken.', 'The finished report describes loading and placeholder states.', 'Described in the report'],
      ['Still open', 'Phone access, older-device performance, and accessibility.', 'Checkout does not take payment, and logged-out phones cannot sign in.', 'Not in this MVP'],
    ];
    return (
      <div className="space-y-4">
        <ol className="space-y-2">
          {stages.map((stage) => (
            <li key={stage} className="text-sm leading-6 text-white">{stage}</li>
          ))}
        </ol>
        <p className="text-sm leading-6 text-[#aaa]">The submitted report counted 13 people in the final test rounds. The survey sheet I used later has 14 responses. They are not the same study, and I do not have a before-and-after success rate.</p>
        <ReportFigure file="62" caption="The Unity room, from an early blockout to a later gallery." />
        {cards.map((card) => (
          <article key={card[0]} className="rounded-xl bg-[#1a1a1a] p-4">
            <h3 className="font-semibold text-white">{card[0]}</h3>
            <p className="mt-2 text-sm text-[#aaa]"><span className="text-[#FF4B4B]">Task. </span>{card[0]}</p>
            <p className="mt-2 text-sm text-[#aaa]"><span className="text-white">Observation. </span>{card[1]}</p>
            <p className="mt-2 text-sm text-white"><span className="text-[#FF4B4B]">Change. </span>{card[2]}</p>
            <p className="mt-2 text-sm font-medium text-[#FF4B4B]">Status. {card[3]}</p>
          </article>
        ))}
      </div>
    );
  }

  if (id === 'ia') {
    return (
      <div className="space-y-4 text-sm leading-6 text-[#aaa]">
        <p>After sign-in, Home, Shop, My Gallery, Social and Profile are places someone can visit, not steps they must complete. The gallery artwork view has no profile button. Close it and use the gallery header. The shop’s artwork view can open a profile. Checkout does not take payment.</p>
        <VisitorFlow />
        <CreatorFlow />
        <AppMap />
        <ul className="sr-only">
          {iaBranches.map((branch) => (
            <li key={branch.title}>{branch.title} {branch.route}: {branch.children.join(', ')}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (id === 'design-system') {
    const swatches = [
      ['#0F0F0F', 'Page'],
      ['#1A1A1A', 'Surface'],
      ['#272727', 'Card'],
      ['#FF4B4B', 'Action'],
      ['#AAAAAA', 'Muted text'],
    ];
    return (
      <div className="space-y-4">
        <p className="text-sm leading-6 text-[#aaa]">I kept the interface dark so the artwork could carry the colour. Red marks an action. Teko is the display face on this page, and Inter carries the interface.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {swatches.map(([colour, label]) => (
            <figure key={colour} className="min-w-0">
              <div className="h-16 rounded-xl border border-white/15" style={{ backgroundColor: colour }} />
              <figcaption className="mt-2 text-sm text-white">{label}</figcaption>
              <p className="text-xs text-[#aaa]">{colour}</p>
            </figure>
          ))}
        </div>
        <p className="text-sm leading-6 text-[#aaa]">Home, Shop, Gallery, Social and Profile sit in the left rail. Messages, notifications and cart stay in the top bar.</p>
        <ReportFigure file="49" caption="The palette." />
        <ReportFigure file="52" caption="Type styles. The report sheet says Tekio; this site uses Teko." />
        <ReportFigure file="53" caption="Hierarchy." />
      </div>
    );
  }

  const columns = [
    ['Built', 'Gallery discovery, creator upload and management, a walkable Unity room, artwork details, profiles and social features, in a desktop browser. People can browse the Shop and add work to a cart.'],
    ['Not finished', 'Checkout does not complete a purchase. Logged-out phones cannot sign in. Phone access, older devices and accessibility were left for later.'],
    ['Still open', 'Can someone say what RVV is, find a gallery and open a piece without a prompt?'],
  ];
  return (
    <div className="space-y-4">
      <ClarityCompare />
      <div className="grid gap-3 md:grid-cols-3">
        {columns.map((column) => (
          <article key={column[0]} className="min-w-0 rounded-xl bg-[#1a1a1a] p-4">
            <h3 className="font-semibold text-white">{column[0]}</h3>
            <p className="mt-2 text-sm leading-6 text-[#aaa]">{column[1]}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

const PANEL_MS = 520;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

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
      if (prefersReducedMotion()) {
        openRef.current = true;
        setOpen(true);
        return;
      }
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
    const delay = prefersReducedMotion() ? 0 : PANEL_MS;
    const timer = window.setTimeout(() => setCurrent(null), delay);
    return () => window.clearTimeout(timer);
  }, [panel]);

  useEffect(() => {
    onPresenceRef.current?.(current !== null);
  }, [current]);

  useEffect(() => {
    if (!current) return;
    const root = dialogRef.current;
    if (!root) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusable = () =>
      Array.from(root.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])'));
    focusable()[0]?.focus();
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
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
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
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div key={current} className="rvv-evidence-content">
            <PanelBody id={current} />
          </div>
        </div>
      </div>
    </div>
  );
}
