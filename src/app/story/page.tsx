import { redirect } from 'next/navigation'

// This route is served by the standalone HTML file at /story.html
// which implements scroll-driven video scrubbing without any framework overhead.
export default function StoryPage() {
  redirect('/story.html')
}
