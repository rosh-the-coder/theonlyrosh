import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type StatusBadgeStatus =
  | 'draft'
  | 'working'
  | 'needs-approval'
  | 'blocked'
  | 'verified'
  | 'ready'

export type StatusBadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  status: StatusBadgeStatus
}

const statusDetails: Record<StatusBadgeStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: '[--status-color:var(--color-status-draft)]' },
  working: { label: 'Working', color: '[--status-color:var(--color-status-working)]' },
  'needs-approval': { label: 'Needs approval', color: '[--status-color:var(--color-status-needs-approval)]' },
  blocked: { label: 'Blocked', color: '[--status-color:var(--color-status-blocked)]' },
  verified: { label: 'Verified', color: '[--status-color:var(--color-status-verified)]' },
  ready: { label: 'Ready', color: '[--status-color:var(--color-status-ready)]' },
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const details = statusDetails[status]

  return (
    <span
      className={cn(
        'status-badge inline-flex h-6 items-center gap-1.5 rounded-control border px-2 type-meta font-medium',
        details.color,
        className,
      )}
      {...props}
    >
      <span className="status-badge-dot size-1.5 shrink-0 rounded-full" aria-hidden="true" />
      {details.label}
    </span>
  )
}
