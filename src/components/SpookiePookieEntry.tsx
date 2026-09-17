'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SpectralGhostSection from './Sections/Intro_Spooky-Pookie';
import UnityButtonOverlay from './UnityButtonOverlay';
import SPWebgl from './Sections/SP-webgl';

export default function SpookiePookieEntry() {
  const [isOpen, setIsOpen] = useState(false);

  // lock page scroll when modal open
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    if (isOpen) document.documentElement.style.overflow = 'hidden';
    else document.documentElement.style.overflow = prev || '';
    return () => { document.documentElement.style.overflow = prev || ''; };
  }, [isOpen]);

  return (
    <>
      {/* Your intro hero with overlay */}
      <SpectralGhostSection showControls={!isOpen}>
        <UnityButtonOverlay onOpenUnity={() => setIsOpen(true)} isVisible={!isOpen} />
      </SpectralGhostSection>

      {/* Unity modal (temporary page) */}
      <AnimatePresence>
        {isOpen && (
          <SPWebgl
            key="sp-modal"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
