import { Component, FlaskConical, Layers3, Palette, Pipette } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge, type StatusBadgeStatus } from '@/components/ui/status-badge'
import { StageRail, type Stage } from '@/components/ui/stage-rail'
import { CheckRow, type CheckRowResult } from '@/components/ui/check-row'
import { Button } from '@/components/ui/button'
import { ActivityItem, type ActivityActor } from '@/components/ui/activity-item'
import './design-system.css'

const statuses: StatusBadgeStatus[] = [
  'draft',
  'working',
  'needs-approval',
  'blocked',
  'verified',
  'ready',
]

const projectStates: Array<{ context: string; detail: string; status: StatusBadgeStatus }> = [
  { context: 'Artwork uploaded', detail: 'Product setup has not started', status: 'draft' },
  { context: 'Preparing print files', detail: 'Generating marketplace-ready sizes', status: 'working' },
  { context: 'Product setup', detail: 'Creator review is required to continue', status: 'needs-approval' },
  { context: 'Print file package', detail: 'A required landscape file is missing', status: 'blocked' },
  { context: 'Listing checks', detail: 'Quality and policy checks passed', status: 'verified' },
  { context: 'Marketplace handoff', detail: 'The listing package can proceed', status: 'ready' },
]

const currentStages: Stage[] = ['setup', 'prepare', 'merchandise', 'verify', 'ready']

const checkResults: Array<{ result: CheckRowResult; title: string; description: string }> = [
  { result: 'pass', title: 'Required print files', description: 'All required print-file formats are present.' },
  { result: 'warning', title: 'Tag count', description: 'Review tag relevance before marketplace handoff.' },
  { result: 'action-required', title: 'Required landscape file', description: 'A landscape print file is missing.' },
]

const actorExamples: Array<{ actor: ActivityActor; title: string; timestamp: string }> = [
  { actor: 'creator', title: 'Approved recommended setup', timestamp: '10:41' },
  { actor: 'flyh', title: 'Prepared listing fields', timestamp: '10:42' },
  { actor: 'system', title: 'Print-file package updated', timestamp: '10:43' },
]

const activityHistory: Array<{ actor: ActivityActor; title: string; timestamp: string; description?: string }> = [
  { actor: 'creator', title: 'Uploaded Morning Study', timestamp: '10:38' },
  { actor: 'creator', title: 'Confirmed artwork rights declaration', timestamp: '10:39' },
  { actor: 'creator', title: 'Approved recommended setup', timestamp: '10:41', description: 'Digital wall-art printable' },
  { actor: 'flyh', title: 'Prepared listing fields', timestamp: '10:42', description: 'Title, description and tags prepared' },
  { actor: 'flyh', title: 'Completed quality review', timestamp: '10:43', description: '5 passed · 1 action required' },
  { actor: 'creator', title: 'Approved proposed recovery', timestamp: '10:46' },
  { actor: 'flyh', title: 'Re-ran verification', timestamp: '10:47' },
  { actor: 'system', title: 'Project became ready for marketplace handoff', timestamp: '10:48' },
]

export function DesignSystemPatternsPage() {
  return (
    <div className="ds-page">
      <aside className="ds-sidebar" aria-label="Design system navigation">
        <div className="ds-wordmark">flyh<span>.ai</span></div>
        <nav className="ds-nav">
          <Link className="ds-nav__item" to="/">
            <Palette size={16} strokeWidth={1.8} />
            Foundations
          </Link>
          <Link className="ds-nav__item" to="/components">
            <Component size={16} strokeWidth={1.8} />
            Components
          </Link>
          <Link className="ds-nav__item ds-nav__item--selected" to="/patterns" aria-current="page">
            <Layers3 size={16} strokeWidth={1.8} />
            Patterns
          </Link>
          <Link className="ds-nav__item" to="/colors">
            <Pipette size={16} strokeWidth={1.8} />
            Color Lab
          </Link>
          <Link className="ds-nav__item" to="/studies">
            <FlaskConical size={16} strokeWidth={1.8} />
            Visual Studies
          </Link>
        </nav>
        <p className="ds-sidebar__note">Internal visual review</p>
      </aside>

      <main className="ds-canvas">
        <div className="ds-content">
          <header className="ds-page-header">
            <p className="ds-kicker">Design system</p>
            <h1>Patterns</h1>
            <p>Operational patterns combine foundation primitives into repeatable product language.</p>
          </header>

          <section className="ds-section" aria-labelledby="status-badge-title">
            <div className="ds-section__heading">
              <p className="ds-section__index">01</p>
              <div>
                <h2 id="status-badge-title">StatusBadge</h2>
                <p>Compact project and output states, distinct from workflow stages.</p>
              </div>
            </div>

            <div className="grid gap-8">
              <div>
                <h3 className="type-label text-text-secondary">Canonical statuses</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {statuses.map((status) => <StatusBadge key={status} status={status} />)}
                </div>
              </div>

              <div className="max-w-[760px] divide-y divide-border-subtle border-y border-border-subtle">
                {projectStates.map((item) => (
                  <div className="grid min-h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-2" key={item.status}>
                    <div className="min-w-0">
                      <p className="type-body font-medium text-text-primary">{item.context}</p>
                      <p className="mt-0.5 type-meta text-text-secondary">{item.detail}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>

              <div className="max-w-[760px] rounded-surface border border-border-subtle bg-surface-subtle p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="type-section text-text-primary">Morning Study</h3>
                    <p className="mt-1 type-meta text-text-secondary">Digital wall-art printable</p>
                  </div>
                  <StatusBadge status="needs-approval" />
                </div>
              </div>
            </div>
          </section>

          <section className="ds-section" aria-labelledby="stage-rail-title">
            <div className="ds-section__heading">
              <p className="ds-section__index">02</p>
              <div>
                <h2 id="stage-rail-title">StageRail</h2>
                <p>Canonical workflow position, separate from the project’s current operational status.</p>
              </div>
            </div>

            <div className="grid gap-8">
              <div className="max-w-[880px] divide-y divide-border-subtle border-y border-border-subtle">
                {currentStages.map((stage) => (
                  <div className="grid gap-3 py-4 lg:grid-cols-[120px_minmax(0,1fr)] lg:items-center" key={stage}>
                    <p className="type-meta font-medium capitalize text-text-secondary">Current: {stage}</p>
                    <StageRail currentStage={stage} />
                  </div>
                ))}
              </div>

              <div className="max-w-[880px] rounded-surface border border-border-subtle bg-surface-subtle p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="type-section text-text-primary">Morning Study</h3>
                    <p className="mt-1 type-meta text-text-secondary">Digital wall-art printable</p>
                  </div>
                  <StatusBadge status="needs-approval" />
                </div>
                <StageRail className="mt-5" currentStage="prepare" />
              </div>
            </div>
          </section>

          <section className="ds-section" aria-labelledby="check-row-title">
            <div className="ds-section__heading">
              <p className="ds-section__index">03</p>
              <div>
                <h2 id="check-row-title">CheckRow</h2>
                <p>Individual verification results for compact, repeatable QA checklists.</p>
              </div>
            </div>

            <div className="grid gap-8">
              <div>
                <h3 className="type-label text-text-secondary">Canonical results</h3>
                <div className="mt-3 max-w-[760px] divide-y divide-border-subtle border-y border-border-subtle">
                  {checkResults.map((check) => <CheckRow key={check.result} {...check} />)}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-baseline justify-between gap-4">
                  <h3 className="type-section text-text-primary">Verify checklist</h3>
                  <p className="type-meta text-text-muted">6 checks</p>
                </div>
                <div className="max-w-[880px] divide-y divide-border-subtle border-y border-border-subtle">
                  <CheckRow
                    result="pass"
                    title="Rights declaration recorded"
                    description="We recorded the creator’s rights declaration."
                  />
                  <CheckRow
                    result="pass"
                    title="Listing title length"
                    description="112 of 140 characters."
                  />
                  <CheckRow
                    result="warning"
                    title="Tag count"
                    description="13 tags supplied; review relevance before handoff."
                  />
                  <CheckRow
                    result="action-required"
                    title="Required landscape file"
                    description="A required landscape print file is missing."
                    action={<Button size="sm" variant="secondary">Review</Button>}
                  />
                  <CheckRow
                    result="pass"
                    title="Required mockups"
                    description="Three marketplace mockups are present."
                  />
                  <CheckRow
                    result="pass"
                    title="Listing description"
                    description="The required listing description is present."
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="ds-section" aria-labelledby="activity-item-title">
            <div className="ds-section__heading">
              <p className="ds-section__index">04</p>
              <div>
                <h2 id="activity-item-title">ActivityItem</h2>
                <p>Traceable project events that distinguish creator decisions, flyh operations and system changes.</p>
              </div>
            </div>

            <div className="grid gap-8">
              <div>
                <h3 className="type-label text-text-secondary">Canonical actors</h3>
                <ol className="mt-4 max-w-[680px]" aria-label="Canonical activity actors">
                  {actorExamples.map((item) => <ActivityItem key={item.actor} {...item} />)}
                </ol>
              </div>

              <div>
                <div className="mb-4 flex items-baseline justify-between gap-4">
                  <h3 className="type-section text-text-primary">Morning Study activity</h3>
                  <p className="type-meta text-text-muted">Today</p>
                </div>
                <ol className="max-w-[760px]" aria-label="Morning Study activity history">
                  {activityHistory.map((item, index) => <ActivityItem key={`${item.timestamp}-${index}`} {...item} />)}
                </ol>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
