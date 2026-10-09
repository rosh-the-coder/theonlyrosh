'use client';

import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { motion } from 'framer-motion';

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const remain = whole % 60;
  return `${minutes}:${remain.toString().padStart(2, '0')}`;
}

const defaultChapters = [
  { title: 'INTRO', start: 0 },
  { title: 'ONBOARDING', start: 15 },
  { title: 'CORE', start: 50 },
  { title: 'SHOP', start: 2 * 60 + 58 },
  { title: 'MY GALLERY', start: 3 * 60 + 30 },
  { title: 'SOCIAL', start: 3 * 60 + 55 },
  { title: 'PROFILE', start: 4 * 60 + 25 },
  { title: 'CONCLUSION', start: 5 * 60 },
] as const;

type WalkthroughChapter = { title: string; start: number };

export type PlayerHandle = {
  seek: (seconds: number) => void;
  play: () => void;
};

function chapterAt(time: number, chapters: readonly WalkthroughChapter[]) {
  let match = chapters[0];
  for (const chapter of chapters) {
    if (time >= chapter.start) match = chapter;
  }
  return match;
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      {children}
    </svg>
  );
}

const WalkthroughPlayer = forwardRef<PlayerHandle, {
  src: string;
  hidden?: boolean;
  title?: string;
  accent?: string;
  chapters?: readonly WalkthroughChapter[];
  closeLabel?: string;
  openLabel?: string;
  resumeWhenShown?: boolean;
  playRequest?: number;
  openExpanded?: boolean;
  onDismiss?: () => void;
  animate?: boolean;
  variant?: 'dock' | 'inline';
  reportHref?: string;
}>(function WalkthroughPlayer({
  src,
  hidden = false,
  title = 'Walkthrough',
  accent = '#FF4B4B',
  chapters = defaultChapters,
  closeLabel = 'Minimize walkthrough',
  openLabel = 'Open walkthrough',
  resumeWhenShown = true,
  playRequest = 0,
  openExpanded = false,
  onDismiss,
  animate = false,
  variant = 'dock',
  reportHref,
}, ref) {
  const inline = variant === 'inline';
  const videoRef = useRef<HTMLVideoElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusOnMinimize = useRef(false);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const playedRequest = useRef(0);
  const hiddenRef = useRef(hidden);
  hiddenRef.current = hidden;
  const setShell = useCallback((node: HTMLDivElement | null) => {
    shellRef.current = node;
    if (node && hiddenRef.current) node.setAttribute('inert', '');
  }, []);
  const wasPlaying = useRef(false);
  const labelId = useId();
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [pipSupported, setPipSupported] = useState(false);
  const [inPip, setInPip] = useState(false);
  const [rate, setRate] = useState(1);
  const [rateOpen, setRateOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    if (inline || !reportHref) return;
    const media = window.matchMedia('(max-width: 639px)');
    const apply = () => {
      if (media.matches) setMinimized(true);
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [inline, reportHref]);
  const scrubbing = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ ratio: number; time: number } | null>(null);

  useEffect(() => {
    setPipSupported(document.pictureInPictureEnabled);
    const video = videoRef.current;
    if (!video) return;
    const enter = () => setInPip(true);
    const leave = () => setInPip(false);
    video.addEventListener('enterpictureinpicture', enter);
    video.addEventListener('leavepictureinpicture', leave);
    const syncDuration = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) setDuration(video.duration);
    };
    syncDuration();
    video.addEventListener('loadedmetadata', syncDuration);
    video.addEventListener('durationchange', syncDuration);
    return () => {
      video.removeEventListener('enterpictureinpicture', enter);
      video.removeEventListener('leavepictureinpicture', leave);
      video.removeEventListener('loadedmetadata', syncDuration);
      video.removeEventListener('durationchange', syncDuration);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!hidden) {
      if (resumeWhenShown && wasPlaying.current) {
        video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        wasPlaying.current = false;
      }
      return;
    }
    wasPlaying.current = !video.paused && !video.ended;
    video.pause();
    setPlaying(false);
    setExpanded(false);
    if (document.pictureInPictureElement === video) {
      document.exitPictureInPicture().catch(() => {});
    }
  }, [hidden, resumeWhenShown]);

  useEffect(() => {
    const node = shellRef.current;
    if (!node) return;
    if (hidden) node.setAttribute('inert', '');
    else node.removeAttribute('inert');
  }, [hidden]);

  useLayoutEffect(() => {
    if (!playRequest || playRequest === playedRequest.current) return;
    playedRequest.current = playRequest;
    const video = videoRef.current;
    if (!video || hidden) return;
    setMinimized(false);
    if (openExpanded) setExpanded(true);
    video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [playRequest, hidden, openExpanded]);

  useEffect(() => {
    if (!expanded || hidden) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setExpanded(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [expanded, hidden]);

  function rememberDuration(video: HTMLVideoElement) {
    if (Number.isFinite(video.duration) && video.duration > 0) setDuration(video.duration);
  }

  function seekTo(next: number) {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const time = Math.min(video.duration, Math.max(0, next));
    video.currentTime = time;
    setCurrent(time);
  }

  function seekFromClientX(clientX: number) {
    const track = trackRef.current;
    const video = videoRef.current;
    if (!track || !video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const rect = track.getBoundingClientRect();
    const ratio = rect.width <= 0 ? 0 : Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    seekTo(ratio * video.duration);
  }

  function applyRate(next: number) {
    const video = videoRef.current;
    if (video) video.playbackRate = next;
    setRate(next);
    setRateOpen(false);
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  async function togglePip() {
    const video = videoRef.current;
    if (!video || !document.pictureInPictureEnabled) return;
    try {
      if (document.pictureInPictureElement === video) {
        await document.exitPictureInPicture();
        return;
      }
      setExpanded(false);
      await video.requestPictureInPicture();
    } catch {
      setInPip(false);
    }
  }

  const shell = inline
    ? 'relative w-full'
    : minimized
      ? 'fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 sm:bottom-6 sm:right-6'
      : expanded
        ? 'fixed inset-0 z-40 flex items-center justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-10'
        : 'fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 w-max max-w-[calc(100vw-2rem)] sm:bottom-6 sm:right-6';

  const progress = duration > 0 ? Math.min(1, current / duration) : 0;
  const showChapters = chapters.length > 0 && (inline || expanded);
  const chapter = showChapters ? chapterAt(current, chapters) : null;

  useEffect(() => {
    if (!minimized || !returnFocusOnMinimize.current) return;
    returnFocusOnMinimize.current = false;
    openButtonRef.current?.focus();
  }, [minimized]);

  useImperativeHandle(ref, () => ({
    seek: (seconds: number) => {
      const video = videoRef.current;
      if (!video) return;
      const time = Number.isFinite(video.duration) && video.duration > 0
        ? Math.min(video.duration, Math.max(0, seconds))
        : Math.max(0, seconds);
      video.currentTime = time;
      setCurrent(time);
    },
    play: () => {
      videoRef.current?.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    },
  }));

  const reportLink = !inline && reportHref ? (
    <motion.a
      layout="position"
      transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
      href={reportHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Read the full report. Opens the report folder in a new tab."
      className="inline-flex min-h-11 items-center rounded-full bg-black/55 px-3 text-sm font-medium text-white backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <span className="max-[380px]:hidden">Read the full report ↗</span>
      <span className="hidden max-[380px]:inline">Full report ↗</span>
    </motion.a>
  ) : null;

  return (
    <div
      ref={setShell}
      className={`${shell} ${animate && !hidden ? 'walkthrough-player-in' : ''} motion-reduce:transition-none ${hidden ? 'pointer-events-none invisible' : ''}`}
      style={{ '--walkthrough-accent': accent } as CSSProperties}
    >
      {!minimized && expanded && (
        <button
          type="button"
          className="absolute inset-0 bg-[#0f0f0f]/55 backdrop-blur-md"
          aria-label="Minimise walkthrough"
          onClick={() => setExpanded(false)}
        />
      )}
      <div
        className={inline ? 'w-full' : minimized ? 'flex items-center gap-3' : `relative z-10 flex flex-col items-end gap-2 ${expanded ? 'w-[min(1100px,94vw)]' : ''}`}
      >
      {reportLink}
      {minimized ? (
        <button
          ref={openButtonRef}
          type="button"
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[var(--walkthrough-accent)] text-white shadow-[0_16px_50px_rgba(0,0,0,0.45)]"
          aria-label={openLabel}
          onClick={() => setMinimized(false)}
        >
          <Icon><path d="M8 5.5v13l11-6.5-11-6.5z" /></Icon>
        </button>
      ) : null}
      <div
        role={expanded ? 'dialog' : 'region'}
        aria-modal={expanded || undefined}
        aria-labelledby={labelId}
        aria-hidden={hidden || minimized}
        className={`${minimized ? 'hidden' : 'relative flex'} flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#111] shadow-[0_16px_50px_rgba(0,0,0,0.45)] ${expanded || inline ? 'w-full' : reportHref ? 'w-[min(calc(100vw-2rem),340px)]' : 'w-[200px] sm:w-[340px]'}`}
      >
        <div className="relative bg-black">
          <video
            ref={videoRef}
            src={src}
            playsInline
            preload="metadata"
            className={`block w-full bg-black object-contain ${expanded ? 'max-h-[78vh]' : 'aspect-video cursor-pointer'}`}
            onClick={() => {
              if (inline || expanded) togglePlay();
              else setExpanded(true);
            }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(event) => {
              if (!scrubbing.current) setCurrent(event.currentTarget.currentTime);
            }}
            onLoadedMetadata={(event) => {
              rememberDuration(event.currentTarget);
              event.currentTarget.playbackRate = rate;
            }}
            onDurationChange={(event) => rememberDuration(event.currentTarget)}
            onVolumeChange={(event) => {
              setMuted(event.currentTarget.muted);
              setVolume(event.currentTarget.volume);
            }}
          />
          {inPip && (
            <p className="absolute inset-0 grid place-items-center bg-[#111] px-4 text-center text-xs text-[#aaa]">
              Playing in a picture-in-picture window
            </p>
          )}
          {!inline && (
          <button
            type="button"
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white"
            aria-label={closeLabel}
            onClick={(event) => {
              event.stopPropagation();
              videoRef.current?.pause();
              setExpanded(false);
              setRateOpen(false);
              if (onDismiss) onDismiss();
              else {
                returnFocusOnMinimize.current = true;
                setMinimized(true);
              }
            }}
          >
            <Icon><path d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4 6.4 5z" /></Icon>
          </button>
          )}
          {!playing && !inPip && (
            <button
              type="button"
              className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--walkthrough-accent)] text-white"
              aria-label="Play"
              onClick={(event) => {
                event.stopPropagation();
                togglePlay();
              }}
            >
              <Icon><path d="M8 5.5v13l11-6.5-11-6.5z" /></Icon>
            </button>
          )}
        </div>
        <div className="bg-[#1a1a1a] px-2.5 py-2">
          <div className="flex items-center justify-between gap-2 px-1">
            <p id={labelId} className="text-xs font-medium text-white">{title}</p>
            <div>
              <button
                type="button"
                className="rounded-full px-2 py-1 text-xs font-medium text-white"
                aria-expanded={rateOpen}
                aria-label={`Playback speed ${rate} times`}
                onClick={() => setRateOpen((open) => !open)}
              >
                {rate}×
              </button>
            </div>
          </div>
          {rateOpen && (
            <div className="mt-1 flex gap-1 px-1">
              {[1, 1.5, 2].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${option === rate ? 'bg-[var(--walkthrough-accent)] text-white' : 'bg-[#272727] text-[#aaa]'}`}
                  onClick={() => applyRate(option)}
                >
                  {option}×
                </button>
              ))}
            </div>
          )}
          <div
            ref={trackRef}
            role="slider"
            tabIndex={hidden ? -1 : 0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(current)}
            aria-valuetext={chapter ? `${formatTime(current)} of ${formatTime(duration)}, ${chapter.title}` : `${formatTime(current)} of ${formatTime(duration)}`}
            className="relative mt-1 flex h-8 cursor-pointer items-center px-1"
            onPointerLeave={() => {
              if (!scrubbing.current) setHover(null);
            }}
            onPointerDown={(event) => {
              scrubbing.current = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              seekFromClientX(event.clientX);
            }}
            onPointerMove={(event) => {
              if (showChapters && duration > 0) {
                const rect = event.currentTarget.getBoundingClientRect();
                const ratio = rect.width <= 0 ? 0 : Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
                setHover({ ratio, time: ratio * duration });
              }
              if (!scrubbing.current) return;
              seekFromClientX(event.clientX);
            }}
            onPointerUp={() => {
              scrubbing.current = false;
            }}
            onPointerCancel={() => {
              scrubbing.current = false;
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') {
                event.preventDefault();
                seekTo(current + 5);
              } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                seekTo(current - 5);
              }
            }}
          >
            {showChapters && hover && (
              <span
                className="pointer-events-none absolute bottom-full z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/90 px-2 py-1 text-xs text-white"
                style={{ left: `${hover.ratio * 100}%` }}
              >
                {chapterAt(hover.time, chapters)?.title}
                <span className="ml-2 tabular-nums text-[#aaa]">{formatTime(hover.time)}</span>
              </span>
            )}
            <span className="relative h-1.5 w-full">
              {showChapters && duration > 0 ? (
                chapters.map((chapter, index) => {
                  const end = chapters[index + 1]?.start ?? duration;
                  const span = Math.max(0, end - chapter.start) / duration;
                  const fill = current <= chapter.start ? 0 : current >= end ? 1 : (current - chapter.start) / (end - chapter.start);
                  return (
                    <span
                      key={chapter.title}
                      className="absolute inset-y-0 overflow-hidden rounded-full bg-white/25"
                      data-chapter={chapter.title}
                      style={{ left: `${(chapter.start / duration) * 100}%`, width: `max(2px, calc(${span * 100}% - 3px))` }}
                    >
                      <span className="absolute inset-y-0 left-0 bg-[var(--walkthrough-accent)]" style={{ width: `${fill * 100}%` }} />
                    </span>
                  );
                })
              ) : (
                <span className="absolute inset-0 overflow-hidden rounded-full bg-[#272727]">
                  <span className="absolute inset-y-0 left-0 bg-[var(--walkthrough-accent)]" style={{ width: `${progress * 100}%` }} />
                </span>
              )}
              <span className="absolute top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white" style={{ left: `calc(${progress * 100}% - 7px)` }} />
            </span>
          </div>
          {chapter && (
            <p className="px-1 text-[11px] font-medium tracking-wide text-white">{chapter.title}</p>
          )}
          <div className="mt-1 flex items-center gap-1">
            <button type="button" onClick={togglePlay} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white" aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <Icon><path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" /></Icon> : <Icon><path d="M8 5.5v13l11-6.5-11-6.5z" /></Icon>}
            </button>
            <span className="min-w-0 shrink text-[11px] tabular-nums text-[#aaa]">{formatTime(current)} / {formatTime(duration)}</span>
            <span className="flex-1" />
            <button
              type="button"
              className="grid h-9 w-9 shrink-0 place-items-center text-white"
              aria-label={muted || volume === 0 ? 'Unmute' : 'Mute'}
              onClick={() => {
                const video = videoRef.current;
                if (!video) return;
                video.muted = !video.muted;
                setMuted(video.muted);
              }}
            >
              {muted || volume === 0
                ? <Icon><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3 2.2-2.2-1.4-1.4L15.1 10.6l-2.2-2.2-1.4 1.4 2.2 2.2-2.2 2.2 1.4 1.4 2.2-2.2 2.2 2.2 1.4-1.4-2.2-2.2z" /></Icon>
                : <Icon><path d="M4 9v6h4l5 4V5L8 9H4zm11.5 3a3.5 3.5 0 0 0-2-3.1v6.2a3.5 3.5 0 0 0 2-3.1z" /></Icon>}
            </button>
            {(inline || expanded) && (
              <input
                aria-label="Volume"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                className="hidden h-1 w-16 accent-[var(--walkthrough-accent)] sm:block"
                onChange={(event) => {
                  const video = videoRef.current;
                  if (!video) return;
                  const next = Number(event.target.value);
                  video.volume = next;
                  video.muted = next === 0;
                  setVolume(next);
                  setMuted(next === 0);
                }}
              />
            )}
            {pipSupported && (
              <button type="button" onClick={togglePip} className="grid h-9 w-9 shrink-0 place-items-center text-white" aria-label={inPip ? 'Exit picture in picture' : 'Picture in picture'}>
                <Icon><path d="M3 5h18v14H3V5zm2 2v10h14V7H5zm6 2h6v4h-6V9z" /></Icon>
              </button>
            )}
            {!inline && (
            <button type="button" onClick={() => setExpanded((value) => !value)} className="grid h-9 w-9 shrink-0 place-items-center text-white" aria-label={expanded ? 'Minimise walkthrough' : 'Expand walkthrough'}>
              {expanded
                ? <Icon><path d="M9 4H4v5h2V6h3V4zm11 5V4h-5v2h3v3h2zM6 15H4v5h5v-2H6v-3zm12 3h-3v2h5v-5h-2v3z" /></Icon>
                : <Icon><path d="M4 9V4h5v2H6v3H4zm10-5h5v5h-2V6h-3V4zM6 15v3h3v2H4v-5h2zm12 0h2v5h-5v-2h3v-3z" /></Icon>}
            </button>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
});

export default WalkthroughPlayer;
