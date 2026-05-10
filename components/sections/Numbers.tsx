'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap-init'
import { CountUp } from 'countup.js'
import { STATS } from '@/lib/constants'

export default function Numbers() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background parallax watermark
      gsap.fromTo('.stat-bg-text', 
        { y: -100, opacity: 0 },
        {
          y: 100, opacity: 0.03, duration: 1, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            scrub: true,
            invalidateOnRefresh: true,
          }
        }
      )

      // Stagger reveal of the grid items
      gsap.fromTo('.stat-card', 
        { opacity: 0, y: 40, scale: 0.98 },
        { 
          opacity: 1, y: 0, scale: 1, 
          duration: 1.2, stagger: 0.1, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' }
        }
      )
    })

    // CountUp logic
    sectionRef.current?.querySelectorAll('[data-countup]').forEach(el => {
      const end    = Number(el.getAttribute('data-end'))
      const suffix = el.getAttribute('data-suffix') || ''
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { 
          new CountUp(el as HTMLElement, end, { 
            suffix, 
            duration: 2.5,
            useEasing: true,
            separator: ','
          }).start(); 
          obs.disconnect() 
        }
      }, { threshold: 0.5 })
      obs.observe(el)
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="numbers" style={{
      position: 'relative',
      background: 'var(--bg)',
      padding: '7rem 2rem',
      overflow: 'hidden',
    }}>
      {/* Top and Bottom gradient masks to blend the background watermark seamlessly into surrounding sections */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 15%, transparent 85%, var(--bg) 100%)'
      }} />
      {/* Massive background watermark */}
      <div className="stat-bg-text" style={{
        position: 'absolute',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        fontFamily: 'var(--font-display)',
        fontSize: '28vw',
        color: 'var(--gold)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 0,
        lineHeight: 1,
      }}>
        IMPACT
      </div>

      <div ref={gridRef} style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '0px',
        background: 'transparent',
      }}>
        {STATS.map((s, i) => (
          <div key={s.label} className="stat-card" style={{
            background: 'transparent',
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Subtle glow inside each card */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: s.highlight 
                ? 'radial-gradient(circle at center, rgba(220, 20, 60, 0.1) 0%, transparent 60%)'
                : 'radial-gradient(circle at center, rgba(255, 215, 0, 0.05) 0%, transparent 60%)',
              opacity: 0.8,
              pointerEvents: 'none'
            }} />

            <span data-countup="true" data-end={s.value} data-suffix={s.suffix} style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(50px, 6vw, 90px)',
              lineHeight: 1,
              color: s.highlight ? 'var(--crimson)' : 'var(--gold)',
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em',
            }}>0{s.suffix}</span>
            
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.3em',
              color: 'var(--sub)',
              textTransform: 'uppercase',
            }}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
