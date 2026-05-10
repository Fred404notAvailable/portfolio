'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap-init'

// Using existing gallery images as battle photos
const COLLEGES = [
  { name: 'NIT Trichy',      photo: '/images/gallery/sparkz-1.jpg' },
  { name: 'VIT Vellore',     photo: '/images/gallery/mirth-1.jpg' },
  { name: 'IIT Madras',      photo: '/images/gallery/halloween-1.jpg' },
  { name: 'SRM Chennai',     photo: '/images/gallery/sparkz-2.jpg' },
  { name: 'KCT Coimbatore',  photo: '/images/gallery/mirth-2.jpg' },
  { name: 'MEPCO Schlenk',   photo: '/images/gallery/halloween-2.jpg' },
  { name: 'PSG Tech',        photo: '/images/gallery/sparkz-3.jpg' },
  { name: 'CIT Chennai',     photo: '/images/gallery/mirth-3.jpg' },
  { name: 'SSN College',     photo: '/images/gallery/halloween-3.jpg' },
]

// Manual split-text animation helper for words
function splitWordsToSpans(text: string) {
  return text.split(' ').map((word, i) => (
    <span
      key={i}
      style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '10px', marginRight: '0.25em' }}
    >
      <span
        className="battlegrounds-word"
        style={{
          display: 'inline-block',
          opacity: 0,
          transform: 'translateY(80px)',
          color: word.includes('CONQUER') ? 'var(--crimson)' : 'inherit'
        }}
      >
        {word}
      </span>
    </span>
  ))
}

export default function Battlegrounds() {
  const sectionRef = useRef<HTMLElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let ctx: ReturnType<typeof gsap.context>
    const init = () => {
      if (!sectionRef.current) return

      ctx = gsap.context(() => {
        // Heading words reveal
        gsap.to('.battlegrounds-word', {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play reverse play reverse'
          },
        })

        // Crimson numeral scale up
        gsap.fromTo(
          '.battle-numeral',
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'elastic.out(1, 0.7)',
            scrollTrigger: {
              trigger: '.battle-numeral-container',
              start: 'top 80%',
              toggleActions: 'play reverse play reverse'
            },
          }
        )

        // CountUp logic for the "3"
        if (countRef.current) {
          ScrollTrigger.create({
            trigger: '.battle-numeral-container',
            start: 'top 80%',
            once: true,
            onEnter: async () => {
              const { CountUp } = await import('countup.js')
              const cu = new CountUp(countRef.current!, 3, { duration: 2, useGrouping: false })
              if (!cu.error) cu.start()
            },
          })
        }

        // Tactical rings rotation — translateZ(0) promotes to GPU compositor layer
        if (document.querySelector('.battle-ring')) {
          gsap.set('.battle-ring', { translateZ: 0 })
          gsap.to('.battle-ring', { rotation: 360, duration: 30, repeat: -1, ease: 'none', transformOrigin: 'center center' })
        }
        if (document.querySelector('.battle-ring-reverse')) {
          gsap.set('.battle-ring-reverse', { translateZ: 0 })
          gsap.to('.battle-ring-reverse', { rotation: -360, duration: 40, repeat: -1, ease: 'none', transformOrigin: 'center center' })
        }

        // College pills entrance stagger
        gsap.fromTo('.college-pill', 
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.02,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.colleges-container',
              start: 'top 90%',
            },
          }
        )

        // Continuous horizontal autonomous scroll (Marquee)
        const track = document.querySelector('.colleges-track') as HTMLElement
        if (track) {
          gsap.to(track, {
            xPercent: -33.33333, // Scroll exactly one third (one original array length)
            ease: 'none',
            duration: 15,
            repeat: -1,
          })
        }

        // Bottom counter
        ScrollTrigger.create({
          trigger: '.bottom-counter',
          start: 'top 95%',
          once: true,
          onEnter: async () => {
            const el = document.getElementById('total-colleges-count')
            if (el) {
              const { CountUp } = await import('countup.js')
              const cu = new CountUp(el, 15, { suffix: '+', duration: 2.5 })
              if (!cu.error) cu.start()
            }
          },
        })
      }, sectionRef)

      // ── 3D Cursor Tilt on Cards ──────────────────────────────────────
      const cards = document.querySelectorAll<HTMLElement>('.college-pill')
      const cleanups: (() => void)[] = []

      cards.forEach((card) => {
        // GSAP quickTo for buttery interpolation
        const setRotX = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power2.out' })
        const setRotY = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power2.out' })

        // Set perspective on the card itself
        gsap.set(card, { transformPerspective: 700, transformStyle: 'preserve-3d' })

        const onMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect()
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          const dx = (e.clientX - cx) / (rect.width / 2)   // -1 to +1
          const dy = (e.clientY - cy) / (rect.height / 2)  // -1 to +1

          setRotY(dx * 12)   // tilt left/right up to 12°
          setRotX(-dy * 10)  // tilt up/down up to 10°

          // Shift photo spotlight toward cursor
          const photo = card.querySelector<HTMLElement>('.card-photo')
          if (photo) {
            const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100)
            const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100)
            photo.style.backgroundPosition = `${xPct}% ${yPct}%`
          }
        }

        const onLeave = () => {
          setRotX(0)
          setRotY(0)
          const photo = card.querySelector<HTMLElement>('.card-photo')
          if (photo) photo.style.backgroundPosition = 'center'
        }

        card.addEventListener('mousemove', onMove)
        card.addEventListener('mouseleave', onLeave)
        cleanups.push(() => {
          card.removeEventListener('mousemove', onMove)
          card.removeEventListener('mouseleave', onLeave)
        })
      })

      return () => {
        cleanups.forEach(fn => fn())
      }
    }
    const cleanup = init()
    return () => {
      if (ctx) ctx.revert()
      if (cleanup) cleanup()
    }
  }, [])

  return (
    <section
      id="battlegrounds"
      ref={sectionRef}
      style={{ padding: '8rem 0', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}
    >
      {/* ── Background Grids & Glows ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'radial-gradient(circle at 50% 50%, rgba(196, 90, 90, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(196, 90, 90, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(196, 90, 90, 1) 1px, transparent 1px)',
        backgroundSize: '40px 40px', backgroundPosition: 'center center'
      }} />

      {/* ── Left-Aligned Screen Edge Tactical Description Box ── */}
      <div className="battle-left-box" style={{
        position: 'absolute',
        left: '2vw',
        top: '25%',
        maxWidth: '380px',
        textAlign: 'left',
        zIndex: 10,
        background: 'linear-gradient(135deg, rgba(10,10,10,0.8) 0%, rgba(15,5,5,0.9) 100%)',
        border: '1px solid rgba(196, 90, 90, 0.15)',
        borderLeft: '3px solid var(--crimson)',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(196, 90, 90, 0.05)'
      }}>
        {/* Tactical Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <div style={{ width: '6px', height: '6px', background: 'var(--crimson)', boxShadow: '0 0 10px var(--crimson)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--crimson)', letterSpacing: '0.3em' }}>
            [ OP_DIRECTIVE ]
          </span>
        </div>
        
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          color: 'rgba(232, 224, 204, 0.85)',
          lineHeight: 1.8,
          letterSpacing: '0.02em',
          margin: 0
        }}>
          We don't just host — we <span style={{ color: 'var(--text)', fontWeight: 600 }}>invade</span>.
          <br/><br/>
          PYROS takes its fire beyond our campus, competing at premier college fests
          across Tamil Nadu — and bringing back the gold every single time.
        </p>

        {/* Bottom Deco */}
        <div style={{ marginTop: '1.5rem', width: '100%', height: '1px', background: 'linear-gradient(90deg, var(--crimson) 0%, transparent 100%)', opacity: 0.5 }} />
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        
        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--crimson)' }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--crimson)', letterSpacing: '0.4em', margin: 0 }}>
              06 // BATTLEGROUNDS
            </p>
            <div style={{ width: '40px', height: '1px', background: 'var(--crimson)' }} />
          </div>
          
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 96px)',
            color: 'var(--text)', letterSpacing: '0.02em', lineHeight: 1, textTransform: 'uppercase',
            textShadow: '0 10px 40px rgba(0,0,0,0.8)'
          }}>
            {splitWordsToSpans('WE COMPETE. WE CONQUER.')}
          </h2>

        </div>

        {/* ── Massive 3x Trophy Block ── */}
        <div className="battle-numeral-container" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '12rem' }}>
          
          {/* Tactical Rings */}
          <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', maxWidth: '800px', height: '80vw', maxHeight: '800px', pointerEvents: 'none', zIndex: -1 }}>
            <svg className="battle-ring" viewBox="0 0 500 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
              <circle cx="250" cy="250" r="240" fill="none" stroke="var(--crimson)" strokeWidth="1" strokeDasharray="4 20" />
              <circle cx="250" cy="250" r="220" fill="none" stroke="var(--crimson)" strokeWidth="0.5" />
            </svg>
            <svg className="battle-ring-reverse" viewBox="0 0 500 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }}>
              <circle cx="250" cy="250" r="200" fill="none" stroke="var(--crimson)" strokeWidth="2" strokeDasharray="40 100" />
              <line x1="250" y1="30" x2="250" y2="50" stroke="var(--crimson)" strokeWidth="2" />
              <line x1="250" y1="450" x2="250" y2="470" stroke="var(--crimson)" strokeWidth="2" />
              <line x1="30" y1="250" x2="50" y2="250" stroke="var(--crimson)" strokeWidth="2" />
              <line x1="450" y1="250" x2="470" y2="250" stroke="var(--crimson)" strokeWidth="2" />
            </svg>
          </div>

          <div className="battle-numeral" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(120px, 22vw, 320px)',
            color: 'var(--crimson)', lineHeight: 0.8, textShadow: '0 0 80px rgba(196, 90, 90, 0.4)',
            position: 'relative', display: 'inline-block'
          }}>
            <span ref={countRef}>0</span>
            <span style={{ fontSize: '0.4em', marginLeft: '10px', color: 'var(--crimson)' }}>×</span>
          </div>

          <div style={{
            marginTop: '-2rem', background: 'var(--bg)', border: '1px solid var(--crimson-border)',
            padding: '1.5rem 3rem', display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(196, 90, 90, 0.2)', position: 'relative', zIndex: 2
          }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--crimson)', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>CONSECUTIVE YEARS</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3vw, 32px)', color: 'var(--text)', letterSpacing: '0.1em', margin: 0, textAlign: 'center' }}>MEPCO OVERALL CHAMPIONS</p>
          </div>
        </div>

        {/* ── College Track ── */}
        <div style={{ marginBottom: '2rem', paddingLeft: '5vw' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--crimson)', letterSpacing: '0.3em' }}>[ DEPLOYMENT HISTORY ]</p>
        </div>
        
        <div className="colleges-container" style={{
          position: 'relative', width: '100vw', marginLeft: 'calc(-50vw + 50%)', overflow: 'hidden',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
          marginBottom: '6rem'
        }}>
          <div className="colleges-track" style={{ display: 'flex', gap: '2rem', width: 'max-content', willChange: 'transform' }}>
            {[...COLLEGES, ...COLLEGES, ...COLLEGES].map((college, idx) => (
              <div
                key={`${college.name}-${idx}`}
                className="college-pill"
                style={{
                  flexShrink: 0,
                  width: 'clamp(280px, 26vw, 400px)',
                  height: 'clamp(240px, 22vw, 340px)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(196, 90, 90, 0.25)',
                  borderBottom: '3px solid var(--crimson)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                }}
              >
                {/* Full-bleed photo */}
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 0,
                  backgroundImage: `url(${college.photo})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'grayscale(40%) brightness(0.6) sepia(15%)',
                  transform: 'scale(1.05)',
                  transition: 'transform 0.8s ease, filter 0.8s ease',
                }} className="card-photo" />

                {/* Gradient — transparent top, dark bottom for text legibility */}
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 1,
                  background: 'linear-gradient(to bottom, rgba(5,5,5,0.05) 0%, rgba(5,5,5,0.0) 30%, rgba(5,5,5,0.85) 100%)',
                }} />

                {/* Top-left badge */}
                <div style={{
                  position: 'absolute', top: '1rem', left: '1rem', zIndex: 2,
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(5,5,5,0.6)', padding: '4px 10px',
                  backdropFilter: 'blur(4px)'
                }}>
                  <div style={{ width: '5px', height: '5px', background: 'var(--crimson)', boxShadow: '0 0 8px var(--crimson)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--crimson)', letterSpacing: '0.2em' }}>
                    ID_{String((idx % COLLEGES.length) + 1).padStart(3, '0')}
                  </span>
                </div>

                {/* Bottom text overlay */}
                <div style={{ position: 'relative', zIndex: 2, padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '22px', color: 'var(--text)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700, textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
                    {college.name}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(196, 90, 90, 0.9)', letterSpacing: '0.2em' }}>
                    STATUS: SECURED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Total Counter ── */}
        <div className="bottom-counter" style={{
          display: 'flex', justifyContent: 'center'
        }}>
          <div style={{
            border: '1px dashed rgba(196, 90, 90, 0.3)', padding: '2rem 4rem', background: 'rgba(10, 8, 8, 0.5)',
            display: 'inline-flex', alignItems: 'center', gap: '2rem'
          }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '50px', color: 'var(--crimson)', opacity: 0.5 }}>∑</div>
            <div>
              <div id="total-colleges-count" style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--crimson)', lineHeight: 1 }}>0</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.2em', marginTop: '4px' }}>COLLEGES INFILTRATED</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
