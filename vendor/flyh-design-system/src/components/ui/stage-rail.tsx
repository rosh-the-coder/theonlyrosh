import type { HTMLAttributes } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Stage = 'setup' | 'prepare' | 'merchandise' | 'verify' | 'ready'

export type StageRailProps = HTMLAttributes<HTMLDivElement> & {
  currentStage: Stage
}

const stages: Array<{ id: Stage; label: string }> = [
  { id: 'setup', label: 'Setup' },
  { id: 'prepare', label: 'Prepare' },
  { id: 'merchandise', label: 'Merchandise' },
  { id: 'verify', label: 'Verify' },
  { id: 'ready', label: 'Ready' },
]

export function StageRail({ currentStage, className, ...props }: StageRailProps) {
  const currentIndex = stages.findIndex((stage) => stage.id === currentStage)

  return (
    <div className={cn('overflow-x-auto', className)} {...props}>
      <ol className="flex min-w-max items-center" aria-label="Project workflow stages">
        {stages.map((stage, index) => {
          const completed = index < currentIndex
          const current = index === currentIndex

          return (
            <li className="flex items-center" key={stage.id} aria-current={current ? 'step' : undefined}>
              <span className="flex items-center gap-2">
                {completed ? (
                  <span className="grid size-3.5 shrink-0 place-items-center rounded-full bg-action-primary text-action-primary-text" aria-hidden="true">
                    <Check className="size-2.5" strokeWidth={2.25} />
                  </span>
                ) : (
                  <span
                    className={cn(
                      'shrink-0 rounded-full',
                      current
                        ? 'size-3 bg-action-primary'
                        : 'size-2.5 border border-border-strong bg-surface',
                    )}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    'type-meta whitespace-nowrap',
                    completed && 'font-medium text-text-secondary',
                    current && 'font-semibold text-text-primary',
                    !completed && !current && 'text-text-muted',
                  )}
                >
                  {stage.label}
                  <span className="visually-hidden">
                    {completed ? ' (completed)' : current ? ' (current)' : ' (upcoming)'}
                  </span>
                </span>
              </span>
              {index < stages.length - 1 && (
                <span
                  className={cn(
                    'mx-2 h-px w-6 shrink-0',
                    completed ? 'bg-border-interactive' : 'bg-border',
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
