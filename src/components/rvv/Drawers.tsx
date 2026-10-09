import type { ReactNode } from 'react';
import { AppMap, CreatorFlow, VisitorFlow } from '@/components/rvv/Diagrams';
import ReportFigure from '@/components/rvv/ReportFigure';
import { competitorHeaders, competitors, type PanelId } from '@/data/rvvCaseStudy';

const summaryCards = [
  ['13/14', 'Clear artwork interactions', 'Rated artwork interaction clarity 4 or 5 out of 5.'],
  ['13/14', 'Consistent interface', 'Rated consistency across sections 4 or 5 out of 5.'],
  ['11/14', 'Appealing visual design', 'Rated modern/appealing UI 4 or 5 out of 5.'],
  ['10/14', 'Clear on first impression', 'Rated the initial purpose-clarity question 4 or 5 out of 5.'],
  ['13/14', 'Would recommend', 'Rated recommendation likelihood 4 or 5 out of 5.'],
  ['12/14', 'Would use again', 'Answered Yes. The other two answered Maybe.'],
] as const;

const featureRatings = [
  ['Artwork information pages', 14],
  ['Top artists and galleries', 13],
  ['3D gallery walkthrough', 12],
  ['Social feed', 9],
  ['Notifications and messages', 8],
] as const;

function jumpTo(id: string) {
  const root = document.getElementById('rvv-panel-scroll');
  const target = document.getElementById(id);
  if (!root || !target) return;
  const top = target.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - 8;
  root.scrollTo({ top, behavior: 'smooth' });
}

function StackedBar({
  title,
  segments,
}: {
  title: string;
  segments: { label: string; count: number; className: string }[];
}) {
  const total = segments.reduce((sum, segment) => sum + segment.count, 0);
  return (
    <figure>
      <figcaption className="text-sm font-medium text-white">{title}</figcaption>
      <div className="mt-2 flex h-8 overflow-hidden rounded-lg" role="img" aria-label={segments.map((segment) => `${segment.label} ${segment.count}`).join(', ')}>
        {segments.map((segment) => (
          <div key={segment.label} className={`min-w-0 ${segment.className}`} style={{ width: `${(segment.count / total) * 100}%` }} />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#aaa]">
        {segments.map((segment) => (
          <li key={segment.label}>{segment.label} — {segment.count}</li>
        ))}
      </ul>
    </figure>
  );
}

function Phase({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="space-y-4">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {children}
    </section>
  );
}

export default function PanelBody({ id }: { id: PanelId }) {
  if (id === 'survey') {
    return (
      <div className="space-y-8">
        <p className="text-sm leading-6 text-[#aaa]">After trying the MVP, testers answered questions about the interface, gallery controls and whether they would use it again.</p>
        <p className="text-sm text-white">14 survey responses · self-reported feedback</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {summaryCards.map(([count, label, detail]) => (
            <article key={label} className="rounded-xl bg-[#1a1a1a] p-4">
              <p className="font-teko text-4xl leading-none text-white">{count}</p>
              <p className="mt-2 text-sm font-medium text-white">{label}</p>
              <p className="mt-1 text-sm leading-6 text-[#aaa]">{detail}</p>
            </article>
          ))}
        </div>
        <p className="text-sm leading-6 text-[#aaa]">Rating cards count answers of 4 or 5 on a five-point scale. Use-again is a separate Yes/Maybe question.</p>
        <div className="space-y-5">
          <h3 className="text-base font-semibold text-white">How the experience felt</h3>
          <StackedBar
            title="Navigation"
            segments={[
              { label: 'Very easy', count: 7, className: 'bg-[#FF4B4B]' },
              { label: 'Easy', count: 5, className: 'bg-[#737373]' },
              { label: 'Difficult', count: 2, className: 'bg-[#272727]' },
            ]}
          />
          <StackedBar
            title="Gallery walkthrough"
            segments={[
              { label: 'Smooth', count: 8, className: 'bg-[#FF4B4B]' },
              { label: 'Acceptable', count: 5, className: 'bg-[#737373]' },
              { label: 'Laggy', count: 1, className: 'bg-[#272727]' },
            ]}
          />
          <p className="text-sm leading-6 text-[#aaa]">These are the categorical questions. A separate five-point navigation statement had 10/14 high ratings. A separate overall-performance statement had 12/14 high ratings. A later statement, “I understood the purpose of the app quickly,” had 12/14 high ratings, which is not the same as the 10/14 first-impression question above.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">How testers rated individual features</h3>
          <p className="mt-1 text-sm leading-6 text-[#aaa]">Responses rating each feature 4 or 5 out of 5.</p>
          <ul className="mt-4 space-y-3">
            {featureRatings.map(([label, count]) => (
              <li key={label}>
                <div className="mb-1 flex justify-between gap-3 text-sm">
                  <span className="text-white">{label}</span>
                  <span className="text-[#aaa]">{count}/14</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#272727]" aria-hidden>
                  <div className="h-full bg-[#FF4B4B]" style={{ width: `${(count / 14) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-6 text-[#aaa]">Artwork information and gallery discovery were rated more positively than the secondary social and messaging features. These are ratings, not observed task success.</p>
          <p className="mt-3 rounded-xl bg-[#1a1a1a] p-4 text-sm leading-6 text-white">All 14 responses selected the 3D gallery walkthrough in the multi-select question about the most valuable feature.</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-white">What still needed work</h3>
          {[
            ['First visit and navigation', 'Some responses questioned whether to enter the gallery or sign up first. Profile navigation and category-selection onboarding also caused difficulties.'],
            ['Uploading artwork', 'Testers requested cropping, support for different aspect ratios and a less restrictive upload limit. Some reported changes in image appearance inside the room.'],
            ['Gallery appearance', 'Testers wanted different room styles and a clearer distinction between their own gallery and another artist’s gallery.'],
            ['Visual comfort and performance', 'Some found the red-heavy presentation intense. There were requests for text-size and contrast controls, and one walkthrough response was Laggy.'],
          ].map(([title, body]) => (
            <article key={title}>
              <h4 className="text-sm font-medium text-white">{title}</h4>
              <p className="mt-1 text-sm leading-6 text-[#aaa]">{body}</p>
            </article>
          ))}
          <blockquote className="border-l-2 border-[#FF4B4B] pl-3 text-sm leading-6 text-white">“Beautiful. Smooth. Purposeful.”</blockquote>
          <blockquote className="border-l-2 border-[#FF4B4B] pl-3 text-sm leading-6 text-white">“So far so good. World Customization would really be fun”</blockquote>
        </div>
        <details className="rounded-xl border border-white/10 p-4">
          <summary className="cursor-pointer text-sm font-medium text-white">More stated intentions</summary>
          <div className="mt-4 space-y-4 text-sm leading-6 text-[#aaa]">
            <p>Expected use frequency: Daily — 2, Weekly — 5, Occasionally — 6, Rarely — 1.</p>
            <p>Premium enough for users to pay for: Yes — 4, Maybe — 9, Not Yet — 1.</p>
            <p>These are stated intentions and opinions, not observed retention or proof that people would pay. A separate “premium and well-designed” rating received 11/14 high ratings.</p>
          </div>
        </details>
        <p className="text-sm leading-6 text-[#aaa]">The submitted report summarises 13 final testers; this panel uses the attached survey export with 14 responses.</p>
      </div>
    );
  }

  if (id === 'explorations') {
    const phases = [
      ['phase-idea', 'Narrowing the idea'],
      ['phase-screens', 'Exploring screens'],
      ['phase-journey', 'Testing the journey'],
      ['phase-layout', 'Returning to the layout'],
    ] as const;
    return (
      <div className="space-y-8">
        <p className="text-sm leading-6 text-[#aaa]">I started with a broad idea for an art platform. Sketching, feedback and prototypes helped me narrow the scope and work out how browsing would connect to the gallery.</p>
        <nav className="flex flex-wrap gap-2">
          {phases.map(([phaseId, label]) => (
            <button key={phaseId} type="button" onClick={() => jumpTo(phaseId)} className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-white hover:border-[#FF4B4B]">
              {label}
            </button>
          ))}
        </nav>
        <Phase id="phase-idea" title="Narrowing the idea">
          <p className="text-xs uppercase tracking-wide text-[#aaa]">Early concept</p>
          <ReportFigure file="32" caption="Figure 32. The first sketch combined education, games, social features and selling art. It helped make the idea concrete, but the scope needed to become much smaller." />
          <ReportFigure file="33" caption="Figure 33. I explored the idea with peers and mapped the possible features. The final MVP focused on creating, sharing and exploring galleries rather than serving every use case." />
          <ReportFigure file="34" caption="Figure 34. Early feature prioritisation. I grouped features by how often they might be used and how many users they would serve. Gallery browsing and artwork viewing became priorities. AR filters and workshops stayed outside the MVP." />
        </Phase>
        <Phase id="phase-screens" title="Exploring screens">
          <ReportFigure file="35" caption="Figure 35. Quick sketches explored different ways to browse art and enter the gallery. These were options to discuss, not a fixed plan." />
          <ReportFigure file="36" caption="Figure 36. Peer voting helped choose which ideas to develop first. The selected ideas informed the initial home layout, artwork listing and gallery entry." />
          <ReportFigure file="37" caption="Figure 37. I turned the selected ideas into rough screens and tried different layouts. These drawings connected the early concept to the paper prototype." />
        </Phase>
        <Phase id="phase-journey" title="Testing the journey">
          <p className="text-xs uppercase tracking-wide text-[#aaa]">Kept in the final flow</p>
          <ReportFigure file="39" caption="Figure 39. A closer look at the paper screens. People could try browsing, entering a gallery and viewing artwork. Feedback showed unclear hierarchy, competing features and uncertainty about gallery entry." />
          <ReportFigure file="40" caption="Figure 40. I mapped paths for guests, artists and buyers to check access and navigation. Some early branches, including payment, stayed concepts rather than finished features." />
          <ReportFigure file="41" caption="Figure 41. This mapped how actions connected across the web interface and the gallery. The later build simplified parts of this early flow." />
        </Phase>
        <Phase id="phase-layout" title="Returning to the layout">
          <p className="text-xs uppercase tracking-wide text-[#aaa]">Refined</p>
          <ReportFigure file="42" caption="Figure 42. The digital prototype made the navigation and layout easier to test. Feedback showed that the home screen felt crowded and required too much scrolling." />
          <ReportFigure file="43" caption="Figure 43. I returned to paper to rethink spacing, content groups and the placement of gallery entry." />
          <p className="text-sm leading-6 text-white">The mobile work established the main journeys. Testing the more detailed screens then showed that the artwork and 3D gallery needed more space.</p>
        </Phase>
      </div>
    );
  }

  if (id === 'pivot') {
    return (
      <div className="space-y-5">
        <p className="text-sm leading-6 text-[#aaa]">The later survey of 14 responses happened after this decision. It did not cause the move to desktop.</p>
        <h3 className="text-base font-semibold text-white">I started with mobile</h3>
        <ReportFigure file="42" caption="Figure 42. Mid-fidelity mobile screens." />
        <ReportFigure file="44" caption="Figure 44. High-fidelity mobile screens. Navigation was familiar. The artwork stayed small." />
        <ReportFigure file="45" caption="Figure 45. Prototype idea. This artwork view still offers a purchase and a profile. The finished gallery does not do either from that view." />
        <h3 className="text-base font-semibold text-white">Testing exposed the limits</h3>
        <p className="text-sm leading-6 text-[#aaa]">The report describes moderated mobile mid-fidelity testing with three users. The artwork cards were small, the home content was crowded, scrolling repeated, and the gallery view was cramped.</p>
        <blockquote className="border-l-2 border-[#FF4B4B] pl-3 text-sm leading-6 text-white">“It’s cool, but feels too zoomed in.”</blockquote>
        <blockquote className="border-l-2 border-[#FF4B4B] pl-3 text-sm leading-6 text-white">“Hard to appreciate the artwork on such a small screen.”</blockquote>
        <h3 className="text-base font-semibold text-white">I tried a web layout</h3>
        <ReportFigure file="46" caption="Figure 46. First web iteration. It still needed visual work, but the artwork and the space around it were larger." />
        <ReportFigure file="47" caption="Figure 47. Layout comparison. The web-style layout is shown at phone resolution. This is not a controlled test of a desktop against a phone." />
        <h3 className="text-base font-semibold text-white">I chose a desktop-first scope I could finish</h3>
        <p className="text-sm leading-6 text-[#aaa]">Desktop suited the gallery better and made Unity WebGL more practical for a solo project. I then refined the web interface in the browser.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl bg-[#1a1a1a] p-4">
            <h4 className="font-medium text-white">What I kept</h4>
            <ul className="mt-2 space-y-1 text-sm leading-6 text-[#aaa]">
              <li>Gallery discovery</li>
              <li>Artist profiles</li>
              <li>Upload and management</li>
              <li>Browsing that leads into the 3D room</li>
            </ul>
          </article>
          <article className="rounded-xl bg-[#1a1a1a] p-4">
            <h4 className="font-medium text-white">What I changed</h4>
            <ul className="mt-2 space-y-1 text-sm leading-6 text-[#aaa]">
              <li>Layout and spacing</li>
              <li>Where navigation sits</li>
              <li>Artwork scale</li>
              <li>The size of the gallery view</li>
            </ul>
          </article>
        </div>
      </div>
    );
  }

  if (id === 'testing') {
    const rounds = [
      ['Paper and mobile prototypes', 'Early flow, hierarchy and screen-space issues.'],
      ['Moderated mobile mid-fidelity testing', 'Three users, as reported.'],
      ['Working MVP session with a design student', 'Gallery entry, controls, upload and navigation.'],
      ['University testing', 'Hands-on use of the browser build and gallery.'],
      ['Remote MVP testing', 'A public URL and personal devices, followed by the final survey.'],
    ];
    const changes = [
      ['A first-time user did not understand click-and-drag camera control.', 'I added a visible Controls overlay.', 'Described in the submitted report', '63'],
      ['Fast rotations and unintended camera movement made navigation difficult.', 'I reduced sensitivity, added damping, used deliberate click-and-drag looking, and kept the camera from passing through walls.', 'Described in the submitted report', null],
      ['Loading did not show progress, and artwork appeared late.', 'I added loading feedback, placeholders and clearer messages.', 'Described in the submitted report', null],
      ['Creators were unsure where their uploads appeared.', 'I made the gallery details clearer and refreshed the room so uploaded work showed up.', 'Described in the submitted report', null],
      ['Category selection required scrolling to find the onboarding action.', 'I moved the button so it was easier to reach.', 'Described in the submitted report', null],
    ] as const;
    return (
      <div className="space-y-5">
        {rounds.map(([title, body]) => (
          <article key={title}>
            <h3 className="text-sm font-medium text-white">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-[#aaa]">{body}</p>
          </article>
        ))}
        {changes.map(([observation, change, status, figure]) => (
          <article key={observation} className="rounded-xl bg-[#1a1a1a] p-4">
            <p className="text-sm leading-6 text-[#aaa]"><span className="text-white">Observation. </span>{observation}</p>
            <p className="mt-2 text-sm leading-6 text-white"><span className="text-[#FF4B4B]">Change. </span>{change}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-[#aaa]">{status}</p>
            {figure && <div className="mt-3"><ReportFigure file={figure} caption="Figure 63. Camera controls from the submitted report. This is the implementation note, not a measured before-and-after test." /></div>}
          </article>
        ))}
        <ReportFigure file="62" caption="Early gallery blockout beside a later gallery build. This shows how the room developed. It does not by itself prove the camera change." />
        <p className="text-sm leading-6 text-[#aaa]">These sessions guided iterative changes. They were not a controlled before-and-after comparison.</p>
        <p className="text-sm leading-6 text-white">Next, I would test whether a new visitor can find a gallery, enter it and inspect an artwork without help.</p>
      </div>
    );
  }

  if (id === 'ia') {
    return (
      <div className="space-y-4 text-sm leading-6 text-[#aaa]">
        <p className="text-xs uppercase tracking-wide text-white">Early navigation concept</p>
        <p>Sign-up and log-in meet at Home. Email accounts verify the address. Google skips that step. An unfinished setup returns to onboarding. Logged-out phones cannot sign in.</p>
        <p>A visitor finds a gallery from Home or search, opens the card, and is in the room. Artwork details do not link to the artist. Close that view and use the gallery header. The shop’s artwork view can open a profile. Checkout does not take payment.</p>
        <p>My Gallery is the creator’s own room: upload into a wall slot, preview, then go live.</p>
        <VisitorFlow />
        <CreatorFlow />
        <AppMap />
      </div>
    );
  }

  if (id === 'design-system') {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-6 text-[#aaa]">Red is kept for actions and selected states so the artwork stays the brightest thing in the room. Dark surfaces sit behind it. Messages, notifications and the cart stay in the top bar so the sidebar can stay a short list of sections.</p>
        <ReportFigure file="49" caption="Figure 49. Colour sheet from the report." />
        <ReportFigure file="52" caption="Figure 52. Type sheet from the report. The display face is Tekio. Inter carries body text, navigation and controls." />
        <p className="text-sm leading-6 text-[#aaa]">I have not rechecked the current Figma variables against these sheets, and this is not an accessibility audit.</p>
      </div>
    );
  }

  if (id === 'competitors') {
    return (
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl bg-[#1a1a1a] p-4">
            <h3 className="font-semibold text-white">2D art platforms</h3>
            <p className="mt-2 text-sm text-[#aaa]">Behance · ArtStation · Pinterest</p>
          </article>
          <article className="rounded-xl bg-[#1a1a1a] p-4">
            <h3 className="font-semibold text-white">3D platforms</h3>
            <p className="mt-2 text-sm text-[#aaa]">Spatial · OnCyber · Arrival · ArtSteps</p>
          </article>
        </div>
        <p className="text-sm leading-6 text-[#aaa]">My 2025 review. Not a test with participants.</p>
        <div className="hidden md:grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)] md:gap-3">
          {competitorHeaders.map((header) => (
            <p key={header} className="text-sm font-semibold text-white">{header}</p>
          ))}
          {competitors.flatMap((row) => row.map((cell, index) => (
            <p key={`${row[0]}-${index}`} className={`min-w-0 border-t border-white/10 pt-3 text-sm leading-5 ${index === 0 ? 'font-medium text-white' : 'text-[#aaa]'}`}>{cell}</p>
          )))}
        </div>
        <div className="space-y-3 md:hidden">
          {competitors.map((row) => (
            <article key={row[0]} className="rounded-xl bg-[#1a1a1a] p-3">
              {competitorHeaders.map((field, index) => (
                <p key={field} className="mt-2 text-sm leading-5 first:mt-0">
                  <span className="font-medium text-[#FF4B4B]">{field}. </span>
                  <span className="text-white">{row[index]}</span>
                </p>
              ))}
            </article>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <article>
            <h3 className="font-semibold text-white">What I borrowed</h3>
            <ul className="mt-2 space-y-1 text-sm leading-6 text-[#aaa]">
              <li>Familiar web browsing</li>
              <li>Artist details next to the work</li>
              <li>Large artwork previews</li>
              <li>WASD to move</li>
            </ul>
          </article>
          <article>
            <h3 className="font-semibold text-white">What I left out</h3>
            <ul className="mt-2 space-y-1 text-sm leading-6 text-[#aaa]">
              <li>An overloaded interface</li>
              <li>A crypto-first frame</li>
              <li>An unclear way into the room</li>
              <li>An open-ended world</li>
            </ul>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-sm leading-6 text-[#aaa]">
      <p>Logged-out phones cannot sign in. The 3D room was not built as a phone experience.</p>
      <p>Checkout does not take payment. Cropping, room themes and an accessibility audit were outside this MVP.</p>
      <p>The next study is a first minute with people who have not seen the project: can they say what it is, find a gallery, enter the room and open a piece.</p>
    </div>
  );
}
