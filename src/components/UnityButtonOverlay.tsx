'use client';

import React from 'react';

interface UnityButtonOverlayProps {
  onOpenUnity: () => void;
  isVisible?: boolean;
}

export default function UnityButtonOverlay({ onOpenUnity, isVisible = true }: UnityButtonOverlayProps) {
  console.log('UnityButtonOverlay rendering');
  
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-[40] pointer-events-none hidden md:block">
      <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: '400px' }}>
        <div className="text-center">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Button clicked!');
              onOpenUnity();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Button mouse down!');
            }}
            className="pointer-events-auto inline-flex items-center gap-2 px-6 py-4 rounded-full border-2 border-red-500 bg-red-500/20 text-white text-sm font-mono uppercase tracking-wider backdrop-blur-sm transition-all duration-200 hover:translate-y-[-2px] hover:bg-red-500/40 hover:border-red-400 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-3"
            aria-haspopup="dialog"
            aria-controls="spookie-pookie-unity"
            style={{ 
              position: 'relative'
            }}
          >
            IS IT THAT TIME OF THE YEAR?
          </button>
        </div>
      </div>
    </div>
  );
}
