import { Component, FlaskConical, Layers3, Palette, Pipette } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import primaryArtwork from '../assets/study-placeholder.svg'
import './design-system.css'
import './design-system-studies.css'

const decisionStudyData = {
  project: 'Morning Study',
  context: 'Digital wall-art printable',
  section: 'Recommended setup',
  recommendation: 'Digital wall-art printable',
  price: '€12–€18',
  rationale: 'Best fit for the supplied artwork and intended home-decor buyer.',
  evidence: [
    { source: 'Creator input', detail: 'Intended for a calm home-decor buyer.' },
    { source: 'Seeded demo signal', detail: 'Digital wall-art printable direction.' },
    { source: 'Estimate', detail: 'Suggested price range of €12–€18.' },
  ],
  preparation: ['Listing fields', 'File package preparation', 'Quality review'],
  preparationNote: 'Next in this workflow after approval.',
  decisionTitle: 'Your decision',
  decisionNote: 'Nothing proceeds until you approve this setup.',
} as const

export function DesignSystemStudiesPage() {
  return (
    <div className="ds-page studies-page">
      <aside className="ds-sidebar" aria-label="Design system navigation">
        <div className="ds-wordmark">flyh<span>.ai</span></div>
        <nav className="ds-nav">
          <Link className="ds-nav__item" to="/"><Palette size={16} strokeWidth={1.8} />Foundations</Link>
          <Link className="ds-nav__item" to="/components"><Component size={16} strokeWidth={1.8} />Components</Link>
          <Link className="ds-nav__item" to="/patterns"><Layers3 size={16} strokeWidth={1.8} />Patterns</Link>
          <Link className="ds-nav__item" to="/colors"><Pipette size={16} strokeWidth={1.8} />Color Lab</Link>
          <Link className="ds-nav__item ds-nav__item--selected" to="/studies" aria-current="page"><FlaskConical size={16} strokeWidth={1.8} />Visual Studies</Link>
        </nav>
        <p className="ds-sidebar__note">Internal visual review</p>
      </aside>

      <main className="ds-canvas">
        <div className="ds-content">
          <header className="ds-page-header">
            <p className="ds-kicker">Visual direction studies</p>
            <h1>Not production components</h1>
            <p>Controlled composition studies used to evaluate flyh’s human-agent interaction language.</p>
          </header>

          <section className="ds-section" aria-labelledby="decision-surface-study-title">
            <div className="ds-section__heading">
              <p className="ds-section__index">01</p>
              <div>
                <h2 id="decision-surface-study-title">Decision Surface</h2>
                <p>How should flyh present a grounded operational recommendation while leaving consequential authority with the creator?</p>
              </div>
            </div>

            <div className="studies-directions">
              <DirectionHeading label="A — Editorial Intelligence" thesis="A concise, evidence-backed briefing with calm authority." />
              <article className="study-surface study-editorial" aria-label="Editorial Intelligence decision surface study">
                <ProjectIdentity />
                <div className="study-editorial__lead">
                  <Recommendation />
                  <Artwork className="study-artwork--editorial" />
                </div>
                <div className="study-editorial__support">
                  <Evidence />
                  <Preparation />
                </div>
                <Decision />
              </article>

              <DirectionHeading label="B — Creative-Commerce Intelligence" thesis="Creator artwork anchors a recommendation entering commercial preparation." />
              <article className="study-surface study-commerce" aria-label="Creative-Commerce Intelligence decision surface study">
                <ProjectIdentity />
                <div className="study-commerce__lead">
                  <Artwork className="study-artwork--commerce" />
                  <Recommendation />
                </div>
                <div className="study-commerce__support">
                  <Evidence />
                  <Preparation />
                </div>
                <Decision />
              </article>

              <DirectionHeading label="C — Operational Command" thesis="A structured operating layer makes evidence, next steps and approval explicit." />
              <article className="study-surface study-command" aria-label="Operational Command decision surface study">
                <ProjectIdentity />
                <div className="study-command__lead">
                  <Recommendation />
                  <Artwork className="study-artwork--command" />
                </div>
                <div className="study-command__support">
                  <Evidence />
                  <Preparation />
                </div>
                <Decision />
              </article>

              <DirectionHeading label="D — Creative Operational Workspace" thesis="Human creativity supplies the energy; flyh supplies clarity; the creator retains authority." />
              <article className="study-surface study-workspace" aria-label="Creative Operational Workspace decision surface study">
                <ProjectIdentity />
                <div className="study-workspace__lead">
                  <Artwork className="study-artwork--workspace" />
                  <div className="study-workspace__intelligence">
                    <Recommendation />
                    <Evidence />
                  </div>
                </div>
                <div className="study-workspace__operations">
                  <Preparation />
                </div>
                <Decision />
              </article>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function DirectionHeading({ label, thesis }: { label: string; thesis: string }) {
  return (
    <header className="study-direction-heading">
      <h3 className="type-section text-text-primary">{label}</h3>
      <p className="type-meta text-text-secondary">{thesis}</p>
    </header>
  )
}

function ProjectIdentity() {
  return (
    <header className="study-project">
      <div>
        <p className="type-meta text-text-muted">Project</p>
        <h3 className="type-page text-text-primary">{decisionStudyData.project}</h3>
      </div>
      <p className="type-meta text-text-secondary">{decisionStudyData.context}</p>
    </header>
  )
}

function Artwork({ className }: { className: string }) {
  return (
    <figure className={`study-artwork ${className}`}>
      <img src={primaryArtwork} alt="Placeholder for the study artwork. The original image was not included because its public rights are unconfirmed." />
      <figcaption className="type-meta-dense text-text-muted">Placeholder · original study artwork excluded</figcaption>
    </figure>
  )
}

function Recommendation() {
  return (
    <section className="study-recommendation">
      <p className="type-label text-text-secondary">{decisionStudyData.section}</p>
      <h4 className="type-section text-text-primary">{decisionStudyData.recommendation}</h4>
      <p className="type-body text-text-secondary">{decisionStudyData.rationale}</p>
      <div className="study-price">
        <span className="type-meta text-text-muted">Suggested price</span>
        <strong className="type-page text-text-primary">{decisionStudyData.price}</strong>
        <small className="type-meta text-text-muted">Estimate</small>
      </div>
    </section>
  )
}

function Evidence() {
  return (
    <section className="study-evidence">
      <h4 className="type-label text-text-primary">Why this recommendation</h4>
      <dl>
        {decisionStudyData.evidence.map((item) => (
          <div key={item.source}>
            <dt className="type-meta font-medium text-text-primary">{item.source}</dt>
            <dd className="type-meta text-text-secondary">{item.detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Preparation() {
  return (
    <section className="study-preparation">
      <h4 className="type-label text-text-primary">flyh will prepare after approval</h4>
      <p className="type-meta text-text-muted">{decisionStudyData.preparationNote}</p>
      <ul>
        {decisionStudyData.preparation.map((item) => <li className="type-meta text-text-secondary" key={item}>{item}</li>)}
      </ul>
    </section>
  )
}

function Decision() {
  return (
    <footer className="study-decision">
      <div>
        <h4 className="type-label text-text-primary">{decisionStudyData.decisionTitle}</h4>
        <p className="type-meta text-text-secondary">{decisionStudyData.decisionNote}</p>
      </div>
      <div className="study-decision__actions">
        <Button variant="secondary">Edit setup</Button>
        <Button>Approve setup</Button>
      </div>
    </footer>
  )
}
