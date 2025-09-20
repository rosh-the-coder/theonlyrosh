'use client'

import VideoEditing from "@/components/VideoEditing/VideoEditing";
import CustomCursor from "@/components/UI/CustomCursor";

export default function VideoEditingPage() {
  return (
    <>
      <main className="bg-[#0B0B0B] min-h-screen">
        <VideoEditing />
        <CustomCursor />
      </main>
    </>
  );
}

