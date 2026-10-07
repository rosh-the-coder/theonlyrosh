import Image from 'next/image';
import Link from 'next/link';
import CommunityCarousel from '@/components/careeros/CommunityCarousel';
import {
  CaseStudyMotion,
  CountUp,
  Entrance,
  MediaReveal,
  Reveal,
  Stagger,
  ViewLargerHint,
  ZoomImage,
  type ZoomShot,
} from '@/components/careeros/motion';
import ScrollFrame from '@/components/careeros/ScrollFrame';

const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C6F135]';
const textLink = `inline-flex min-h-11 items-center text-sm text-[#bdbdb4] transition-[color,transform] duration-300 ${ease} hover:-translate-y-px hover:text-white ${focusRing} `;

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className={`inline-block transition-transform duration-300 ${ease} group-hover:translate-x-[3px] group-hover:-translate-y-[3px] `}
    >
      ↗
    </span>
  );
}

const liveProductUrl = 'https://career-os-topaz-nu.vercel.app/';
const walkthroughUrl = 'https://www.loom.com/share/0b65c13eb14d460b8d32e5aebfd9ea63';

const stages = [
  'Discover',
  'Score',
  'Understand',
  'Select evidence',
  'Generate',
  'Review',
  'Apply',
  'Track',
] as const;

const oldTools = [
  ['Job board', 'Find the opportunity'],
  ['Job description / browser', 'Evaluate fit and eligibility'],
  ['AI chat', 'Paste the JD, explain the background, request changes'],
  ['CV / document editor', 'Rewrite, format and export'],
  ['Tracker', 'Record the application'],
] as const;

const careerPass = ['Job', 'Fit', 'Evidence', 'CV', 'Application'] as const;

const breakdown = [
  ['Skills', 90],
  ['Evidence', 80],
  ['Projects', 80],
  ['Seniority', 90],
  ['Eligibility', 85],
  ['Permit path', 55],
  ['Location', 100],
  ['Salary', 100],
  ['Direction', 90],
] as const;

const priorities = [
  ['Priority', 'Act first', 'bg-[#C6F135] text-[#12170f]'],
  ['Strong', 'Close fit', 'bg-[#16324a] text-[#9fd0ff]'],
  ['Worth reviewing', 'Look closer', 'bg-[#3a3418] text-[#e4d48a]'],
  ['Low priority', 'Later', 'bg-[#2a2a28] text-[#c8c8c0]'],
  ['Archive', 'Keep, don’t chase', 'bg-[#1c1c1a] text-[#8e8e88]'],
  ['Rejected', 'Out', 'bg-[#3a1c1c] text-[#f0a0a0]'],
] as const;

const approval = ['Discovered', 'Scored', 'Reviewed', 'Approved', 'CV prepared', 'I apply'] as const;

const cvIssues = [
  'Hierarchy',
  'Spacing',
  'Typography',
  'Content density',
  'Repeated content',
  'Links',
  'PDF / DOCX export',
  'Claims grounded in existing evidence',
] as const;

const loop = ['Discovery', 'Decision', 'Preparation', 'Application', 'Follow-up'] as const;

const buildAreas = [
  ['System framing', 'Name the repeated workflow and the loop the product had to close.'],
  ['Profile and ingestion', 'Give the system a real background, then a way to bring jobs in.'],
  ['Scoring and explanations', 'Move from keyword overlap to a fit someone can inspect.'],
  ['Evidence and CVs', 'Map projects to a role, then make the document usable.'],
  ['Application workflow', 'Keep approval, submission and follow-up in the same place.'],
  ['Polish and real use', 'Use it on a live search and fix what the workflow exposed.'],
] as const;

const publicSurfaces = [
  {
    src: '/Work/CareerOS/careerOS_access.png',
    width: 1897,
    height: 903,
    alt: 'Request access page. CareerOS is invite-only, and no account is created until a request is reviewed.',
  },
  {
    src: '/Work/CareerOS/careerOS_signin.png',
    width: 1907,
    height: 903,
    alt: 'Sign-in page beside the same job lifecycle, ending at human review.',
  },
] as const;

const insights = [
  ['Context before prompts', 'The strongest improvements came from better structured context, not simply longer prompts.'],
  ['Explain the score', 'A recommendation becomes much more useful when the evidence behind it is visible.'],
  ['Keep the human checkpoint', 'Automation should remove repetition without removing accountability.'],
  ['A short feedback loop', 'Using the product, finding friction and changing the workflow could happen in the same sitting.'],
] as const;

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#C6F135]">{children}</p>;
}

function SectionTitle({ children, long = false }: { children: React.ReactNode; long?: boolean }) {
  const className = long
    ? "mt-1 max-w-[22ch] font-['Imbue',serif] text-3xl font-medium leading-[0.95] text-[#f4f0e6] sm:text-5xl"
    : "max-w-[16ch] font-['Imbue',serif] text-4xl font-medium leading-[0.95] text-[#f4f0e6] sm:text-6xl";
  return <h2 className={className}>{children}</h2>;
}

function LiveProductLink({ quiet = false, children }: { quiet?: boolean; children: React.ReactNode }) {
  const className = quiet
    ? `group inline-flex min-h-11 items-center gap-2 text-sm text-[#bdbdb4] underline-offset-4 transition-[color,transform] duration-300 ${ease} hover:-translate-y-px hover:text-white hover:underline ${focusRing} `
    : `group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#C6F135] px-5 text-sm font-semibold text-[#12170f] transition-[background-color,transform] duration-300 ${ease} hover:-translate-y-px hover:bg-[#d6ff6a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white `;
  return (
    <a href={liveProductUrl} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function Shot({
  src,
  alt,
  width,
  height,
  caption,
  priority = false,
  tall = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  priority?: boolean;
  tall?: boolean;
}) {
  const image: ZoomShot = { src, alt, width, height, caption };
  return (
    <figure className="min-w-0">
      <div className="group relative">
        <ScrollFrame label={alt} className={tall ? 'max-h-[82vh]' : ''}>
          <ZoomImage image={image} hint={false}>
            <div className="w-[1400px] max-w-none">
              <Image
                src={src}
                alt=""
                width={width}
                height={height}
                priority={priority}
                sizes="1400px"
                style={{ width: '100%', height: 'auto' }}
                className="h-auto w-full"
              />
            </div>
          </ZoomImage>
        </ScrollFrame>
        <ViewLargerHint />
      </div>
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2 text-sm leading-6 text-[#9c9c94]">
        <span className="max-w-[68ch]">{caption}</span>
        <span className="text-[11px] uppercase tracking-[0.14em] text-[#6f6f68]">Scroll to read</span>
      </figcaption>
    </figure>
  );
}

export default function CaseStudy() {
  return (
    <CaseStudyMotion>
    <main className="min-h-screen overflow-x-clip bg-[#0B0B0B] text-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-12">
        <nav className="flex h-16 items-center" aria-label="Case study">
          <Link href="/#work" className={textLink}>
            Back to work
          </Link>
        </nav>

        <header className="grid items-center gap-8 pb-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:pb-6">
          <div className="relative z-10 min-w-0 lg:py-6 lg:pr-8">
          <Entrance y={20} duration={0.95}>
            <Kicker>AI product · Product design · Design engineering</Kicker>
          </Entrance>
          <Entrance delay={0.08} y={40} duration={1.05}>
            <h1 className="mt-3 font-teko text-7xl leading-none text-white sm:text-8xl lg:text-[7.5rem]">CareerOS</h1>
          </Entrance>
          <Entrance delay={0.14} y={34} duration={1}>
            <p className="mt-4 max-w-[14ch] font-['Imbue',serif] text-4xl font-medium leading-[0.95] text-[#f4f0e6] sm:text-6xl">
              Run your job search like a system.
            </p>
          </Entrance>
          <Entrance delay={0.18} y={30} duration={0.95}>
            <p className="mt-5 max-w-[46ch] text-base leading-7 text-[#d5d5cc] sm:text-lg">
              A job-search operating system that discovers relevant roles, explains their fit, prepares evidence-grounded CVs and keeps applications organised in one workflow.
            </p>
          </Entrance>
          <Entrance delay={0.24} y={22} duration={0.9}>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <LiveProductLink>
              View live product
              <Arrow />
            </LiveProductLink>
            <a
              href={walkthroughUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 px-5 text-sm font-medium text-white transition-[color,border-color,transform] duration-300 ${ease} hover:-translate-y-px hover:border-[#C6F135] hover:text-[#C6F135] ${focusRing} `}
            >
              Watch walkthrough
              <Arrow />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          </Entrance>
          <Entrance delay={0.28} y={22} duration={0.9}>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {[
              ['Role', 'Product Designer & Design Engineer'],
              ['Timeline', '1 week'],
              ['Date', 'July 2026'],
              ['Type', 'Independent AI product'],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-[#8f8f86]">{label}</dt>
                <dd className="mt-1 text-sm leading-6 text-[#f4f0e6]">{value}</dd>
              </div>
            ))}
            </dl>
          </Entrance>
          </div>
          <Entrance delay={0.2} x={55} y={18} scale={0.965} duration={1.05} className="min-w-0">
            <Image
              src="/Work/CareerOS/careerOS_macbook.png"
              alt="MacBook showing the CareerOS landing page: run your job search like a system, with a role scored at 84 and held for human review."
              width={2011}
              height={1171}
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              style={{ width: '100%', height: 'auto' }}
              className="h-auto w-full"
            />
          </Entrance>
        </header>
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-4 pb-4 md:px-8">
        <MediaReveal>
          <div className="group relative">
            <ScrollFrame label="CareerOS dashboard, scroll sideways on a small screen to read it" align="center">
              <ZoomImage
                hint={false}
                image={{
                  src: '/Work/CareerOS/careerOS_dashboard_full.png',
                  alt: 'CareerOS dashboard showing 98 unique jobs, 32 queued or scored, and 34 applications, with priority roles ready for review.',
                  width: 1920,
                  height: 2615,
                  caption: 'The working dashboard.',
                }}
              >
                <div className="relative h-[720px] w-[1400px] max-w-none bg-[#10140c] xl:aspect-[16/10] xl:h-auto xl:w-full">
                  <Image
                    src="/Work/CareerOS/careerOS_dashboard_full.png"
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 1400px, 1280px"
                    className="object-cover object-top"
                  />
                </div>
              </ZoomImage>
            </ScrollFrame>
            <ViewLargerHint />
          </div>
        </MediaReveal>
        <p className="mx-auto mt-3 max-w-[1440px] text-sm leading-6 text-[#9c9c94]">
          The working dashboard. On a small screen, scroll sideways to read it.
        </p>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-12">
        <section id="problem" className="scroll-mt-8 border-t border-white/10 py-16 md:py-24">
          <Reveal>
            <SectionTitle>Job hunting had become a job in itself.</SectionTitle>
            <div className="mt-6 max-w-[62ch] space-y-4 text-base leading-7 text-[#d5d5cc]">
              <p>
                The problem wasn&apos;t simply finding vacancies. Every tailored application meant leaving one tool and opening another.
              </p>
              <p>None of those tasks was particularly difficult. Doing them repeatedly was.</p>
            </div>
          </Reveal>
          <Reveal className="mt-10">
            <blockquote className="max-w-[20ch] font-['Imbue',serif] text-3xl leading-[1.05] text-[#f4f0e6] sm:text-5xl">
              I wasn&apos;t looking for another job board. I wanted a system that could understand my background and tell me what deserved my attention.
            </blockquote>
          </Reveal>
        </section>

        <section className="border-t border-white/10 py-12 md:py-16">
          <Reveal>
            <SectionTitle long>I wasn&apos;t the only one feeling the friction.</SectionTitle>
            <p className="mt-5 max-w-[62ch] text-base leading-7 text-[#d5d5cc]">
              CareerOS started from my own workflow. Looking beyond my own experience, the same pain kept appearing in job-search communities: repeated tailoring, AI-generated changes that overreach, and 20–40 minute application-prep loops.
            </p>
          </Reveal>
          <Reveal className="mt-6">
            <CommunityCarousel />
          </Reveal>
        </section>

        <section className="border-t border-white/10 py-16 md:py-24">
          <Reveal>
            <Kicker>The workflow</Kicker>
            <SectionTitle>One application, five tools.</SectionTitle>
          </Reveal>
          <Reveal className="mt-8">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <article className="rounded-2xl border border-white/10 bg-[#121212] p-5 sm:p-6">
              <h3 className="text-[11px] uppercase tracking-[0.16em] text-[#8f8f86]">Before CareerOS</h3>
              <p className="mt-3 text-sm leading-6 text-[#9c9c94]">A single tailored application meant moving between separate tools.</p>
              <Stagger as="ol" className="mt-5" step={0.06}>
                {oldTools.map(([tool, action], index) => (
                  <div key={tool}>
                    {index > 0 && (
                      <p aria-hidden="true" className="py-1 pl-1 text-sm text-[#6f6f68]">→</p>
                    )}
                    <div className="rounded-xl border border-white/10 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[#f4f0e6]">{tool}</p>
                      <p className="mt-1 text-sm leading-6 text-[#9c9c94]">{action}</p>
                    </div>
                  </div>
                ))}
              </Stagger>
            </article>
            <article className="rounded-2xl border border-[#C6F135]/40 bg-[#141a10] p-5 sm:p-6">
              <h3 className="text-[11px] uppercase tracking-[0.16em] text-[#C6F135]">CareerOS</h3>
              <p className="mt-3 text-sm leading-6 text-[#d5d5cc]">The same decisions, kept in one pass.</p>
              <Stagger
                as="ol"
                ariaLabel="CareerOS pass"
                className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2"
                itemClassName="flex items-center"
                step={0.07}
              >
                {careerPass.flatMap((step, index) => {
                  const nodes = [
                    <span key={step} className="font-teko text-5xl leading-none text-[#f4f0e6]">{step}</span>,
                  ];
                  if (index < careerPass.length - 1) {
                    nodes.push(<span key={`${step}-arrow`} aria-hidden="true" className="text-2xl text-[#C6F135]">→</span>);
                  }
                  return nodes;
                })}
              </Stagger>
            </article>
          </div>
          </Reveal>
        </section>

        <section className="border-t border-white/10 py-12 md:py-16" aria-label="Working search notes">
          <Reveal>
            <Kicker>From the working search</Kicker>
          <Stagger className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" itemClassName="h-full min-w-0 [&>*]:h-full" step={0.06}>
            <article className="rounded-2xl border border-white/10 bg-[#12170f] p-5">
              <p className="font-teko text-6xl leading-none text-white">≈5 min</p>
              <p className="mt-3 text-sm uppercase tracking-[0.12em] text-[#f4f0e6]">From job description to tailored CV</p>
              <p className="mt-2 text-xs leading-5 text-[#9c9c94]">Observed in my own CareerOS workflow.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[#12170f] p-5">
              <p className="font-teko text-6xl leading-none text-white"><CountUp value={98} /></p>
              <p className="mt-3 text-sm uppercase tracking-[0.12em] text-[#f4f0e6]">Unique roles processed</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[#12170f] p-5">
              <p className="font-teko text-6xl leading-none text-white"><CountUp value={34} /></p>
              <p className="mt-3 text-sm uppercase tracking-[0.12em] text-[#f4f0e6]">Applications tracked</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[#12170f] p-5">
              <p className="font-teko text-5xl leading-none text-white">No separate</p>
              <p className="mt-3 text-sm uppercase tracking-[0.12em] text-[#f4f0e6]">Résumé-builder subscription</p>
            </article>
          </Stagger>
          </Reveal>
        </section>

        <section className="border-t border-white/10 py-16 md:py-24">
          <Reveal>
            <p className="max-w-[14ch] font-['Imbue',serif] text-5xl font-medium leading-[0.92] text-[#f4f0e6] sm:text-7xl">
              Evidence before generation.
            </p>
            <p className="mt-6 max-w-[62ch] text-base leading-7 text-[#d5d5cc]">
              Generation starts from structured evidence: skills, projects, experience, preferences and eligibility.
            </p>
          </Reveal>
          <Stagger as="ol" ariaLabel="CareerOS lifecycle" className="mt-8 flex flex-wrap gap-2" step={0.055}>
            {stages.map((stage, index) => (
              <span key={stage} className="inline-flex items-center gap-2 rounded-full border border-[#C6F135]/35 bg-[#141a10] px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[#C6F135]">
                <span className="font-teko text-lg leading-none text-white">{String(index + 1).padStart(2, '0')}</span>
                {stage}
              </span>
            ))}
          </Stagger>
        </section>

        <section className="border-t border-white/10 py-16 md:py-24">
          <Reveal>
            <SectionTitle long>A single percentage wasn&apos;t trustworthy enough.</SectionTitle>
            <p className="mt-6 max-w-[62ch] text-base leading-7 text-[#d5d5cc]">
              Keyword overlap could spot a shared phrase. It could not show whether my experience actually supported the requirement. Strengths, gaps, evidence and the breakdown had to stay visible.
            </p>
          </Reveal>
          <Stagger className="mt-8 grid gap-3 md:grid-cols-2" step={0.08}>
            <article className="rounded-2xl border border-white/10 p-5">
              <h3 className="text-[11px] uppercase tracking-[0.16em] text-[#8f8f86]">Early</h3>
              <p className="mt-3 font-['Imbue',serif] text-3xl leading-none text-[#f4f0e6] sm:text-4xl">Do these words match?</p>
            </article>
            <article className="rounded-2xl border border-[#C6F135]/40 bg-[#141a10] p-5">
              <h3 className="text-[11px] uppercase tracking-[0.16em] text-[#C6F135]">Evolved</h3>
              <p className="mt-3 font-['Imbue',serif] text-3xl leading-none text-[#f4f0e6] sm:text-4xl">Does my evidence actually support this role?</p>
            </article>
          </Stagger>
          <Reveal className="mt-6">
            <p className="max-w-[62ch] text-base leading-7 text-[#d5d5cc]">
              The number is decision support. It is not a scientific measure of fit.
            </p>
          </Reveal>

          <Stagger className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" step={0.05}>
            {breakdown.map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-[#12170f] px-4 py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-sm text-[#d5d5cc]">{label}</h3>
                  <p className="font-teko text-3xl leading-none text-white">{value}</p>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden>
                  <div className="h-full rounded-full bg-[#C6F135]" style={{ width: `${value}%`, opacity: value < 70 ? 0.45 : 1 }} />
                </div>
              </div>
            ))}
          </Stagger>
          <p className="mt-3 max-w-[68ch] text-sm leading-6 text-[#9c9c94]">
            One scored role: Graduate UI Designer. Permit path sits at 55 while location and salary sit at 100, so a weak dimension stays visible inside the overall 84.
          </p>

          <Reveal className="mt-10">
            <blockquote className="font-['Imbue',serif] text-4xl leading-none text-[#f4f0e6] sm:text-6xl">
              84% — and here&apos;s why.
            </blockquote>
            <p className="mt-4 text-sm uppercase tracking-[0.16em] text-[#C6F135]">Explainability &gt; arbitrary AI scores</p>
          </Reveal>

          <MediaReveal className="mt-8">
            <Shot
              src="/Work/CareerOS/careerOS_job_detail.png"
              alt="Job analysis for a Graduate UI Designer role, with an 84 strong-fit score, a written explanation, strengths, gaps, a score breakdown, recommended projects and generated CV files."
              width={1920}
              height={2571}
              tall
              caption="The job page explains the fit, then keeps requirements, evidence and the generated CV on the same screen."
            />
          </MediaReveal>
        </section>

        <section className="border-t border-white/10 py-16 md:py-24">
          <Reveal>
            <SectionTitle>AI where judgement helps. Rules where certainty matters.</SectionTitle>
          </Reveal>
          <Stagger className="mt-8 grid gap-4 lg:grid-cols-2" step={0.08}>
            <article className="rounded-2xl border border-white/10 bg-[#12170f] p-5 sm:p-6">
              <h3 className="text-[11px] uppercase tracking-[0.16em] text-[#C6F135]">AI / semantic reasoning</h3>
              <ul className="mt-4 space-y-2 text-base leading-7 text-[#d5d5cc]">
                <li>Transferable skills</li>
                <li>Project relevance</li>
                <li>Role similarity</li>
                <li>Evidence interpretation</li>
              </ul>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[#12170f] p-5 sm:p-6">
              <h3 className="text-[11px] uppercase tracking-[0.16em] text-[#C6F135]">Structured logic</h3>
              <ul className="mt-4 space-y-2 text-base leading-7 text-[#d5d5cc]">
                <li>Known eligibility constraints</li>
                <li>Explicit profile data</li>
                <li>Deterministic status logic</li>
                <li>Clear filtering conditions</li>
              </ul>
            </article>
          </Stagger>
          <Reveal className="mt-6">
            <p className="max-w-[62ch] text-base leading-7 text-[#d5d5cc]">
              CareerOS became a hybrid system rather than an LLM making every decision.
            </p>
          </Reveal>
        </section>

        <section className="border-t border-white/10 py-16 md:py-24">
          <Reveal>
            <SectionTitle>What deserves my attention?</SectionTitle>
            <p className="mt-6 max-w-[62ch] text-base leading-7 text-[#d5d5cc]">
              Another long list of listings would not have helped. Stronger opportunities surface. Weaker ones recede.
            </p>
          </Reveal>
          <Stagger as="ul" ariaLabel="Job priority states" className="mt-6 flex flex-wrap gap-2" step={0.05}>
            {priorities.map(([label, hint, tone]) => (
              <span key={label} className={`rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.12em] ${tone}`}>
                {label}
                <span className="ml-2 normal-case tracking-normal opacity-80">{hint}</span>
              </span>
            ))}
          </Stagger>
          <MediaReveal className="mt-8">
            <Shot
              src="/Work/CareerOS/careerOS_jobs.png"
              alt="Jobs table with fit scores and states including Priority, Strong, Worth reviewing, Archive and Rejected."
              width={1899}
              height={905}
              caption="Roles are sorted as decisions: priority and strong fits stay forward, archive and rejected roles fall back."
            />
          </MediaReveal>
        </section>

        <section className="border-t border-white/10 py-16 md:py-24">
          <Reveal>
            <Kicker>Automate preparation, not judgement.</Kicker>
            <SectionTitle long>I didn&apos;t want AI deciding which jobs I should apply to.</SectionTitle>
            <p className="mt-6 max-w-[62ch] text-base leading-7 text-[#d5d5cc]">
              The approval queue can discover, parse and score a role without turning that score into an application. Preparing a CV stays a separate step.
            </p>
          </Reveal>
          <Stagger as="ol" ariaLabel="Approval lifecycle" className="mt-6 flex flex-wrap gap-2" itemClassName="flex items-center gap-2 text-sm text-[#f4f0e6]" step={0.055}>
            {approval.map((step, index) => (
              <span key={step} className="flex items-center gap-2">
                <span className="font-teko text-2xl leading-none text-[#C6F135]">{String(index + 1).padStart(2, '0')}</span>
                {step}
                {index < approval.length - 1 && <span aria-hidden className="px-1 text-[#C6F135]/50">→</span>}
              </span>
            ))}
          </Stagger>
          <MediaReveal className="mt-8">
            <Shot
              src="/Work/CareerOS/careerOS_approve.png"
              alt="Approve queue listing roles that can be scored individually before any CV pack is prepared."
              width={1901}
              height={892}
              caption="Unscored roles stay in the queue until they are opened. Preparing a CV is a separate step."
            />
          </MediaReveal>
        </section>

        <section className="border-t border-white/10 py-16 md:py-24">
          <Reveal>
            <SectionTitle long>Generating text was easy. Generating something I could actually submit was not.</SectionTitle>
            <p className="mt-6 max-w-[62ch] text-base leading-7 text-[#d5d5cc]">
              The job page recommends projects from existing evidence before a CV is produced. The file stays attached to the role for review.
            </p>
          </Reveal>
          <MediaReveal className="mt-8">
            <figure>
              <ZoomImage
                image={{
                  src: '/Work/CareerOS/careerOS_cv_evidence.png',
                  alt: 'Recommended projects for a Graduate UI Designer role, including RedVelvetVault and CareerOS, beside parsed requirements and a generated CV ready to download as DOCX or PDF.',
                  width: 1510,
                  height: 484,
                  caption: 'Evidence is chosen first. The generated file stays attached to the role for review and download.',
                }}
              >
                <span className="block overflow-hidden rounded-2xl border border-white/10 bg-[#10140c]">
                  <Image
                    src="/Work/CareerOS/careerOS_cv_evidence.png"
                    alt=""
                    width={1510}
                    height={484}
                    sizes="(min-width: 1024px) 1100px, 100vw"
                    style={{ width: '100%', height: 'auto' }}
                    className="h-auto w-full"
                  />
                </span>
              </ZoomImage>
              <figcaption className="mt-3 text-sm leading-6 text-[#9c9c94]">
                Evidence is chosen first. The generated file stays attached to the role for review and download.
              </figcaption>
            </figure>
          </MediaReveal>
          <Stagger as="ul" className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4" step={0.05}>
            {cvIssues.map((issue) => (
              <span key={issue} className="block rounded-xl border border-white/10 px-3 py-3 text-sm leading-5 text-[#d5d5cc]">
                {issue}
              </span>
            ))}
          </Stagger>
          <Reveal className="mt-8">
            <p className="font-['Imbue',serif] text-3xl leading-none text-[#C6F135] sm:text-4xl">
              Document generation is also a design problem.
            </p>
          </Reveal>
        </section>

        <section className="border-t border-white/10 py-16 md:py-24">
          <Reveal>
            <SectionTitle long>Once the CV left the editor, the application still had to be remembered somewhere else.</SectionTitle>
            <p className="mt-6 max-w-[62ch] text-base leading-7 text-[#d5d5cc]">
              Status, date, salary where it is known, and the next action stay on the role.
            </p>
          </Reveal>
          <MediaReveal className="mt-8">
            <Shot
              src="/Work/CareerOS/careerOS_applications.png"
              alt="Applications tracker with company, position, status, application date, salary and next action."
              width={1903}
              height={905}
              caption="Discovery, the decision, the CV and the follow-up live in one workspace."
            />
          </MediaReveal>
          <Stagger as="ol" ariaLabel="Closed loop" className="mt-8 flex flex-wrap items-center gap-2" itemClassName="flex items-center gap-2" step={0.06}>
            {loop.map((step, index) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-white/15 px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[#f4f0e6]">{step}</span>
                {index < loop.length - 1 && <span aria-hidden className="text-[#C6F135]">→</span>}
              </span>
            ))}
          </Stagger>
          <Reveal className="mt-8">
            <p className="max-w-[28ch] font-['Imbue',serif] text-3xl leading-[1.05] text-[#f4f0e6] sm:text-5xl">
              That closed loop is what turned a set of AI utilities into an operating system for the job search.
            </p>
          </Reveal>
        </section>

        <section className="border-t border-white/10 py-16 md:py-24">
          <Reveal>
            <SectionTitle>Outside the dashboard.</SectionTitle>
            <p className="mt-6 max-w-[62ch] text-base leading-7 text-[#d5d5cc]">
              Access and sign-in use the same rule as the product. The landing lifecycle, on the laptop above, ends at human review. CareerOS does not submit the application.
            </p>
          </Reveal>
          <Stagger className="mt-8 space-y-4" step={0.08}>
            {publicSurfaces.map((surface, index) => (
              <figure key={surface.src} className="group relative min-w-0">
                <ScrollFrame label={surface.alt}>
                  <ZoomImage
                    hint={false}
                    index={index}
                    gallery={publicSurfaces.map((item) => ({
                      src: item.src,
                      alt: item.alt,
                      width: item.width,
                      height: item.height,
                    }))}
                    image={{ src: surface.src, alt: surface.alt, width: surface.width, height: surface.height }}
                  >
                    <div className="w-[1100px] max-w-none lg:w-full">
                      <Image
                        src={surface.src}
                        alt=""
                        width={surface.width}
                        height={surface.height}
                        sizes="(min-width: 1024px) 1200px, 1100px"
                        style={{ width: '100%', height: 'auto' }}
                        className="h-auto w-full"
                      />
                    </div>
                  </ZoomImage>
                </ScrollFrame>
                <ViewLargerHint />
              </figure>
            ))}
          </Stagger>
        </section>

        <section className="border-t border-white/10 py-16 md:py-24">
          <Reveal>
            <Kicker>One week · key build areas</Kicker>
            <SectionTitle>One week forced ruthless scope.</SectionTitle>
            <p className="mt-6 max-w-[62ch] text-base leading-7 text-[#d5d5cc]">
              I wasn&apos;t trying to build another LinkedIn. I focused on the highest-friction loop in my own search: finding worthwhile roles, understanding fit and producing a usable application without rebuilding the process every time.
            </p>
            <p className="mt-3 max-w-[62ch] text-sm leading-6 text-[#9c9c94]">
              AI-assisted build in Cursor. The interface and the implementation moved together in the working product.
            </p>
          </Reveal>
          <Stagger as="ol" className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" itemClassName="h-full min-w-0 [&>*]:h-full" step={0.06}>
            {buildAreas.map(([title, body], index) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-[#12170f] p-4">
                <p className="font-teko text-4xl leading-none text-[#C6F135]">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 font-medium text-[#f4f0e6]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#9c9c94]">{body}</p>
              </div>
            ))}
          </Stagger>
        </section>

        <section className="border-t border-white/10 py-16 md:py-24">
          <Reveal>
            <Kicker>Used, not just prototyped</Kicker>
            <SectionTitle>Part of a real search.</SectionTitle>
            <p className="mt-6 max-w-[62ch] text-base leading-7 text-[#d5d5cc]">
              CareerOS became part of my job-search workflow. It moved past a portfolio prototype.
            </p>
            <p className="mt-4">
              <LiveProductLink quiet>
                Explore the working product <Arrow />
              </LiveProductLink>
            </p>
          </Reveal>
          <Stagger className="mt-8 grid gap-3 sm:grid-cols-3" itemClassName="h-full min-w-0 [&>*]:h-full" step={0.07}>
            {(
              [
                [98, 'Unique roles'],
                [32, 'Queued / scored'],
                [34, 'Applications tracked'],
              ] as const
            ).map(([figure, label]) => (
              <article key={label} className="rounded-2xl border border-[#C6F135]/30 bg-[#141a10] p-5">
                <p className="font-teko text-7xl leading-none text-white"><CountUp value={figure} /></p>
                <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[#C6F135]">{label}</p>
              </article>
            ))}
          </Stagger>
          <p className="mt-4 max-w-[68ch] text-sm leading-6 text-[#9c9c94]">
            Operating data from the working dashboard, not a usability study.
          </p>
        </section>

        <section className="border-t border-white/10 py-16 md:py-24">
          <Reveal>
            <SectionTitle>What building CareerOS changed for me.</SectionTitle>
          </Reveal>
          <Stagger className="mt-8 grid gap-3 md:grid-cols-2" itemClassName="h-full min-w-0 [&>*]:h-full" step={0.07}>
            {insights.map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-white/10 p-5">
                <h3 className="text-sm uppercase tracking-[0.14em] text-[#C6F135]">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#d5d5cc]">{body}</p>
              </article>
            ))}
          </Stagger>
          <Reveal className="mt-10">
            <blockquote className="max-w-[22ch] font-['Imbue',serif] text-3xl leading-[1.05] text-[#f4f0e6] sm:text-5xl">
              CareerOS wasn&apos;t an attempt to automate job hunting away. It was an attempt to spend less time operating the process and more time making good decisions.
            </blockquote>
          </Reveal>
        </section>

        <nav className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-10" aria-label="Project">
          <Link href="/#work" className={textLink}>
            Back to work
          </Link>
          <Link href="/work/redvelvetvault" className={textLink}>
            Next · RedVelvetVault
          </Link>
        </nav>
      </div>
    </main>
    </CaseStudyMotion>
  );
}
