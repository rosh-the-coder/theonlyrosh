'use client'

import VideoEditing from "@/components/VideoEditing/VideoEditing";
import FloatingBottomNav from "@/components/Navigation/FloatingBottomNav";
import CustomCursor from "@/components/UI/CustomCursor";

export default function VideoEditingPage() {
  return (
    <>
      <main className="bg-[#0B0B0B] min-h-screen">
        <VideoEditing />
        <FloatingBottomNav />
        <CustomCursor />
      </main>
    </>
  );
}

