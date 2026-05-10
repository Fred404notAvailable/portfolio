'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap-init'
import { Scan, ShieldAlert } from 'lucide-react'

const WHY_CARDS = [
  { number:'01', label:'CREATIVITY',   title:'Over Two Decades of Excellence', body:'PYROS has nurtured 150+ students across 8 art disciplines since 1999 at KARE.' },
  { number:'02', label:'COMPETITION',  title:'3× MEPCO Overall Champions', body:'We have dominated inter-college competitions across NIT, VIT, IIT, SRM, and more.' },
  { number:'03', label:'COMMUNITY',    title:'150+ Members, One Family', body:'Every team — from Music to Fashion — competes as one unified force on every stage.' },
  { number:'04', label:'PERFORMANCE',  title:'5+ Major Events Per Year', body:'MIRTH, Sparkz, Halloween Special, and more — multiple massive stages, endless chances to shine.' },
  { number:'05', label:'OPPORTUNITY',  title:'Perform at Any Stage', body:'Drama to Dance, Gaming to Literature — PYROS opens doors to every creative discipline.' },
  { number:'06', label:'LEGACY',       title:'25+ Years of Trophies', body:'Our shelves are heavy with the absolute highest honors from prestigious cultural festivals across the nation.' },
  { number:'07', label:'TALENT',       title:'Elite Grooming', body:'We take raw, unpolished potential and meticulously train our students to be confident, national-level performers.' },
  { number:'08', label:'LIFESTYLE',    title:'More Than A Club', body:'Once a Pyros, always a Pyros. We build deep, lifelong networks with extremely talented alumni across the globe.' },
]

export default function TheCrest() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)
  const transitionTextRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const track   = trackRef.current
    const wrapper = wrapperRef.current
    if (!track || !wrapper) return

    // gsap.context() tracks every tween/ScrollTrigger created inside — ctx.revert()
    // kills them all cleanly, which prevents React Strict Mode double-invocation bugs.
    const ctx = gsap.context(() => {
      // ── Dynamic calculations for resizing ─────────────────────────────
      const getScrollAmt = () => track.scrollWidth - window.innerWidth

      // Initial state for transition overlay
      if (transitionTextRef.current) {
        gsap.set(transitionTextRef.current, { opacity: 0, scale: 0.85 })
      }

      // ── Horizontal scroll movement ────────────────────────────────────
      const horizontalScroll = gsap.to(track, {
        x: () => -getScrollAmt(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${getScrollAmt()}`,
          pin: true,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      // ── Decorative crest & text fade out ──────────────────────────────
      const svgTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${getScrollAmt()}`,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      })
      svgTl.to('#pyros-crest', { scale: 3, opacity: 0, duration: 1 }, 0)
      svgTl.to('.crest-ring',  { rotation: 180, scale: 1.5, opacity: 0, duration: 1 }, 0)
      svgTl.to('.crest-decor', { y: -50, opacity: 0, duration: 1 }, 0)
      svgTl.to('.crest-glow',  { scale: 2, opacity: 0, duration: 1 }, 0)

      gsap.to('#why-pyros-text', {
        opacity: 0, x: -30,
        scrollTrigger: {
          trigger: wrapper,
          start: () => `top+=${getScrollAmt() * 0.5} top`,
          end: () => `top+=${getScrollAmt() * 0.7} top`,
          scrub: true,
          invalidateOnRefresh: true,
        }
      })

      // ── Per-card animations ───────────────────────────────────────────
      const cards = track.querySelectorAll<HTMLElement>('.why-card')
      cards.forEach((card, index) => {
        const isLast = index === cards.length - 1
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalScroll,
            start: 'left 100%',
            end: isLast ? 'center center' : 'right 0%',
            scrub: true,
          }
        })

        if (isLast) {
          card.style.willChange = 'transform, opacity, border-radius, background-color'

          // 8th card enters exactly like the other cards
          tl.fromTo(card, 
            { scale: 1, opacity: 0, y: 30 },
            { scale: 1.3, opacity: 1, y: 0, duration: 0.6, ease: 'sine.inOut' },
            0
          )

          // Expand linearly over the remaining 40% so it fills the screen earlier
          tl.to(card, { 
            scale: 15, 
            borderRadius: 0,
            duration: 0.4, 
            ease: 'none' 
          }, 0.6)
          
          // Fade out inner content quickly exactly when the scaling begins
          tl.to(Array.from(card.children), { autoAlpha: 0, duration: 0.1, ease: 'none' }, 0.6)

          // Fade in the transition text once the brown background is large enough
          if (transitionTextRef.current) {
            tl.to(transitionTextRef.current, {
              opacity: 1, scale: 1,
              duration: 0.25, ease: 'power2.out'
            }, 0.75)
          }

          if (ringRef.current) {
            gsap.to(ringRef.current, {
              rotation: 360, duration: 15, repeat: -1,
              ease: 'none', transformOrigin: 'center center'
            })
          }
        } else {
          tl.fromTo(card,
            { scale: 1, opacity: 0, y: 30 },
            { scale: 1.3, opacity: 1, y: 0, duration: 0.5, ease: 'sine.inOut' }
          )
          tl.to(card, { scale: 1, opacity: 0, y: -30, duration: 0.5, ease: 'sine.inOut' })
        }
      })
    })

    return () => {
      ctx.revert()
      const cards = track.querySelectorAll<HTMLElement>('.why-card')
      const lastCard = cards[cards.length - 1]
      if (lastCard) lastCard.style.willChange = 'auto'
    }
  }, [])

  return (
    <>
      {/* ── Main TheCrest wrapper ─────────────────────────────────────── */}
      <div
        ref={wrapperRef}
        id="the-crest"
        style={{
          height: '100vh', display: 'flex', alignItems: 'center',
          background: 'var(--bg)', overflow: 'hidden',
          position: 'relative', zIndex: 10,
        }}
      >
        {/* ── Transition Overlay ────────────────────────────────────── */}
        <div
          ref={transitionTextRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 9999, pointerEvents: 'none',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            opacity: 0,
          }}
        >
          {/* Tactical Corner Scanners */}
          <div style={{ position: 'absolute', top: '4vh', left: '4vw', color: 'var(--gold)', opacity: 0.3 }}><Scan size={40} /></div>
          <div style={{ position: 'absolute', top: '4vh', right: '4vw', color: 'var(--gold)', opacity: 0.3 }}><Scan size={40} /></div>
          <div style={{ position: 'absolute', bottom: '4vh', left: '4vw', color: 'var(--gold)', opacity: 0.3 }}><Scan size={40} /></div>
          <div style={{ position: 'absolute', bottom: '4vh', right: '4vw', color: 'var(--gold)', opacity: 0.3 }}><Scan size={40} /></div>

          {/* Vertical Telemetry Data Lines */}
          <div style={{ position: 'absolute', top: '15vh', left: '5.5vw', bottom: '15vh', width: '1px', background: 'linear-gradient(to bottom, transparent, var(--gold), transparent)', opacity: 0.15 }} />
          <div style={{ position: 'absolute', top: '15vh', right: '5.5vw', bottom: '15vh', width: '1px', background: 'linear-gradient(to bottom, transparent, var(--gold), transparent)', opacity: 0.15 }} />

          {/* Left Vertical Text */}
          <div style={{ position: 'absolute', left: '3vw', top: '50%', transform: 'translateY(-50%) rotate(180deg)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.4em', color: 'var(--gold)', writingMode: 'vertical-rl', opacity: 0.4 }}>
            SYS.OP.VER // 49.02.11 — ACTIVE
          </div>

          {/* Right Vertical Text */}
          <div style={{ position: 'absolute', right: '3vw', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.4em', color: 'var(--gold)', writingMode: 'vertical-rl', opacity: 0.4 }}>
            COORD: 34° 51' 42" N / ENGAGEMENT READY
          </div>

          {/* Top Left Status */}
          <div style={{ position: 'absolute', top: '6vh', left: '8vw', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.2em', color: 'var(--gold)', opacity: 0.5 }}>NETWORK: SECURE</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.2em', color: 'var(--gold)', opacity: 0.3 }}>UPLINK: 104.2 MB/S</div>
          </div>

          {/* Top Right Live Indicator */}
          <div style={{ position: 'absolute', top: '6vh', right: '8vw', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--crimson)' }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--crimson)', opacity: 0.8 }}>REC</div>
          </div>

          {/* Bottom Center Data Stream */}
          <div style={{ position: 'absolute', bottom: '8vh', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.5em', color: 'var(--gold)', opacity: 0.3, whiteSpace: 'nowrap' }}>
            [ AUDIO VISUAL FEED ENCRYPTED ]
          </div>

          {/* Rotating SVG Target Ring */}
          <svg
            ref={ringRef}
            viewBox="0 0 500 500"
            style={{ position: 'absolute', width: '60vmin', height: '60vmin', opacity: 0.15 }}
          >
            <circle cx="250" cy="250" r="240" fill="none" stroke="var(--gold)" strokeWidth="2" strokeDasharray="10 30" />
            <circle cx="250" cy="250" r="220" fill="none" stroke="var(--gold)" strokeWidth="1" strokeDasharray="100 50" />
            <circle cx="250" cy="250" r="180" fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity="0.5" />
            <circle cx="250" cy="250" r="160" fill="none" stroke="var(--gold)" strokeWidth="2" strokeDasharray="2 12" />
            
            {/* Primary Crosshairs */}
            <line x1="250" y1="0" x2="250" y2="40" stroke="var(--gold)" strokeWidth="4" />
            <line x1="250" y1="460" x2="250" y2="500" stroke="var(--gold)" strokeWidth="4" />
            <line x1="0" y1="250" x2="40" y2="250" stroke="var(--gold)" strokeWidth="4" />
            <line x1="460" y1="250" x2="500" y2="250" stroke="var(--gold)" strokeWidth="4" />

            {/* Diagonal Crosshairs */}
            <line x1="73" y1="73" x2="101" y2="101" stroke="var(--gold)" strokeWidth="2" />
            <line x1="427" y1="73" x2="399" y2="101" stroke="var(--gold)" strokeWidth="2" />
            <line x1="73" y1="427" x2="101" y2="399" stroke="var(--gold)" strokeWidth="2" />
            <line x1="427" y1="427" x2="399" y2="399" stroke="var(--gold)" strokeWidth="2" />
          </svg>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.5em',
            color: 'var(--gold)',
            opacity: 0.8,
            marginBottom: '3vh',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <ShieldAlert size={14} /> [ INITIATING BATTLE PROTOCOL ]
          </div>
          
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 9vw, 140px)',
            letterSpacing: '0.02em',
            color: 'var(--gold)',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 0.9,
            textShadow: '0 20px 50px rgba(0,0,0,0.9)'
          }}>
            OUR<br />BATTLEFIELDS
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2vw', marginTop: '5vh' }}>
            <div style={{ width: '12vw', height: '1px', background: 'var(--gold)', opacity: 0.5 }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.4em', color: 'var(--gold)', opacity: 1 }}>TARGET LOCKED</div>
            <div style={{ width: '12vw', height: '1px', background: 'var(--gold)', opacity: 0.5 }} />
          </div>
        </div>
        <div style={{
          position: 'absolute', left: '6vw', top: '0', width: '40vw', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1, pointerEvents: 'none',
        }}>
          <div className="crest-glow" style={{
            position: 'absolute', width: '60vw', height: '60vw',
            maxWidth: '600px', maxHeight: '600px',
            background: 'radial-gradient(circle, var(--gold-dim) 0%, transparent 60%)',
            opacity: 0.15, zIndex: -1, borderRadius: '50%'
          }} />
          <div className="crest-decor" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-220px,-220px)', opacity:0.4, color:'var(--gold)', fontFamily:'var(--font-mono)', fontSize:'14px' }}>+</div>
          <div className="crest-decor" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(220px,220px)', opacity:0.4, color:'var(--gold)', fontFamily:'var(--font-mono)', fontSize:'14px' }}>+</div>
          <div className="crest-decor" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(180px,-180px)', opacity:0.3, color:'var(--gold)', fontFamily:'var(--font-mono)', fontSize:'10px' }}>[ 0110 ]</div>
          <svg className="crest-ring" viewBox="0 0 500 500" style={{ position:'absolute', width:'100%', maxWidth:'500px', height:'auto', zIndex:-1, opacity:0.2 }}>
            <circle cx="250" cy="250" r="240" fill="none" stroke="var(--gold)" strokeWidth="1" strokeDasharray="4 16" />
            <circle cx="250" cy="250" r="210" fill="none" stroke="var(--gold)" strokeWidth="0.5" />
          </svg>
          <div className="crest-decor" style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-270px,-50%) rotate(-90deg)', fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.4em', color:'var(--sub)', opacity:0.6 }}>KALASALINGAM ACADEMY</div>
          <div className="crest-decor" style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(270px,-50%) rotate(90deg)', fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.4em', color:'var(--sub)', opacity:0.6 }}>ESTABLISHED 1999</div>
          <img id="pyros-crest" src="/logo/pyros-crest-final.png" alt="PYROS Crest"
            style={{ width:'100%', maxWidth:'400px', height:'auto', objectFit:'contain' }} />
        </div>

        <div id="why-pyros-text" style={{ position:'absolute', left:'4rem', top:'50%', transform:'translateY(-50%)', zIndex:2, width:'30vw' }}>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.4em', color:'var(--sub)', marginBottom:12 }}>05 / 08</p>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,4vw,44px)', letterSpacing:'0.08em', color:'var(--gold)', lineHeight:1.1, maxWidth:220 }}>WHY PYROS?</h2>
        </div>

        <div style={{ position:'absolute', top:'18%', bottom:'18%', left:'40vw', right:'0vw', borderTop:'1px solid rgba(200,180,120,0.04)', borderBottom:'1px solid rgba(200,180,120,0.04)', zIndex:1, pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:-1, left:0, width:30, height:10, borderTop:'1px solid rgba(200,180,120,0.2)', borderLeft:'1px solid rgba(200,180,120,0.2)' }} />
          <div style={{ position:'absolute', bottom:-1, left:0, width:30, height:10, borderBottom:'1px solid rgba(200,180,120,0.2)', borderLeft:'1px solid rgba(200,180,120,0.2)' }} />
          <div style={{ position:'absolute', top:-18, right:'15%', fontFamily:'var(--font-mono)', fontSize:8, color:'var(--sub)', letterSpacing:'0.3em', opacity:0.5 }}>TRACK SYNC // ACTIVE</div>
          <div style={{ position:'absolute', bottom:-20, left:'20%', fontFamily:'var(--font-mono)', fontSize:8, color:'var(--sub)', letterSpacing:'0.3em', opacity:0.5 }}>STREAM LATENCY : 14ms</div>
        </div>

        <div ref={trackRef} style={{ display:'flex', gap:'4vw', paddingLeft:'45vw', paddingRight:'calc(50vw - 220px)', willChange:'transform', zIndex:3 }}>
          {WHY_CARDS.map((card, idx) => (
            <div
              key={card.number}
              className="why-card"
              style={idx === WHY_CARDS.length - 1 ? {
                // Ensure text/content is hidden when scaled
                overflow: 'hidden',
              } : undefined}
            >
              <div className="why-card-number">{card.number}</div>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.3em', color:'var(--sub)', marginBottom:16, textTransform:'uppercase' }}>{card.label}</p>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:28, letterSpacing:'0.08em', color:'var(--gold-light)', lineHeight:1.2, marginBottom:20 }}>{card.title}</h3>
              <p style={{ fontFamily:'var(--font-body)', fontSize:13, color:'var(--body-copy)', lineHeight:1.8 }}>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
