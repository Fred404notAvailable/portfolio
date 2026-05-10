'use client'
import { useEffect } from 'react'

export function useLenis() {
  useEffect(() => {
    const init = async () => {
      const { default: Lenis } = await import('lenis')
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      // Expose globally so Ignition can pause/resume during intro animation
      ;(window as any).lenis = lenis

      // Sync Lenis scroll position with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update)

      // GSAP ticker passes time in seconds — Lenis.raf expects milliseconds
      const ticker = (time: number) => {
        lenis.raf(time * 1000)
      }

      gsap.ticker.add(ticker)
      // Let gsap-init.ts handle lagSmoothing globally — don't set to 0 here
      // lagSmoothing(0) disables the safety catch that prevents runaway animations

      // Store for cleanup
      ;(window as any)._lenisCleanup = () => {
        gsap.ticker.remove(ticker)
        lenis.destroy()
        delete (window as any).lenis
        delete (window as any)._lenisCleanup
      }
    }

    init()

    return () => {
      if (typeof window !== 'undefined' && (window as any)._lenisCleanup) {
        (window as any)._lenisCleanup()
      }
    }
  }, [])
}
