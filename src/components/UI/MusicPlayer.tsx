'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react'

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const sfxRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio when component mounts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      audioRef.current.loop = true
    }
  }, [])

  // Preload SFX
  useEffect(() => {
    sfxRef.current = new Audio('/music/tape-rec_sfx.mp3')
    sfxRef.current.volume = 0.6
    sfxRef.current.preload = 'auto'
  }, [])

  // Update audio volume when volume state changes
  useEffect(() => {
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = volume
    }
  }, [volume, isMuted])

  const togglePlay = async () => {
    if (!audioRef.current) return

    // Play tape feedback sound on every click
    playTapeFeedback()

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        setIsLoading(true)
        setHasError(false)
        
        // Load the audio if it hasn't been loaded yet
        if (audioRef.current.readyState === 0) {
          audioRef.current.load()
        }
        
        await audioRef.current.play()
        setIsPlaying(true)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error playing audio:', error)
      setHasError(true)
      setIsLoading(false)
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    
    // Play tape feedback sound on mute toggle
    playTapeFeedback()
    
    if (isMuted) {
      audioRef.current.volume = volume
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (!isMuted && audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  // Handle audio events
  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  const handleAudioError = () => {
    setHasError(true)
    setIsLoading(false)
    setIsPlaying(false)
  }

  // Tape recorder feedback sound effect using custom SFX
  const playTapeFeedback = () => {
    try {
      if (sfxRef.current) {
        // Reset to beginning if already playing
        sfxRef.current.currentTime = 0
        sfxRef.current.play().catch((error) => {
          console.warn('Could not play tape SFX:', error)
        })
      }
    } catch (error) {
      console.warn('Error playing tape SFX:', error)
    }
  }

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        preload="metadata"
      >
        <source src="/music/ambient-music.mp3" type="audio/mpeg" />
        <source src="/music/ambient-music.ogg" type="audio/ogg" />
        <source src="/music/ambient-music.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>

      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Player Button */}
          <motion.button
            className={`w-14 h-14 backdrop-blur-sm border rounded-full flex items-center justify-center text-white transition-colors ${
              hasError 
                ? 'bg-red-500/80 border-red-400/20 hover:bg-red-500/90' 
                : 'bg-black/80 border-white/20 hover:bg-white/10'
            }`}
            onClick={togglePlay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </motion.button>

        {/* Volume Control */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className={`absolute left-16 top-1/2 -translate-y-1/2 backdrop-blur-sm border rounded-lg p-3 flex items-center gap-3 ${
                hasError 
                  ? 'bg-red-500/80 border-red-400/20' 
                  : 'bg-black/80 border-white/20'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className={`transition-colors ${
                  hasError 
                    ? 'text-red-200 hover:text-red-100' 
                    : 'text-white hover:text-gray-300'
                }`}
                onClick={toggleMute}
                disabled={hasError}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className={`w-20 h-1 rounded-lg appearance-none cursor-pointer ${
                  hasError ? 'bg-red-200/20' : 'bg-white/20'
                }`}
                style={{
                  background: hasError 
                    ? `linear-gradient(to right, #ef4444 0%, #ef4444 ${(isMuted ? 0 : volume) * 100}%, rgba(239,68,68,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(239,68,68,0.2) 100%)`
                    : `linear-gradient(to right, #FF5353 0%, #FF5353 ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
                disabled={hasError}
              />
              
              {hasError && (
                <span className="text-xs text-red-200 whitespace-nowrap">
                  Audio Error
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Music Icon */}
        <motion.div
          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${
            hasError ? 'bg-red-500' : 'bg-[#FF5353]'
          }`}
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
        >
          <Music className="w-3 h-3 text-white" />
        </motion.div>
      </div>
    </motion.div>
    </>
  )
}