import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Roshan Najar - UX Designer & Developer',
  description: 'Multidisciplinary UX/UI designer, creative developer, and digital storyteller based in Dublin, Ireland.',
  keywords: 'UX Design, UI Design, Web Development, Creative Developer, Dublin, Ireland',
  authors: [{ name: 'Roshan Najar' }],
  openGraph: {
    title: 'Roshan Najar - UX Designer & Developer',
    description: 'Multidisciplinary UX/UI designer, creative developer, and digital storyteller.',
    url: 'https://theonlyrosh.com',
    siteName: 'Roshan Najar Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Roshan Najar Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roshan Najar - UX Designer & Developer',
    description: 'Multidisciplinary UX/UI designer, creative developer, and digital storyteller.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Climate+Crisis:wght@400&family=Imbue:wght@100;200;300;400;500;600;700;800;900&family=Teko:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
