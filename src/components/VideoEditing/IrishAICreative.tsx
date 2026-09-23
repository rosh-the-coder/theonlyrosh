'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getVideoWork } from '@/components/VideoEditing/videoWork'
import {
  MasonryGrid,
  type MasonryCardData,
} from '@/components/UI/masonry-grid-with-scroll-animation'

const SECTIONS = [
  {
    title: 'ShowItOn',
    description: 'Fast-paced branded edits built around strong hooks, sharp pacing and social-first storytelling.',
  },
  {
    title: 'UGC',
    description: 'Native-feeling UGC creatives shaped from raw AI footage into concise, engaging and platform-ready ads.',
  },
  {
    title: 'AI Marketing',
    description: 'AI-generated concepts turned into unconventional marketing creatives.',
  },
  {
    title: 'Gold Testing Dublin(GTD)',
    description: 'Performance campaigns for their latest venture.',
  },
  {
    title: 'Willy & Jean-Luc',
    description: 'Character-led short-form series combining humour, personality and punchy social storytelling.',
  },
] as const
const R2_CDN = 'https://pub-14e70177217f4d5481f61d1335a55a75.r2.dev'
const AI_MARKETING_PREFIX = `${R2_CDN}/irish-ai-creative/ai-marketing`
const SHOWITON_PREFIX = `${R2_CDN}/irish-ai-creative/showiton`
const GTD_PREFIX = `${R2_CDN}/irish-ai-creative/gtd`
const WILLY_PREFIX = `${R2_CDN}/irish-ai-creative/willy-jean-luc`
const UGC_PREFIX = `${R2_CDN}/irish-ai-creative/ugc`
const PLACEHOLDER_COUNT = 12

function hostedCards(idPrefix: string, cdnPrefix: string, count: number, padUrls: boolean): MasonryCardData[] {
  return Array.from({ length: count }, (_, index) => {
    const label = String(index + 1).padStart(2, '0')
    const file = padUrls ? label : String(index + 1)

    return {
      id: `${idPrefix}-${label}`,
      src: `${cdnPrefix}/${file}.jpg`,
      alt: `${idPrefix} ${label}`,
      content: '',
      linkHref: '#',
      linkText: label,
      video: `${cdnPrefix}/${file}.mp4`,
    }
  })
}

function sectionId(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function placeholderCards(section: string): MasonryCardData[] {
  return Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => {
    const number = String(index + 1).padStart(2, '0')
    const title = `${section} ${number}`

    return {
      id: `${section}-${number}`,
      src: '',
      alt: title,
      content: 'Placeholder clip.',
      linkHref: '#',
      linkText: title,
      video: '',
    }
  })
}

const SECTIONS_WITH_CARDS = SECTIONS.map((section) => ({
  ...section,
  items:
    section.title === 'ShowItOn'
      ? hostedCards('showiton', SHOWITON_PREFIX, 16, true)
      : section.title === 'UGC'
        ? hostedCards('ugc', UGC_PREFIX, 15, true)
        : section.title === 'AI Marketing'
        ? hostedCards('ai-marketing', AI_MARKETING_PREFIX, 7, false)
        : section.title === 'Gold Testing Dublin(GTD)'
          ? hostedCards('gtd', GTD_PREFIX, 12, true)
          : section.title === 'Willy & Jean-Luc'
            ? hostedCards('willy', WILLY_PREFIX, 10, true)
            : placeholderCards(section.title),
}))

export default function IrishAICreative() {
  const piece = getVideoWork('irish-ai-creative')
  const [currentVideo, setCurrentVideo] = useState<MasonryCardData | null>(null)
  const [activeSection, setActiveSection] = useState(SECTIONS_WITH_CARDS[0].title)
  const videoRef = useRef<HTMLVideoElement>(null)

  const openVideo = (item: MasonryCardData) => {
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
          {piece?.title ?? 'Irish AI Creative'}
        </h1>
        <p className="mt-4 max-w-2xl font-teko text-lg leading-snug text-gray-300 md:text-xl">
          Commercial video, AI-generated content and performance creatives produced across brands, campaigns and social platforms.
        </p>
        <p className="mt-1 max-w-2xl font-teko text-lg leading-snug text-gray-300 md:text-xl">
          Selected work from 200+ videos created in 3 months
        </p>
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
            <p className="mt-1 px-4 font-teko text-lg leading-snug text-gray-300 md:text-xl">
              {section.description}
            </p>
            <MasonryGrid items={section.items} onItemClick={openVideo} />
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
            className="relative mx-4 w-full max-w-md"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 text-2xl text-white transition-colors hover:text-gray-300"
              aria-label="Close video"
            >
              ✕
            </button>
            <div className="relative overflow-hidden rounded-lg bg-black" style={{ aspectRatio: '9/16' }}>
              {currentVideo.video ? (
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
