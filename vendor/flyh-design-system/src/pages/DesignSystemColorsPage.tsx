import { useState, type CSSProperties } from 'react'
import { ArrowRight, Component, FlaskConical, FolderKanban, Home, Layers3, Palette, Pipette, Search, Settings2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import './design-system.css'
import './design-system-colors.css'

type PaletteRoles = {
  shell: string
  shellSurface: string
  shellText: string
  shellMuted: string
  shellSelected: string
  page: string
  surface: string
  surfaceSubtle: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  border: string
  borderStrong: string
  actionPrimary: string
  actionPrimaryHover: string
  actionPrimaryText: string
  brandAccent: string
  brandAccentSecondary: string
  focus: string
}

type PaletteDefinition = {
  name: string
  subtitle: string
  roles: PaletteRoles
  identityGradient?: string
}

const palettes = {
  current: {
    name: 'Current',
    subtitle: 'Forest / warm neutral',
    roles: {
      shell: '#111613', shellSurface: '#181E1A', shellText: '#F2F4F2', shellMuted: '#949D97', shellSelected: '#222A25',
      page: '#F7F6F2', surface: '#FFFFFF', surfaceSubtle: '#F2F1ED', textPrimary: '#1D2420', textSecondary: '#5E6862', textMuted: '#858E88',
      border: '#DFE2DE', borderStrong: '#CBD0CC', actionPrimary: '#145C46', actionPrimaryHover: '#104A39', actionPrimaryText: '#F2F4F2',
      brandAccent: '#D66A4A', brandAccentSecondary: '#DCEDE5', focus: '#DCEDE5',
    },
  },
  tealMint: {
    name: 'Teal Mint',
    subtitle: 'Deep teal / mint / warm accent',
    roles: {
      shell: '#042F34', shellSurface: '#16232B', shellText: '#FFFFFF', shellMuted: '#A9BEC0', shellSelected: '#16434A',
      page: '#F3F7F6', surface: '#FFFFFF', surfaceSubtle: '#E4EEF0', textPrimary: '#16232B', textSecondary: '#52666A', textMuted: '#78898C',
      border: '#D5E1E2', borderStrong: '#B8CBCD', actionPrimary: '#042F34', actionPrimaryHover: '#0A4449', actionPrimaryText: '#FFFFFF',
      brandAccent: '#B5F2DB', brandAccentSecondary: '#FFC933', focus: '#B5F2DB',
    },
  },
  electricWarm: {
    name: 'Electric Warm',
    subtitle: 'Electric blue / orange / beige',
    roles: {
      shell: '#1B1C20', shellSurface: '#24262B', shellText: '#FAF8F3', shellMuted: '#9C9DA3', shellSelected: '#30333A',
      page: '#F5F0E7', surface: '#FFFEFC', surfaceSubtle: '#EEE7DB', textPrimary: '#202126', textSecondary: '#5E6068', textMuted: '#898B92',
      border: '#DDD7CC', borderStrong: '#C9C1B5', actionPrimary: '#245BFF', actionPrimaryHover: '#1647D8', actionPrimaryText: '#FFFFFF',
      brandAccent: '#F36A2D', brandAccentSecondary: '#FFE1D2', focus: '#D9E3FF',
    },
  },
  midnightSpring: {
    name: 'Midnight Spring',
    subtitle: 'Midnight / spring lime / green',
    roles: {
      shell: '#001F3F', shellSurface: '#082B4E', shellText: '#F6F7ED', shellMuted: '#A8B7C8', shellSelected: '#123A60',
      page: '#F6F7ED', surface: '#FFFFFF', surfaceSubtle: '#EDF1E5', textPrimary: '#10263D', textSecondary: '#516274', textMuted: '#7B8894',
      border: '#DCE2D5', borderStrong: '#C5CEBC', actionPrimary: '#00804C', actionPrimaryHover: '#006B40', actionPrimaryText: '#FFFFFF',
      brandAccent: '#DBE64C', brandAccentSecondary: '#74C365', focus: '#B8DDB1',
    },
  },
  ember: {
    name: 'Ember',
    subtitle: 'Graphite / orange / magenta',
    roles: {
      shell: '#19181B', shellSurface: '#232126', shellText: '#F7F4F1', shellMuted: '#A7A1A8', shellSelected: '#302D32',
      page: '#F7F4F0', surface: '#FFFFFF', surfaceSubtle: '#F1EDE9', textPrimary: '#211F22', textSecondary: '#625D63', textMuted: '#8C858D',
      border: '#E1DBD7', borderStrong: '#CBC2BD', actionPrimary: '#2B292D', actionPrimaryHover: '#171619', actionPrimaryText: '#FFFFFF',
      brandAccent: '#F06A35', brandAccentSecondary: '#C83F78', focus: '#E5D8D2',
    },
    identityGradient: 'linear-gradient(135deg, #F06A35, #C83F78)',
  },
  graphiteElectric: {
    name: 'Graphite Electric',
    subtitle: 'Graphite / electric blue / lime',
    roles: {
      shell: '#1A1A1E', shellSurface: '#23242A', shellText: '#F7F8FA', shellMuted: '#A1A4AE', shellSelected: '#30313A',
      page: '#F5F6F8', surface: '#FFFFFF', surfaceSubtle: '#ECEEF2', textPrimary: '#1A1A1E', textSecondary: '#5B5E68', textMuted: '#878A94',
      border: '#DFE1E6', borderStrong: '#C8CBD3', actionPrimary: '#305CFF', actionPrimaryHover: '#2448D8', actionPrimaryText: '#FFFFFF',
      brandAccent: '#B3FA4E', brandAccentSecondary: '#84A4FF', focus: '#CED8FF',
    },
  },
} satisfies Record<string, PaletteDefinition>

type PaletteKey = keyof typeof palettes

const displayedRoles: { label: string; key: keyof PaletteRoles }[] = [
  { label: 'Shell', key: 'shell' },
  { label: 'Page', key: 'page' },
  { label: 'Surface', key: 'surface' },
  { label: 'Primary', key: 'actionPrimary' },
  { label: 'Accent', key: 'brandAccent' },
  { label: 'Secondary accent', key: 'brandAccentSecondary' },
  { label: 'Border', key: 'border' },
  { label: 'Text', key: 'textPrimary' },
]

function paletteStyle(palette: PaletteDefinition): CSSProperties {
  const roles = palette.roles
  return {
    '--lab-shell': roles.shell,
    '--lab-shell-surface': roles.shellSurface,
    '--lab-shell-text': roles.shellText,
    '--lab-shell-muted': roles.shellMuted,
    '--lab-shell-selected': roles.shellSelected,
    '--lab-page': roles.page,
    '--lab-surface': roles.surface,
    '--lab-surface-subtle': roles.surfaceSubtle,
    '--lab-text-primary': roles.textPrimary,
    '--lab-text-secondary': roles.textSecondary,
    '--lab-text-muted': roles.textMuted,
    '--lab-border': roles.border,
    '--lab-border-strong': roles.borderStrong,
    '--lab-action': roles.actionPrimary,
    '--lab-action-hover': roles.actionPrimaryHover,
    '--lab-action-text': roles.actionPrimaryText,
    '--lab-accent': roles.brandAccent,
    '--lab-accent-secondary': roles.brandAccentSecondary,
    '--lab-focus': roles.focus,
    '--lab-identity': palette.identityGradient ?? roles.brandAccent,
  } as CSSProperties
}

export function DesignSystemColorsPage() {
  const [selectedKey, setSelectedKey] = useState<PaletteKey>('current')
  const selected = palettes[selectedKey]

  return (
    <div className="ds-page">
      <aside className="ds-sidebar" aria-label="Design system navigation">
        <div className="ds-wordmark">flyh<span>.ai</span></div>
        <nav className="ds-nav">
          <Link className="ds-nav__item" to="/"><Palette size={16} strokeWidth={1.8} />Foundations</Link>
          <Link className="ds-nav__item" to="/components"><Component size={16} strokeWidth={1.8} />Components</Link>
          <Link className="ds-nav__item" to="/patterns"><Layers3 size={16} strokeWidth={1.8} />Patterns</Link>
          <Link className="ds-nav__item ds-nav__item--selected" to="/colors" aria-current="page"><Pipette size={16} strokeWidth={1.8} />Color Lab</Link>
          <Link className="ds-nav__item" to="/studies"><FlaskConical size={16} strokeWidth={1.8} />Visual Studies</Link>
        </nav>
        <p className="ds-sidebar__note">Internal visual review</p>
      </aside>

      <main className="ds-canvas">
        <div className="ds-content">
          <header className="ds-page-header">
            <p className="ds-kicker">Design system</p>
            <h1>Color Lab</h1>
            <p>Compare experimental identities inside one controlled flyh application specimen.</p>
          </header>

          <section className="ds-section" aria-labelledby="palette-selector-title">
            <div className="ds-section__heading">
              <p className="ds-section__index">01</p>
              <div><h2 id="palette-selector-title">Palette candidates</h2><p>Only colour changes between candidates. Current is the control.</p></div>
            </div>
            <div className="color-lab-picker" role="radiogroup" aria-label="Experimental palette">
              {(Object.entries(palettes) as [PaletteKey, PaletteDefinition][]).map(([key, palette]) => {
                const swatches = [palette.roles.shell, palette.roles.page, palette.roles.actionPrimary, palette.roles.brandAccent, palette.roles.brandAccentSecondary]
                return (
                  <button
                    type="button"
                    className="color-lab-picker__option"
                    data-selected={selectedKey === key}
                    role="radio"
                    aria-checked={selectedKey === key}
                    onClick={() => setSelectedKey(key)}
                    key={key}
                  >
                    <span className="color-lab-picker__copy"><strong>{palette.name}</strong><small>{palette.subtitle}</small></span>
                    <span className="color-lab-picker__swatches" aria-hidden="true">
                      {swatches.map((value, index) => <i style={{ background: value }} key={`${value}-${index}`} />)}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="ds-section" aria-labelledby="role-mapping-title">
            <div className="ds-section__heading">
              <p className="ds-section__index">02</p>
              <div><h2 id="role-mapping-title">{selected.name} role mapping</h2><p>{selected.subtitle}</p></div>
            </div>
            <div className="color-lab-roles">
              {displayedRoles.map(({ label, key }) => (
                <div className="color-lab-role" key={key}>
                  <i style={{ background: selected.roles[key] }} aria-hidden="true" />
                  <span><strong>{label}</strong><code>{selected.roles[key]}</code></span>
                </div>
              ))}
            </div>
          </section>

          <section className="ds-section" aria-labelledby="application-preview-title">
            <div className="ds-section__heading">
              <p className="ds-section__index">03</p>
              <div><h2 id="application-preview-title">Application specimen</h2><p>Identical product structure rendered through the selected experimental roles.</p></div>
            </div>
            <ColorApplicationSpecimen palette={selected} />
          </section>
        </div>
      </main>
    </div>
  )
}

function ColorApplicationSpecimen({ palette }: { palette: PaletteDefinition }) {
  return (
    <div className="color-lab" style={paletteStyle(palette)}>
      <aside className="color-lab__shell">
        <div className="color-lab__brand"><span className="color-lab__brand-mark" />flyh.ai</div>
        <nav aria-label="Application specimen navigation">
          <span><Home />Home</span>
          <span className="is-selected"><FolderKanban />Projects</span>
          <span><Search />Intelligence <small>Soon</small></span>
        </nav>
        <span className="color-lab__utility"><Settings2 />Workspace settings</span>
      </aside>

      <main className="color-lab__workspace">
        <header className="color-lab__project-header">
          <div className="color-lab__artwork" aria-label="Abstract artwork placeholder"><i /><i /><i /></div>
          <div><h3>Morning Study</h3><p>Digital wall-art printable</p></div>
          <span className="color-lab__state">Prepared</span>
        </header>

        <ol className="color-lab__stages" aria-label="Project stages">
          <li className="is-complete">Setup <span>✓</span></li>
          <li className="is-current">Prepare <span>●</span></li>
          <li>Merchandise</li><li>Verify</li><li>Ready</li>
        </ol>

        <div className="color-lab__content-grid">
          <section className="color-lab__operational">
            <div><h4>Listing preparation</h4><p>Your artwork is prepared for marketplace setup. Review the commercial details before continuing.</p></div>
            <dl>
              <div><dt>Print files</dt><dd>5 prepared</dd></div>
              <div><dt>Marketplace metadata</dt><dd>Complete</dd></div>
            </dl>
            <div className="color-lab__actions">
              <button type="button" className="color-lab-button color-lab-button--ghost">View evidence</button>
              <button type="button" className="color-lab-button color-lab-button--secondary">Save draft</button>
              <button type="button" className="color-lab-button color-lab-button--primary">Continue <ArrowRight /></button>
            </div>
          </section>

          <aside className="color-lab__decision">
            <section className="color-lab__recommendation">
              <p>Suggested price range</p><strong>€8 – €12</strong><small>Based on available demo signals.</small>
              <button type="button">View evidence</button>
            </section>
            <label htmlFor="color-lab-price">Your price</label>
            <input id="color-lab-price" defaultValue="€9.50" />
            <p>You decide the final marketplace price.</p>
          </aside>
        </div>
      </main>
    </div>
  )
}
