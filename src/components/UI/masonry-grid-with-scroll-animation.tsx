'use client'

import React from 'react'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import './masonry-grid.css'

export interface MasonryCardData {
  id: string
  src: string
  alt: string
  content: string
  linkHref: string
  linkText: string
  video?: string
  youtubeId?: string
  youtubeStart?: number
}

export interface MasonryGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MasonryCardData[]
  onItemClick?: (item: MasonryCardData) => void
  aspect?: '9/16' | '16/9'
  columns?: 3 | 5
}

const MasonryCard = ({
  item,
  className,
  onItemClick,
  revealed,
  index,
  aspect = '9/16',
  ...props
}: {
  item: MasonryCardData
  onItemClick?: (item: MasonryCardData) => void
  revealed: boolean
  index: number
  aspect?: '9/16' | '16/9'
} & React.HTMLAttributes<HTMLDivElement>) => {
  const side = index % 2 === 0 ? 1 : -1
  const amp = Math.max(1, Math.ceil(((index % 6) + 1) / 2))
  const frame = aspect === '16/9' ? 'aspect-video' : 'aspect-[9/16]'

  return (
  <div
    {...props}
    className={cn('grid gap-2', className)}
    data-reveal-id={item.id}
    data-revealed={revealed ? 'true' : 'false'}
    onClick={() => onItemClick?.(item)}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onItemClick?.(item)
      }
    }}
    role={onItemClick ? 'button' : undefined}
    tabIndex={onItemClick ? 0 : undefined}
    style={{ ['--tilt' as string]: `${side * amp * 7}deg`, transitionDelay: revealed ? `${(index % 5) * 45}ms` : '0ms' }}
  >
    <article className={cn('relative cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-md transition-colors hover:border-white/30', frame)}>
      {item.src ? (
        <img
          src={item.src}
          alt={item.alt}
          height={aspect === '16/9' ? 720 : 1280}
          width={aspect === '16/9' ? 1280 : 720}
          className="absolute inset-0 h-full w-full bg-white/10 object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-white/10">
          <Play className="h-8 w-8 fill-white text-white" aria-hidden="true" />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 space-y-1 bg-gradient-to-t from-black/80 to-transparent p-3">
        <p className="line-clamp-2 text-sm leading-tight text-white/60">{item.content}</p>
        <span className="text-sm font-medium text-white">{item.linkText}</span>
      </div>
    </article>
  </div>
  )
}

const MasonryGrid = React.forwardRef<HTMLDivElement, MasonryGridProps>(
  ({ items, className, onItemClick, aspect = '9/16', columns = 5, ...props }, ref) => {
    const localRef = React.useRef<HTMLDivElement | null>(null)
    const [revealed, setRevealed] = React.useState<Record<string, boolean>>({})

    const setRefs = (node: HTMLDivElement | null) => {
      localRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }

    React.useEffect(() => {
      const root = localRef.current
      if (!root) return

      let frame = 0
      const update = () => {
        const cards = root.querySelectorAll<HTMLElement>('[data-reveal-id]')
        const viewH = window.innerHeight
        const entering: string[] = []

        cards.forEach((card) => {
          const id = card.dataset.revealId
          if (!id) return
          const rect = card.getBoundingClientRect()
          if (rect.top < viewH * 0.9 && rect.bottom > 40) entering.push(id)
        })

        if (!entering.length) return
        setRevealed((current) => {
          let changed = false
          const next = { ...current }
          entering.forEach((id) => {
            if (!next[id]) {
              next[id] = true
              changed = true
            }
          })
          return changed ? next : current
        })
      }

      const onScroll = () => {
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(update)
      }

      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)
      document.addEventListener('scroll', onScroll, true)

      return () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
        document.removeEventListener('scroll', onScroll, true)
      }
    }, [items])

    return (
      <div
        ref={setRefs}
        className={cn(
          'grid gap-4 p-4',
          columns === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-5',
          className,
        )}
        {...props}
      >
          {items.map((item, index) => (
            <MasonryCard
              key={item.id}
              item={item}
              index={index}
              aspect={aspect}
              revealed={Boolean(revealed[item.id])}
              onItemClick={onItemClick}
              className="masonry-card-wrapper"
            />
          ))}
      </div>
    )
  },
)

MasonryGrid.displayName = 'MasonryGrid'

export { MasonryGrid, MasonryCard }
