'use client'
import { useEffect, useRef } from 'react'

export function useCountUp(end: number, suffix = '', decimals = 0) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          const { CountUp } = await import('countup.js')
          const cu = new CountUp(el, end, {
            suffix,
            duration: 2.5,
            decimalPlaces: decimals,
            useEasing: true,
            useGrouping: false,
          })
          if (!cu.error) cu.start()
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, suffix, decimals])

  return ref
}
