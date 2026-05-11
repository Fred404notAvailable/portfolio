'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { GALLERY } from '@/lib/constants'
import Lightbox from '@/components/ui/Lightbox'
import { gsap, ScrollTrigger } from '@/lib/gsap-init'
import type { GalleryPhoto } from '@/types/event'
import { onImgError } from '@/lib/imgFallback'

type Filter = 'all' | 'mirth' | 'sparkz' | 'halloween'
const FILTERS: { label: string; value: Filter }[] = [
  { label: 'ALL', value: 'all' }, { label: 'MIRTH', value: 'mirth' },
  { label: 'SPARKZ', value: 'sparkz' }, { label: 'HALLOWEEN', value: 'halloween' },
]

// ── True CSS Bento Grid — each cell has a column span and row span ─────────────
// Grid has 12 columns. Base row unit = 220px.
// Slots 0-9 (used when Sparkz filter is active, 10 cards) are kept varied:
//   only 2 truly wide slots (idx 0 and 7) so the filtered view isn't a stack of panoramas.
const BENTO_CELLS: { colSpan: number; rowSpan: number }[] = [
  // ── Slots 0-9  (Sparkz filtered view — 10 cards) ──────────────────────────
  // Row 1-2: wide tall left + two portrait stacked right
  { colSpan: 8, rowSpan: 2 },   //  0 — WIDE   8×2  → 8+4=12
  { colSpan: 4, rowSpan: 1 },   //  1 — normal  4×1
  { colSpan: 4, rowSpan: 1 },   //  2 — normal  4×1

  // Row 3: three equal thirds
  { colSpan: 4, rowSpan: 1 },   //  3           4×1  → 4+4+4=12
  { colSpan: 4, rowSpan: 1 },   //  4
  { colSpan: 4, rowSpan: 1 },   //  5

  // Row 4-5: portrait left + wide tall right
  { colSpan: 4, rowSpan: 1 },   //  6 — normal  4×1  → 4+8=12
  { colSpan: 8, rowSpan: 2 },   //  7 — WIDE   8×2
  { colSpan: 4, rowSpan: 1 },   //  8 — normal  4×1

  // Row 6: half + half (no wide here — 2 wides total for Sparkz)
  { colSpan: 6, rowSpan: 1 },   //  9           6×1  → 6+6=12

  // ── Slots 10-23  (extra cards / ALL view continuation) ────────────────────
  { colSpan: 6, rowSpan: 1 },   // 10           6×1

  // Row 7-8: portrait left + two landscape stacked right
  { colSpan: 5, rowSpan: 2 },   // 11 — tall    5×2  → 5+7=12
  { colSpan: 7, rowSpan: 1 },   // 12           7×1
  { colSpan: 7, rowSpan: 1 },   // 13           7×1

  // Row 9: halves
  { colSpan: 6, rowSpan: 1 },   // 14           6×1  → 6+6=12
  { colSpan: 6, rowSpan: 1 },   // 15

  // Row 10-11: wide + portrait right
  { colSpan: 7, rowSpan: 1 },   // 16           7×1  → 7+5=12
  { colSpan: 5, rowSpan: 2 },   // 17 — tall    5×2
  { colSpan: 7, rowSpan: 1 },   // 18           7×1

  // Row 12: three thirds
  { colSpan: 4, rowSpan: 1 },   // 19           4×1  → 4+4+4=12
  { colSpan: 4, rowSpan: 1 },   // 20
  { colSpan: 4, rowSpan: 1 },   // 21

  // Row 13: wide + narrow
  { colSpan: 8, rowSpan: 1 },   // 22           8×1  → 8+4=12
  { colSpan: 4, rowSpan: 1 },   // 23
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
  const frameRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const cell = BENTO_CELLS[idx % BENTO_CELLS.length]
  // photo.size drives rowSpan: 'tall' → double-height, otherwise use BENTO_CELLS rowSpan
  const rowSpan = photo.size === 'tall' ? 2 : cell.rowSpan

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
    gsap.to(cardRef.current, { scale: 1.04, zIndex: 10, duration: 0.45, ease: 'power2.out', overwrite: true })
    gsap.to(imgRef.current, { filter: 'grayscale(0%) brightness(0.80)', scale: 1.06, duration: 0.5 })
    gsap.to(frameRef.current, { borderColor: 'var(--gold)', duration: 0.28 })
  }, [])

  const leave = useCallback(() => {
    setHovered(false)
    gsap.to(cardRef.current, { scale: 1, zIndex: 1, duration: 0.4, ease: 'power2.inOut', overwrite: true })
    gsap.to(imgRef.current, { filter: 'grayscale(100%) brightness(0.6)', scale: 1, duration: 0.45 })
    gsap.to(frameRef.current, { borderColor: 'rgba(201,168,76,0.25)', duration: 0.28 })
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
        gridRow: `span ${rowSpan}`,
        position: 'relative', overflow: 'hidden',
        borderRadius: 14,
        background: 'var(--bg-card)',
        cursor: 'pointer',
        minHeight: rowSpan === 2 ? 'clamp(320px, 38vh, 520px)' : 'clamp(160px, 19vh, 260px)',
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
        onError={onImgError}
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
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
      }} />

      {/* Gold border — always visible, brightens on hover */}
      <div ref={frameRef} style={{
        position: 'absolute', inset: 0, zIndex: 4,
        border: '1.5px solid rgba(201,168,76,0.25)', borderRadius: 14, pointerEvents: 'none',
        transition: 'border-color 0.28s ease',
      }} />

      {/* Bottom: event name — always visible, lights up on hover */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 18px', zIndex: 3 }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(13px, 1.4vw, 18px)',
          letterSpacing: '0.18em',
          color: hovered ? 'var(--gold)' : 'rgba(255,255,255,0.55)',
          textTransform: 'uppercase',
          margin: 0,
          transition: 'color 0.3s ease',
        }}>{photo.event === 'halloween' ? 'HALLOWEEN' : photo.event.toUpperCase()}</p>
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
            gridAutoRows: 'clamp(200px, 24vh, 320px)',
            gridAutoFlow: 'dense',
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
