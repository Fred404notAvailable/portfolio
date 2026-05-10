'use client'
import { useEffect } from 'react'
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap-init'

export function useWordReveal(selector: string) {
  useEffect(() => {
    const els = document.querySelectorAll(selector)
    const splits: SplitText[] = []

    els.forEach(el => {
      // Prevent multiple initialization
      if (el.hasAttribute('data-split')) return
      el.setAttribute('data-split', 'true')

      const split = new SplitText(el, { type: 'words' })
      splits.push(split)
      
      gsap.set(split.words, { opacity: 0.15, color: 'var(--muted)' })
      
      gsap.to(split.words, {
        opacity: 1,
        color: 'var(--text)',
        stagger: { each: 0.05, from: 'start' },
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          end: 'bottom 30%',
          scrub: 0.5,
        },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger && typeof t.vars.trigger !== 'string') {
          // generic cleanup
        }
      })
      splits.forEach(split => split.revert())
      els.forEach(el => el.removeAttribute('data-split'))
    }
  }, [selector])
}
