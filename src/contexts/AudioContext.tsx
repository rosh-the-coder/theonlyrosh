'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

type AudioSource = 'music-player' | 'showreel' | 'about-video' | 'work-video' | 'unity-game' | null;

interface AudioContextType {
  activeAudio: AudioSource;
  requestAudioPlay: (source: AudioSource) => boolean;
  releaseAudio: (source: AudioSource) => void;
  pauseAllAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [activeAudio, setActiveAudio] = useState<AudioSource>(null);
  const audioCallbacks = useRef<Map<AudioSource, () => void>>(new Map());

  const requestAudioPlay = useCallback((source: AudioSource): boolean => {
    if (activeAudio && activeAudio !== source) {
      // Pause current audio before allowing new one
      const callback = audioCallbacks.current.get(activeAudio);
      if (callback) callback();
    }
    setActiveAudio(source);
    return true;
  }, [activeAudio]);

  const releaseAudio = useCallback((source: AudioSource) => {
    setActiveAudio(current => current === source ? null : current);
    audioCallbacks.current.delete(source);
  }, []);

  const pauseAllAudio = useCallback(() => {
    audioCallbacks.current.forEach(callback => callback());
    setActiveAudio(null);
  }, []);

  // Register pause callbacks
  const registerPauseCallback = useCallback((source: AudioSource, callback: () => void) => {
    audioCallbacks.current.set(source, callback);
  }, []);

  return (
    <AudioContext.Provider value={{ activeAudio, requestAudioPlay, releaseAudio, pauseAllAudio }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioManager() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioManager must be used within AudioProvider');
  }
  return context;
}

