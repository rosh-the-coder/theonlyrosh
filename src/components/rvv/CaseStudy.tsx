'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AppMap, ClarityCompare, CreatorFlow, PlatformPreference, VisitorFlow } from '@/components/rvv/Diagrams';
import EvidenceOverlay from '@/components/rvv/EvidenceOverlay';
import ReportFigure from '@/components/rvv/ReportFigure';
import WalkthroughPlayer from '@/components/rvv/WalkthroughPlayer';
import { heroVideoUrl, metrics, prototypeUrl, walkthroughVideoUrl, type PanelId } from '@/data/rvvCaseStudy';

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
      className="mt-4 inline-flex min-h-11 items-center text-base font-medium text-[#FF4B4B] underline-offset-4 hover:underline"
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

const findings = [
  ['Finding the way in', 'Paper tests exposed an unclear route into the gallery.', 'I made the gallery card the way in.'],
  ['Understanding the art', 'People needed a familiar image and some context for the artist.', 'Cards and artwork details stay around the room.'],
  ['Feeling in control', 'A walkable space needs more than atmosphere.', 'So I set out to teach movement and show when something is loading.'],
] as const;

const objectives = [
  ['01', 'Make the entry obvious.', 'Explain what RVV is and let someone find a gallery without hunting through navigation.'],
  ['02', 'Make the room usable.', 'Give visitors clear movement cues and artwork details when they need them.'],
  ['03', 'Give artists control.', 'Let them upload, manage and publish work in their own space.'],
] as const;

const changes = [
  ['Getting in', 'Early paper tests made the gallery entry hard to follow.', 'The current build lets a visitor open the room from a gallery card, without a separate gallery-information stop.'],
  ['Moving around', 'In a structured test, a participant tried to move before knowing about click-and-drag.', 'The report describes a controls overlay and a calmer camera, so movement was more deliberate.'],
  ['Knowing what is loading', 'When a room or artwork took time to appear, people could mistake it for missing content.', 'The report describes clearer loading and placeholder states.'],
] as const;

export default function CaseStudy() {
  const mainRef = useRef<HTMLElement>(null);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [panelPresent, setPanelPresent] = useState(false);
  const open = useCallback((next: PanelId) => setPanel(next), []);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>('.rvv-reveal'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sections.forEach((section) => section.classList.add('is-in'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    sections.forEach((section) => observer.observe(section));
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
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
            src={heroVideoUrl}
          />
          <div className="rvv-hero-vignette pointer-events-none absolute inset-0" />
          <div className="relative mx-auto w-full max-w-[1440px] px-4 min-[390px]:px-5 md:px-8 xl:px-12">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-[#FF4B4B]">MSc capstone · Solo product design and development · 2025</p>
          <div className="mt-3">
            <div className="min-w-0">
              <h1 className="font-teko text-6xl leading-none text-white sm:text-7xl lg:text-8xl">RedVelvetVault</h1>
              <p className="mt-4 max-w-[60ch] text-xl font-medium leading-8 text-white">A desktop-first art platform where creators put work in a personal 3D gallery and visitors discover, enter and explore those galleries in their browser.</p>
              <p className="mt-3 max-w-[60ch] text-base leading-7 text-[#aaa]">
                I designed and built the web experience and its Unity gallery as a working capstone MVP.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={prototypeUrl} className="inline-flex min-h-11 items-center rounded-full bg-[#FF4B4B] px-5 font-medium text-white">Explore the prototype</a>
                <button type="button" data-panel="survey" onClick={() => open('survey')} className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-5 font-medium text-white">See the research</button>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {metrics.map((metric) => (
              <article key={metric.figure} className="min-w-0 rounded-2xl bg-[#1a1a1a] p-4">
                <p className="font-teko text-5xl leading-none text-white">{metric.figure}</p>
                <p className="mt-2 text-sm text-white">{metric.label}</p>
                <p className="mt-1 text-xs text-[#aaa]">{metric.support}</p>
                <Dots filled={metric.filled} />
              </article>
            ))}
          </div>
          <p className="mt-3 max-w-[60ch] text-sm leading-6 text-[#aaa]">Post-prototype feedback · 14 responses. These ratings describe what people reported after trying the MVP, not measured task completion or business impact.</p>
          <Trigger panel="survey" onOpen={open}>See the survey results →</Trigger>
          </div>
        </section>

        <div data-rvv-container className="mx-auto w-full max-w-[1440px] px-4 min-[390px]:px-5 md:px-8 xl:px-12">
        <section className="rvv-reveal border-t border-white/10 py-14">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What is RedVelvetVault?</h2>
          <p className="mt-4 max-w-[60ch] text-base leading-7 text-white">RedVelvetVault has two connected sides. Artists upload and manage work in a personal walkable gallery, then make it discoverable. Visitors find a gallery through the website, enter the room and open individual artworks to learn more. Profiles and a social feed support that journey. The Shop can be browsed, but checkout is not complete in this MVP.</p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 p-4">
              <h3 className="text-sm font-medium uppercase tracking-wide text-[#FF4B4B]">For creators</h3>
              <p className="mt-2 text-base leading-7 text-white">Upload work → manage your room → make it visible.</p>
            </article>
            <article className="rounded-2xl border border-white/10 p-4">
              <h3 className="text-sm font-medium uppercase tracking-wide text-[#FF4B4B]">For visitors</h3>
              <p className="mt-2 text-base leading-7 text-white">Find a gallery → walk through it → inspect the art.</p>
            </article>
          </div>
          <div className="mt-8 max-w-[60ch]">
            <h3 className="text-sm font-medium uppercase tracking-wide text-[#FF4B4B]">The problem</h3>
            <p className="mt-2 text-base leading-7 text-white">I saw two useful experiences that did not meet neatly in the middle. Art feeds made work easy to find, but presented it as another image to scroll past. Virtual galleries gave art a sense of place, but entry and movement could be harder to understand. Early paper tests made that second risk concrete: some people could not tell how to get into a gallery or what to do once they arrived.</p>
            <h3 className="mt-6 text-sm font-medium uppercase tracking-wide text-[#FF4B4B]">My aim</h3>
            <p className="mt-2 text-base leading-7 text-white">Make it straightforward for an artist to show work in an online gallery—and for a first-time visitor to find, enter and explore it through a familiar website.</p>
          </div>
          <ol className="mt-6 grid gap-3 lg:grid-cols-3">
            {objectives.map(([number, title, body]) => (
              <li key={number} className="rounded-2xl bg-[#1a1a1a] p-4">
                <p className="font-teko text-3xl leading-none text-[#FF4B4B]">{number}</p>
                <h3 className="mt-2 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#aaa]">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rvv-reveal border-t border-white/10 py-14">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">See it in motion</h2>
          <p className="mt-3 max-w-[60ch] text-base leading-7 text-white">A gallery card opens the room directly. Inside, visitors can move around and open a work to see its details.</p>
        </section>

        <section className="rvv-reveal border-t border-white/10 py-14">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What I learned before committing to a design</h2>
          <p className="mt-4 max-w-[60ch] text-base leading-7 text-white">I looked at six art and virtual-space products, sketched with peers and watched people try early gallery tasks. The useful questions were simple: Could they find the room? Could they understand the art once inside? Could an artist tell where their uploaded work would appear?</p>
          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {findings.map(([title, finding, response]) => (
              <article key={title} className="min-w-0 rounded-2xl bg-[#1a1a1a] p-4">
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#aaa]">{finding}</p>
                <p className="mt-2 text-sm leading-6 text-white">{response}</p>
              </article>
            ))}
          </div>
          <div className="mt-6">
            <ReportFigure file="38" caption="Early paper screens. Getting into the room still took an extra step." />
          </div>
          <Trigger panel="competitors" onOpen={open}>See the full comparison →</Trigger>
        </section>

        <section className="rvv-reveal border-t border-white/10 py-14">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Why I switched from phone to desktop</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <PlatformPreference />
            <p className="max-w-[60ch] text-base leading-7 text-white">I began on mobile because it seemed the more convenient way to browse. The phone prototypes helped me work out the flow, but the artwork cards and 3D room felt cramped. In an early nine-person survey, seven preferred web for a role-playing 3D gallery; three people testing my mobile mid-fi also wanted more space for the art. With Unity performance and a solo build to consider, I chose to make the full gallery experience desktop-first. The mobile work still shaped the navigation I carried over.</p>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <ReportFigure file="42" caption="Mobile mid-fidelity. Three people tried this version, including a stop for gallery information." />
            <ReportFigure file="43" caption="Sketches after that round. I was still redrawing how someone gets in." />
            <ReportFigure file="44" caption="Started here: mobile high-fidelity screens." />
            <ReportFigure file="45" caption="Started here: the mobile room. This screen still offers a purchase and an artist link. The current gallery does neither from the artwork view." />
          </div>
          <div className="mt-4">
            <ReportFigure file="46" caption="Moved here: the first web composition, with more room for the artwork and the gallery viewer." />
          </div>
          <Trigger panel="explorations" onOpen={open}>See the early directions →</Trigger>
        </section>

        <section className="rvv-reveal border-t border-white/10 py-14">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">From browsing to a gallery</h2>
          <VisitorFlow />
        </section>

        <section className="rvv-reveal border-t border-white/10 py-14">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">From upload to exhibition</h2>
          <CreatorFlow />
        </section>

        <section className="rvv-reveal border-t border-white/10 py-14">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">How the app is organised</h2>
          <AppMap />
          <Trigger panel="ia" onOpen={open}>Explore the app structure →</Trigger>
        </section>

        <section className="rvv-reveal border-t border-white/10 py-14">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What changed when people tried it</h2>
          <p className="mt-4 max-w-[60ch] text-base leading-7 text-white">A few problems kept showing up as the sketches became a working product. I treated each one as a design job, not just a bug to close.</p>
          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {changes.map(([title, problem, response]) => (
              <article key={title} className="min-w-0 rounded-2xl bg-[#1a1a1a] p-4">
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#aaa]">{problem}</p>
                <p className="mt-2 text-sm leading-6 text-white">{response}</p>
              </article>
            ))}
          </div>
          <div className="mt-6">
            <ReportFigure file="62" caption="The Unity room, from an early blockout to a later gallery." />
          </div>
          <Trigger panel="testing" onOpen={open}>See what testing showed →</Trigger>
        </section>

        <section className="rvv-reveal border-t border-white/10 py-14">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Why it looks this way</h2>
          <p className="mt-4 max-w-[60ch] text-base leading-7 text-white">I kept most of the interface dark so the artwork could carry the colour. Red marks important actions and feedback, while repeatable cards, type styles and overlays help the web pages and gallery feel related. The aim was not to make every screen dramatic; it was to make the next action easy to spot.</p>
          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            <article className="rounded-2xl bg-[#1a1a1a] p-4">
              <div className="rounded-xl bg-[#272727] p-3">
                <p className="text-sm font-semibold text-white">Gallery card</p>
                <p className="mt-1 text-xs text-[#aaa]">Title, artist, a room behind the still.</p>
                <span className="mt-3 inline-flex rounded-full bg-[#FF4B4B] px-3 py-1 text-xs font-medium text-white">Open</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#aaa]">Dark holds the work. Red is the action.</p>
            </article>
            <article className="rounded-2xl bg-[#1a1a1a] p-4">
              <div className="flex gap-3 rounded-xl bg-[#272727] p-3">
                <ul className="w-24 space-y-1 border-r border-white/10 pr-3 text-xs text-white">
                  {['Home', 'Shop', 'Gallery', 'Social', 'Profile'].map((item) => (
                    <li key={item} className={item === 'Gallery' ? 'text-[#FF4B4B]' : ''}>{item}</li>
                  ))}
                </ul>
                <p className="text-xs leading-5 text-[#aaa]">Messages, notifications and cart stay in the top bar.</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#aaa]">Primary destinations and utilities are split on purpose.</p>
            </article>
            <article className="rounded-2xl bg-[#1a1a1a] p-4">
              <div className="rounded-xl border border-white/10 bg-[#0f0f0f]/80 p-3 backdrop-blur-sm">
                <p className="text-sm text-white">Click and drag to look</p>
                <p className="mt-1 text-xs text-[#aaa]">WASD to move</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#aaa]">The overlay sits on the room so the next move is easy to see.</p>
            </article>
          </div>
          <div className="mt-6 grid gap-4">
            <ReportFigure file="49" caption="The palette: dark surfaces, with red for the action." />
            <ReportFigure file="52" caption="Type styles from the report." />
            <ReportFigure file="53" caption="How type and spacing set a hierarchy." />
          </div>
          <Trigger panel="design-system" onOpen={open}>See the design-system decisions →</Trigger>
        </section>

        <section className="rvv-reveal border-t border-white/10 py-14">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What I built, what I learned, what is still open</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
            <ClarityCompare />
            <div className="grid gap-2">
              {[
                ['Built', 'The MVP brings together gallery discovery, creator upload and management, a walkable Unity room, artwork details, profiles and social features in a desktop browser. People can browse the Shop and add work to a cart; they cannot complete a purchase.'],
                ['Learned', 'The room matters, but so do the moments around it: spotting a gallery, understanding the controls and knowing whether art is still loading. After trying the prototype, 13 of 14 people rated artwork interactions clear. Only 10 of 14 said the product’s purpose was clear immediately.'],
                ['Still open', 'I would start by testing the first minute: can someone tell me what RVV is, find a gallery and open a piece without a prompt? I would also revisit phone access, older-device performance and accessibility before calling this a finished product.'],
              ].map(([title, body]) => (
                <article key={title} className="rounded-xl border border-white/10 px-3 py-3">
                  <h3 className="text-sm font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#aaa]">{body}</p>
                </article>
              ))}
            </div>
          </div>
          <Trigger panel="scope" onOpen={open}>See what was built and what&apos;s next →</Trigger>
        </section>
      </div>
      <WalkthroughPlayer src={walkthroughVideoUrl} hidden={panel !== null || panelPresent} />
      <EvidenceOverlay panel={panel} onClose={() => setPanel(null)} onPresenceChange={setPanelPresent} />
    </main>
  );
}
