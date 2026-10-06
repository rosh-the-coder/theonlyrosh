'use client';

import { useId, useLayoutEffect, useRef, useState } from 'react';
import { iaBranches } from '@/data/rvvCaseStudy';

type Kind = 'sequence' | 'optional' | 'conditional' | 'hierarchy' | 'utility';

type Edge = {
  id: string;
  from: string;
  to: string;
  label: string;
  kind: Kind;
};

type Box = {
  id: string;
  l: number;
  t: number;
  r: number;
  b: number;
  cx: number;
  cy: number;
};

type Pt = { x: number; y: number };

type Drawn = {
  id: string;
  from: string;
  to: string;
  d: string;
  kind: Kind;
  label: string;
  lx: number;
  ly: number;
};

const visitorEdges: Edge[] = [
  { id: 'v-landing-signup', from: 'landing', to: 'signup', label: 'new account', kind: 'sequence' },
  { id: 'v-landing-login', from: 'landing', to: 'login', label: 'returning', kind: 'sequence' },
  { id: 'v-signup-verify', from: 'signup', to: 'emailVerification', label: 'email only', kind: 'sequence' },
  { id: 'v-verify-onboarding', from: 'emailVerification', to: 'onboarding', label: 'verified', kind: 'sequence' },
  { id: 'v-signup-onboarding-google', from: 'signup', to: 'onboarding', label: 'Google skips verification', kind: 'optional' },
  { id: 'v-onboarding-home', from: 'onboarding', to: 'home', label: 'setup complete', kind: 'sequence' },
  { id: 'v-login-home', from: 'login', to: 'home', label: 'returning', kind: 'sequence' },
  { id: 'v-login-onboarding', from: 'login', to: 'onboarding', label: 'if setup unfinished', kind: 'conditional' },
  { id: 'v-home-card', from: 'home', to: 'galleryCard', label: '', kind: 'sequence' },
  { id: 'v-card-unity', from: 'galleryCard', to: 'unityRoom', label: 'opens the gallery page', kind: 'sequence' },
  { id: 'v-home-unity-featured', from: 'home', to: 'unityRoom', label: 'optional featured room', kind: 'optional' },
  { id: 'v-unity-detail', from: 'unityRoom', to: 'artworkDetail', label: 'click work', kind: 'sequence' },
  { id: 'v-unity-header', from: 'unityRoom', to: 'galleryHeader', label: 'without opening a work', kind: 'optional' },
  { id: 'v-detail-header', from: 'artworkDetail', to: 'galleryHeader', label: 'close the artwork', kind: 'sequence' },
  { id: 'v-header-profile', from: 'galleryHeader', to: 'artistProfile', label: 'select artist in gallery header', kind: 'sequence' },
];

const creatorEdges: Edge[] = [
  { id: 'c-gallery-upload', from: 'myGallery', to: 'wallSlot', label: 'wall slot', kind: 'sequence' },
  { id: 'c-upload-manage', from: 'wallSlot', to: 'managementGrid', label: '', kind: 'sequence' },
  { id: 'c-manage-preview', from: 'managementGrid', to: 'unityEdit', label: 'preview', kind: 'sequence' },
  { id: 'c-preview-live', from: 'unityEdit', to: 'goLive', label: 'GO LIVE', kind: 'sequence' },
  { id: 'c-live-discover', from: 'goLive', to: 'homeDiscoverCards', label: 'now listed', kind: 'sequence' },
];

const iaEdges: Edge[] = [
  { id: 'ia-shell-home', from: 'appShell', to: 'home', label: '', kind: 'hierarchy' },
  { id: 'ia-shell-shop', from: 'appShell', to: 'shop', label: '', kind: 'hierarchy' },
  { id: 'ia-shell-gallery', from: 'appShell', to: 'myGallery', label: '', kind: 'hierarchy' },
  { id: 'ia-shell-social', from: 'appShell', to: 'social', label: '', kind: 'hierarchy' },
  { id: 'ia-shell-profile', from: 'appShell', to: 'profile', label: '', kind: 'hierarchy' },
  { id: 'ia-shell-utilities', from: 'appShell', to: 'topNavUtilities', label: 'not a nav tab', kind: 'utility' },
];

const branchIds = ['home', 'shop', 'myGallery', 'social', 'profile'] as const;

function strokeFor(kind: Kind) {
  if (kind === 'sequence' || kind === 'conditional') return '#FF4B4B';
  return '#aaaaaa';
}

function dashFor(kind: Kind) {
  if (kind === 'optional' || kind === 'conditional') return '5 4';
  return undefined;
}

function segHits(a: Pt, b: Pt, box: Box) {
  const pad = 6;
  const l = box.l - pad;
  const r = box.r + pad;
  const t = box.t - pad;
  const btm = box.b + pad;
  if (Math.abs(a.y - b.y) <= 1) {
    const y = (a.y + b.y) / 2;
    if (y < t || y > btm) return false;
    const minx = Math.min(a.x, b.x);
    const maxx = Math.max(a.x, b.x);
    return maxx > l && minx < r;
  }
  if (Math.abs(a.x - b.x) <= 1) {
    const x = (a.x + b.x) / 2;
    if (x < l || x > r) return false;
    const miny = Math.min(a.y, b.y);
    const maxy = Math.max(a.y, b.y);
    return maxy > t && miny < btm;
  }
  return false;
}

function hits(pts: Pt[], boxes: Box[], skip: Set<string>) {
  for (let i = 0; i < pts.length - 1; i += 1) {
    for (const box of boxes) {
      if (skip.has(box.id)) continue;
      if (segHits(pts[i], pts[i + 1], box)) return true;
    }
  }
  return false;
}

function inside(pts: Pt[], width: number, height: number) {
  return pts.every((pt) => pt.x >= 2 && pt.y >= 2 && pt.x <= width - 2 && pt.y <= height - 2);
}

function explicitLane(from: Box, to: Box, edgeId: string): Pt[] | null {
  if (edgeId === 'v-signup-onboarding-google') {
    const y = Math.min(from.t, to.t) - 22;
    return [{ x: from.cx, y: from.t }, { x: from.cx, y }, { x: to.cx, y }, { x: to.cx, y: to.t }];
  }
  if (edgeId === 'v-login-onboarding') {
    const x = from.r + 18;
    const y = to.b + 14;
    return [{ x: from.r, y: from.cy }, { x, y: from.cy }, { x, y }, { x: to.cx, y }, { x: to.cx, y: to.b }];
  }
  if (edgeId === 'v-onboarding-home' || edgeId === 'v-login-home') {
    const y = to.t - (edgeId === 'v-onboarding-home' ? 16 : 30);
    return [{ x: from.cx, y: from.b }, { x: from.cx, y }, { x: to.cx, y }, { x: to.cx, y: to.t }];
  }
  if (edgeId === 'v-home-unity-featured' || edgeId === 'v-unity-header') {
    const y = Math.max(from.b, to.b) + (edgeId === 'v-home-unity-featured' ? 16 : 34);
    return [{ x: from.cx, y: from.b }, { x: from.cx, y }, { x: to.cx, y }, { x: to.cx, y: to.b }];
  }
  return null;
}

function route(from: Box, to: Box, boxes: Box[], width: number, height: number, edgeId: string) {
  const skip = new Set([from.id, to.id]);
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  const start: Pt = Math.abs(dx) >= Math.abs(dy)
    ? { x: dx >= 0 ? from.r : from.l, y: from.cy }
    : { x: from.cx, y: dy >= 0 ? from.b : from.t };
  const end: Pt = Math.abs(dx) >= Math.abs(dy)
    ? { x: dx >= 0 ? to.l : to.r, y: to.cy }
    : { x: to.cx, y: dy >= 0 ? to.t : to.b };

  const direct: Pt[] = Math.abs(start.x - end.x) < 2 || Math.abs(start.y - end.y) < 2
    ? [start, end]
    : Math.abs(dx) >= Math.abs(dy)
      ? [start, { x: (start.x + end.x) / 2, y: start.y }, { x: (start.x + end.x) / 2, y: end.y }, end]
      : [start, { x: start.x, y: (start.y + end.y) / 2 }, { x: end.x, y: (start.y + end.y) / 2 }, end];

  const lane = 0;
  const above = Math.min(from.t, to.t) - 16 - lane * 8;
  const below = Math.max(from.b, to.b) + 16 + lane * 8;
  const gutter = Math.min(from.l, to.l, 18) - 14;
  const rail = width - 10;
  const candidates: Pt[][] = [
    direct,
    [{ x: from.cx, y: from.t }, { x: from.cx, y: above }, { x: to.cx, y: above }, { x: to.cx, y: to.t }],
    [{ x: from.cx, y: from.b }, { x: from.cx, y: below }, { x: to.cx, y: below }, { x: to.cx, y: to.b }],
    [{ x: from.r, y: from.cy }, { x: rail, y: from.cy }, { x: rail, y: to.cy }, { x: to.r, y: to.cy }],
    [{ x: from.l, y: from.cy }, { x: gutter, y: from.cy }, { x: gutter, y: to.cy }, { x: to.l, y: to.cy }],
  ];
  if (to.t > from.b + 8) {
    const gapY = from.b + 14 + lane * 8;
    candidates.splice(1, 0, [
      { x: from.cx, y: from.b },
      { x: from.cx, y: gapY },
      { x: to.cx, y: gapY },
      { x: to.cx, y: to.t },
    ]);
  }

  const forced = explicitLane(from, to, edgeId);
  const chosen = forced && inside(forced, width, height) && !hits(forced, boxes, skip)
    ? forced
    : candidates.find((pts) => inside(pts, width, height) && !hits(pts, boxes, skip)) ?? direct;
  let labelAt = { span: 0, x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
  for (let index = 0; index < chosen.length - 1; index += 1) {
    const pt = chosen[index];
    const next = chosen[index + 1];
    const span = Math.abs(next.x - pt.x) + Math.abs(next.y - pt.y);
    if (span > labelAt.span) labelAt = { span, x: (pt.x + next.x) / 2, y: (pt.y + next.y) / 2 };
  }

  return {
    d: chosen.map((pt, index) => `${index === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' '),
    lx: Math.min(width - 36, Math.max(36, labelAt.x)),
    ly: labelAt.y - 8,
    span: labelAt.span,
  };
}

function useDrawnEdges(edges: Edge[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState<Drawn[]>([]);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const measure = () => {
      const rootBox = root.getBoundingClientRect();
      const boxes: Box[] = [];
      root.querySelectorAll<HTMLElement>('[data-node-id]').forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) return;
        boxes.push({
          id: node.dataset.nodeId || '',
          l: rect.left - rootBox.left,
          t: rect.top - rootBox.top,
          r: rect.right - rootBox.left,
          b: rect.bottom - rootBox.top,
          cx: rect.left - rootBox.left + rect.width / 2,
          cy: rect.top - rootBox.top + rect.height / 2,
        });
      });
      const byId = new Map(boxes.map((box) => [box.id, box]));
      const next: Drawn[] = [];
      edges.forEach((edge, index) => {
        const from = byId.get(edge.from);
        const to = byId.get(edge.to);
        if (!from || !to) return;
        const path = route(from, to, boxes, root.clientWidth, root.clientHeight, edge.id);
        const labelClear = !boxes.some((box) => path.lx > box.l - 6 && path.lx < box.r + 6 && path.ly > box.t - 10 && path.ly < box.b + 6);
        const label = labelClear && edge.label.length * 5.6 < path.span ? edge.label : '';
        next.push({ id: edge.id, from: edge.from, to: edge.to, d: path.d, kind: edge.kind, label, lx: path.lx, ly: path.ly });
      });
      setDrawn(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    const fonts = document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      void fonts;
    };
  }, [edges]);

  return { ref, drawn };
}

function ConnectorLayer({ drawn, markerId }: { drawn: Drawn[]; markerId: string }) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <defs>
        <marker id={`${markerId}-red`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#FF4B4B" />
        </marker>
        <marker id={`${markerId}-muted`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#aaaaaa" />
        </marker>
      </defs>
      {drawn.map((edge) => (
        <g key={edge.id}>
          <path
            data-edge-id={edge.id}
            data-from={edge.from}
            data-to={edge.to}
            d={edge.d}
            fill="none"
            stroke={strokeFor(edge.kind)}
            strokeWidth={edge.kind === 'hierarchy' ? 1.5 : 2}
            strokeDasharray={dashFor(edge.kind)}
            markerEnd={edge.kind === 'hierarchy' ? undefined : `url(#${markerId}-${edge.kind === 'sequence' || edge.kind === 'conditional' ? 'red' : 'muted'})`}
          />
          {edge.label ? (
            <text x={edge.lx} y={edge.ly} fill="#aaaaaa" fontSize="11" textAnchor="middle">
              {edge.label}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}

function GNode({
  id,
  title,
  detail,
  className = '',
  tone = 'sequence',
}: {
  id: string;
  title: string;
  detail?: string;
  className?: string;
  tone?: 'sequence' | 'hierarchy' | 'stub';
}) {
  const border = tone === 'stub' ? 'border-dashed border-[#aaa]' : tone === 'hierarchy' ? 'border-[#aaa]' : 'border-[#FF4B4B]';
  return (
    <div data-node-id={id} className={`relative z-10 min-w-0 rounded-xl border bg-[#272727] px-2.5 py-2 ${border} ${className}`}>
      <p className="text-sm font-semibold leading-5 text-white">{title}</p>
      {detail ? <p className="mt-0.5 text-xs leading-4 text-[#aaa]">{detail}</p> : null}
    </div>
  );
}

function EdgeList({ edges }: { edges: Edge[] }) {
  return (
    <ol className="sr-only">
      {edges.map((edge) => (
        <li key={edge.id}>{edge.id}: {edge.from} to {edge.to}{edge.label ? `, ${edge.label}` : ''}. {edge.kind}.</li>
      ))}
    </ol>
  );
}

function Legend() {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#aaa]">
      <li>Solid red — sequence</li>
      <li>Dashed red — conditional</li>
      <li>Dashed grey — optional</li>
      <li>Solid grey — hierarchy, not a step</li>
    </ul>
  );
}

export function VisitorFlow() {
  const markerId = useId().replace(/:/g, '');
  const { ref, drawn } = useDrawnEdges(visitorEdges);
  return (
    <figure className="mt-6" aria-label="Visitor journey from landing to the artist profile">
      <EdgeList edges={visitorEdges} />
      <div ref={ref} data-rvv-flow className="rvv-graph relative pb-12 pl-4 pr-8 pt-10">
        <ConnectorLayer drawn={drawn} markerId={markerId} />
        <div className="rvv-visitor-grid">
          <GNode id="landing" title="Landing" detail="Desktop entry. Phones cannot sign in." className="rvv-span-2 rvv-n-landing" />
          <GNode id="signup" title="Sign up" detail="Email or Google" className="rvv-n-signup" />
          <GNode id="login" title="Log in" detail="Returning account" className="rvv-n-login" />
          <GNode id="emailVerification" title="Email verification" detail="Email path only" className="rvv-span-2 rvv-n-verify" />
          <GNode id="onboarding" title="Onboarding" detail="Once, then Home" className="rvv-span-2 rvv-n-onboarding" />
          <GNode id="home" title="Home" detail="Discover galleries" className="rvv-span-2 rvv-n-home" />
          <GNode id="galleryCard" title="Gallery card" detail="Opens the room directly" className="rvv-span-2 rvv-n-card" />
          <GNode id="unityRoom" title="Unity room" detail="Same gallery page" className="rvv-span-2 rvv-n-unity" />
          <GNode id="artworkDetail" title="Artwork detail" detail="No link to the artist here" className="rvv-span-2 rvv-n-detail" />
          <GNode id="galleryHeader" title="Gallery header" detail="Same page, once the artwork closes" className="rvv-span-2 rvv-n-header" />
          <GNode id="artistProfile" title="Artist profile" detail="Opened from that header" className="rvv-span-2 rvv-n-profile" />
        </div>
      </div>
      <figcaption className="mt-2 text-sm leading-6 text-[#aaa]">
        Someone can find a gallery on Home, open its card and walk into the Unity room. Clicking a piece opens its details. To reach the artist, they close the artwork view and use the link in the gallery header.
      </figcaption>
      <Legend />
    </figure>
  );
}

export function CreatorFlow() {
  const markerId = useId().replace(/:/g, '');
  const { ref, drawn } = useDrawnEdges(creatorEdges);
  return (
    <figure className="mt-6" aria-label="Creator path from My Gallery to a discoverable room">
      <EdgeList edges={creatorEdges} />
      <div ref={ref} data-rvv-creator className="rvv-graph relative px-4 pb-4 pt-6">
        <ConnectorLayer drawn={drawn} markerId={markerId} />
        <div className="rvv-creator-grid">
          <GNode id="myGallery" title="My Gallery" detail="Where the artist works on their room" />
          <GNode id="wallSlot" title="Wall-slot upload" detail="Add a work to a wall" />
          <GNode id="managementGrid" title="Manage" detail="Choose what appears" />
          <GNode id="unityEdit" title="Preview" detail="Look at the room before publishing" />
          <GNode id="goLive" title="GO LIVE" detail="Makes the gallery discoverable" />
          <GNode id="homeDiscoverCards" title="Discoverable" detail="Visitors can find it from Home" />
        </div>
      </div>
      <figcaption className="mt-2 text-sm leading-6 text-[#aaa]">
        In My Gallery, an artist can upload work into a wall slot, manage what appears in the room and make the gallery discoverable with GO LIVE. Those controls share one screen.
      </figcaption>
    </figure>
  );
}

export function AppMap() {
  const markerId = useId().replace(/:/g, '');
  const { ref, drawn } = useDrawnEdges(iaEdges);
  return (
    <figure className="mt-6" aria-label="Signed-in information architecture">
      <EdgeList edges={iaEdges} />
      <div ref={ref} data-rvv-ia className="rvv-graph relative px-5 pb-2 pt-2">
        <ConnectorLayer drawn={drawn} markerId={markerId} />
        <div className="rvv-ia-top">
          <GNode id="appShell" tone="hierarchy" title="Signed-in app shell" detail="Five destinations in parallel. Bottom bar only after sign-in." className="min-w-0 flex-1" />
          <GNode id="topNavUtilities" tone="hierarchy" title="Top nav utilities" detail="Messages · Notifications. Not a sixth tab." className="rvv-ia-utilities" />
        </div>
        <div className="rvv-ia-grid">
          {iaBranches.map((branch, index) => (
            <div key={branch.title} data-node-id={branchIds[index]} className="relative z-10 min-w-0 rounded-xl border border-[#aaa] bg-[#272727] p-3">
              <p className="text-sm font-semibold text-white">{branch.title}</p>
              <p className="text-xs text-[#aaa]">{branch.route}</p>
              <ul className="mt-2 space-y-1 border-l border-[#aaa] pl-2">
                {branch.children.map((child, childIndex) => {
                  const stub = 'dashedLast' in branch && branch.dashedLast && childIndex === branch.children.length - 1;
                  return (
                    <li key={child} className={`text-xs leading-4 text-white ${stub ? 'rounded-md border border-dashed border-[#aaa] px-1.5 py-1 text-[#aaa]' : ''}`}>
                      {child}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-2 text-sm leading-6 text-[#aaa]">
        After sign-in, Home, Shop, My Gallery, Social and Profile are places people can visit—not steps they have to complete. Home and search lead to other artists’ galleries; My Gallery is where a creator works on their own room.
      </figcaption>
      <Legend />
    </figure>
  );
}

export function PlatformPreference() {
  return (
    <figure className="max-w-xl" data-asset="rvv-fig05-platform-preference">
      <div className="flex h-9 overflow-hidden rounded-lg text-xs font-medium text-white" role="img" aria-label="7 of 9 chose web and 2 of 9 chose mobile for a role-playing 3D gallery">
        <div className="flex items-center bg-[#FF4B4B] px-2" style={{ width: `${(7 / 9) * 100}%` }}>Web 7</div>
        <div className="flex items-center bg-[#272727] px-2" style={{ width: `${(2 / 9) * 100}%` }}>2</div>
      </div>
      <figcaption className="mt-2 text-sm leading-5 text-[#aaa]">Early platform-preference question · n=9 · specific to a 3D gallery scenario.</figcaption>
    </figure>
  );
}

export function ClarityCompare() {
  const rows = [
    ['Artwork interaction clear', 13],
    ['Purpose clear immediately', 10],
  ] as const;
  return (
    <figure aria-label="13 of 14 rated artwork interaction clear. 10 of 14 rated immediate purpose clear.">
      <div className="space-y-3">
        {rows.map(([label, count]) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-white">{label}</span>
              <span className="text-[#aaa]">{count}/14</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#272727]">
              <div className="h-full bg-[#FF4B4B]" style={{ width: `${(count / 14) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <figcaption className="mt-2 text-sm leading-5 text-[#aaa]">Post-prototype survey · 14 responses · rated 4 or 5 out of 5.</figcaption>
    </figure>
  );
}
