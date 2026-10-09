import type { LiHTMLAttributes } from 'react'
import { Bot, Settings2, UserRound, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ActivityActor = 'creator' | 'flyh' | 'system'

export type ActivityItemProps = Omit<LiHTMLAttributes<HTMLLIElement>, 'children'> & {
  actor: ActivityActor
  title: string
  timestamp: string
  description?: string
}

const actorDetails: Record<ActivityActor, { label: string; icon: LucideIcon }> = {
  creator: { label: 'Creator', icon: UserRound },
  flyh: { label: 'flyh', icon: Bot },
  system: { label: 'System', icon: Settings2 },
}

export function ActivityItem({ actor, title, timestamp, description, className, ...props }: ActivityItemProps) {
  const details = actorDetails[actor]
  const ActorIcon = details.icon

  return (
    <li
      className={cn(
        'relative grid grid-cols-[24px_minmax(0,1fr)] gap-x-3 pb-5 last:pb-0 last:[&_.activity-item__connector]:hidden sm:grid-cols-[24px_minmax(0,1fr)_auto]',
        className,
      )}
      {...props}
    >
      <div className="relative row-span-2">
        <span className="grid size-6 place-items-center rounded-full border border-border-strong bg-surface text-text-secondary" aria-hidden="true">
          <ActorIcon className="size-3.5" strokeWidth={1.8} />
        </span>
        <span className="activity-item__connector absolute -bottom-3 left-1/2 top-6 w-px -translate-x-1/2 bg-border" aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <p className="type-meta-dense font-medium text-text-muted">{details.label}</p>
        <p className="mt-0.5 type-body font-medium text-text-primary">{title}</p>
        {description && <p className="mt-0.5 type-meta text-text-secondary">{description}</p>}
      </div>

      <time className="col-start-2 mt-1 type-meta-dense text-text-muted sm:col-start-3 sm:row-start-1 sm:mt-0">
        {timestamp}
      </time>
    </li>
  )
}
