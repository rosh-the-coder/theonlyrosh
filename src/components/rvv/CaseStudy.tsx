'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CreatorFlow, VisitorFlow } from '@/components/rvv/Diagrams';
import EvidenceOverlay from '@/components/rvv/EvidenceOverlay';
import ReportFigure from '@/components/rvv/ReportFigure';
import WalkthroughPlayer from '@/components/rvv/WalkthroughPlayer';
import { heroVideoUrl, metrics, prototypeUrl, walkthroughVideoUrl, type PanelId } from '@/data/rvvCaseStudy';

const sectionClass = 'rvv-reveal border-t border-white/10 py-16 md:py-24';

const facts = [
  ['Role', 'Product Design + Development'],
  ['Team', 'Solo'],
  ['Platform', 'Desktop Web + Unity WebGL'],
  ['Tools', 'Figma · React · Firebase · Unity'],
  ['Year', '2025'],
] as const;

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
  const showreelRef = useRef<HTMLVideoElement>(null);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [panelPresent, setPanelPresent] = useState(false);
  const open = useCallback((next: PanelId) => setPanel(next), []);

  const playFrom = useCallback((seconds: number) => {
    const video = showreelRef.current;
    document.getElementById('rvv-showreel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (!video) return;
    video.currentTime = seconds;
    video.play().catch(() => undefined);
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
      <div data-rvv-container className="mx-auto w-full max-w-[1440px] px-4 min-[390px]:px-5 md:px-8 xl:px-12">
        <nav className="flex h-16 items-center">
          <Link href="/#work" className="inline-flex min-h-11 items-center text-sm text-[#aaa] hover:text-white">
            Back to work
          </Link>
        </nav>
      </div>

      <section className="relative w-full overflow-hidden pb-16 lg:pb-20">
        <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="auto" aria-hidden src={heroVideoUrl} />
        <div className="rvv-hero-vignette pointer-events-none absolute inset-0" />
        <div className="relative mx-auto w-full max-w-[1440px] px-4 min-[390px]:px-5 md:px-8 xl:px-12">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-[#FF4B4B]">MSc capstone · 2025</p>
          <h1 className="mt-3 font-teko text-6xl leading-none text-white sm:text-7xl lg:text-8xl">RedVelvetVault</h1>
          <p className="mt-4 max-w-[38rem] text-xl font-medium leading-8 text-white">A browser-based art platform where familiar web discovery leads into immersive, walkable 3D galleries.</p>
          <p className="mt-3 max-w-[40rem] text-base leading-7 text-[#aaa]">Artists can upload and organise their work, publish a gallery, and let visitors step inside it through a Unity-powered web experience.</p>
          <p className="mt-4 text-lg text-white">Familiar cards. Then a walkable gallery.</p>
          <div className="mt-6 flex flex-col">
            <dl className="order-2 mt-6 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:order-1 lg:mt-0 lg:grid-cols-5">
              {facts.map(([term, detail]) => (
                <div key={term} className="min-w-0">
                  <dt className="text-xs uppercase tracking-wide text-[#aaa]">{term}</dt>
                  <dd className="mt-1 text-sm text-white">{detail}</dd>
                </div>
              ))}
            </dl>
            <div className="order-1 flex flex-wrap gap-3 lg:order-2 lg:mt-6">
              <a href={prototypeUrl} className="inline-flex min-h-11 items-center rounded-full bg-[#FF4B4B] px-5 font-medium text-white">Explore prototype</a>
              <a href="#rvv-showreel" className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-5 font-medium text-white">Watch walkthrough</a>
            </div>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3 sm:mr-[22rem]">
            {metrics.map((metric) => (
              <article key={metric.figure} className="min-w-0 rounded-2xl bg-[#1a1a1a]/90 p-4">
                <p className="font-teko text-5xl leading-none text-white">{metric.figure}</p>
                <p className="mt-2 text-sm text-white">{metric.label}</p>
                <p className="mt-1 text-xs text-[#aaa]">{metric.support}</p>
                <Dots filled={metric.filled} />
              </article>
            ))}
          </div>
          <p className="mt-3 max-w-[42rem] text-sm leading-6 text-[#aaa]">Post-prototype survey · 14 people · what they reported after trying the MVP.</p>
          <Trigger panel="survey" onOpen={open}>See final testing →</Trigger>
        </div>
      </section>

      <div data-rvv-container className="mx-auto w-full max-w-[1440px] px-4 min-[390px]:px-5 md:px-8 xl:px-12">
        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What is RedVelvetVault?</h2>
          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-[#FF4B4B]">The product</h3>
              <p className="mt-3 max-w-[42rem] text-base leading-7 text-white">RedVelvetVault combines ordinary art discovery with a browser-based 3D gallery.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <article className="rounded-2xl border border-white/10 p-4">
                  <h4 className="text-sm font-medium text-[#FF4B4B]">Visitors</h4>
                  <p className="mt-2 text-base leading-7 text-white">Discover → Enter → Inspect → Reach the artist</p>
                </article>
                <article className="rounded-2xl border border-white/10 p-4">
                  <h4 className="text-sm font-medium text-[#FF4B4B]">Creators</h4>
                  <p className="mt-2 text-base leading-7 text-white">Upload → Manage → Preview → Publish</p>
                </article>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-[#FF4B4B]">The problem</h3>
              <p className="mt-3 text-base leading-7 text-white">The products I studied sat at one of two extremes.</p>
              <div className="mt-4 space-y-4">
                <p className="text-base leading-7 text-[#aaa]"><span className="text-white">Familiar, but flat. </span>Behance, ArtStation and Pinterest make browsing easy. The work stays in a feed.</p>
                <p className="text-base leading-7 text-[#aaa]"><span className="text-white">Immersive, but harder to enter. </span>Spatial and OnCyber make art spatial, then ask someone to learn a world, a control scheme, or a crypto cue.</p>
              </div>
            </div>
          </div>
          <div className="mt-10 max-w-[44rem]">
            <h3 className="text-sm font-medium uppercase tracking-wide text-[#FF4B4B]">The design question</h3>
            <p className="mt-3 text-2xl font-medium leading-snug text-white">How might I give digital artists the presence of a physical exhibition without losing the simplicity of familiar web platforms?</p>
          </div>
          <Trigger panel="competitors" onOpen={open}>See research context →</Trigger>
        </section>

        <section id="rvv-showreel" className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">See it in motion</h2>
          <p className="mt-3 max-w-[40rem] text-base leading-7 text-[#aaa]">Before the process, here is the product I ended up building.</p>
          <figure className="mt-8">
            <video
              ref={showreelRef}
              className="aspect-video w-full rounded-2xl bg-black object-contain"
              controls
              playsInline
              preload="metadata"
              src={walkthroughVideoUrl}
            />
            <figcaption className="mt-3 text-sm leading-6 text-[#aaa]">Product showreel · Landing, discovery, the room, an artwork, then the creator side.</figcaption>
          </figure>
          <p className="mt-4 text-base text-white">Designed and built as a working MVP — not a static concept.</p>
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
          <Trigger panel="explorations" onOpen={open}>See early research →</Trigger>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Why I switched from phone to desktop</h2>
          <p className="mt-4 max-w-[40rem] text-2xl font-medium leading-snug text-white">The first polished concept was mobile. Testing convinced me it was the wrong platform for the core experience.</p>
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
          <Trigger panel="pivot" onOpen={open}>See the full pivot →</Trigger>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">From browsing to a gallery</h2>
          <p className="mt-3 max-w-[40rem] text-base leading-7 text-[#aaa]">The website handles discovery. The Unity room handles presence.</p>
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
            <ProductShot src="/Work/RVV/case-study-v2/shipped/go-live.gif" caption="Live preview. GO LIVE is the control that publishes the room." />
          </div>
          <Trigger panel="ia" onOpen={open}>Explore the full IA →</Trigger>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">How the product is organised</h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {['Home', 'Shop', 'My Gallery', 'Social', 'Profile'].map((item) => (
              <li key={item} className="rounded-full bg-[#1a1a1a] px-4 py-2 text-sm text-white">{item}</li>
            ))}
          </ul>
          <div className="mt-6 flex max-w-xl gap-4 rounded-2xl bg-[#1a1a1a] p-4">
            <ul className="w-28 shrink-0 space-y-1 border-r border-white/10 pr-3 text-sm text-white">
              {['Home', 'Shop', 'Gallery', 'Social', 'Profile'].map((item) => (
                <li key={item} className={item === 'Gallery' ? 'text-[#FF4B4B]' : ''}>{item}</li>
              ))}
            </ul>
            <p className="text-sm leading-6 text-[#aaa]">Messages, notifications and cart stay in the top bar.</p>
          </div>
          <p className="mt-4 max-w-[42rem] text-base leading-7 text-white">Primary navigation answers “where am I going?” The top bar handles “what do I need to do?”</p>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What changed when people tried it</h2>
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
            <ReportFigure tall file="62" caption="The Unity room, from an early blockout to a later gallery." />
          </div>
          <Trigger panel="testing" onOpen={open}>See testing notes →</Trigger>
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
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Designed beyond one viewport</h2>
          <p className="mt-3 max-w-[42rem] text-base leading-7 text-[#aaa]">The 3D room is desktop. The web shell around it is what has to adapt. Logged-out phones cannot sign in.</p>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {['Artwork', 'Artwork', 'Artwork', 'Artwork'].map((label, index) => (
              <div key={`${label}-${index}`} className="flex aspect-[4/3] items-end rounded-2xl bg-[#1a1a1a] p-3">
                <span className="text-xs uppercase tracking-wide text-[#aaa]">{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-[#aaa]">Layout model for discovery: four columns on a wide desktop, two from tablet width, one on a phone. This is not a screenshot of the shipped Discover page.</p>
          <p className="mt-2 text-sm text-white">Browse and discover can live on a phone. The walkable room is meant for desktop.</p>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">A system, not a collection of screens</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl bg-[#1a1a1a] p-5">
              <p className="text-xs uppercase tracking-wide text-[#aaa]">Surfaces</p>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {[
                  ['#0F0F0F', 'Page'],
                  ['#1A1A1A', 'Surface'],
                  ['#272727', 'Card'],
                  ['#FF4B4B', 'Action'],
                  ['#AAAAAA', 'Muted'],
                ].map(([colour, name]) => (
                  <div key={colour}>
                    <div className="h-12 rounded-lg border border-white/10" style={{ backgroundColor: colour }} />
                    <p className="mt-1 text-[11px] text-white">{name}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs uppercase tracking-wide text-[#aaa]">Type</p>
              <p className="mt-2 font-teko text-5xl leading-none text-white">Display</p>
              <p className="mt-2 text-2xl font-semibold text-white">Heading</p>
              <p className="mt-2 text-base text-white">Body copy stays in Inter.</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-[#aaa]">Label · metadata</p>
            </div>
            <div className="rounded-2xl bg-[#1a1a1a] p-5">
              <p className="text-xs uppercase tracking-wide text-[#aaa]">Components</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex min-h-11 items-center rounded-full bg-[#FF4B4B] px-4 text-sm font-medium text-white">Primary</span>
                <span className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-4 text-sm text-white">Secondary</span>
                <span className="inline-flex min-h-11 items-center rounded-full bg-[#272727] px-4 text-sm text-[#aaa]">Disabled</span>
                <span className="rounded-full border border-white/15 px-3 py-1 text-sm text-white">Chip</span>
              </div>
              <div className="mt-4 rounded-xl border border-white/15 bg-[#0f0f0f] px-3 py-2 text-sm text-[#aaa]">Input</div>
              <div className="mt-4 rounded-xl bg-[#272727] p-3">
                <p className="text-sm font-semibold text-white">Gallery card</p>
                <p className="mt-1 text-xs text-[#aaa]">Title, artist, then the room.</p>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#aaa]">Inter carries the interface. Teko is the display face on this page. The report spells that face “Tekio”.</p>
            </div>
          </div>
          <Trigger panel="design-system" onOpen={open}>See design-system decisions →</Trigger>
        </section>

        <section className={sectionClass}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Accessibility considerations</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl bg-[#1a1a1a] p-5">
              <h3 className="text-sm font-medium uppercase tracking-wide text-[#FF4B4B]">Considered</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-white">
                <li>Readable contrast on dark surfaces</li>
                <li>Visible focus on actions</li>
                <li>Targets aimed at 44px or larger</li>
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
              ['01', 'Immersion works better after familiarity.', 'People understood the product faster when a familiar card came before the room.'],
              ['02', 'Platform is part of the UX.', 'Moving the full experience to desktop gave the art room to breathe, and gave Unity a viewport it could hold.'],
              ['03', 'Design and implementation informed each other.', 'Camera behaviour, loading and browser limits became design problems, not only engineering ones.'],
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
      <WalkthroughPlayer src={walkthroughVideoUrl} hidden={panel !== null || panelPresent} />
      <EvidenceOverlay panel={panel} onClose={() => setPanel(null)} onPresenceChange={setPanelPresent} />
    </main>
  );
}
