export type VideoWorkPiece = {
  slug: string
  title: string
  description: string
}

export const VIDEO_WORK: VideoWorkPiece[] = [
  {
    slug: 'irish-ai-creative',
    title: 'Irish AI Creative',
    description:
      'They build custom AI tools that help small and medium-sized businesses automate workflows, reduce costs, and grow faster.',
  },
  {
    slug: 'two-blokes-trading',
    title: 'Two Blokes Trading',
    description:
      'Finance-focused digital content brand with a growing product offering (Trevesto), targeting retail investors.',
  },
]

export function getVideoWork(slug: string) {
  return VIDEO_WORK.find((piece) => piece.slug === slug)
}
