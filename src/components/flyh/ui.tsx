import Image from 'next/image';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { liveDesignSystemUrl, type FlyHImage } from '@/data/flyh/content';

const buttonClass = {
  primary: 'border-[#145C46] bg-[#145C46] text-[#F2F4F2] hover:border-[#104A39] hover:bg-[#104A39]',
  secondary: 'border-[#CBD0CC] bg-white text-[#1D2420] hover:bg-[#F2F1ED]',
  ghost: 'border-transparent bg-transparent text-[#1D2420] hover:bg-[#F2F1ED]',
} as const;

export function FlyHButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonClass }) {
  return (
    <button
      type="button"
      className={`inline-flex h-11 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors duration-150 ${buttonClass[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function FlyHTextButton({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`flyh-link underline ${className}`} {...props}>
      {children}
    </button>
  );
}

export function FlyHKicker({ children }: { children: ReactNode }) {
  return <p className="flyh-kicker">{children}</p>;
}

export function FlyHDesignSystemCta({
  label = 'Explore the live design system',
}: {
  label?: string;
}) {
  const className = 'inline-flex h-12 items-center gap-2 rounded-lg border border-[#145C46] bg-[#145C46] px-5 text-sm font-semibold text-[#F2F4F2]';
  if (liveDesignSystemUrl) {
    return (
      <a href={liveDesignSystemUrl} target="_blank" rel="noopener noreferrer" className={`${className} hover:border-[#104A39] hover:bg-[#104A39]`}>
        {label}
        <span aria-hidden="true">↗</span>
      </a>
    );
  }
  return (
    <button type="button" className={`${className} cursor-not-allowed opacity-60`} disabled>
      {label}
      <span aria-hidden="true">↗</span>
    </button>
  );
}

export function FlyHScreenFrame({
  image,
  caption,
  priority = false,
  sizes = '(min-width: 1024px) 960px, 100vw',
}: {
  image: FlyHImage;
  caption?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <figure className="min-w-0">
      <div className="overflow-hidden rounded-xl border border-[#DFE2DE] bg-white">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority={priority}
          sizes={sizes}
          className="h-auto w-full"
        />
      </div>
      {caption ? <figcaption className="mt-3 max-w-[68ch] text-sm leading-6 text-[#5E6862]">{caption}</figcaption> : null}
    </figure>
  );
}

export function FlyHAnnotation({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-md border border-[#DFE2DE] bg-white px-3 py-2 text-[12px] font-medium leading-4 text-[#1D2420]">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function FlyHTag({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-md bg-[#F2F1ED] px-2 py-1 text-xs font-medium text-[#1D2420]">{children}</span>;
}

export function FlyHField({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-medium text-[#1D2420]">{label}</span>
      <div className="rounded-md border border-[#CBD0CC] bg-white px-3 py-2 text-[13px] leading-5 text-[#1D2420]">{value}</div>
    </div>
  );
}

function StatusIcon({ status }: { status: 'pass' | 'warning' | 'action' }) {
  const color = status === 'pass' ? '#2F6B4F' : status === 'warning' ? '#8A6517' : '#A33B31';
  const label = status === 'pass' ? 'Passed' : status === 'warning' ? 'Warning' : 'Action required';
  return (
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center overflow-hidden" style={{ color }}>
      <span className="sr-only">{label}</span>
      {status === 'pass' ? (
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="10" cy="10" r="7.25" />
          <path d="M6.5 10.2 8.8 12.4 13.5 7.6" />
        </svg>
      ) : status === 'warning' ? (
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M10 3.5 17 16.5H3L10 3.5Z" />
          <path d="M10 8.2v4" />
          <path d="M10 14.6h.01" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="10" cy="10" r="7.25" />
          <path d="M10 6.4v4.4" />
          <path d="M10 13.4h.01" />
        </svg>
      )}
    </span>
  );
}

export function FlyHCheckRow({
  status,
  title,
  detail,
}: {
  status: 'pass' | 'warning' | 'action';
  title: string;
  detail: string;
}) {
  return (
    <div className="flex gap-3 border-t border-[#DFE2DE] py-3 first:border-t-0">
      <StatusIcon status={status} />
      <div className="min-w-0">
        <p className="text-[13px] font-medium leading-5 text-[#1D2420]">{title}</p>
        <p className="mt-0.5 text-xs leading-4 text-[#5E6862]">{detail}</p>
      </div>
    </div>
  );
}

export function FlyHWarningGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-[#8A6517]/25 bg-white p-4" aria-label={title}>
      <h3 className="text-lg font-semibold text-[#1D2420]">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export function FlyHBlockerGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-[#A33B31]/25 bg-white p-4" aria-label={title}>
      <h3 className="text-lg font-semibold text-[#1D2420]">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export function FlyHApprovalWell() {
  return (
    <div className="rounded-lg border border-[#145C46]/25 bg-[#EFF7F3] p-4">
      <p className="flyh-kicker">You decide</p>
      <p className="mt-3 text-[13px] leading-5 text-[#1D2420]">I have reviewed this listing and approve it for export.</p>
    </div>
  );
}

export function FlyHMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-0 border-t border-[#29302C] pt-4">
      <p className="text-4xl font-semibold tracking-[-0.03em] text-[#F2F4F2] sm:text-5xl">{value}</p>
      <p className="mt-2 text-sm text-[#949D97]">{label}</p>
    </div>
  );
}

export function FlyHStageJourney({
  current,
  onSelect,
}: {
  current: string;
  onSelect: (id: string) => void;
}) {
  const steps = [
    ['flyh-artwork', '01', 'Artwork'],
    ['flyh-direction', '02', 'Direction'],
    ['flyh-listing', '03', 'Listing'],
    ['flyh-review', '04', 'Review'],
  ] as const;

  return (
    <ol className="grid grid-cols-2 gap-2 lg:grid-cols-1" aria-label="Listing journey">
      {steps.map(([id, index, name]) => {
        const active = current === id;
        return (
          <li key={id}>
            <button
              type="button"
              aria-current={active ? 'true' : undefined}
              onClick={() => onSelect(id)}
              className={`flex min-h-11 w-full items-center gap-3 rounded-lg border px-3 py-2 text-left ${active ? 'border-[#145C46] bg-white' : 'border-transparent bg-transparent'}`}
            >
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${active ? 'bg-[#145C46] text-white' : 'border border-[#DFE2DE] text-[#858E88]'}`}>
                {index}
              </span>
              <span className={`text-sm font-medium ${active ? 'text-[#1D2420]' : 'text-[#5E6862]'}`}>{name}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
