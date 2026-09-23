import VideoSectionNav from '@/components/VideoEditing/VideoSectionNav'
import FloatingBottomNav from '@/components/Navigation/FloatingBottomNav'
import CustomCursor from '@/components/UI/CustomCursor'

export default function VideoEditingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="bg-[#0B0B0B] min-h-screen">
      <VideoSectionNav />
      {children}
      <FloatingBottomNav />
      <CustomCursor />
    </main>
  )
}
