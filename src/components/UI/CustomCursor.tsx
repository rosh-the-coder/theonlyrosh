'use client'

import { useEffect, useRef, useState } from 'react'

const TRAIL_EASE = 0.12
const REST_DISTANCE_SQ = 0.25

function exclusionColorAt(x: number, y: number): string {
  let backgroundColor = 'rgb(11, 11, 11)'
  const element = document.elementFromPoint(x, y)

  if (!element) return '#FE5454'

  let currentElement = element as HTMLElement
  while (currentElement && currentElement !== document.body) {
    const computedStyle = window.getComputedStyle(currentElement)
    const bg = computedStyle.backgroundColor

    if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
      backgroundColor = bg
      break
    }

    currentElement = currentElement.parentElement as HTMLElement
  }

  if (backgroundColor === 'rgb(11, 11, 11)') {
    const bodyStyle = window.getComputedStyle(document.body)
    const bodyBg = bodyStyle.backgroundColor
    if (bodyBg && bodyBg !== 'transparent' && bodyBg !== 'rgba(0, 0, 0, 0)') {
      backgroundColor = bodyBg
    }
  }

  let r = 11, g = 11, b = 11

  const rgbMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (rgbMatch) {
    r = parseInt(rgbMatch[1], 10)
    g = parseInt(rgbMatch[2], 10)
    b = parseInt(rgbMatch[3], 10)
  } else {
    const rgbaMatch = backgroundColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
    if (rgbaMatch) {
      r = parseInt(rgbaMatch[1], 10)
      g = parseInt(rgbaMatch[2], 10)
      b = parseInt(rgbaMatch[3], 10)
    }
  }

  const exclusionR = 255 - r
  const exclusionG = 255 - g
  const exclusionB = 255 - b

  return `#${((1 << 24) + (exclusionR << 16) + (exclusionG << 8) + exclusionB).toString(16).slice(1)}`
}

function place(el: HTMLDivElement | null, x: number, y: number) {
  if (!el) return
  el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
}

export default function CustomCursor() {
  const [isActive, setIsActive] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [cursorColor, setCursorColor] = useState('#FE5454')

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const trailRef = useRef({ x: 0, y: 0 })
  const hoveringRef = useRef(false)
  const clickingRef = useRef(false)
  const colorRef = useRef('#FE5454')
  const lastTargetRef = useRef<EventTarget | null>(null)

  useEffect(() => {
    if (window.innerWidth <= 768) return

    let alive = true
    let frameId = 0
    let loopOn = false

    setIsActive(true)

    const paintTrail = () => {
      place(ringRef.current, trailRef.current.x, trailRef.current.y)
    }

    const tick = () => {
      frameId = 0
      if (!alive) {
        loopOn = false
        return
      }

      const dx = mouseRef.current.x - trailRef.current.x
      const dy = mouseRef.current.y - trailRef.current.y

      if (dx * dx + dy * dy < REST_DISTANCE_SQ) {
        trailRef.current.x = mouseRef.current.x
        trailRef.current.y = mouseRef.current.y
        paintTrail()
        loopOn = false
        return
      }

      trailRef.current.x += dx * TRAIL_EASE
      trailRef.current.y += dy * TRAIL_EASE
      paintTrail()
      frameId = requestAnimationFrame(tick)
    }

    const startLoop = () => {
      if (!alive || loopOn) return
      loopOn = true
      frameId = requestAnimationFrame(tick)
    }

    const setHover = (next: boolean) => {
      if (!alive || next === hoveringRef.current) return
      hoveringRef.current = next
      setIsHovering(next)
    }

    const setClicking = (next: boolean) => {
      if (!alive || next === clickingRef.current) return
      clickingRef.current = next
      setIsClicking(next)
    }

    const setColor = (next: string) => {
      if (!alive || next === colorRef.current) return
      colorRef.current = next
      setCursorColor(next)
    }

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      place(dotRef.current, e.clientX, e.clientY)
      startLoop()

      if (e.target === lastTargetRef.current) return
      lastTargetRef.current = e.target

      const target = e.target instanceof Element ? e.target : null
      setHover(!!target?.closest('button, a, [data-cursor="hover"]'))
      setColor(exclusionColorAt(e.clientX, e.clientY))
    }

    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)

    return () => {
      alive = false
      loopOn = false
      if (frameId) cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
    }
  }, [])

  useEffect(() => {
    if (!isActive) return
    place(dotRef.current, mouseRef.current.x, mouseRef.current.y)
    place(ringRef.current, trailRef.current.x, trailRef.current.y)
  }, [isActive])

  if (!isActive) return null

  return (
    <>
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: 0,
          top: 0,
          transform: 'translate3d(0px, 0px, 0) translate(-50%, -50%)',
        }}
      >
        <div
          className={`w-12 h-12 border-2 rounded-full transition-all duration-200 ease-out ${
            isHovering ? 'scale-150 opacity-80' : 'scale-100 opacity-60'
          }`}
          style={{
            borderColor: cursorColor,
          }}
        />
      </div>

      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: 0,
          top: 0,
          transform: 'translate3d(0px, 0px, 0) translate(-50%, -50%)',
        }}
      >
        <div
          className={`w-2.5 h-2.5 rounded-full transition-all duration-100 ease-out ${
            isHovering ? 'scale-200' : isClicking ? 'scale-50' : 'scale-100'
          }`}
          style={{
            backgroundColor: cursorColor,
          }}
        />
      </div>
    </>
  )
}
