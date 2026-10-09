import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap border transition-colors duration-150 outline-none [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border-strong disabled:bg-surface-subtle disabled:text-text-secondary',
  {
    variants: {
      variant: {
        primary: 'border-action-primary bg-action-primary text-action-primary-text hover:border-action-primary-hover hover:bg-action-primary-hover active:border-action-primary-active active:bg-action-primary-active',
        secondary: 'border-border-strong bg-surface text-text-primary hover:bg-surface-hover',
        ghost: 'border-transparent bg-transparent text-text-primary hover:bg-surface-hover',
        destructive: 'border-danger bg-danger text-text-inverse hover:border-destructive-hover hover:bg-destructive-hover focus-visible:ring-validation-ring',
        'destructive-outline': 'border-border-strong bg-surface text-danger hover:border-danger hover:bg-surface-subtle focus-visible:ring-validation-ring',
      },
      size: {
        sm: 'h-8 rounded-control px-2.5 type-action leading-4 [--button-icon-gap:6px] [&_svg]:size-3.5',
        default: 'h-9 rounded-control px-3 type-action [--button-icon-gap:6px] [&_svg]:size-4',
        lg: 'h-10 rounded-surface px-4 type-action-prominent [--button-icon-gap:7px] [&_svg]:size-4',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
    loadingLabel?: string
    leadingIcon?: ReactNode
    trailingIcon?: ReactNode
  }

export function Button({
  className,
  variant,
  size,
  loading = false,
  loadingLabel = 'Loading…',
  leadingIcon,
  trailingIcon,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      <span className="grid items-center justify-items-center">
        <span
          className={cn(
            'col-start-1 row-start-1 inline-flex items-center gap-[var(--button-icon-gap)]',
            loading && 'invisible',
          )}
        >
          {leadingIcon}
          {children}
          {trailingIcon}
        </span>
        <span
          className={cn(
            'col-start-1 row-start-1 inline-flex items-center gap-[var(--button-icon-gap)]',
            !loading && 'invisible',
          )}
        >
          <LoaderCircle aria-hidden="true" className="animate-spin" />
          {loadingLabel}
        </span>
      </span>
    </button>
  )
}
