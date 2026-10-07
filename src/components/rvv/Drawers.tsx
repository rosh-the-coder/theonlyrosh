import { AppMap, ClarityCompare, PlatformPreference } from '@/components/rvv/Diagrams';
import ReportFigure from '@/components/rvv/ReportFigure';
import { competitorHeaders, competitors, metrics, type PanelId } from '@/data/rvvCaseStudy';

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

export default function PanelBody({ id }: { id: PanelId }) {
  if (id === 'survey') {
    return (
      <div className="space-y-6">
        <p className="text-sm leading-6 text-[#aaa]">These are the answers behind the three counts on the page, plus two questions the hero does not show.</p>
        {metrics.map((metric) => (
          <div key={metric.figure}>
            <p className="text-lg font-semibold text-white">{metric.figure} {metric.label}</p>
            <p className="mt-1 text-sm text-[#aaa]">{metric.support}</p>
            <div className="mt-2"><Dots filled={metric.filled} /></div>
          </div>
        ))}
        <div>
          <p className="font-semibold text-white">Would recommend it</p>
          <p className="mt-1 text-sm text-[#aaa]">13 of 14 rated likelihood 4 or 5 out of 5.</p>
        </div>
        <div>
          <p className="font-semibold text-white">Gallery walkthrough</p>
          <div className="mt-2 flex h-7 overflow-hidden rounded-lg" aria-hidden>
            <div className="bg-[#FF4B4B]" style={{ width: `${(8 / 14) * 100}%` }} />
            <div className="bg-[#737373]" style={{ width: `${(5 / 14) * 100}%` }} />
            <div className="bg-[#272727]" style={{ width: `${(1 / 14) * 100}%` }} />
          </div>
          <p className="mt-2 text-sm text-[#aaa]">8 called it smooth · 5 acceptable · 1 laggy</p>
        </div>
        <div>
          <p className="font-semibold text-white">Where it still snagged</p>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-[#aaa]">
            <li>Some people did not grasp the product on the first look.</li>
            <li>Finding a profile was not always obvious.</li>
            <li>Choosing categories during onboarding got in the way.</li>
            <li>Loading depended on the computer.</li>
            <li>One person found the red and black visually intense.</li>
            <li>People wanted to crop or adjust an upload, and to customise the room.</li>
          </ul>
        </div>
        <p className="text-sm leading-6 text-[#aaa]">Post-prototype survey · 14 responses. Self-reported. Not an observed task-success study. The submitted report counted 13 responses; the sheet I used later has 14.</p>
        <ClarityCompare />
      </div>
    );
  }

  if (id === 'competitors') {
    return (
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl bg-[#1a1a1a] p-4">
            <h3 className="font-semibold text-white">2D creative platforms</h3>
            <p className="mt-2 text-sm text-[#aaa]">Behance · ArtStation · Pinterest</p>
          </article>
          <article className="rounded-xl bg-[#1a1a1a] p-4">
            <h3 className="font-semibold text-white">Immersive platforms</h3>
            <p className="mt-2 text-sm text-[#aaa]">Spatial · OnCyber · Arrival · ArtSteps</p>
          </article>
        </div>
        <p className="text-sm leading-6 text-[#aaa]">My 2025 review. Not a test with participants, and not a claim about those products today.</p>
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
              <li>Artist metadata next to the work</li>
              <li>Large artwork previews</li>
              <li>WASD as a known way to move</li>
            </ul>
          </article>
          <article>
            <h3 className="font-semibold text-white">What I left behind</h3>
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

  if (id === 'explorations') {
    return (
      <div className="space-y-5">
        <ReportFigure file="38" caption="Paper screens. The extra step before the room is what I cut." />
        <p className="text-sm leading-6 text-[#aaa]">It told me people could miss the room entirely. The gallery card became the entry.</p>
        <ReportFigure file="43" caption="Sketches after the mid-fidelity round. Entry was still being redrawn." />
        <p className="text-sm leading-6 text-[#aaa]">It told me the path was still a diagram, not a habit. I kept redrawing the first click until it was a card.</p>
        <p className="text-sm leading-6 text-[#aaa]">I also sketched with peers and watched early gallery tasks. I did not count those sessions as a formal sample.</p>
      </div>
    );
  }

  if (id === 'pivot') {
    return (
      <div className="space-y-5">
        <PlatformPreference />
        <p className="text-sm leading-6 text-[#aaa]">Seven of nine people preferred the web for a role-playing 3D gallery. That was one question, not a vote on the whole product. The later survey of 14 people did not cause this decision. The pivot was already underway from the cramped phone screens, the mid-fidelity round of three, and what a solo Unity build could hold.</p>
        <ReportFigure file="42" caption="What three people tried. A gallery-information stop sat in front of the room." />
        <ReportFigure file="45" caption="The mobile room. This artwork view still offers a purchase and a profile. The current gallery does neither from that view." />
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl bg-[#1a1a1a] p-4">
            <h3 className="font-semibold text-white">Kept from the phone</h3>
            <p className="mt-2 text-sm leading-6 text-[#aaa]">The destinations, the card as a preview, and the idea that social and profile sit beside the art.</p>
          </article>
          <article className="rounded-xl bg-[#1a1a1a] p-4">
            <h3 className="font-semibold text-white">Changed on desktop</h3>
            <p className="mt-2 text-sm leading-6 text-[#aaa]">Scale, density, and a viewport large enough for the room. Logged-out phones still cannot sign in.</p>
          </article>
        </div>
      </div>
    );
  }

  if (id === 'testing') {
    const rounds = [
      ['Paper and low-fi with peers', 'Entry into the room was hard to follow.'],
      ['Mobile mid-fidelity, three people', 'Cards and the room felt cramped. Separate from the later survey.'],
      ['Live browser and Unity passes', 'Camera and loading were iterated in the build. I have not re-checked that Unity project in this website repo.'],
      ['Later MVP rounds', 'The submitted report counted 13 people. The survey sheet used on this page has 14 responses. They are not the same study.'],
    ];
    return (
      <div className="space-y-4">
        {rounds.map(([title, body]) => (
          <article key={title} className="rounded-xl bg-[#1a1a1a] p-4">
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#aaa]">{body}</p>
          </article>
        ))}
        <ReportFigure file="62" caption="Early blockout beside a later room. There is no before-and-after success rate." />
        <p className="text-sm leading-6 text-[#aaa]">Gallery-card entry is in the current product. The controls overlay and the loading states are described in the finished report. I would re-test both with people who have not seen the project.</p>
      </div>
    );
  }

  if (id === 'ia') {
    return (
      <div className="space-y-4 text-sm leading-6 text-[#aaa]">
        <p>Sign-up and log-in join at Home. Email accounts verify the address. Google skips that step. An unfinished setup returns to onboarding.</p>
        <p>A visitor finds a gallery from Home or search, opens the card, and is in the room. Artwork details do not link to the artist. Close that view and use the gallery header. The shop’s artwork view can open a profile. Checkout does not take payment.</p>
        <p>My Gallery is the creator’s own room: upload into a wall slot, preview, then GO LIVE. Those controls share one screen.</p>
        <AppMap />
      </div>
    );
  }

  if (id === 'design-system') {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-6 text-[#aaa]">Red is reserved for the action. Dark surfaces keep the artwork as the colour. Messages, notifications and cart stay out of the left rail so the five destinations stay easy to scan.</p>
        <ReportFigure file="49" caption="Palette sheet from the report." />
        <ReportFigure file="52" caption="Type sheet from the report. It says Tekio. This site uses Teko." />
        <ReportFigure file="53" caption="Hierarchy sheet from the report." />
        <p className="text-sm leading-6 text-[#aaa]">These sheets are the report’s record. I have not confirmed the current Figma variables against them, and this is not an accessibility audit.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-sm leading-6 text-[#aaa]">
      <p>The next study is a first minute with people who have not seen the project: can they say what it is, find a gallery, enter the room and open a piece.</p>
      <p>I would also test artwork editing, room themes, older hardware, and a real accessibility pass before calling the product finished.</p>
    </div>
  );
}
