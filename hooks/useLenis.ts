'use client'
import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export function useLenis() {
  useEffect(() => {
    // Dynamically import to avoid SSR issues
    let lenis: Lenis
    let rafId: number | undefined

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      // Expose globally for pausing during animations
      ;(window as any).lenis = lenis

      lenis.on('scroll', ScrollTrigger.update)

      const ticker = (time: number) => {
        lenis.raf(time * 1000)
      }

      gsap.ticker.add(ticker)
      gsap.ticker.lagSmoothing(0)
    }

    init()

    return () => {
      if (lenis) lenis.destroy()
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])
}
