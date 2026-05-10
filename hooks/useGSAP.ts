'use client'
import { useEffect, useRef } from 'react'

/**
 * SSR-safe GSAP hook. Run animations inside the callback;
 * they are automatically cleaned up on unmount.
 */
export function useGSAP(callback: (gsap: typeof import('gsap').gsap) => void, deps: unknown[] = []) {
  const ctx = useRef<{ revert: () => void } | null>(null)

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      if (!isMounted) return

      ctx.current = gsap.context(() => {
        callback(gsap)
      })
    }

    init()

    return () => {
      isMounted = false
      ctx.current?.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
