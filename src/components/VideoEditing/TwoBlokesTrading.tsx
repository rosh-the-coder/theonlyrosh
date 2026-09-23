'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getVideoWork } from '@/components/VideoEditing/videoWork'
import {
  MasonryGrid,
  type MasonryCardData,
} from '@/components/ui/masonry-grid-with-scroll-animation'

const CHANNEL_URL = 'https://www.youtube.com/@TwoBlokesTrading/videos'

const REEL_CDN = 'https://pub-14e70177217f4d5481f61d1335a55a75.r2.dev/two-blokes-trading/reels'

type MediaItem = { src: string; video?: string; youtubeId?: string; youtubeStart?: number }

const PODCASTS: MediaItem[] = [
  { src: '/video-editing/two-blokes-trading/podcasts/p1.png', youtubeId: 'R9WLkGsww2w', youtubeStart: 22 },
  { src: '/video-editing/two-blokes-trading/podcasts/p2.png', youtubeId: 'sip_ZskfSx8' },
  { src: '/video-editing/two-blokes-trading/podcasts/p3.png', youtubeId: 'RPO-Es62Otk', youtubeStart: 99 },
]

const REELS: MediaItem[] = [
  { src: '/video-editing/two-blokes-trading/reels/reel-2.png', youtubeId: 'FoivjO7qDAQ' },
  { src: `${REEL_CDN}/01.png`, video: `${REEL_CDN}/01.mp4` },
  { src: `${REEL_CDN}/02.png`, video: `${REEL_CDN}/02.mp4` },
  { src: `${REEL_CDN}/03.png`, video: `${REEL_CDN}/03.mp4` },
]

const SECTIONS = [
  { title: '3 of my favorite podcasts', aspect: '16/9' as const, media: PODCASTS },
  { title: '4 of my favorite reels', aspect: '9/16' as const, media: REELS },
]

function sectionId(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function mediaCards(section: string, media: MediaItem[]): MasonryCardData[] {
  return media.map((item, index) => {
    const number = String(index + 1).padStart(2, '0')

    return {
      id: `${section}-${number}`,
      src: item.src,
      alt: `${section} ${number}`,
      content: '',
      linkHref: '#',
      linkText: number,
      video: item.video,
      youtubeId: item.youtubeId,
      youtubeStart: item.youtubeStart,
    }
  })
}

const SECTIONS_WITH_CARDS = SECTIONS.map((section) => ({
  ...section,
  items: mediaCards(section.title, section.media),
}))

export default function TwoBlokesTrading() {
  const piece = getVideoWork('two-blokes-trading')
  const [currentVideo, setCurrentVideo] = useState<MasonryCardData | null>(null)
  const [playerAspect, setPlayerAspect] = useState<'9/16' | '16/9'>('9/16')
  const [activeSection, setActiveSection] = useState(SECTIONS_WITH_CARDS[0].title)
  const videoRef = useRef<HTMLVideoElement>(null)

  const openVideo = (item: MasonryCardData, aspect: '9/16' | '16/9') => {
    setPlayerAspect(aspect)
    setCurrentVideo(item)
    window.dispatchEvent(
      new CustomEvent('work-section-visibility', { detail: { isVisible: true } }),
    )
  }

  const closeVideo = () => {
    setCurrentVideo(null)
    window.dispatchEvent(
      new CustomEvent('work-section-visibility', { detail: { isVisible: false } }),
    )
  }

  useEffect(() => {
    if (!currentVideo) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeVideo()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentVideo])

  useEffect(() => {
    const onScroll = () => {
      const marker = window.innerHeight * 0.28
      let current = SECTIONS_WITH_CARDS[0].title

      SECTIONS_WITH_CARDS.forEach((section) => {
        const element = document.getElementById(sectionId(section.title))
        if (!element) return
        if (element.getBoundingClientRect().top - 96 <= marker) current = section.title
      })

      setActiveSection(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToSection = (title: string) => {
    setActiveSection(title)
    document.getElementById(sectionId(title))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const video = videoRef.current
    if (!currentVideo?.video || !video) return

    video.muted = false
    video.play().catch(() => {
      video.muted = true
      video.play().catch(() => {})
    })
  }, [currentVideo])

  return (
    <section className="min-h-screen px-4 pt-28 pb-32 md:px-8">
      <div className="mx-auto w-full max-w-3xl px-4">
        <Link
          href="/video-editing/work"
          className="font-teko text-lg uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white"
        >
          Work
        </Link>
        <h1 className="mt-4 font-teko text-4xl font-bold tracking-wider text-white md:text-6xl">
          {piece?.title ?? 'Two Blokes Trading'}
        </h1>
        <p className="mt-4 max-w-2xl font-teko text-lg leading-snug text-gray-300 md:text-xl">
          {piece?.description}
        </p>
        <p className="mt-1 max-w-2xl font-teko text-lg leading-snug text-gray-300 md:text-xl">
          Made 30+ long-form podcast episodes and 250+ short-form content. Grew YouTube subscribers from 2.9K to 8.2K (+183%) and views from 34.9K to 165.5K(+374%).
        </p>
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 font-teko text-xl tracking-wide text-white transition-colors hover:text-white/70"
        >
          View Channel
          <ArrowUpRight className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </a>
      </div>

      <div className="mx-auto mt-16 flex w-full max-w-[1600px] gap-6">
        <div className="hidden w-52 shrink-0 lg:block" aria-hidden="true" />
        <nav
          aria-label="Sections"
          className="fixed top-1/2 z-30 hidden w-52 -translate-y-1/2 lg:block"
          style={{ left: 'max(2rem, calc((100vw - 1600px) / 2))' }}
        >
          <ol className="relative space-y-5 border-l border-white/15 pl-5">
            {SECTIONS_WITH_CARDS.map((section) => {
              const active = activeSection === section.title

              return (
                <li key={section.title}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(section.title)}
                    aria-current={active ? 'true' : undefined}
                    className="group relative text-left"
                  >
                    <span
                      className={`absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border ${
                        active ? 'border-white bg-white' : 'border-white/40 bg-[#0B0B0B] group-hover:border-white/80'
                      }`}
                    />
                    <span
                      className={`block font-teko text-lg leading-tight tracking-wide ${
                        active ? 'text-white' : 'text-white/45 group-hover:text-white/75'
                      }`}
                    >
                      {section.title}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>

        <div className="min-w-0 flex-1 space-y-16">
          {SECTIONS_WITH_CARDS.map((section) => (
            <div key={section.title} id={sectionId(section.title)} className="scroll-mt-28">
              <h2 className="px-4 font-teko text-3xl tracking-wide text-white md:text-5xl">
                {section.title}
              </h2>
              <MasonryGrid
                items={section.items}
                aspect={section.aspect}
                columns={section.aspect === '16/9' ? 3 : 5}
                onItemClick={(item) => openVideo(item, section.aspect)}
              />
            </div>
          ))}
        </div>
      </div>

      {currentVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={closeVideo}
        >
          <div
            className={`relative mx-4 w-full ${playerAspect === '16/9' ? 'max-w-4xl' : 'max-w-md'}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 text-2xl text-white transition-colors hover:text-gray-300"
              aria-label="Close video"
            >
              ✕
            </button>
            <div className="relative overflow-hidden rounded-lg bg-black" style={{ aspectRatio: playerAspect }}>
              {currentVideo.youtubeId ? (
                <iframe
                  key={currentVideo.youtubeId}
                  src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1${currentVideo.youtubeStart ? `&start=${currentVideo.youtubeStart}` : ''}`}
                  title={currentVideo.alt}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : currentVideo.video ? (
                <video
                  ref={videoRef}
                  key={currentVideo.video}
                  src={currentVideo.video}
                  className="h-full w-full object-cover"
                  playsInline
                  autoPlay
                  controls
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <p className="font-teko text-3xl tracking-wide text-white">{currentVideo.linkText}</p>
                  <p className="font-teko text-lg text-white/50">Video coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
