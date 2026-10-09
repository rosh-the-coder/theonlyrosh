'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import WalkthroughPlayer from '@/components/rvv/WalkthroughPlayer';
import CommunityCarousel from '@/components/flyh/CommunityCarousel';
import FlyHEvidenceDrawer from '@/components/flyh/EvidenceDrawer';
import FlyHLightbox from '@/components/flyh/Lightbox';
import FlyHMockupSlider from '@/components/flyh/MockupSlider';
import { Entrance, FlyHMotion, Reveal, Stagger } from '@/components/flyh/motion';
import {
  FlyHAnnotation,
  FlyHApprovalWell,
  FlyHBlockerGroup,
  FlyHCheckRow,
  FlyHDesignSystemCta,
  FlyHField,
  FlyHKicker,
  FlyHMetric,
  FlyHScreenFrame,
  FlyHStageJourney,
  FlyHTag,
  FlyHTextButton,
  FlyHWarningGroup,
} from '@/components/flyh/ui';
import {
  built,
  configured,
  flowSteps,
  handoffBenchmark,
  images,
  marketStats,
  next,
  positionRows,
  preview,
  questions,
  reviewSequence,
  roles,
  shifts,
  stages,
  type DrawerId,
} from '@/data/flyh/content';
import Image from 'next/image';

const stageIds = stages.map((stage) => stage.id);
const liveProductUrl = 'https://flyh-ai-890746657280.europe-west1.run.app/';
const walkthroughSrc = '/Work/FlyH/flyh-walkthrough.mp4';

function DemoLogin() {
  const [copied, setCopied] = useState(false);

  return (
    <p className="mt-3 text-xs leading-5 text-[#858E88]">
      Demo login —{' '}
      <button
        type="button"
        className="font-medium text-[#5E6862] underline decoration-[#CBD0CC] underline-offset-2"
        onClick={() => {
          navigator.clipboard?.writeText('admin / admin').then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          }).catch(() => setCopied(false));
        }}
      >
        admin / admin
      </button>
      <span className="ml-2 text-[#145C46]" aria-live="polite">{copied ? 'Copied' : ''}</span>
    </p>
  );
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="max-w-[22ch] text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
      {children}
    </h2>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return <div className="mt-5 max-w-[62ch] space-y-4 text-base leading-7 text-[#5E6862]">{children}</div>;
}

export default function CaseStudy() {
  const heroRef = useRef<HTMLElement>(null);
  const heroLeft = useRef(false);
  const openedOnHero = useRef(false);
  const [drawer, setDrawer] = useState<DrawerId | null>(null);
  const [saleOpen, setSaleOpen] = useState(false);
  const [activeStage, setActiveStage] = useState<string>(stageIds[0]);
  const [heroVisible, setHeroVisible] = useState(true);
  const [forcedOpen, setForcedOpen] = useState(false);
  const [playRequest, setPlayRequest] = useState(0);

  useEffect(() => {
    const nodes = stageIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveStage(visible.target.id);
      },
      { rootMargin: '-28% 0px -48% 0px', threshold: [0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => {
      setHeroVisible(entry.isIntersecting);
    }, { threshold: 0 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!heroVisible) {
      heroLeft.current = true;
      openedOnHero.current = false;
      return;
    }
    if (heroLeft.current && !openedOnHero.current) setForcedOpen(false);
  }, [heroVisible]);

  const watchWalkthrough = () => {
    const hero = heroRef.current;
    const rect = hero?.getBoundingClientRect();
    const onHero = rect ? rect.bottom > 0 && rect.top < window.innerHeight : true;
    openedOnHero.current = onHero;
    setForcedOpen(true);
    setPlayRequest((value) => value + 1);
  };

  const playerHidden = heroVisible && !forcedOpen;

  const openStage = (id: string) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <FlyHMotion>
      <main className="flyh-study min-h-screen">
        <div className="mx-auto w-full max-w-[1120px] overflow-x-clip px-4 sm:px-6 lg:px-8">
          <nav className="flex h-16 items-center" aria-label="Case study">
            <Link href="/#work" className="flyh-link">Back to work</Link>
          </nav>

          <header ref={heroRef} className="grid items-center gap-8 pb-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.08fr)] lg:gap-6 lg:pb-16">
            <div>
              <Entrance y={16}>
                <FlyHKicker>FlyH</FlyHKicker>
              </Entrance>
              <Entrance delay={0.08} y={24}>
                <h1 className="mt-3 text-[clamp(2.05rem,3.6vw,3.35rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
                  From finished artwork to a listing-ready handoff in minutes — without giving up control.
                </h1>
              </Entrance>
              <Entrance delay={0.16}>
                <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 text-sm sm:grid-cols-3">
                  {[
                    ['Role', 'Product Designer'],
                    ['Team', '6'],
                    ['Timeline', '2 weeks'],
                    ['Context', 'TechIreland National AI Challenge 2026'],
                    ['Focus', 'AI workflows, creator commerce, human-in-the-loop UX'],
                  ].map(([label, value]) => (
                    <div key={label} className={label === 'Context' || label === 'Focus' ? 'col-span-2 sm:col-span-3' : ''}>
                      <dt className="flyh-kicker">{label}</dt>
                      <dd className="mt-1 font-medium text-[#1D2420]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Entrance>
              <Entrance delay={0.22}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href={liveProductUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open FlyH live product demo in a new tab"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#145C46] bg-[#145C46] px-5 text-sm font-semibold text-[#F2F4F2] hover:border-[#104A39] hover:bg-[#104A39]"
                  >
                    Explore live product
                    <span aria-hidden="true">↗</span>
                  </a>
                  <button
                    type="button"
                    aria-label="Play FlyH product walkthrough"
                    onClick={watchWalkthrough}
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-[#CBD0CC] bg-white px-5 text-sm font-semibold text-[#1D2420] hover:bg-[#F2F1ED]"
                  >
                    Watch walkthrough
                  </button>
                </div>
                <DemoLogin />
              </Entrance>
            </div>
            <Entrance delay={0.28} y={18}>
              <figure>
                <Image
                  src={images.heroDashboard.src}
                  alt={images.heroDashboard.alt}
                  width={images.heroDashboard.width}
                  height={images.heroDashboard.height}
                  priority
                  sizes="(min-width: 1024px) 960px, 100vw"
                  className="h-auto w-full"
                />
                <figcaption className="mt-3 text-sm text-[#5E6862]">The FlyH Dashboard, on a working session.</figcaption>
              </figure>
            </Entrance>
          </header>

          <section className="border-t border-[#DFE2DE] py-12 md:py-16">
            <Reveal>
              <FlyHKicker>01 — Problem</FlyHKicker>
              <Title>The artwork is only half the job.</Title>
            </Reveal>
            <Stagger className="mt-8 grid gap-8 sm:grid-cols-3">
              {marketStats.map((stat) => (
                <div key={stat.figure}>
                  <p className="text-[clamp(3rem,6vw,4.5rem)] font-semibold leading-none tracking-[-0.04em]">{stat.figure}</p>
                  <p className="mt-3 text-sm leading-5 text-[#5E6862]">{stat.label}</p>
                </div>
              ))}
            </Stagger>
            <p className="mt-6 max-w-[68ch] text-xs leading-5 text-[#858E88]">
              Etsy 2024 Global Seller Census · Etsy 2025 10-K · Q2 2026 filing. Etsy reports 52% of business time on making and designing. These are Etsy figures, not FlyH results.
            </p>
            <ol className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2">
              {flowSteps.map((step, index) => (
                <li key={step} className="flex items-center gap-2">
                  <span className="rounded-md border border-[#DFE2DE] bg-white px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em]">{step}</span>
                  {index < flowSteps.length - 1 ? <span className="text-[#D66A4A]" aria-hidden="true">→</span> : null}
                </li>
              ))}
            </ol>
            <div className="mt-12">
              <FlyHKicker>Community signals</FlyHKicker>
              <h3 className="mt-3 max-w-[18ch] text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
                Real sellers describe the same bottleneck.
              </h3>
              <p className="mt-3 max-w-[58ch] text-base leading-7 text-[#5E6862]">
                Public seller conversations echoed the same pattern: finishing the design wasn&apos;t finishing the job.
              </p>
              <div className="mt-6">
                <CommunityCarousel />
              </div>
            </div>
          </section>

          <section className="border-t border-[#DFE2DE] py-12 md:py-16">
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div>
                <Reveal>
                  <FlyHKicker>02 — Origin</FlyHKicker>
                  <Title>It started as something I built for myself.</Title>
                </Reveal>
                <Prose>
                  <p>Aethelgard only had one user: me. I already knew what every state meant and how to fix it when something broke. FlyH couldn&apos;t rely on that.</p>
                </Prose>
              </div>
              <div>
                <Reveal y={12}>
                  <FlyHScreenFrame image={images.aethelgard} caption="Aethelgard, the personal system. One owner, one set of assumptions." />
                </Reveal>
                <p className="py-3 text-center text-[#D66A4A]" aria-hidden="true">↓</p>
                <button type="button" className="block w-full overflow-hidden rounded-xl border border-[#DFE2DE] bg-white text-left" onClick={() => setSaleOpen(true)}>
                  <Image
                    src={images.firstSale.src}
                    alt={images.firstSale.alt}
                    width={images.firstSale.width}
                    height={images.firstSale.height}
                    sizes="(min-width: 1024px) 520px, 100vw"
                    className="h-auto w-full"
                  />
                </button>
                <p className="flyh-kicker mt-4">Origin validation</p>
                <p className="mt-2 text-base font-medium leading-7">Aethelgard was used to fulfil my first Etsy order — a 23-print digital bundle.</p>
                <p className="mt-2 text-sm leading-6 text-[#5E6862]">That proved my workflow could run. It didn&apos;t prove another creator could use it.</p>
              </div>
            </div>
            <Reveal className="mt-12">
              <p className="max-w-[18ch] text-[clamp(1.8rem,4vw,2.8rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
                A system that understands its maker is not automatically a product.
              </p>
            </Reveal>
            <Stagger className="mt-8 grid gap-3 md:grid-cols-2">
              <article className="rounded-xl bg-[#111613] p-5 text-[#F2F4F2]">
                <h3 className="flyh-kicker">Aethelgard</h3>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-[#949D97]">
                  <li>One owner</li>
                  <li>Implicit knowledge</li>
                  <li>Manual repair</li>
                  <li>Personal credentials</li>
                </ul>
              </article>
              <article className="rounded-xl border border-[#DFE2DE] bg-white p-5">
                <h3 className="flyh-kicker">FlyH</h3>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-[#5E6862]">
                  <li>Unknown creator</li>
                  <li>Visible state</li>
                  <li>Guided recovery</li>
                  <li>Explicit permissions</li>
                </ul>
              </article>
            </Stagger>
            <p className="mt-6">
              <FlyHTextButton onClick={() => setDrawer('origin')}>Origin notes</FlyHTextButton>
            </p>
          </section>

          <section className="rounded-xl bg-[#111613] px-5 py-10 text-[#F2F4F2] sm:px-8 md:py-12">
            <Reveal>
              <FlyHKicker>03 — The challenge</FlyHKicker>
              <Title>Two weeks. Six people. A different question.</Title>
            </Reveal>
            <Stagger className="mt-8 grid gap-6 sm:grid-cols-3">
              <FlyHMetric value="2" label="Weeks" />
              <FlyHMetric value="6" label="People" />
              <FlyHMetric value="1" label="Product Designer" />
            </Stagger>
            <ul className="mt-8 flex flex-wrap gap-2">
              {roles.map((role) => (
                <li key={role} className="rounded-md border border-[#29302C] px-3 py-2 text-sm text-[#F2F4F2]">{role}</li>
              ))}
            </ul>
            <p className="mt-8 max-w-[28ch] text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-[-0.03em]">
              How do you turn a personal workflow into something someone else can understand, correct and trust?
            </p>
            <Stagger className="mt-8 grid gap-3 sm:grid-cols-2">
              {shifts.map(([from, to]) => (
                <p key={from} className="rounded-lg border border-[#29302C] p-4 text-sm leading-6">
                  <span className="text-[#949D97]">{from}</span>
                  <span className="mx-2 text-[#D66A4A]" aria-hidden>→</span>
                  <span>{to}</span>
                </p>
              ))}
            </Stagger>
            <p className="mt-6 max-w-[46ch] text-sm leading-6 text-[#949D97]">
              I led product design. The final MVP was built collaboratively across design and engineering.
            </p>
            <p className="mt-4">
              <button type="button" className="inline-flex min-h-11 items-center text-sm font-medium text-[#F2F4F2] underline" onClick={() => setDrawer('team')}>How we worked</button>
            </p>
          </section>

          <section className="py-12 md:py-16">
            <Reveal>
              <FlyHKicker>04 — Human and agent</FlyHKicker>
              <Title>Humans create. Humans decide. Agents operate.</Title>
            </Reveal>
            <Stagger className="mt-8 grid gap-3 lg:grid-cols-3">
              {[
                ['Humans create', ['Artwork', 'Intent', 'Context']],
                ['Humans decide', ['Direction', 'Edits', 'Price', 'Approval']],
                ['Agents operate', ['Analyse', 'Prepare', 'Draft', 'Check', 'Handoff']],
              ].map(([title, items]) => (
                <article key={title as string} className="rounded-xl border border-[#DFE2DE] bg-white p-5">
                  <h3 className="text-lg font-semibold">{title as string}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-[#5E6862]">
                    {(items as string[]).map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </article>
              ))}
            </Stagger>
            <Prose>
              <p>Some steps use a model. Some are a check. The screen shows the result either way, and stops when a person has to decide.</p>
            </Prose>
            <p className="mt-6">
              <FlyHTextButton onClick={() => setDrawer('control')}>Human control map</FlyHTextButton>
            </p>
          </section>

          <section className="border-t border-[#DFE2DE] py-12 md:py-16">
            <Reveal>
              <FlyHKicker>05 — The journey</FlyHKicker>
              <Title>Four stages, built around creator decisions.</Title>
            </Reveal>
            <div className="mt-10 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
              <div className="mb-8 lg:sticky lg:top-6 lg:mb-0 lg:self-start">
                <FlyHStageJourney current={activeStage} onSelect={openStage} />
              </div>
              <div className="space-y-12">
                {stages.map((stage) => (
                  <article key={stage.id} id={stage.id} className="scroll-mt-6">
                    <p className="flyh-kicker">{stage.index} — {stage.name}</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-semibold text-[#145C46]">Creator</h3>
                        <p className="mt-2 text-sm leading-6 text-[#5E6862]">{stage.creator}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">FlyH</h3>
                        <p className="mt-2 text-sm leading-6 text-[#5E6862]">{stage.system}</p>
                      </div>
                    </div>
                    <div className="mt-5">
                      <FlyHScreenFrame image={stage.image} />
                    </div>
                  </article>
                ))}
                <p className="max-w-[62ch] text-base leading-7 text-[#5E6862]">
                  The output is not a fifth stage. It is a JSON handoff, or an Etsy draft when that connection is configured.
                </p>
                <FlyHTextButton onClick={() => setDrawer('journey')}>Journey anatomy</FlyHTextButton>
              </div>
            </div>
          </section>

          <section className="border-t border-[#DFE2DE] py-12 md:py-16">
            <Reveal>
              <FlyHKicker>06 — Controlled automation</FlyHKicker>
              <Title>The creator can see the plan, and change it.</Title>
            </Reveal>
            <div className="mt-10">
              <h3 className="text-xl font-semibold tracking-[-0.02em]">Where the creator gets to disagree</h3>
              <p className="mt-3 max-w-[62ch] text-base leading-7 text-[#5E6862]">
                The line on screen is “Flyh understands this as…”. The creator can edit that reading, then choose Continue.
              </p>
              <Reveal y={12} className="mt-6">
                <FlyHScreenFrame
                  image={images.direction}
                  caption="Understanding is a proposal. Continue is the creator's decision."
                />
                <FlyHAnnotation items={['System interpretation', 'Editable understanding', 'Creator decision']} />
              </Reveal>
            </div>
            <div className="mt-12 grid items-start gap-8 border-t border-[#DFE2DE] pt-12 lg:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.02em]">What the file can support</h3>
                <p className="mt-3 text-base leading-7 text-[#5E6862]">
                  FlyH checks 4×6, 5×7, 8×10 and 11×14 against the file. A larger size is a resize the creator asks for. It does not invent detail.
                </p>
              </div>
              <FlyHScreenFrame image={images.printQuality} caption="Every size on this screen needs resizing. The creator uploads a better original, or prepares larger sizes." />
            </div>
            <div className="mt-12 border-t border-[#DFE2DE] pt-12">
              <h3 className="max-w-[16ch] text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
                Presentation is part of the product.
              </h3>
              <p className="mt-4 max-w-[62ch] text-base leading-7 text-[#5E6862]">
                FlyH suggests calibrated scene templates based on the artwork and lets the creator choose up to three. The artwork is composited into those frames deterministically; the room itself is not AI-generated.
              </p>
              <Reveal y={12} className="mt-6">
                <FlyHScreenFrame image={images.mockupStudio} caption="Mockup Studio. Nine portrait scenes, each marked ready once a frame is calibrated." />
              </Reveal>
              <div className="mt-6">
                <FlyHMockupSlider />
                <p className="mt-2 text-sm text-[#5E6862]">A portfolio reading of the nine scene names. The product uses a grid.</p>
              </div>
            </div>
          </section>

          <section className="border-t border-[#DFE2DE] py-12 md:py-16">
            <Reveal>
              <FlyHKicker>07 — Review</FlyHKicker>
              <Title>The last action still belongs to the creator.</Title>
            </Reveal>
            <p className="mt-5 max-w-[62ch] text-base leading-7 text-[#5E6862]">
              I wrote the sentence that tells the creator which print sizes to keep. The checks around it were a team build.
            </p>
            <div className="mt-8 grid gap-3 lg:grid-cols-2">
              <FlyHBlockerGroup title="1 thing needs your attention">
                <FlyHCheckRow status="action" title="Print-size claim" detail="The description names a size that is not being sold. Export stays off until the creator edits it." />
              </FlyHBlockerGroup>
              <FlyHWarningGroup title="One thing to know">
                <FlyHCheckRow status="warning" title="Print size coverage" detail="Listing copy should mention every available print size. A warning does not stop the handoff." />
              </FlyHWarningGroup>
            </div>
            <ol className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {reviewSequence.map((step, index) => (
                <li key={step} className="flex items-center gap-3 rounded-lg border border-[#DFE2DE] bg-white px-3 py-2">
                  <span className="text-xs font-semibold text-[#145C46]">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-sm font-medium">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-8 max-w-[62ch] text-base leading-7 text-[#5E6862]">
              The creator ticks approval before anything leaves. This screen downloads a JSON pack because Etsy is not connected. A configured shop can create a draft, and the creator still publishes it.
            </p>
            <Reveal y={12} className="mt-6">
              <FlyHScreenFrame image={images.review} caption="Warning visible. Checks passed. Approval ticked. JSON ready." />
            </Reveal>
            <div className="mt-12 border-t border-[#DFE2DE] pt-10">
              <h3 className="text-xl font-semibold tracking-[-0.02em]">When the evidence isn&apos;t there</h3>
              <p className="mt-3 max-w-[62ch] text-base leading-7 text-[#5E6862]">
                We labelled demo data as demo and kept unsupported market claims out of the workflow.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {['Preview gate', 'Demo labelled', 'Live shop off', 'Estimates off'].map((item) => (
                  <li key={item} className="rounded-md border border-[#DFE2DE] bg-white px-3 py-2 text-sm font-medium">{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="border-t border-[#DFE2DE] py-12 md:py-16">
            <Reveal>
              <Title>Where FlyH sits.</Title>
              <p className="mt-4 max-w-[22ch] text-[clamp(1.4rem,3vw,2rem)] font-semibold leading-tight tracking-[-0.03em]">
                We weren&apos;t trying to out-bulk MyDesigns.
              </p>
            </Reveal>
            <div className="mt-5 max-w-[68ch] space-y-4 text-base leading-7 text-[#5E6862]">
              <p>The closest established end-to-end competitor we identified was MyDesigns. Adjacent tools still cover SEO, mockups, research and marketplace management on their own.</p>
              <p>MyDesigns is an established US product, operated by MyDesigns, Inc., a Nevada corporation. Its public positioning centres on bulk design, mockups, listing copy and publishing across channels such as Etsy, Shopify, TikTok and WooCommerce.</p>
              <p>MyDesigns already tackles the wider commerce workflow at scale. FlyH explored a narrower wedge: what happens when a creator already has the work, but wants the operational layer handled without losing visibility or final control.</p>
            </div>
            <div className="mt-8 overflow-hidden rounded-xl border border-[#DFE2DE] bg-white">
              <div className="hidden border-b border-[#DFE2DE] bg-[#F7F6F2] px-4 py-3 text-xs font-semibold tracking-[0.12em] sm:grid sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)]">
                <span />
                <p className="text-[#858E88]">MYDESIGNS</p>
                <p className="text-[#145C46]">FLYH</p>
              </div>
              {positionRows.map(([label, theirs, ours]) => (
                <div key={label} className="grid gap-1 border-b border-[#DFE2DE] px-4 py-3 last:border-b-0 sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)] sm:items-baseline sm:gap-3">
                  <p className="text-xs font-semibold tracking-[0.12em] text-[#D66A4A]">{label}</p>
                  <p className="text-sm leading-6 text-[#5E6862]"><span className="mr-2 text-xs font-semibold tracking-[0.08em] text-[#858E88] sm:hidden">MYDESIGNS</span>{theirs}</p>
                  <p className="text-sm font-medium leading-6 text-[#145C46] sm:text-[#1D2420]"><span className="mr-2 text-xs font-semibold tracking-[0.08em] sm:hidden">FLYH</span>{ours}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              <a href="https://mydesigns.io" target="_blank" rel="noopener noreferrer" className="flyh-link underline">View MyDesigns ↗</a>
            </p>
            <p className="mt-10 max-w-[28ch] text-[clamp(1.5rem,3vw,2.1rem)] font-semibold leading-tight tracking-[-0.03em]">
              FlyH wasn&apos;t designed to replace the creative process. It starts after the work exists.
            </p>
            <ol className="mt-6 max-w-md">
              {[
                ['Creation', 'stays with the creator'],
                ['Commercial preparation', 'FlyH helps'],
                ['Final decision', 'returns to the creator'],
              ].map(([title, detail], index, list) => (
                <li key={title}>
                  <p className="text-xs font-semibold tracking-[0.12em] text-[#D66A4A]">{title}</p>
                  <p className="mt-1 text-sm font-medium">{detail}</p>
                  {index < list.length - 1 ? <p className="py-2 text-[#D66A4A]" aria-hidden="true">↓</p> : null}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm font-semibold tracking-[-0.02em]">Humans create. Humans decide. Agents operate.</p>
          </section>

          <section id="flyh-system" className="border-t border-[#DFE2DE] py-12 md:py-16">
            <Reveal>
              <FlyHKicker>08 — System</FlyHKicker>
              <Title>A design system the product actually runs on.</Title>
            </Reveal>
            <p className="mt-5 max-w-[62ch] text-base leading-7 text-[#5E6862]">
              Instead of making a separate style board for the case study, FlyH&apos;s visual language lives in code as an interactive system covering foundations, components, operational patterns and visual studies.
            </p>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              <article className="rounded-xl border border-[#DFE2DE] bg-white p-4">
                <h3 className="font-semibold">Foundations</h3>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {['#111613', '#F7F6F2', '#145C46', '#D66A4A', '#EFF7F3', '#8A6517', '#A33B31', '#FFFFFF'].map((color) => (
                    <span key={color} className="aspect-square rounded-md border border-[#DFE2DE]" style={{ background: color }} />
                  ))}
                </div>
                <p className="mt-4 text-sm font-medium">Manrope 400 / 500 / 600</p>
              </article>
              <article className="space-y-3 rounded-xl border border-[#DFE2DE] bg-white p-4">
                <h3 className="font-semibold">Components</h3>
                <FlyHField label="Title" value="Amber-Eyed Anime Portrait" />
                <div className="flex flex-wrap gap-2">
                  <FlyHTag>green eyes artwork</FlyHTag>
                  <FlyHTag>printable art</FlyHTag>
                </div>
              </article>
              <article className="space-y-3 rounded-xl border border-[#DFE2DE] bg-white p-4">
                <h3 className="font-semibold">Patterns</h3>
                <FlyHCheckRow status="pass" title="All 18 checks passed" detail="Passed is a label, not only a colour." />
                <FlyHApprovalWell />
              </article>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {['Foundations', 'Components', 'Patterns', 'Color Lab', 'Visual Studies'].map((item) => (
                <li key={item} className="rounded-md border border-[#DFE2DE] bg-white px-3 py-2 text-sm font-medium">{item}</li>
              ))}
            </ul>
            <p className="mt-6 max-w-[62ch] text-sm leading-6 text-[#5E6862]">
              Foundations, components, operational patterns, Color Lab and visual studies — running in code.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <FlyHDesignSystemCta />
              <FlyHTextButton onClick={() => setDrawer('system')}>See system notes</FlyHTextButton>
            </div>
            {handoffBenchmark ? (
              <div className="mt-10 max-w-sm">
                <p className="text-5xl font-semibold tracking-[-0.04em]">{handoffBenchmark.median}</p>
                <p className="mt-2 text-sm font-medium">median artwork → listing-ready handoff</p>
                <p className="mt-1 text-xs text-[#858E88]">Controlled FlyH demo run · n=3</p>
              </div>
            ) : null}
            <div className="mt-14 border-t border-[#DFE2DE] pt-10">
              <h3 className="text-xl font-semibold tracking-[-0.02em]">What we actually built</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['Built', built],
                  ['Config-dependent', configured],
                  ['Preview', preview],
                  ['Next', next],
                ].map(([label, items]) => (
                  <article key={label as string}>
                    <h4 className="flyh-kicker">{label as string}</h4>
                    <ul className="mt-3 space-y-2 text-sm leading-5">
                      {(items as readonly string[]).map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </article>
                ))}
              </div>
              <p className="mt-4">
                <FlyHTextButton onClick={() => setDrawer('scope')}>Scope notes</FlyHTextButton>
              </p>
            </div>
            <div className="mt-14 border-t border-[#DFE2DE] pt-10">
              <h3 className="text-xl font-semibold tracking-[-0.02em]">From MVP to MVB</h3>
              <ol className="mt-4">
                {questions.map(([question, answer]) => (
                  <li key={question} className="grid gap-1 border-t border-[#DFE2DE] py-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)] sm:items-baseline">
                    <p className="font-semibold tracking-[-0.02em]">{question}</p>
                    <p className="text-sm text-[#5E6862]">{answer}</p>
                  </li>
                ))}
              </ol>
            </div>
            <blockquote className="mt-14 max-w-[20ch] border-t border-[#DFE2DE] pt-10 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
              Aethelgard taught me how to automate a workflow. FlyH taught me that a product has to explain itself to someone who didn&apos;t build it.
            </blockquote>
          </section>

          <nav className="flex flex-wrap items-center justify-between gap-4 border-t border-[#DFE2DE] py-10" aria-label="Project">
            <Link href="/work/redvelvetvault" className="flyh-link">Previous · RedVelvetVault</Link>
            <Link href="/#work" className="flyh-link">Back to work</Link>
            <Link href="/work/careeros" className="flyh-link">Next · CareerOS</Link>
          </nav>
        </div>
        <FlyHEvidenceDrawer panel={drawer} onClose={() => setDrawer(null)} />
        <FlyHLightbox
          items={[{
            src: images.firstSale.src,
            width: images.firstSale.width,
            height: images.firstSale.height,
            alt: images.firstSale.alt,
            subreddit: 'Origin validation',
            title: 'Aethelgard was used to fulfil my first Etsy order — a 23-print digital bundle.',
          }]}
          index={saleOpen ? 0 : null}
          onIndex={() => setSaleOpen(true)}
          onClose={() => setSaleOpen(false)}
        />
      </main>
      <WalkthroughPlayer
        src={walkthroughSrc}
        hidden={playerHidden}
        title="FlyH product walkthrough"
        accent="#145C46"
        chapters={[]}
        closeLabel="Close FlyH walkthrough"
        openLabel="Open FlyH walkthrough"
        resumeWhenShown={false}
        playRequest={playRequest}
        openExpanded
        animate
      />
    </FlyHMotion>
  );
}
