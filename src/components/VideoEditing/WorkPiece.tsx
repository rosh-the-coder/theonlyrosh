import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getVideoWork } from '@/components/VideoEditing/videoWork'

export default function WorkPiece({ slug }: { slug: string }) {
  const piece = getVideoWork(slug)

  if (!piece) {
    notFound()
  }

  return (
    <section className="min-h-screen px-6 pt-28 pb-32">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/video-editing/work"
          className="font-teko text-lg tracking-[0.18em] uppercase text-white/45 transition-colors hover:text-white"
        >
          Work
        </Link>
        <h1 className="mt-4 font-teko text-4xl md:text-6xl font-bold tracking-wider text-white">
          {piece.title}
        </h1>
        <p className="mt-4 max-w-2xl font-teko text-lg md:text-xl leading-snug text-gray-300">
          {piece.description}
        </p>
      </div>
    </section>
  )
}
