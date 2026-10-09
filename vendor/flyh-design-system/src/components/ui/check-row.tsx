import type { HTMLAttributes, ReactNode } from 'react'
import { CircleAlert, CircleCheck, TriangleAlert, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CheckRowResult = 'pass' | 'warning' | 'action-required'

export type CheckRowProps = HTMLAttributes<HTMLDivElement> & {
  result: CheckRowResult
  title: string
  description?: string
  action?: ReactNode
}

const resultDetails: Record<CheckRowResult, { label: string; icon: LucideIcon; color: string }> = {
  pass: { label: 'Pass', icon: CircleCheck, color: 'text-success' },
  warning: { label: 'Warning', icon: TriangleAlert, color: 'text-warning' },
  'action-required': { label: 'Action required', icon: CircleAlert, color: 'text-danger' },
}

export function CheckRow({ result, title, description, action, className, ...props }: CheckRowProps) {
  const details = resultDetails[result]
  const ResultIcon = details.icon

  return (
    <div
      className={cn(
        'grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 py-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]',
        className,
      )}
      {...props}
    >
      <span className={cn('grid size-5 place-items-center', details.color)} aria-hidden="true">
        <ResultIcon className="size-4" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="type-body font-medium text-text-primary">
          {title}
          <span className="visually-hidden"> — {details.label}</span>
        </p>
        {description && <p className="mt-0.5 max-w-[54rem] type-meta leading-5 text-text-secondary">{description}</p>}
      </div>
      {action && (
        <div className="col-start-2 mt-2 sm:col-start-3 sm:row-start-1 sm:mt-0 sm:self-center">
          {action}
        </div>
      )}
    </div>
  )
}
