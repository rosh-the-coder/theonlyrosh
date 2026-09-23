'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  {
    href: '/video-editing',
    label: 'My Videos',
    isActive: (pathname: string) => pathname === '/video-editing',
  },
  {
    href: '/video-editing/work',
    label: 'Work',
    isActive: (pathname: string) => pathname.startsWith('/video-editing/work'),
  },
]

export default function VideoSectionNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 inset-x-0 z-40 flex items-center justify-center gap-8 md:gap-14 h-16 pointer-events-none">
      {LINKS.map((link) => {
        const active = link.isActive(pathname)

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`pointer-events-auto font-teko text-xl md:text-2xl tracking-[0.18em] uppercase transition-colors border-b pb-0.5 ${
              active
                ? 'text-white border-white'
                : 'text-white/45 border-transparent hover:text-white/80'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
