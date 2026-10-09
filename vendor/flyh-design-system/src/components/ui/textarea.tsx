import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'min-h-28 w-full resize-y rounded-control border border-border-strong bg-surface px-3 py-2 type-control leading-5 text-text-primary outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-text-muted focus-visible:border-border-interactive focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-text-muted disabled:opacity-100 aria-invalid:border-validation aria-invalid:focus-visible:border-validation aria-invalid:focus-visible:ring-validation-ring',
        className,
      )}
      {...props}
    />
  )
}
