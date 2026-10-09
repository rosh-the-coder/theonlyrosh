import type { HTMLAttributes } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TagProps = HTMLAttributes<HTMLSpanElement> & {
  onRemove?: () => void
  removeLabel?: string
}

export function Tag({ className, children, onRemove, removeLabel, ...props }: TagProps) {
  const accessibleRemoveLabel = removeLabel ?? (typeof children === 'string' ? `Remove ${children}` : 'Remove tag')

  return (
    <span
      className={cn(
        'inline-flex h-7 items-center gap-1.5 rounded-control border border-border bg-surface-subtle px-2.5 type-label text-text-primary',
        className,
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          className="-mr-1 grid size-5 cursor-pointer place-items-center rounded-[4px] border-0 bg-transparent p-0 text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          onClick={onRemove}
          aria-label={accessibleRemoveLabel}
        >
          <X className="size-3.5 shrink-0" aria-hidden="true" />
        </button>
      )}
    </span>
  )
}
