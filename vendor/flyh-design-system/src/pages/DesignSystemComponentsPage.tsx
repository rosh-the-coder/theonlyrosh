import { ArrowRight, Component, FlaskConical, Layers3, Palette, Pipette, Save, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Tag } from '@/components/ui/tag'
import { Textarea } from '@/components/ui/textarea'
import './design-system.css'

const specimen = 'rounded-surface border border-border bg-surface p-5'

export function DesignSystemComponentsPage() {
  return (
    <div className="ds-page">
      <aside className="ds-sidebar" aria-label="Design system navigation">
        <div className="ds-wordmark">flyh<span>.ai</span></div>
        <nav className="ds-nav">
          <Link className="ds-nav__item" to="/">
            <Palette size={16} strokeWidth={1.8} />
            Foundations
          </Link>
          <Link className="ds-nav__item ds-nav__item--selected" to="/components" aria-current="page">
            <Component size={16} strokeWidth={1.8} />
            Components
          </Link>
          <Link className="ds-nav__item" to="/patterns">
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
            <h1>Components</h1>
            <p>Buttons and form controls for calm, creator-respecting operational workflows.</p>
          </header>

          <section className="ds-section" aria-labelledby="buttons-title">
            <SectionHeading index="01" title="Buttons" id="buttons-title" description="Actions use hierarchy, direct language and icons only where they improve comprehension." />
            <div className={`${specimen} grid gap-6`}>
              <SpecimenRow label="Variants">
                <Button>Continue</Button>
                <Button variant="secondary">Save draft</Button>
                <Button variant="ghost">Cancel</Button>
                <Button variant="destructive" leadingIcon={<Trash2 aria-hidden="true" />}>Delete permanently</Button>
                <Button variant="destructive-outline" leadingIcon={<Trash2 aria-hidden="true" />}>Delete draft</Button>
              </SpecimenRow>
              <SpecimenRow label="Sizes and icons">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg" trailingIcon={<ArrowRight aria-hidden="true" />}>Large action</Button>
              </SpecimenRow>
              <SpecimenRow label="System states">
                <Button>Prepare listing</Button>
                <Button loading loadingLabel="Preparing…">Prepare listing</Button>
                <Button disabled>Continue</Button>
                <Button variant="secondary" disabled>Save draft</Button>
              </SpecimenRow>
            </div>
          </section>

          <section className="ds-section" aria-labelledby="density-title">
            <SectionHeading index="02" title="Control size hierarchy" id="density-title" description="One coherent hierarchy for compact operations, normal workflow controls and exceptional actions." />
            <div className="divide-y divide-border-subtle border-y border-border-subtle">
              <SizeTier
                name="Compact"
                usage="Toolbars, filters, table actions and dense project controls"
                detail="32h · 10px pad · 13/16 type · 14px icon · 6px gap · 6px radius"
                size="sm"
              />
              <SizeTier
                name="Default"
                usage="Normal buttons, form controls and ordinary workflow actions"
                detail="36h · 12px pad · 13/18 type · 16px icon · 6px gap · 6px radius"
                size="default"
              />
              <SizeTier
                name="Prominent"
                usage="Important entry, major continue and final handoff actions"
                detail="40h · 16px pad · 14/20 type · 16px icon · 7px gap · 8px radius"
                size="lg"
              />
            </div>
          </section>

          <section className="ds-section" aria-labelledby="inputs-title">
            <SectionHeading index="03" title="Inputs" id="inputs-title" description="A compact 36px operational control language with explicit helper and validation text." />
            <div className="grid gap-x-6 border-y border-border-subtle md:grid-cols-2">
              <div className="py-4">
                <Field>
                  <FieldLabel htmlFor="input-default">Default</FieldLabel>
                  <Input id="input-default" defaultValue="Morning Study" />
                </Field>
              </div>
              <div className="py-4">
                <Field>
                  <FieldLabel htmlFor="input-placeholder">Placeholder</FieldLabel>
                  <Input id="input-placeholder" placeholder="Enter a listing title" />
                </Field>
              </div>
              <div className="py-4">
                <Field>
                  <FieldLabel htmlFor="input-focus">Focused appearance</FieldLabel>
                  <Input id="input-focus" defaultValue="Digital wall art" className="border-border-interactive ring-2 ring-focus-ring" />
                </Field>
              </div>
              <div className="py-4">
                <Field>
                  <FieldLabel htmlFor="input-disabled">Disabled</FieldLabel>
                  <Input id="input-disabled" defaultValue="Prepared by flyh.ai" disabled />
                </Field>
              </div>
              <div className="py-4">
                <Field>
                  <FieldLabel htmlFor="input-error" required>Validation example</FieldLabel>
                  <Input id="input-error" defaultValue="Morning Study printable wall art title that needs review" aria-invalid="true" aria-describedby="input-error-message" />
                  <FieldError id="input-error-message">Keep the title concise and remove repeated phrases.</FieldError>
                </Field>
              </div>
              <div className="py-4">
                <Field>
                  <div className="flex items-center justify-between gap-4">
                    <FieldLabel htmlFor="description">Marketplace description</FieldLabel>
                    <span className="type-meta text-text-muted">118 / 500</span>
                  </div>
                  <Textarea id="description" defaultValue="Bring calm, minimal character to your space with Morning Study, an original digital wall-art printable created for quiet interiors." aria-describedby="description-help" />
                  <FieldDescription id="description-help">Describe the artwork accurately. Review all claims before handoff.</FieldDescription>
                </Field>
              </div>
            </div>
          </section>

          <section className="ds-section" aria-labelledby="selection-title">
            <SectionHeading index="04" title="Selection" id="selection-title" description="Native controls retain familiar keyboard and platform behaviour." />
            <div className="grid gap-4 lg:grid-cols-2">
              <div className={specimen}>
                <Field>
                  <FieldLabel htmlFor="target-buyer">Target buyer</FieldLabel>
                  <Select id="target-buyer" defaultValue="Home decor buyer">
                    <option>Home decor buyer</option>
                    <option>Gift buyer</option>
                    <option>Student or office decor buyer</option>
                    <option>Art collector</option>
                    <option>Other</option>
                  </Select>
                  <FieldDescription>Choose the audience that best matches this listing direction.</FieldDescription>
                </Field>
              </div>
              <div className={`${specimen} grid gap-4`}>
                <Checkbox label="Include a size guide in the listing images" defaultChecked />
                <div className="rounded-surface border border-border-strong bg-canvas p-4">
                  <p className="mb-3 type-label text-text-secondary">Creator declaration</p>
                  <Checkbox label="I confirm that I created this artwork or have the rights required to use and sell it." />
                </div>
              </div>
            </div>
          </section>

          <section className="ds-section" aria-labelledby="tags-title">
            <SectionHeading index="05" title="Tags" id="tags-title" description="Compact neutral metadata that does not compete with primary actions." />
            <div className="flex flex-wrap gap-2 border-y border-border-subtle py-4">
              <Tag onRemove={() => undefined}>cat art</Tag>
              <Tag onRemove={() => undefined}>minimalist</Tag>
              <Tag>wall decor</Tag>
            </div>
          </section>

          <section className="ds-section" aria-labelledby="composition-title">
            <SectionHeading index="06" title="Form composition" id="composition-title" description="A compact commerce form specimen combining the control foundations." />
            <article className={`${specimen} max-w-[760px]`}>
              <div className="border-b border-border pb-4">
                <h3 className="type-section text-text-primary">Listing information</h3>
                <p className="mt-1 type-body text-text-secondary">Review the marketplace information before continuing.</p>
              </div>
              <div className="grid gap-5 py-5">
                <Field>
                  <FieldLabel htmlFor="listing-title" required>Listing title</FieldLabel>
                  <Input id="listing-title" defaultValue="Morning Study Minimalist Cat Printable Wall Art" aria-describedby="listing-title-help" />
                  <FieldDescription id="listing-title-help">Use clear, accurate language. 51 / 140 characters.</FieldDescription>
                </Field>
                <Field>
                  <div className="flex justify-between gap-4">
                    <FieldLabel htmlFor="listing-description">Description</FieldLabel>
                    <span className="type-meta text-text-muted">146 / 500</span>
                  </div>
                  <Textarea id="listing-description" defaultValue="An original minimalist cat illustration for calm home interiors. This digital wall-art printable is supplied as a downloadable product." />
                </Field>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="listing-buyer">Target buyer</FieldLabel>
                    <Select id="listing-buyer" defaultValue="Home decor buyer">
                      <option>Home decor buyer</option>
                      <option>Gift buyer</option>
                      <option>Student or office decor buyer</option>
                      <option>Art collector</option>
                      <option>Other</option>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="listing-tags">Tags</FieldLabel>
                    <Input id="listing-tags" defaultValue="cat art, minimalist, wall decor" aria-invalid="true" aria-describedby="tag-validation" />
                    <FieldError id="tag-validation">Add at least one product-format tag.</FieldError>
                  </Field>
                </div>
              </div>
              <footer className="flex flex-wrap justify-end gap-3 border-t border-border pt-4">
                <Button variant="secondary" leadingIcon={<Save aria-hidden="true" />}>Save draft</Button>
                <Button trailingIcon={<ArrowRight aria-hidden="true" />}>Continue</Button>
              </footer>
            </article>
          </section>

          <section className="ds-section" aria-labelledby="recommendation-title">
            <SectionHeading index="07" title="Recommendation vs decision" id="recommendation-title" description="System guidance is presented as evidence-bearing context, not as a locked creator choice." />
            <div className="grid max-w-[760px] gap-4 md:grid-cols-2">
              <article className="rounded-surface border border-border-strong bg-surface-subtle p-5">
                <p className="type-label text-text-secondary">Suggested price range</p>
                <p className="mt-2 type-page leading-8 text-text-primary">€8 – €12</p>
                <p className="mt-2 type-meta text-text-secondary">Based on the approved positioning and available demo signals.</p>
                <button type="button" className="mt-4 cursor-pointer border-0 bg-transparent p-0 type-action text-forest underline decoration-forest/35 underline-offset-4 hover:text-forest-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/25">View evidence</button>
              </article>
              <article className={specimen}>
                <Field>
                  <FieldLabel htmlFor="creator-price">Your price</FieldLabel>
                  <Input id="creator-price" inputMode="decimal" defaultValue="€9.50" aria-describedby="creator-price-help" />
                  <FieldDescription id="creator-price-help">You decide the final marketplace price.</FieldDescription>
                </Field>
              </article>
            </div>
          </section>

          <section className="ds-section" aria-labelledby="typography-calibration-title">
            <SectionHeading index="08" title="Typography hierarchy" id="typography-calibration-title" description="The selected Manrope hierarchy with tighter metadata reserved for genuinely dense information." />
            <TypographyHierarchySpecimen />
          </section>

          <section className="ds-section" aria-labelledby="surface-title">
            <SectionHeading index="09" title="Operational surface" id="surface-title" description="The selected crisp-tonal treatment for purposeful operational containers." />
            <OperationalSurface />
          </section>
        </div>
      </main>
    </div>
  )
}

type SectionHeadingProps = {
  index: string
  title: string
  id: string
  description: string
}

function SectionHeading({ index, title, id, description }: SectionHeadingProps) {
  return (
    <div className="ds-section__heading">
      <p className="ds-section__index">{index}</p>
      <div>
        <h2 id={id}>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}

function SpecimenRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 border-b border-border pb-6 last:border-b-0 last:pb-0 md:grid-cols-[120px_1fr]">
      <p className="pt-2 type-meta font-medium text-text-muted">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function SizeTier({ name, usage, detail, size }: { name: string; usage: string; detail: string; size: 'sm' | 'default' | 'lg' }) {
  return (
    <article className="grid gap-4 py-5 lg:grid-cols-[180px_1fr] lg:items-center">
      <div>
        <h3 className="type-item text-text-primary">{name}</h3>
        <p className="mt-1 type-meta text-text-muted">{detail}</p>
        <p className="mt-2 type-body text-text-secondary">{usage}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size={size}>Continue</Button>
        <Button size={size} variant="secondary">Save draft</Button>
        <Button size={size} variant="ghost">View evidence</Button>
        <Button size={size} variant="secondary">
          <Save aria-hidden="true" />
          Save
        </Button>
      </div>
    </article>
  )
}

function OperationalSurface() {
  return (
    <article className="max-w-[760px] rounded-surface border border-border-subtle bg-surface-subtle/55 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="type-section text-text-primary">Listing preparation</h3>
        </div>
        <span className="type-meta font-medium text-neutral">Prepared</span>
      </div>
      <div className="mt-4">
        <p className="type-item text-text-primary">Morning Study</p>
        <p className="mt-0.5 type-body text-text-secondary">Digital wall-art printable</p>
      </div>
      <dl className="mt-5 divide-y divide-border-subtle border-y border-border-subtle">
        <div className="flex items-center justify-between gap-4 py-3">
          <dt className="type-label text-text-secondary">Print files</dt>
          <dd className="type-body font-medium text-text-primary">5 prepared</dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-3">
          <dt className="type-label text-text-secondary">Marketplace metadata</dt>
          <dd className="type-body font-medium text-text-primary">Complete</dd>
        </div>
      </dl>
      <footer className="mt-4 flex items-center justify-between gap-3">
        <Button size="sm" variant="ghost">View details</Button>
        <Button size="sm" trailingIcon={<ArrowRight aria-hidden="true" />}>Continue</Button>
      </footer>
    </article>
  )
}

function TypographyHierarchySpecimen() {
  return (
    <article className="max-w-[760px] rounded-surface border border-border-subtle bg-surface-subtle/55 p-5 text-text-primary">
      <div className="flex items-start justify-between gap-4">
        <h3 className="type-section">Listing preparation</h3>
        <span className="type-meta-dense font-medium text-text-muted">Prepared</span>
      </div>
      <div className="mt-4 border-b border-border-subtle pb-4">
        <p className="type-item">Morning Study</p>
        <p className="mt-1 type-meta-dense font-medium text-text-muted">5 print files prepared</p>
        <p className="mt-3 type-body text-text-secondary">Marketplace details are ready for review.</p>
      </div>
      <div className="mt-4">
        <Field>
          <FieldLabel htmlFor="typography-target-buyer">Target buyer</FieldLabel>
          <Input id="typography-target-buyer" defaultValue="Home decor buyer" />
        </Field>
      </div>
      <Button className="mt-4" trailingIcon={<ArrowRight aria-hidden="true" />}>Continue</Button>
      <dl className="mt-5 grid gap-x-6 gap-y-2 border-t border-border-subtle pt-4 type-meta text-text-secondary sm:grid-cols-2">
        <div className="flex justify-between gap-3"><dt>Heading</dt><dd>16 / 600 / 20</dd></div>
        <div className="flex justify-between gap-3"><dt>Item title</dt><dd>14 / 600 / 20</dd></div>
        <div className="flex justify-between gap-3"><dt>Body</dt><dd>13 / 400 / 19</dd></div>
        <div className="flex justify-between gap-3"><dt>Label</dt><dd>12 / 500 / 16</dd></div>
        <div className="flex justify-between gap-3"><dt>Dense metadata</dt><dd>11 / 500 / 14</dd></div>
        <div className="flex justify-between gap-3"><dt>Control / action</dt><dd>13 / 400–500 / 18</dd></div>
      </dl>
    </article>
  )
}
