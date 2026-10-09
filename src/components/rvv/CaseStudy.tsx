'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CreatorFlow, VisitorFlow } from '@/components/rvv/Diagrams';
import EvidenceOverlay from '@/components/rvv/EvidenceOverlay';
import ReportFigure from '@/components/rvv/ReportFigure';
import WalkthroughPlayer, { type PlayerHandle } from '@/components/rvv/WalkthroughPlayer';
import { heroVideoUrl, metrics, prototypeUrl, showreelVideoUrl, walkthroughVideoUrl, type PanelId } from '@/data/rvvCaseStudy';

const sectionClass = 'rvv-reveal border-t border-white/10 py-16 md:py-24';

const facts = [
  ['Role', 'UX/UI design and development'],
  ['Team', 'Solo project'],
  ['Platform', 'Desktop web + Unity WebGL'],
  ['Tools', 'Figma · React · Firebase · Unity'],
] as const;

const reportFolderUrl = 'https://drive.google.com/drive/folders/1hDhhxPwsY-90GXPfKwvyc2r1WOcjP_Rn?usp=sharing';
const figmaSystemUrl = 'https://www.figma.com/design/IrRpfLUo6AThFUw8EH0AR7/RedVelvetVault?node-id=1079-1758&t=cMrrJBMTlLdowFMr-1';

const learned = [
  ['01', 'Discovery had to feel familiar', 'People already understood artwork cards, artist profiles and a social feed.'],
  ['02', 'Immersion needed guidance', 'A 3D room was attractive, but first-time visitors needed a clear way in and a way to move.'],
  ['03', 'Artwork needed room', 'Small phone layouts squeezed the thing the project was for: seeing the work, then walking around it.'],
] as const;

const moments = [
  [0, 'Discover', 'Artwork stays dominant. Categories and filters stay close.'],
  [50, 'Enter', 'The room opens from the gallery card, not from a separate mode.'],
  [90, 'Explore', 'WASD to move. Click and drag to look. Controls stay on screen.'],
  [140, 'Inspect', 'Artwork details stay with the piece. The artist link is in the gallery header, not the artwork view.'],
  [210, 'Create', 'Upload once, manage the room, then publish from the web.'],
  [265, 'Connect', 'The room leads back to a person: profile, follow, message.'],
] as const;

function ProductShot({ src, caption, tall = false }: { src: string; caption: string; tall?: boolean }) {
  return (
    <figure className="min-w-0">
      <img
        src={src}
        alt={caption}
        className={`w-full rounded-2xl border border-white/10 bg-[#1a1a1a] object-contain ${tall ? 'max-h-[78vh]' : 'max-h-[640px]'}`}
      />
      <figcaption className="mt-3 text-sm leading-6 text-[#aaa]">{caption}</figcaption>
    </figure>
  );
}

function Trigger({
  panel,
  children,
  onOpen,
}: {
  panel: PanelId;
  children: string;
  onOpen: (panel: PanelId) => void;
}) {
  return (
    <button
      type="button"
      data-panel={panel}
      onClick={() => onOpen(panel)}
      className="mt-6 inline-flex min-h-11 items-center text-base font-medium text-[#FF4B4B] underline-offset-4 hover:underline"
    >
      {children}
    </button>
  );
}

function Dots({ filled }: { filled: number }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5" aria-hidden>
      {Array.from({ length: 14 }, (_, index) => (
        <span
          key={index}
          className={`h-2.5 w-2.5 rounded-full border ${index < filled ? 'border-[#FF4B4B] bg-[#FF4B4B]' : 'border-[#aaa] bg-[#272727]'}`}
        />
      ))}
    </div>
  );
}

export default function CaseStudy() {
  const mainRef = useRef<HTMLElement>(null);
  const walkthroughRef = useRef<PlayerHandle>(null);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [panelPresent, setPanelPresent] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const open = useCallback((next: PanelId) => setPanel(next), []);

  const playFrom = useCallback((seconds: number) => {
    document.getElementById('rvv-showreel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    walkthroughRef.current?.seek(seconds);
    walkthroughRef.current?.play();
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduceMotion(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>('.rvv-reveal'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    sections.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main ref={mainRef} className="min-h-screen bg-[#0f0f0f] text-white">
      <section className="relative flex min-h-[100svh] w-full flex-col overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay={!reduceMotion}
          muted
          loop={!reduceMotion}
          playsInline
          preload="auto"
          aria-hidden
          src={heroVideoUrl}
          onLoadedData={(event) => {
            if (!reduceMotion) return;
            event.currentTarget.pause();
            event.currentTarget.currentTime = 0;
          }}
        />
        <div className="rvv-hero-vignette pointer-events-none absolute inset-0" />
        <Link
          href="/#work"
          className="absolute left-4 top-4 z-10 inline-flex min-h-11 items-center text-sm text-white/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF4B4B] sm:left-8 md:left-10"
        >
          Back to work
        </Link>
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-5 pb-36 pt-28 sm:px-8 sm:pb-40 md:px-10 md:pb-44">
          <div className="max-w-[620px] sm:max-w-[min(620px,calc(100vw-28rem))] min-[1100px]:max-w-[620px]">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-[#FF4B4B]">MSc capstone · 2025</p>
            <h1 className="mt-3 font-teko text-6xl leading-none text-white sm:text-7xl lg:text-[6.5rem]">RedVelvetVault</h1>
            <p className="mt-4 max-w-[38rem] text-xl font-medium leading-8 text-white sm:text-2xl sm:leading-9">A web platform where artists can share their work and visitors can explore it in a 3D gallery.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={prototypeUrl} target="_blank" rel="noopener noreferrer" aria-label="Explore the prototype. Opens RedVelvetVault in a new tab." className="inline-flex min-h-11 items-center rounded-full bg-[#FF4B4B] px-5 font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Explore the prototype</a>
              <a href="#rvv-showreel" className="inline-flex min-h-11 items-center rounded-full border border-white/40 px-5 font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Watch the walkthrough</a>
            </div>
            <dl className="mt-8 grid max-w-lg grid-cols-2 gap-x-6 gap-y-3 sm:max-w-[22rem] min-[1100px]:max-w-lg">
              {facts.map(([term, detail]) => (
                <div key={term} className="min-w-0">
                  <dt className="text-[13px] uppercase tracking-wide text-white/70">{term}</dt>
                  <dd className="mt-1 text-sm text-white">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <div data-rvv-container className="mx-auto w-full max-w-[1440px] px-4 min-[390px]:px-5 md:px-8 xl:px-12">
        <section className="py-10 md:py-14">
          <div className="grid gap-3 md:grid-cols-3">
            {metrics.map((metric) => (
              <article key={metric.figure} className="min-w-0 rounded-2xl bg-[#1a1a1a] p-4">
                <p className="font-teko text-5xl leading-none text-white">{metric.figure}</p>
                <p className="mt-2 text-sm text-white">{metric.label}</p>
                <p className="mt-1 text-xs text-[#aaa]">{metric.support}</p>
                <Dots filled={metric.filled} />
              </article>
            ))}
          </div>
          <p className="mt-3 max-w-[42rem] text-sm leading-6 text-[#aaa]">Final MVP survey · 14 responses · what testers reported after trying it.</p>
          <Trigger panel="survey" onOpen={open}>View survey results →</Trigger>
        </section>
      </div>

      <div data-rvv-container className="mx-auto w-full max-w-[1440px] px-4 min-[390px]:px-5 md:px-8 xl:px-12">
        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What visitors and artists do</h2>
          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div>
              <div className="grid gap-3 sm:grid-cols-2">
                <article className="rounded-2xl border border-white/10 p-4">
                  <h3 className="text-sm font-medium text-[#FF4B4B]">Visitors</h3>
                  <p className="mt-2 text-base leading-7 text-white">Find a gallery, open it, walk through the room, and look at the work.</p>
                </article>
                <article className="rounded-2xl border border-white/10 p-4">
                  <h3 className="text-sm font-medium text-[#FF4B4B]">Artists</h3>
                  <p className="mt-2 text-base leading-7 text-white">Upload work, arrange the room, preview it, and publish.</p>
                </article>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-[#FF4B4B]">The gap I was designing for</h3>
              <div className="mt-4 space-y-4">
                <p className="text-base leading-7 text-[#aaa]"><span className="text-white">Easy to browse, flat to view. </span>Behance, ArtStation and Pinterest make finding work easy. Looking at it stays in a feed.</p>
                <p className="text-base leading-7 text-[#aaa]"><span className="text-white">Spatial, but harder to start. </span>Spatial and OnCyber put art in a room, then ask someone to learn a world, a control scheme, or a crypto cue.</p>
              </div>
            </div>
          </div>
          <div className="mt-10 max-w-[44rem]">
            <h3 className="text-sm font-medium uppercase tracking-wide text-[#FF4B4B]">The question I kept returning to</h3>
            <p className="mt-3 text-2xl font-medium leading-snug text-white">How can a digital artist have the presence of a physical exhibition without giving up the simplicity of a normal website?</p>
          </div>
          <Trigger panel="competitors" onOpen={open}>See research context →</Trigger>
        </section>

        <section id="rvv-showreel" className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">See it in motion</h2>
          <p className="mt-3 max-w-[40rem] text-base leading-7 text-[#aaa]">This is the walkthrough of the working MVP, before the process that led to it.</p>
          <figure className="mt-8">
            <WalkthroughPlayer
              ref={walkthroughRef}
              variant="inline"
              title="Walkthrough"
              src={walkthroughVideoUrl}
            />
            <figcaption className="mt-3 text-sm leading-6 text-[#aaa]">Chapters: intro, onboarding, the room, shop, my gallery, social, profile, conclusion.</figcaption>
          </figure>
          <p className="mt-4 text-base text-white">I designed and built this as a working MVP.</p>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What I learned before committing to a design</h2>
          <div className="mt-8 grid gap-3 lg:grid-cols-3">
            {learned.map(([number, title, body]) => (
              <article key={number} className="rounded-2xl bg-[#1a1a1a] p-5">
                <p className="font-teko text-3xl leading-none text-[#FF4B4B]">{number}</p>
                <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#aaa]">{body}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <ReportFigure file="38" caption="Early paper screens. Getting into the room still took an extra step." />
            <ReportFigure file="42" caption="Mobile mid-fidelity. The flow was there. The artwork was not." />
          </div>
          <Trigger panel="explorations" onOpen={open}>See how the idea developed →</Trigger>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Why I moved to desktop</h2>
          <p className="mt-4 max-w-[40rem] text-2xl font-medium leading-snug text-white">I began with a mobile prototype. Testing showed that the artwork felt small and the 3D gallery felt cramped, so I moved the main experience to desktop.</p>
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-[#FF4B4B]">Mobile-first → Desktop-first</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div>
              <ReportFigure file="44" caption="Mobile high-fidelity. Navigation was familiar. The work stayed small." />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-white">What worked</p>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-[#aaa]">
                    <li>Familiar navigation</li>
                    <li>Portable</li>
                    <li>The overall flow held up</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">What broke</p>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-[#aaa]">
                    <li>Small artwork cards</li>
                    <li>Crowded hierarchy</li>
                    <li>A cramped 3D view</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <ReportFigure file="46" caption="First web composition. More room for the work and for the gallery viewer." />
              <ul className="mt-4 space-y-1 text-sm leading-6 text-[#aaa]">
                <li>Larger artwork surfaces</li>
                <li>Room to breathe</li>
                <li>A persistent way around the app</li>
                <li>A viewport that could hold Unity</li>
              </ul>
            </div>
          </div>
          <Trigger panel="pivot" onOpen={open}>See why I moved to desktop →</Trigger>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">From browsing to a gallery</h2>
          <p className="mt-3 max-w-[40rem] text-base leading-7 text-[#aaa]">Visitors find a gallery on the website, then walk through it in the Unity room.</p>
          <ol className="mt-6 flex flex-wrap gap-2 text-sm text-white">
            {['Home', 'Gallery card', 'Unity room', 'Artwork', 'Artist'].map((step, index) => (
              <li key={step} className="inline-flex items-center gap-2">
                {index > 0 && <span className="text-[#FF4B4B]" aria-hidden>→</span>}
                <span className="rounded-full border border-white/15 px-3 py-1.5">{step}</span>
              </li>
            ))}
          </ol>
          <VisitorFlow />
          <div className="mt-8">
            <ProductShot src="/Work/RVV/case-study-v2/shipped/home.png" caption="Opened gallery. Home stays selected, and the artist header — share, follow, message — sits above the room." />
          </div>
          <h2 className="mt-14 text-3xl font-semibold tracking-tight sm:text-4xl">From upload to exhibition</h2>
          <ol className="mt-6 flex flex-wrap gap-2 text-sm text-white">
            {['My Gallery', 'Upload', 'Manage', 'Preview', 'Go Live', 'Discoverable'].map((step, index) => (
              <li key={step} className="inline-flex items-center gap-2">
                {index > 0 && <span className="text-[#FF4B4B]" aria-hidden>→</span>}
                <span className="rounded-full border border-white/15 px-3 py-1.5">{step}</span>
              </li>
            ))}
          </ol>
          <CreatorFlow />
          <div className="mt-8">
            <ProductShot src="/Work/RVV/case-study-v2/shipped/go-live.gif" caption="Live preview. GO LIVE publishes the room." />
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Navigation for visitors and creators</h2>
          <p className="mt-4 max-w-[42rem] text-base leading-7 text-white">Visitors use Home to find galleries and artists. Creators use My Gallery to upload and manage their work. I kept these sections in the sidebar and put messages, notifications and the cart in the top bar.</p>
          <p className="mt-3 max-w-[42rem] text-base leading-7 text-[#aaa]">This keeps navigation in a predictable place while leaving the main area for artwork and the gallery viewer.</p>
          <figure className="mt-8">
            <img src="/Work/RVV/case-study-v2/shipped/home.png" alt="RedVelvetVault with the sidebar, top bar and an open gallery room." className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] object-contain" />
            <figcaption className="mt-3 space-y-1 text-sm leading-6 text-[#aaa]">
              <p>1. Sidebar — Home, Shop, Gallery, Social and Profile.</p>
              <p>2. Top bar — search, cart, messages, notifications and the account.</p>
              <p>3. Main area — the artist header and the gallery room.</p>
            </figcaption>
          </figure>
          <Trigger panel="ia" onOpen={open}>View the navigation map →</Trigger>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What testing changed</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <article className="rounded-2xl bg-[#1a1a1a] p-5">
              <h3 className="text-lg font-semibold text-white">Gallery entry</h3>
              <p className="mt-3 text-sm leading-6 text-[#aaa]"><span className="text-white">Before. </span>People could not tell how to get into the 3D space.</p>
              <p className="mt-2 text-sm leading-6 text-white"><span className="text-[#FF4B4B]">After. </span>The gallery card opens the room.</p>
            </article>
            <article className="rounded-2xl bg-[#1a1a1a] p-5">
              <h3 className="text-lg font-semibold text-white">Camera</h3>
              <p className="mt-3 text-sm leading-6 text-[#aaa]"><span className="text-white">Before. </span>The camera drifted, and movement felt too sharp.</p>
              <p className="mt-2 text-sm leading-6 text-white"><span className="text-[#FF4B4B]">After. </span>Click and drag to look, with a controls overlay. Described in the report.</p>
            </article>
            <article className="rounded-2xl bg-[#1a1a1a] p-5">
              <h3 className="text-lg font-semibold text-white">Loading</h3>
              <p className="mt-3 text-sm leading-6 text-[#aaa]"><span className="text-white">Before. </span>A silent wait looked like missing art.</p>
              <p className="mt-2 text-sm leading-6 text-white"><span className="text-[#FF4B4B]">After. </span>Placeholders and a visible loading state. Described in the report.</p>
            </article>
          </div>
          <div className="mt-8">
            <ReportFigure tall file="62" caption="Early gallery blockout beside a later gallery build." />
          </div>
          <Trigger panel="testing" onOpen={open}>View observations and changes →</Trigger>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">The final experience</h2>
          <div className="mt-8 space-y-14">
            <div>
              <p className="font-teko text-4xl leading-none text-[#FF4B4B]">Enter</p>
              <div className="mt-4">
                <ProductShot tall src="/Work/RVV/case-study-v2/shipped/home.png" caption="The room opens in place. The artist stays on the gallery — share, follow, message — instead of sending the visitor into a separate mode." />
              </div>
            </div>
            <div>
              <p className="font-teko text-4xl leading-none text-[#FF4B4B]">Go live</p>
              <div className="mt-4">
                <ProductShot tall src="/Work/RVV/case-study-v2/shipped/go-live.gif" caption="The creator checks the room in live preview, then publishes it with GO LIVE." />
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {moments.map(([time, title]) => (
              <button
                key={title}
                type="button"
                onClick={() => playFrom(time)}
                className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-4 text-sm text-white transition-colors hover:border-[#FF4B4B]"
              >
                {title}
              </button>
            ))}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Desktop first</h2>
          <p className="mt-4 max-w-[42rem] text-base leading-7 text-[#aaa]">The walkable room was built for a desktop browser. I do not have finished screens of the same page at desktop, tablet and phone widths, so this section does not invent them. The earlier mobile screens are prototypes, shown in the section about moving to desktop.</p>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Colours, typography and components</h2>
          <p className="mt-4 max-w-[42rem] text-base leading-7 text-[#aaa]">I used a shared set of colours, type styles and components across the web interface. Dark surfaces frame the artwork, while red highlights actions and selected states. The values below are the ones documented in the project report.</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-[#1a1a1a] p-5">
              <p className="text-xs uppercase tracking-wide text-[#aaa]">Colours</p>
              <ul className="mt-4 space-y-3">
                {[
                  ['#0F0F0F', 'RVV Black', 'Page background'],
                  ['#1A1A1A', 'Dark Surface', 'Panels'],
                  ['#272727', 'Gray', 'Cards and quiet controls'],
                  ['#AAAAAA', 'Light Gray', 'Secondary text'],
                  ['#FF4B4B', 'RVV Red', 'Actions and selected states'],
                  ['#FFFFFF', 'White', 'Primary text'],
                ].map(([colour, name, use]) => (
                  <li key={name} className="flex items-center gap-3">
                    <span className="h-10 w-10 shrink-0 rounded-lg border border-white/10" style={{ backgroundColor: colour }} />
                    <span>
                      <span className="block text-sm text-white">{name}</span>
                      <span className="block text-xs text-[#aaa]">{colour} · {use}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-[#1a1a1a] p-5">
              <p className="text-xs uppercase tracking-wide text-[#aaa]">Type, from the report</p>
              <p className="mt-4 font-teko text-[60px] font-bold leading-none text-white">Share your art. Build your gallery.</p>
              <p className="text-xs text-[#aaa]">Tekio · Display · 60px / 700</p>
              <p className="mt-4 text-[30px] font-semibold leading-none text-white">Discover galleries</p>
              <p className="text-xs text-[#aaa]">Inter · H3 · 30px / 600</p>
              <p className="mt-4 text-base text-white">Explore collections from artists and creators.</p>
              <p className="text-xs text-[#aaa]">Inter · Body · 16px / 400</p>
              <p className="mt-4 text-sm text-white">Upload artwork</p>
              <p className="text-xs text-[#aaa]">Inter · Label · 14px / 400</p>
              <p className="mt-4 text-xs text-white">Artist · 12 artworks</p>
              <p className="text-xs text-[#aaa]">Inter · Metadata · 12px / 400</p>
            </div>
          </div>
          <figure className="mt-4">
            <img src="/Work/RVV/case-study-v2/shipped/home.png" alt="The shipped interface: sidebar, gallery header and room." className="max-h-[520px] w-full rounded-2xl border border-white/10 bg-[#1a1a1a] object-contain object-left" />
            <figcaption className="mt-2 text-sm leading-6 text-[#aaa]">Shipped interface. The sidebar shows the selected section. The header holds the artist, follow and message actions above the room.</figcaption>
          </figure>
          <a href={figmaSystemUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center text-base font-medium text-[#FF4B4B] underline-offset-4 hover:underline">
            View the full design system in Figma ↗
          </a>
          <p className="mt-1 text-sm text-[#aaa]">Typography, tokens and component styles.</p>
          <Trigger panel="design-system" onOpen={open}>View design decisions →</Trigger>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Accessibility considerations</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl bg-[#1a1a1a] p-5">
              <h3 className="text-sm font-medium uppercase tracking-wide text-[#FF4B4B]">Considered</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-white">
                <li>Readable contrast on dark surfaces</li>
                <li>Visible focus on actions</li>
                <li>Large click targets on the main actions</li>
                <li>Loading that explains itself</li>
                <li>Familiar controls, labelled in the room</li>
              </ul>
            </article>
            <article className="rounded-2xl border border-white/10 p-5">
              <h3 className="text-sm font-medium uppercase tracking-wide text-[#aaa]">Not yet validated</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[#aaa]">
                <li>A full keyboard journey</li>
                <li>Screen-reader testing</li>
                <li>A formal accessibility audit</li>
                <li>WCAG conformance testing</li>
              </ul>
            </article>
          </div>
          <p className="mt-4 max-w-[42rem] text-base leading-7 text-white">Accessibility shaped some interface decisions. A formal audit was outside this MVP.</p>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What testers said</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {[
              ['“Beautiful. Smooth. Purposeful.”', 'After trying the MVP'],
              ['“Pretty impressive for a master\'s project!”', 'After trying the MVP'],
              ['“The app was intuitive, and the idea was clear and understandable.”', 'After trying the MVP'],
              ['“It was fun to explore the 3D virtual gallery.”', 'After trying the MVP'],
              ['“The most important feature missing right now is one to edit or crop the images we upload.”', 'What is still missing'],
            ].map(([quote, note]) => (
              <blockquote key={quote} className="rounded-2xl bg-[#1a1a1a] p-5">
                <p className="text-lg leading-7 text-white">{quote}</p>
                <footer className="mt-3 text-sm text-[#aaa]">{note}</footer>
              </blockquote>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-[#aaa]">Names are not shown. A QA engineer, speaking as a normal user, called the build genuinely impressive. That is a summary, not a verbatim line.</p>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What shipped — and what did not</h2>
          <div className="mt-8 grid gap-3 lg:grid-cols-3">
            <article className="rounded-2xl bg-[#1a1a1a] p-5">
              <h3 className="text-sm font-medium uppercase tracking-wide text-[#FF4B4B]">Built</h3>
              <ul className="mt-3 space-y-1 text-sm leading-6 text-white">
                <li>Sign-in and onboarding</li>
                <li>Public gallery discovery</li>
                <li>Unity room and artwork details</li>
                <li>Upload, manage, publish</li>
                <li>Profiles, social, search</li>
                <li>Shop browsing and a cart</li>
              </ul>
            </article>
            <article className="rounded-2xl bg-[#1a1a1a] p-5">
              <h3 className="text-sm font-medium uppercase tracking-wide text-[#aaa]">Not finished</h3>
              <ul className="mt-3 space-y-1 text-sm leading-6 text-[#aaa]">
                <li>Checkout does not take payment</li>
                <li>Gallery themes are limited</li>
                <li>No crop or image edit</li>
                <li>The 3D room is not a phone experience</li>
                <li>Logged-out phones cannot sign in</li>
                <li>No accessibility audit</li>
              </ul>
            </article>
            <article className="rounded-2xl border border-white/10 p-5">
              <h3 className="text-sm font-medium uppercase tracking-wide text-white">Next</h3>
              <ul className="mt-3 space-y-1 text-sm leading-6 text-[#aaa]">
                <li>A first-minute test with new visitors</li>
                <li>Artwork editing</li>
                <li>Room themes</li>
                <li>Lower-end hardware</li>
                <li>A real accessibility audit</li>
              </ul>
            </article>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What I learned</h2>
          <ol className="mt-8 grid gap-4 lg:grid-cols-3">
            {[
              ['01', 'The platform was limiting the experience.', 'Testing the detailed mobile screens showed me that a phone layout was squeezing the artwork and the room.'],
              ['02', 'I went back to sketching.', 'When the home layout was not working, I returned to paper instead of only polishing the same arrangement.'],
              ['03', 'Building the gallery was design work.', 'Controls, loading and how uploaded images appeared became part of the design, not only the engineering.'],
            ].map(([number, title, body]) => (
              <li key={number} className="min-w-0">
                <p className="font-teko text-4xl leading-none text-[#FF4B4B]">{number}</p>
                <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#aaa]">{body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 max-w-[40rem]">
            <h3 className="text-sm font-medium uppercase tracking-wide text-[#FF4B4B]">What I would test next</h3>
            <p className="mt-3 text-base leading-7 text-white">Can someone who has never seen RedVelvetVault explain what it is, find a gallery, enter the room and inspect an artwork — without a prompt?</p>
          </div>
        </section>
      </div>
      <WalkthroughPlayer
        src={showreelVideoUrl}
        title="Showreel"
        chapters={[]}
        hidden={panel !== null || panelPresent}
        reportHref={reportFolderUrl}
        closeLabel="Minimise walkthrough"
        openLabel="Expand walkthrough"
      />
      <EvidenceOverlay panel={panel} onClose={() => setPanel(null)} onPresenceChange={setPanelPresent} />
    </main>
  );
}
