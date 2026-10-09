import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: ReactNode
  description?: ReactNode
}

export function Checkbox({ className, label, description, ...props }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 py-1 text-text-primary has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50">
      <input
        type="checkbox"
        className={cn(
          'mt-0.5 size-4 shrink-0 cursor-pointer rounded-[4px] accent-action-primary outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-surface disabled:cursor-not-allowed',
          className,
        )}
        {...props}
      />
      <span className="grid gap-1">
        <span className="type-body">{label}</span>
        {description && <span className="type-meta text-text-secondary">{description}</span>}
      </span>
    </label>
  )
}
