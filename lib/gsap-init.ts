import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

// Register plugins once, client-side only
// Guarded to prevent SSR errors and duplicate registration warnings
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText)

  // Normalize scroll across devices (helps with iOS momentum, Windows trackpads, etc.)
  ScrollTrigger.normalizeScroll(true)

  // Prevent GSAP from over-compensating after tab focus loss (causes scroll jump)
  gsap.ticker.lagSmoothing(500, 33)
}

export { gsap, ScrollTrigger, SplitText }
