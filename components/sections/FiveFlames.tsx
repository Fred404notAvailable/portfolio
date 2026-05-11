'use client'
import { useEffect, useRef, useState } from 'react'
import { TEAMS } from '@/lib/constants'
import { gsap, ScrollTrigger } from '@/lib/gsap-init'
import { probeBgImage } from '@/lib/imgFallback'

export default function FiveFlames() {
  const sectionRef  = useRef<HTMLElement>(null)
  const stripRef    = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    if (!sectionRef.current || !stripRef.current) return

      const strip = stripRef.current
      const getScrollAmount = () => strip.scrollWidth - window.innerWidth

      const ctx = gsap.context(() => {
        // ── Pin the section and drive horizontal scroll ──
        const pinTween = gsap.to(strip, {
          x: () => -getScrollAmount(),
          ease: 'none',
          scrollTrigger: {
            id: 'filmstrip',
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${getScrollAmount()}`,
            invalidateOnRefresh: true,
          },
        })

        // ── Section heading fades in from left ──
        gsap.from('.filmstrip-heading', {
          x: -60, opacity: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        })

        // ── Each panel image subtly scales on entry (parallax feel) ──
        gsap.utils.toArray<HTMLElement>('.panel-img').forEach((img) => {
          gsap.fromTo(img,
            { scale: 1.08 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: img.closest('.team-panel'),
                containerAnimation: pinTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          )
        })

      }, sectionRef)

    return () => { ctx.revert() }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="teams"
      style={{
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg)',
        position: 'relative',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
      }}
    >
      {/* Scroll hint — bottom right (Stays fixed but has blend mode/shadow to remain legible) */}
      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        right: '2.5rem',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        letterSpacing: '0.3em',
        color: 'rgba(255,255,255,0.8)',
        textShadow: '0 2px 10px rgba(0,0,0,0.8)',
        textTransform: 'uppercase',
        pointerEvents: 'none',
        mixBlendMode: 'difference',
      }}>
        SCROLL TO EXPLORE
        <svg width="32" height="1" viewBox="0 0 32 1" style={{ overflow: 'visible' }}>
          <line x1="0" y1="0.5" x2="32" y2="0.5" stroke="currentColor" strokeWidth="0.8"/>
          <polyline points="26,−3 32,0.5 26,4" fill="none" stroke="currentColor" strokeWidth="0.8"/>
        </svg>
      </div>

      {/* ── The horizontal filmstrip ── */}
      <div
        ref={stripRef}
        style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'stretch',
          width: 'max-content',
          willChange: 'transform',
        }}
      >
        {/* Intro Panel: Scrolls away with the images */}
        <div className="filmstrip-intro" style={{
          flexShrink: 0,
          width: 'clamp(320px, 35vw, 500px)',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '4rem',
          padding: '0 2.5rem',
          position: 'relative',
        }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '0.4em',
              color: 'var(--muted)',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}>02 / TEAMS</p>
            <h2 className="filmstrip-heading" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 52px)',
              letterSpacing: '0.04em',
              color: 'var(--gold)',
              lineHeight: 1,
            }}>MEET THE<br/>TEAMS</h2>
            
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              color: 'var(--sub)',
              maxWidth: '280px',
              marginTop: '1.5rem',
              lineHeight: 1.5,
              opacity: 0.8,
            }}>
              Discover the {TEAMS.length} creative teams driving the passion and artistry at PYROS. Each with a unique spark, uniting over 150 active members.
            </p>
          </div>

          {/* Counter at the bottom of the intro panel */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.25em',
            color: 'var(--muted)',
            textTransform: 'uppercase',
          }}>{TEAMS.length} TEAMS · KARE UNIVERSITY</div>
        </div>

        {TEAMS.map((team) => {
          const isHov = hovered === team.id
          return (
            <div
              key={team.id}
              className="team-panel"
              style={{
                flexShrink: 0,
                width: 'clamp(280px, 32vw, 500px)',
                height: '100vh',
                position: 'relative',
                marginRight: '2px',
                cursor: 'crosshair',
                overflow: 'hidden',
              }}
              onMouseEnter={() => setHovered(team.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Full-bleed photo */}
              <div
                className="panel-img"
                ref={(el) => { if (el) probeBgImage(el, team.photo) }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${team.photo})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transformOrigin: 'center',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isHov ? 'scale(1.04)' : 'scale(1)',
                }}
              />

              {/* Dark gradient overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: isHov
                  ? 'linear-gradient(to top, rgba(0,0,0,0.92) 20%, transparent 100%)'
                  : 'linear-gradient(to top, rgba(0,0,0,0.85) 20%, transparent 100%)',
                transition: 'background 0.6s ease',
              }} />

              {/* Gold top-right panel index */}
              <div style={{
                position: 'absolute',
                top: '2rem',
                right: '1.8rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '0.3em',
                color: isHov ? 'var(--gold)' : 'rgba(255,255,255,0.25)',
                transition: 'color 0.4s ease',
              }}>
                {String(TEAMS.indexOf(team) + 1).padStart(2, '0')} / {String(TEAMS.length).padStart(2, '0')}
              </div>

              {/* Bottom content */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '2.5rem 2rem',
              }}>
                {/* Category tag */}
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  letterSpacing: '0.35em',
                  color: isHov ? 'var(--gold)' : 'var(--muted)',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                  transition: 'color 0.4s ease',
                }}>{team.category}</p>

                {/* Team name */}
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(32px, 4vw, 56px)',
                  letterSpacing: '0.08em',
                  color: 'var(--text)',
                  lineHeight: 0.9,
                  marginBottom: '1.2rem',
                  transform: isHov ? 'translateY(-6px)' : 'translateY(0)',
                  transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>{team.name}</h3>

                {/* Activities — slide up on hover */}
                <div style={{
                  overflow: 'hidden',
                  maxHeight: isHov ? '200px' : '0px',
                  opacity: isHov ? 1 : 0,
                  transition: 'max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.2rem' }}>
                    {team.activities.map((act, idx) => (
                      <div key={act} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transform: isHov ? 'translateX(0)' : 'translateX(-12px)',
                        opacity: isHov ? 1 : 0,
                        transition: `transform 0.5s cubic-bezier(0.16,1,0.3,1) ${idx * 0.06}s, opacity 0.4s ease ${idx * 0.06}s`,
                      }}>
                        <div style={{ width: '20px', height: '1px', background: 'var(--gold-border)' }} />
                        <span style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.8)',
                          letterSpacing: '0.05em',
                        }}>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom border line */}
                <div style={{
                  height: '1px',
                  background: isHov ? 'var(--gold-border)' : 'rgba(255,255,255,0.1)',
                  transition: 'background 0.5s ease',
                }} />
              </div>

              {/* Left film perforation marks */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '2px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                paddingBlock: '4rem',
                pointerEvents: 'none',
              }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{
                    width: '2px',
                    height: '14px',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '1px',
                  }} />
                ))}
              </div>
            </div>
          )
        })}

        {/* End spacer */}
        <div style={{ flexShrink: 0, width: '18vw' }} />
      </div>
    </section>
  )
}
