'use client'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { gsap, SplitText } from '@/lib/gsap-init'
import { emberConfig } from '@/lib/particles-config'

const Particles = dynamic(() => import('@tsparticles/react').then(m => m.Particles), { ssr: false })

export default function Ignition() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([])

  const [particlesInit, setParticlesInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setParticlesInit(true))
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Lock scroll while intro plays (handles both native and async lenis)
      document.body.style.overflow = 'hidden'
      
      const preventScroll = (e: Event) => {
        e.preventDefault()
      }
      const preventKeys = (e: KeyboardEvent) => {
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Space'].includes(e.key)) {
          e.preventDefault()
        }
      }

      const unlockScroll = () => {
        document.body.style.overflow = ''
        window.removeEventListener('wheel', preventScroll)
        window.removeEventListener('touchmove', preventScroll)
        window.removeEventListener('keydown', preventKeys)
        if (typeof window !== 'undefined' && (window as any).lenis) {
          (window as any).lenis.start()
        }
      }
      
      window.addEventListener('wheel', preventScroll, { passive: false })
      window.addEventListener('touchmove', preventScroll, { passive: false })
      window.addEventListener('keydown', preventKeys, { passive: false })

      // Safety net: always unlock after 6s regardless of animation state
      // Prevents permanent scroll lock on slow devices or if GSAP stalls
      const safetyTimer = setTimeout(unlockScroll, 6000)

      // Also try to stop lenis if it's already there
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.stop()
      }

      gsap.set([titleRef.current, ctaRef.current, logoRef.current, '#particles-hero'], { opacity: 0 })

      const tl = gsap.timeline({ 
        delay: 0.1,
        onComplete: () => {
          clearTimeout(safetyTimer)
          unlockScroll()
        }
      })

      // Make title container visible so SVGs are visible, but keep text invisible
      tl.to(titleRef.current, { opacity: 1, duration: 0 })

      // Split text for the staggered mask reveal later
      const split = new SplitText(titleRef.current, { type: 'chars, words' })
      gsap.set(split.words, { overflow: 'hidden', padding: '0 0.1em', margin: '0 -0.1em', verticalAlign: 'bottom' })
      gsap.set(split.chars, { yPercent: 120 }) // text hidden below mask

      // 2. Preloader Phase: SVGs fly from edges to the CENTER of the screen
      iconRefs.current.forEach((icon, i) => {
        if (!icon) return

        // Calculate vector from inline position to screen center
        const rect = icon.getBoundingClientRect()
        // If rect is 0 (display none or similar), fallback to 0
        const centerX = window.innerWidth / 2 - (rect.left + rect.width / 2) || 0
        const centerY = window.innerHeight / 2 - (rect.top + rect.height / 2) || 0

        // Start from off-screen
        let startX = 0, startY = 0
        if (i === 0) startX = -window.innerWidth  // left
        if (i === 1) startX = window.innerWidth   // right
        if (i === 2) startY = window.innerHeight  // bottom

        // Offset them so they sit side-by-side in the center without overlapping
        // At scale:2.5 the icons are ~200px wide each, so we need wide enough spacing
        const offsetX = i === 0 ? -260 : i === 1 ? 260 : 0;

        // Step A: Fly to center, sit side-by-side, massive scale
        tl.fromTo(icon,
          { x: startX, y: startY, scale: 3, opacity: 0, rotation: i % 2 === 0 ? -45 : 45 },
          { x: centerX + offsetX, y: centerY, scale: 2.5, opacity: 1, rotation: 0, duration: 1.2, ease: 'expo.out' },
          0 // all start at same time
        )
      })

      // 3. Rearrange Phase: SVGs swoop from center to their final inline slots
      tl.to(iconRefs.current, {
        x: 0, y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'expo.inOut',
        stagger: 0.05,
      }, '+=0.3') // hold in center briefly

      // 4. Reveal Phase: Text fades in smoothly together, Background fades in, UI loads
      const revealTime = '-=0.6' // Start just as SVGs are snapping into place

      // Text smooth uniform fade + slight slide up (no popping one by one)
      gsap.set(split.chars, { yPercent: 0, opacity: 1 }) // remove individual char masking
      tl.from(split.words, {
        opacity: 0,
        y: 40,
        duration: 1.0,
        ease: 'power3.out'
      }, revealTime)

      tl.to('#particles-hero', { opacity: 1, duration: 2 }, revealTime)
      tl.fromTo(logoRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        revealTime
      )

      // Staggered detail labels
      tl.fromTo('.hero-detail',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 1.4, stagger: 0.12, ease: 'power3.out' },
        revealTime
      )

      // Delay for button reveal and line shift (heavily overlapped for a very fast sequence)
      const buttonRevealTime = '-=1.2'

      tl.to('.line-2-wrapper', {
        x: '-8vw', // Shift left to visually re-center the composition with the button
        duration: 1.0,
        ease: 'expo.inOut'
      }, buttonRevealTime)

      tl.fromTo(ctaRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out' },
        buttonRevealTime + '+=0.2'
      )


      // Scroll Handoff Transition
      // Text shears horizontally apart as you scroll down
      const scrubConfig = {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }

      // Spread per-call so each line gets its own independent ScrollTrigger instance
      gsap.to('.hero-line-0', { xPercent: -40, opacity: 0, scrollTrigger: { ...scrubConfig } })
      gsap.to('.hero-line-1', { xPercent: 40, opacity: 0, scrollTrigger: { ...scrubConfig } })
      gsap.to('.hero-line-2', { xPercent: -40, opacity: 0, scrollTrigger: { ...scrubConfig } })


      // Parallax mouse movement — use quickTo so no new tween is created per pixel
      const section = sectionRef.current
      const moveParticlesX = gsap.quickTo('#particles-hero', 'x', { duration: 1.4, ease: 'power1.out' })
      const moveParticlesY = gsap.quickTo('#particles-hero', 'y', { duration: 1.4, ease: 'power1.out' })
      const moveTitleX    = gsap.quickTo(titleRef.current,   'x', { duration: 1.0, ease: 'power1.out' })
      const moveTitleY    = gsap.quickTo(titleRef.current,   'y', { duration: 1.0, ease: 'power1.out' })

      const onMouse = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2
        const y = (e.clientY / window.innerHeight - 0.5) * 2
        moveParticlesX(x * 6)
        moveParticlesY(y * 6)
        moveTitleX(x * -7)
        moveTitleY(y * -5)
      }
      section?.addEventListener('mousemove', onMouse)

      return () => {
        section?.removeEventListener('mousemove', onMouse)
        split.revert()
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="ignition" style={{ height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {/* PYROS wordmark — top left corner */}
      <div ref={logoRef} style={{
        position: 'absolute',
        top: '2rem',
        left: '2rem',
        zIndex: 'var(--z-content)' as any,
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(18px, 2vw, 28px)',
        color: 'var(--gold)',
        letterSpacing: '0.15em',
        lineHeight: 1,
        userSelect: 'none',
      }}>PYROS</div>

      {/* Floating detail labels — Zippy-style contextual micro-labels */}
      {/* Top center */}
      <div className="hero-detail" style={{
        position: 'absolute', top: '2.2rem', left: '50%', transform: 'translateX(-50%)',
        zIndex: 'var(--z-content)' as any, textAlign: 'center',
        fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.25em',
        color: 'var(--muted)', textTransform: 'uppercase', lineHeight: 1.6,
      }}>
        KALASALINGAM ACADEMY<br />OF RESEARCH &amp; EDUCATION
      </div>

      {/* Left mid */}
      <div className="hero-detail" style={{
        position: 'absolute', left: '2rem', top: '50%', transform: 'translateY(-50%)',
        zIndex: 'var(--z-content)' as any,
        fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em',
        color: 'var(--muted)', textTransform: 'uppercase', lineHeight: 1.8,
      }}>
        VISUAL ARTS<br />&amp; MUSIC
      </div>

      {/* Right mid */}
      <div className="hero-detail" style={{
        position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)',
        zIndex: 'var(--z-content)' as any, textAlign: 'right',
        fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em',
        color: 'var(--muted)', textTransform: 'uppercase', lineHeight: 1.8,
      }}>
        DRAMA &amp; DANCE<br />PERFORMANCE
      </div>

      {/* Bottom left */}
      <div className="hero-detail" style={{
        position: 'absolute', bottom: '2.2rem', left: '2rem',
        zIndex: 'var(--z-content)' as any,
        fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em',
        color: 'var(--muted)', textTransform: 'uppercase', lineHeight: 1.8,
      }}>
        MIRTH &middot; SPARKZ<br />HALLOWEEN
      </div>

      {/* Bottom right */}
      <div className="hero-detail" style={{
        position: 'absolute', bottom: '2.2rem', right: '2rem',
        zIndex: 'var(--z-content)' as any, textAlign: 'right',
        fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em',
        color: 'var(--muted)', textTransform: 'uppercase', lineHeight: 1.8,
      }}>
        EST. 1999<br />27 YEARS OF FIRE
      </div>

      {/* Ember particles */}
      <div id="particles-hero" style={{ position: 'absolute', inset: 0, zIndex: 'var(--z-particles)' as any }}>
        {particlesInit && <Particles id="tsparticles" options={emberConfig as any} />}
      </div>


      {/* Content */}
      <div style={{ position: 'relative', zIndex: 'var(--z-content)' as any, textAlign: 'center', width: '100%', padding: '0 2rem' }}>

        {/* Main title - Structured to fill the screen like Zippy */}
        <div ref={titleRef} style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(48px, 10.5vw, 160px)', // Reduced ceiling for cross-device safety
          color: 'var(--text)',
          lineHeight: 0.88,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}>
          {/* Line 1: PYROS [svg] FINE — White + Muted */}
          <div className="hero-line-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(12px, 2vw, 40px)', width: '100%', flexWrap: 'nowrap', willChange: 'transform, opacity' }}>
            <span style={{ color: 'var(--text)' }}>PYROS</span>
            <span ref={el => { iconRefs.current[0] = el }} style={{ display: 'inline-flex', fontSize: '0.65em', color: 'var(--gold)' }}>
              {/* Phosphor Icons: music-notes (regular) */}
              <svg width="1em" height="1em" viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M212.92,17.69a8,8,0,0,0-6.86-1.45l-128,32A8,8,0,0,0,72,56V166.08A36,36,0,1,0,88,196V110.25l112-28v51.83A36,36,0,1,0,216,164V24A8,8,0,0,0,212.92,17.69ZM52,216a20,20,0,1,1,20-20A20,20,0,0,1,52,216ZM88,93.75V62.25l112-28v31.5ZM180,184a20,20,0,1,1,20-20A20,20,0,0,1,180,184Z" />
              </svg>
            </span>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>FINE</span>
          </div>

          {/* Line 2: ARTS [svg] CLUB + EXPLORE Button */}
          <div className="hero-line-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', flexWrap: 'nowrap', overflow: 'visible', willChange: 'transform, opacity' }}>

            <div className="line-2-wrapper" style={{ display: 'flex', alignItems: 'center', position: 'relative', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2vw, 40px)', flexWrap: 'nowrap' }}>
                <span style={{ color: 'var(--gold)' }}>ARTS</span>
                <span ref={el => { iconRefs.current[1] = el }} style={{ display: 'inline-flex', fontSize: '0.65em', color: 'rgba(255,255,255,0.6)' }}>
                  {/* Phosphor Icons: diamond (regular) */}
                  <svg width="1em" height="1em" viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M235.33,116.72,139.28,20.66a16,16,0,0,0-22.56,0l-96,96.06a16,16,0,0,0,0,22.56l96.05,96.06h0a16,16,0,0,0,22.56,0l96.05-96.06a16,16,0,0,0,0-22.56ZM128,224h0L32,128,128,32,224,128Z" />
                  </svg>
                </span>
                <span style={{ color: 'var(--text)' }}>CLUB</span>
              </div>

              {/* Absolutely positioned so it doesn't break the initial center alignment of the text */}
              <div ref={ctaRef} style={{ position: 'absolute', left: '100%', marginLeft: 'clamp(12px, 2vw, 40px)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <button
                  onClick={() => document.getElementById('numbers')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: 'rgba(201, 168, 76, 0.12)', // Subtle glass gold
                    border: '1px solid rgba(201, 168, 76, 0.4)',
                    color: 'var(--gold)',
                    fontSize: 'clamp(11px, 1.2vw, 16px)',
                    fontWeight: 600, letterSpacing: '0.25em',
                    padding: '1em 2.5em', borderRadius: '100px',
                    backdropFilter: 'blur(12px)',
                    cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(201, 168, 76, 0.25)'
                    e.currentTarget.style.transform = 'scale(1.05)'
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(201, 168, 76, 0.2)'
                    const svg = e.currentTarget.querySelector('svg')
                    if (svg) svg.style.transform = 'translateX(6px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(201, 168, 76, 0.12)'
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                    const svg = e.currentTarget.querySelector('svg')
                    if (svg) svg.style.transform = 'translateX(0)'
                  }}
                >
                  EXPLORE
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>

          </div>

          {/* Line 3: EST. [svg] 2014 — Muted + Warm Amber */}
          <div className="hero-line-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(12px, 2vw, 40px)', width: '100%', flexWrap: 'nowrap', willChange: 'transform, opacity' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>EST.</span>
            <span ref={el => { iconRefs.current[2] = el }} style={{ display: 'inline-flex', fontSize: '0.65em', color: 'var(--gold)' }}>
              {/* Phosphor Icons: flame (regular) */}
              <svg width="1em" height="1em" viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M173.79,51.48a221.25,221.25,0,0,0-41.67-34.34,8,8,0,0,0-8.24,0A221.25,221.25,0,0,0,82.21,51.48C54.59,80.48,40,112.47,40,144a88,88,0,0,0,176,0C216,112.47,201.41,80.48,173.79,51.48ZM96,184c0-27.67,22.53-47.28,32-54.3,9.48,7,32,26.63,32,54.3a32,32,0,0,1-64,0Zm77.27,15.93A47.8,47.8,0,0,0,176,184c0-44-42.09-69.79-43.88-70.86a8,8,0,0,0-8.24,0C122.09,114.21,80,140,80,184a47.8,47.8,0,0,0,2.73,15.93A71.88,71.88,0,0,1,56,144c0-34.41,20.4-63.15,37.52-81.19A216.21,216.21,0,0,1,128,33.54a215.77,215.77,0,0,1,34.48,29.27C193.49,95.5,200,125,200,144A71.88,71.88,0,0,1,173.27,199.93Z" />
              </svg>
            </span>
            <span style={{ color: 'hsl(38, 70%, 65%)' }}>1999</span>
          </div>
        </div>


      </div>
    </section>
  )
}
