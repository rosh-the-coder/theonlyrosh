import { Box, Component, FlaskConical, Layers3, Palette, Pipette } from 'lucide-react'
import { Link } from 'react-router-dom'
import './design-system.css'

const colourGroups = [
  {
    name: 'Shell',
    colours: [
      ['Shell', '#111613'],
      ['Shell Surface', '#181E1A'],
      ['Shell Selected', '#222A25'],
      ['Shell Border', '#29302C'],
      ['Shell Text', '#F2F4F2'],
      ['Shell Muted', '#949D97'],
    ],
  },
  {
    name: 'Workspace',
    colours: [
      ['Canvas', '#F7F6F2'],
      ['Surface', '#FFFFFF'],
      ['Subtle Surface', '#F2F1ED'],
      ['Border', '#DFE2DE'],
      ['Strong Border', '#CBD0CC'],
    ],
  },
  {
    name: 'Text',
    colours: [
      ['Primary', '#1D2420'],
      ['Secondary', '#5E6862'],
      ['Muted', '#858E88'],
    ],
  },
  {
    name: 'Brand',
    colours: [
      ['Deep Forest', '#145C46'],
      ['Green Hover', '#104A39'],
      ['Green Soft', '#DCEDE5'],
      ['Green Subtle', '#EFF7F3'],
      ['Terracotta Accent', '#D66A4A'],
    ],
  },
] as const

const typeSpecimens = [
  ['section', 'Section / card heading', '16 / 600 / 20', 'Listing information'],
  ['item', 'Item title', '14 / 600 / 20', 'Morning Study'],
  ['body', 'Body', '13 / 400 / 19', 'Review the product information before continuing.'],
  ['control', 'Control', '13 / 400 / 18', 'Home decor buyer'],
  ['action', 'Action', '13 / 500 / 18', 'Continue'],
  ['label', 'Label', '12 / 500 / 16', 'Target buyer'],
  ['meta', 'Metadata', '12 / 400–500 / 16', 'Digital wall art · Prepare'],
  ['meta-dense', 'Dense metadata', '11 / 400–500 / 14', '5 print files prepared'],
] as const

const spacingScale = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64] as const

export function DesignSystemPage() {
  return (
    <div className="ds-page">
      <aside className="ds-sidebar" aria-label="Design system navigation">
        <div className="ds-wordmark">flyh<span>.ai</span></div>
        <nav className="ds-nav">
          <Link className="ds-nav__item ds-nav__item--selected" to="/" aria-current="page">
            <Palette size={16} strokeWidth={1.8} />
            Foundations
          </Link>
          <Link className="ds-nav__item" to="/components">
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

      <main className="ds-canvas" id="foundations">
        <div className="ds-content">
          <header className="ds-page-header">
            <p className="ds-kicker">Design system</p>
            <h1>Foundations</h1>
            <p>This page is used to review flyh’s visual foundations before product implementation.</p>
          </header>

          <section className="ds-section" aria-labelledby="ds-colour-title">
            <div className="ds-section__heading">
              <p className="ds-section__index">01</p>
              <div>
                <h2 id="ds-colour-title">Colour</h2>
                <p>A restrained hybrid palette for navigation, commerce work and creator decisions.</p>
              </div>
            </div>
            <div className="ds-colour-groups">
              {colourGroups.map((group) => (
                <article className="ds-palette" key={group.name}>
                  <h3>{group.name}</h3>
                  <div className="ds-swatches">
                    {group.colours.map(([name, value]) => (
                      <div className="ds-swatch" key={name}>
                        <span className="ds-swatch__colour" style={{ backgroundColor: value }} aria-hidden="true" />
                        <span className="ds-swatch__details">
                          <strong>{name}</strong>
                          <code>{value}</code>
                        </span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="ds-section" aria-labelledby="ds-type-title">
            <div className="ds-section__heading">
              <p className="ds-section__index">02</p>
              <div>
                <h2 id="ds-type-title">Typography</h2>
                <p>Compact, calm type for operational clarity, with display scale used sparingly.</p>
              </div>
            </div>
            <div className="ds-type-table">
              {typeSpecimens.map(([role, name, spec, example]) => (
                <div className="ds-type-row" key={role}>
                  <div className="ds-type-row__meta">
                    <strong>{name}</strong>
                    <span>{spec}</span>
                  </div>
                  <p className={`ds-type-example ds-type-example--${role}`}>
                    {example}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="ds-section" aria-labelledby="ds-spacing-title">
            <div className="ds-section__heading">
              <p className="ds-section__index">03</p>
              <div>
                <h2 id="ds-spacing-title">Spacing</h2>
                <p>A practical scale centred on 8, 12, 16, 24 and 32 pixels.</p>
              </div>
            </div>
            <div className="ds-spacing-scale">
              {spacingScale.map((space) => (
                <div className="ds-spacing-item" key={space}>
                  <span>{space}</span>
                  <div className="ds-spacing-item__track">
                    <i style={{ width: `${space}px` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="ds-section" aria-labelledby="ds-surface-title">
            <div className="ds-section__heading">
              <p className="ds-section__index">04</p>
              <div>
                <h2 id="ds-surface-title">Surfaces &amp; geometry</h2>
                <p>Borders do the structural work; radius and elevation stay restrained.</p>
              </div>
            </div>

            <div className="ds-surface-grid">
              <div className="ds-surface-samples">
                <div className="ds-surface-sample ds-surface-sample--canvas"><span>Canvas</span><code>#F7F6F2</code></div>
                <div className="ds-surface-sample ds-surface-sample--white"><span>Surface</span><code>#FFFFFF</code></div>
                <div className="ds-surface-sample ds-surface-sample--subtle"><span>Subtle surface</span><code>#F2F1ED</code></div>
                <div className="ds-border-samples">
                  <div><i className="ds-border-line" /><span>Standard border · #DFE2DE</span></div>
                  <div><i className="ds-border-line ds-border-line--strong" /><span>Strong border · #CBD0CC</span></div>
                </div>
                <div className="ds-radius-samples" aria-label="Radius examples">
                  {[6, 8, 10, 12].map((radius) => (
                    <div key={radius} style={{ borderRadius: `${radius}px` }}>{radius}px</div>
                  ))}
                </div>
              </div>

              <article className="ds-operational-card">
                <div className="ds-operational-card__heading">
                  <div className="ds-operational-card__icon"><Box size={16} strokeWidth={1.8} /></div>
                  <div>
                    <h3>Listing information</h3>
                    <p>Review the product information before continuing.</p>
                  </div>
                </div>
                <dl>
                  <div>
                    <dt>Product</dt>
                    <dd>Digital wall-art printable</dd>
                  </div>
                  <div>
                    <dt>Target buyer</dt>
                    <dd>Home decor buyer</dd>
                  </div>
                </dl>
                <p className="ds-operational-card__note">Visual specimen · no product behaviour</p>
              </article>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
