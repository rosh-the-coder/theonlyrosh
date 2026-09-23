import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { VIDEO_WORK } from '@/components/VideoEditing/videoWork'

export const metadata: Metadata = {
  title: 'Work | Video Editing',
}

const TOOLS: { name: string; src: string; cover?: boolean }[] = [
  { name: 'Premiere Pro', src: '/video-editing/tools/premiere.svg' },
  { name: 'After Effects', src: '/video-editing/tools/after-effects.svg' },
  { name: 'Photoshop', src: '/video-editing/tools/photoshop.svg' },
  { name: 'Cursor', src: '/video-editing/tools/cursor.svg' },
  { name: 'Higgsfield', src: '/video-editing/tools/higgsfield.png', cover: true },
  { name: 'Veo 3', src: '/video-editing/tools/veo.svg' },
  { name: 'CapCut', src: '/video-editing/tools/capcut.svg' },
  { name: 'Midjourney', src: '/video-editing/tools/midjourney.svg' },
]

export default function VideoWorkPage() {
  return (
    <section className="min-h-screen px-6 pt-28 pb-32">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-center font-teko text-2xl sm:text-3xl font-bold leading-none tracking-[0.12em] text-white/70">
          TOOLS I USE
        </h1>

        <ul className="mx-auto mt-2 flex flex-wrap justify-center gap-x-3 gap-y-3">
          {TOOLS.map((tool) => (
            <li key={tool.name} className="flex flex-col items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white md:h-12 md:w-12">
                <img
                  src={tool.src}
                  alt={tool.name}
                  className={tool.cover ? 'h-full w-full object-cover' : 'h-7 w-7 object-contain md:h-8 md:w-8'}
                />
              </div>
              <span className="text-center font-teko text-sm leading-tight tracking-wide text-white/70 md:text-base">
                {tool.name}
              </span>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-20 max-w-3xl space-y-12">
          {VIDEO_WORK.map((piece) => (
            <Link
              key={piece.slug}
              href={`/video-editing/work/${piece.slug}`}
              className="group block border-b border-white/10 pb-10"
            >
              <h2 className="flex items-center gap-2 font-teko text-3xl tracking-wide text-white transition-colors group-hover:text-white/70 md:gap-3 md:text-5xl">
                {piece.title}
                <ArrowUpRight
                  aria-hidden
                  className="h-6 w-6 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:h-8 md:w-8"
                  strokeWidth={1.75}
                />
              </h2>
              <p className="mt-3 max-w-2xl font-teko text-lg md:text-xl leading-snug text-gray-300">
                {piece.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
