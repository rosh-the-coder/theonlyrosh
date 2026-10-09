import type { HTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Field({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('grid gap-1.5', className)} {...props} />
}

export type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean
}

export function FieldLabel({ className, required, children, ...props }: FieldLabelProps) {
  return (
    <label className={cn('type-label text-text-primary', className)} {...props}>
      {children}
      {required && <span className="ml-1 text-validation" aria-hidden="true">*</span>}
      {required && <span className="visually-hidden"> required</span>}
    </label>
  )
}

export function FieldDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('type-meta text-text-secondary', className)} {...props} />
}

export function FieldError({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement> & { children: ReactNode }) {
  return (
    <p className={cn('type-meta font-medium text-validation', className)} role="alert" {...props}>
      {children}
    </p>
  )
}
