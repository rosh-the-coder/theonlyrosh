import { FlyHDesignSystemCta } from '@/components/flyh/ui';
import { built, configured, next, preview, type DrawerId } from '@/data/flyh/content';

function Flow({ steps }: { steps: { title: string; detail?: string }[] }) {
  return (
    <ol>
      {steps.map((step, index) => (
        <li key={step.title}>
          <p className="text-sm font-semibold text-[#1D2420]">{step.title}</p>
          {step.detail ? <p className="mt-1 text-sm text-[#5E6862]">{step.detail}</p> : null}
          {index < steps.length - 1 ? <p className="py-2 text-[#D66A4A]" aria-hidden="true">↓</p> : null}
        </li>
      ))}
    </ol>
  );
}

export default function DrawerBody({ id }: { id: DrawerId }) {
  if (id === 'origin') {
    return (
      <div>
        <Flow
          steps={[
            { title: 'Personal pain' },
            { title: 'Aethelgard', detail: 'Personal Etsy workflow' },
            { title: 'Real order', detail: '23-print bundle fulfilled' },
            { title: 'FlyH', detail: 'Workflow redesigned for unknown creators' },
          ]}
        />
        <p className="mt-6 border-t border-[#DFE2DE] pt-4 text-sm leading-6 text-[#5E6862]">
          Aethelgard proved my workflow could run. It did not prove that another creator could understand it.
        </p>
      </div>
    );
  }

  if (id === 'journey') {
    return (
      <Flow
        steps={[
          { title: 'Artwork' },
          { title: 'Analysis' },
          { title: 'Positioning' },
          { title: 'Assets' },
          { title: 'Mockups' },
          { title: 'Listing pack' },
          { title: 'Quality check' },
          { title: 'Handoff' },
        ]}
      />
    );
  }

  if (id === 'control') {
    const rows = [
      ['Rights', 'FlyH waits', 'Creator confirms'],
      ['Understanding', 'FlyH proposes', 'Creator edits / accepts'],
      ['Direction', 'FlyH recommends', 'Creator adjusts / approves'],
      ['Listing', 'FlyH prepares', 'Creator edits / prices'],
      ['Review', 'FlyH checks', 'Creator fixes / approves'],
    ];
    return (
      <div>
        {rows.map(([name, system, creator]) => (
          <div key={name} className="grid gap-1 border-t border-[#DFE2DE] py-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4">
            <p className="text-xs font-semibold tracking-[0.12em] text-[#D66A4A]">{name}</p>
            <p className="text-sm text-[#1D2420]">
              {system}
              <span className="mx-2 text-[#D66A4A]" aria-hidden="true">→</span>
              {creator}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (id === 'system') {
    return (
      <div>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['#F7F6F2', 'Canvas'],
            ['#145C46', 'Forest'],
            ['#D66A4A', 'Terracotta'],
          ].map(([color, label]) => (
            <div key={label} className="overflow-hidden rounded-lg border border-[#DFE2DE] bg-white">
              <div className="h-14" style={{ background: color }} />
              <p className="px-2 py-2 text-xs font-medium">{label}</p>
            </div>
          ))}
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          {['Foundations', 'Components', 'Patterns', 'Color Lab', 'Visual Studies'].map((item) => (
            <li key={item} className="rounded-md border border-[#DFE2DE] bg-white px-3 py-2 text-sm font-medium">{item}</li>
          ))}
        </ul>
        <p className="mt-6">
          <FlyHDesignSystemCta label="Explore the live design system" />
        </p>
      </div>
    );
  }

  if (id === 'scope') {
    const columns = [
      ['Built', built],
      ['Config-dependent', configured],
      ['Preview', preview],
      ['Next', next],
    ] as const;
    return (
      <div className="grid grid-cols-2 gap-4 min-[520px]:grid-cols-4">
        {columns.map(([label, items]) => (
          <div key={label}>
            <p className="flyh-kicker">{label}</p>
            <ul className="mt-3 space-y-2">
              {items.map((item) => (
                <li key={item} className="text-sm leading-5 text-[#1D2420]">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <p className="flyh-kicker">Product Designer</p>
      <p className="mt-1 text-2xl font-semibold tracking-[-0.03em]">Roshan</p>
      <p className="my-4 text-lg text-[#D66A4A]" aria-hidden="true">+</p>
      <ul className="flex flex-wrap gap-2">
        {['Frontend Engineer', 'Backend Engineer', 'AI Engineer', 'UX Researcher', 'Marketing Executive'].map((role) => (
          <li key={role} className="rounded-md border border-[#DFE2DE] bg-white px-3 py-2 text-sm font-medium">{role}</li>
        ))}
      </ul>
      <p className="mt-6 text-sm leading-6 text-[#5E6862]">
        I led product design while the final MVP was shaped and built collaboratively across the six-person team.
      </p>
    </div>
  );
}
