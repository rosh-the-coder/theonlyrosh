import { useEffect, useState, useRef, RefObject } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number
  root?: Element | null
  rootMargin?: string
}

export function useIntersectionObserver(
  ref: RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: options.threshold || 0,
        root: options.root || null,
        rootMargin: options.rootMargin || '0px',
      }
    )

    observer.observe(element)
    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [ref, options.threshold, options.root, options.rootMargin])

  return isIntersecting
}
