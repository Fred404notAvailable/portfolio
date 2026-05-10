'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { GALLERY } from '@/lib/constants'
import Lightbox from '@/components/ui/Lightbox'
import { gsap, ScrollTrigger } from '@/lib/gsap-init'
import type { GalleryPhoto } from '@/types/event'

type Filter = 'all' | 'mirth' | 'sparkz' | 'halloween'
const FILTERS: { label: string; value: Filter }[] = [
  { label: 'ALL', value: 'all' }, { label: 'MIRTH', value: 'mirth' },
  { label: 'SPARKZ', value: 'sparkz' }, { label: 'HALLOWEEN', value: 'halloween' },
]
const EVENT_META: Record<string, { tag: string; desc: string }> = {
  mirth: { tag: 'INTERNAL', desc: 'Annual Cultural Fest · KARE' },
  sparkz: { tag: 'INTER-COLLEGE', desc: 'Flagship Open Cultural' },
  halloween: { tag: 'SPECIAL', desc: 'Halloween Night Special' },
}

// ── True CSS Bento Grid — each cell has a column span and row span ─────────────
// Grid has 12 columns. Base row unit = 220px.
// colSpan drives width, rowSpan drives height — some cards are 2× taller.
// Pattern repeats every 12 photos so any number of photos works.
const BENTO_CELLS: { colSpan: number; rowSpan: number }[] = [
  { colSpan: 7, rowSpan: 2 },   //  0 — big tall-left
  { colSpan: 5, rowSpan: 1 },   //  1 — short top-right
  { colSpan: 5, rowSpan: 1 },   //  2 — short bottom-right
  { colSpan: 4, rowSpan: 1 },   //  3 — short
  { colSpan: 4, rowSpan: 2 },   //  4 — tall center
  { colSpan: 4, rowSpan: 1 },   //  5 — short
  { colSpan: 4, rowSpan: 1 },   //  6 — short
  { colSpan: 4, rowSpan: 1 },   //  7 — short
  { colSpan: 5, rowSpan: 2 },   //  8 — big tall-left
  { colSpan: 7, rowSpan: 1 },   //  9 — wide short-right
  { colSpan: 3, rowSpan: 1 },   // 10 — narrow
  { colSpan: 4, rowSpan: 1 },   // 11 — medium
  { colSpan: 6, rowSpan: 2 },   // 12 — tall-wide left
  { colSpan: 6, rowSpan: 1 },   // 13 — half-width top
  { colSpan: 3, rowSpan: 1 },   // 14 — small
  { colSpan: 3, rowSpan: 1 },   // 15 — small
  { colSpan: 4, rowSpan: 1 },   // 16 — medium
  { colSpan: 8, rowSpan: 2 },   // 17 — wide tall
  { colSpan: 4, rowSpan: 1 },   // 18 — medium
  { colSpan: 4, rowSpan: 1 },   // 19 — medium
  { colSpan: 5, rowSpan: 1 },   // 20 — medium-wide
  { colSpan: 7, rowSpan: 2 },   // 21 — tall-wide
  { colSpan: 5, rowSpan: 1 },   // 22 — medium-wide
  { colSpan: 5, rowSpan: 1 },   // 23 — medium-wide
]

// ── Single Card ───────────────────────────────────────────────────────────────
function GalleryCard({
  photo, idx, onClick,
}: {
  photo: GalleryPhoto
  idx: number
  onClick: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const meta = EVENT_META[photo.event] ?? { tag: photo.event.toUpperCase(), desc: '' }
  const cell = BENTO_CELLS[idx % BENTO_CELLS.length]

  // Scroll-triggered fade-in per card
  useEffect(() => {
    if (!cardRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          delay: (idx % 4) * 0.08,
          scrollTrigger: { trigger: cardRef.current, start: 'top 90%' },
        }
      )
    })
    return () => ctx.revert()
  }, [idx])

  const enter = useCallback(() => {
    setHovered(true)
    // Card itself pops out — scale up + elevate over neighbors
    gsap.to(cardRef.current, { scale: 1.04, zIndex: 10, duration: 0.45, ease: 'power2.out', overwrite: true })
    // Image de-saturates and zooms slightly within the card
    gsap.to(imgRef.current, { filter: 'grayscale(0%) brightness(0.80)', scale: 1.06, duration: 0.5 })
    gsap.to(infoRef.current, { y: 0, opacity: 1, duration: 0.4, delay: 0.1 })
    gsap.to(frameRef.current, { borderColor: 'var(--gold)', duration: 0.28 })
  }, [])

  const leave = useCallback(() => {
    setHovered(false)
    // Shrink back, reset z-index after transition
    gsap.to(cardRef.current, { scale: 1, zIndex: 1, duration: 0.4, ease: 'power2.inOut', overwrite: true })
    gsap.to(imgRef.current, { filter: 'grayscale(100%) brightness(0.6)', scale: 1, duration: 0.45 })
    gsap.to(infoRef.current, { y: 14, opacity: 0, duration: 0.3 })
    gsap.to(frameRef.current, { borderColor: 'transparent', duration: 0.28 })
  }, [])

  return (
    <div
      ref={cardRef}
      className="gallery-card"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onClick={onClick}
      style={{
        gridColumn: `span ${cell.colSpan}`,
        gridRow: `span ${cell.rowSpan}`,
        position: 'relative', overflow: 'hidden',
        borderRadius: 14,
        background: 'var(--bg-card)',
        cursor: 'pointer',
        minHeight: cell.rowSpan === 2 ? 'clamp(320px, 38vh, 520px)' : 'clamp(160px, 19vh, 260px)',
        // transform-origin center so scale-up expands outward symmetrically
        transformOrigin: 'center center',
        willChange: 'transform',
        zIndex: 1,
      }}
    >
      {/* Photo */}
      <img
        ref={imgRef}
        src={photo.src}
        alt={photo.alt}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          filter: 'grayscale(100%) brightness(0.6)',
          transformOrigin: 'center',
        }}
      />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)',
      }} />

      {/* Gold border frame on hover */}
      <div ref={frameRef} style={{
        position: 'absolute', inset: 0, zIndex: 4,
        border: '2px solid transparent', borderRadius: 14, pointerEvents: 'none',
      }} />

      {/* Top-right: tag + hex icon */}
      <div style={{ position: 'absolute', top: 13, right: 14, display: 'flex', alignItems: 'center', gap: 6, zIndex: 3 }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.28em',
          color: hovered ? 'var(--gold)' : 'var(--muted)',
          textTransform: 'uppercase', transition: 'color 0.3s', whiteSpace: 'nowrap',
        }}>{meta.tag}</span>
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
          <path d="M14 2L24.39 8V20L14 26L3.61 20V8L14 2Z"
            stroke={hovered ? 'var(--gold)' : 'var(--border)'} strokeWidth="1.2"
            fill={hovered ? 'rgba(201,168,76,0.12)' : 'transparent'} style={{ transition: 'all 0.3s' }} />
          <path d="M10 14h8M15 11l3 3-3 3" stroke={hovered ? 'var(--gold)' : 'var(--sub)'}
            strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.3s' }} />
        </svg>
      </div>

      {/* Bottom content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 16px', zIndex: 3 }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: hovered ? 22 : 16,
          letterSpacing: '0.05em',
          color: hovered ? 'var(--gold-light)' : 'var(--text)',
          lineHeight: 1.15, marginBottom: 5,
          transition: 'font-size 0.35s ease, color 0.3s',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{photo.alt.toUpperCase()}</h3>

        {/* Slide-up info — hidden until hover */}
        <div ref={infoRef} style={{ opacity: 0, transform: 'translateY(14px)' }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em',
            color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8,
          }}>{meta.desc}</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Photography', 'Performance', 'PYROS'].map(t => (
              <span key={t} style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                color: 'var(--muted)', border: '1px solid var(--border)',
                padding: '2px 7px', borderRadius: 'var(--r-pill)',
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TheStage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const lineLeftRef = useRef<HTMLDivElement>(null)
  const lineRightRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  const filtered = filter === 'all' ? GALLERY : GALLERY.filter(p => p.event === filter)

  useEffect(() => {
    if (!headerRef.current || !sectionRef.current || !contentRef.current) return
    const ctx = gsap.context(() => {
      // Entrance parallax (animate content, not the section wrapper, so pinning works safely later)
      gsap.fromTo(contentRef.current,
        { y: 100 },
        { y: 0, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'top 20%', scrub: 1 } }
      )
      // Cinematic Divider Animation
      if (dividerRef.current && lineLeftRef.current && lineRightRef.current && iconRef.current && labelRef.current) {
        gsap.fromTo(lineLeftRef.current,
          { scaleX: 0, transformOrigin: 'right' },
          { scaleX: 1, ease: 'power2.out', scrollTrigger: { trigger: dividerRef.current, start: 'top 95%', end: 'top 70%', scrub: 1 } }
        )
        gsap.fromTo(lineRightRef.current,
          { scaleX: 0, transformOrigin: 'left' },
          { scaleX: 1, ease: 'power2.out', scrollTrigger: { trigger: dividerRef.current, start: 'top 95%', end: 'top 70%', scrub: 1 } }
        )
        gsap.fromTo(iconRef.current,
          { rotation: -90, scale: 0, opacity: 0 },
          { rotation: 45, scale: 1, opacity: 0.9, ease: 'back.out(2)', scrollTrigger: { trigger: dividerRef.current, start: 'top 90%', end: 'top 65%', scrub: 1 } }
        )
        gsap.fromTo(labelRef.current,
          { y: 20, opacity: 0, letterSpacing: '0.1em' },
          { y: 0, opacity: 1, letterSpacing: '0.5em', ease: 'power2.out', scrollTrigger: { trigger: dividerRef.current, start: 'top 85%', end: 'top 60%', scrub: 1 } }
        )
      }

      // Header entrance
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, ease: 'power3.out', scrollTrigger: { trigger: headerRef.current, start: 'top 85%', end: 'top 40%', scrub: 1 } }
      )
      // Cinematic Curtain Reveal: Pin the stage and let TheCrest scroll over it
      // We animate contentRef, NOT sectionRef, so the trigger bounds don't jump around!
      gsap.to(contentRef.current, {
        scale: 0.95,
        opacity: 0.2,
        transformOrigin: 'bottom center',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'bottom bottom',
          end: '+=100%',
          pin: true,
          pinSpacing: false,
          scrub: true,
          invalidateOnRefresh: true,
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="gallery" style={{ padding: 'var(--sp-4xl) 0', background: 'var(--bg)' }}>
      <div ref={contentRef}>


        <div ref={headerRef}>

        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '0 2rem' }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', margin: '3rem 0 2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.4em', marginBottom: '0.4rem', textTransform: 'uppercase' }}>04 / The Stage</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,5.5vw,60px)', color: 'var(--gold)', letterSpacing: '0.08em', lineHeight: 1 }}>THE STAGE</h2>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {FILTERS.map(f => (
                <button key={f.value} onClick={() => setFilter(f.value)} aria-pressed={filter === f.value}
                  style={{
                    background: filter === f.value ? 'var(--gold)' : 'transparent',
                    color: filter === f.value ? 'var(--bg)' : 'var(--muted)',
                    border: `1px solid ${filter === f.value ? 'var(--gold)' : 'var(--border)'}`,
                    fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.1em',
                    padding: '7px 20px', borderRadius: 'var(--r-sm)', cursor: 'pointer', transition: 'all 0.25s',
                  }}>{f.label}</button>
              ))}
            </div>
          </div>

          {/* ── CSS Bento Grid ── */}
          <div className="gallery-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridAutoRows: 'clamp(160px, 19vh, 260px)',
            gap: 10,
          }}>
            {filtered.map((photo, i) => (
              <GalleryCard
                key={photo.id}
                photo={photo}
                idx={i}
                onClick={() => setLightbox(photo)}
              />
            ))}
          </div>

          <div style={{
            marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1rem',
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--sub)', letterSpacing: '0.3em', textTransform: 'uppercase'
          }}>
            Hover to reveal · Click to open full photo
          </div>
        </div>
      </div>
      </div>

      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
    </section>
  )
}
