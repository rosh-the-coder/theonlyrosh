import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <span className="relative block">
      <select
        className={cn(
          'h-9 w-full appearance-none rounded-control border border-border-strong bg-surface px-3 pr-8 type-control text-text-primary outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-border-interactive focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-text-muted disabled:opacity-100 aria-invalid:border-validation aria-invalid:focus-visible:border-validation aria-invalid:focus-visible:ring-validation-ring',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
    </span>
  )
}
