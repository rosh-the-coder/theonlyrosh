import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, type = 'text', ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'h-9 w-full rounded-control border border-border-strong bg-surface px-3 type-control text-text-primary outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-text-muted focus-visible:border-border-interactive focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-text-muted disabled:opacity-100 aria-invalid:border-validation aria-invalid:focus-visible:border-validation aria-invalid:focus-visible:ring-validation-ring',
        className,
      )}
      {...props}
    />
  )
}
