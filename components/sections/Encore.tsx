'use client'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap-init'
import { SOCIALS } from '@/lib/constants'

export default function Encore() {
  const sectionRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    let ctx: ReturnType<typeof gsap.context>
    if (!sectionRef.current) return

    ctx = gsap.context(() => {
      // Background massive text entrance
      gsap.fromTo('.massive-bg-text',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 0.15, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
      )
    }, sectionRef)

    return () => { if (ctx) ctx.revert() }
  }, [])

  return (
    <section
      id="encore"
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Cinematic Lighting ── */}
      {/* Center Gold Glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '150vw', height: '150vh',
        background: 'radial-gradient(circle, rgba(201, 168, 76, 0.08) 0%, rgba(0,0,0,0) 50%)',
        pointerEvents: 'none', zIndex: 0
      }} />
      {/* Bottom Crimson Ambient Light */}
      <div style={{
        position: 'absolute', bottom: '-20%', left: '0', width: '100%', height: '80vh',
        background: 'radial-gradient(ellipse at bottom center, rgba(196, 90, 90, 0.15) 0%, rgba(0,0,0,0) 60%)',
        pointerEvents: 'none', zIndex: 0
      }} />
      {/* Edge Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        boxShadow: 'inset 0 0 200px rgba(0,0,0,0.9)',
        pointerEvents: 'none', zIndex: 1
      }} />

      {/* ── Massive Background Text ── */}
      <div
        className="massive-bg-text"
        style={{
          position: 'absolute',
          top: '55%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(150px, 55vw, 1200px)',
          color: 'var(--gold)',
          opacity: 0,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 0,
          lineHeight: 0.8,
        }}
      >
        PYROS
      </div>

      {/* ── Main Foreground Content — flex-grows to fill space above footer ── */}
      <div style={{
        flex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '12rem 2rem 3rem',
        position: 'relative', zIndex: 4,
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(60px, 12vw, 200px)',
          lineHeight: 0.85,
          color: 'var(--text)',
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          margin: 0,
        }}>
          LET'S <span style={{ color: 'var(--gold)' }}>IGNITE</span><br />
          SOMETHING <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', letterSpacing: '-0.04em' }}>EPIC</span>
        </h2>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(12px, 1.5vw, 18px)',
          color: 'var(--muted)',
          letterSpacing: '0.25em',
          marginTop: '3rem',
          marginBottom: '3rem',
          textTransform: 'uppercase'
        }}>
          BECOME PART OF A DECADE OF FIRE
        </p>

        {/* Magnetic Sweep CTA Button */}
        <a
          href="#"
          ref={ctaRef}
          onMouseMove={(e) => {
            if (!ctaRef.current) return
            const rect = ctaRef.current.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2

            // Magnetic pull on the button itself
            gsap.to(ctaRef.current, { x: x * 0.4, y: y * 0.4, scale: 1.05, duration: 0.4, ease: 'power3.out' })

            // Parallax pull on the inner content
            const content = ctaRef.current.querySelector('.btn-content')
            if (content) gsap.to(content, { x: x * 0.2, y: y * 0.2, duration: 0.4, ease: 'power3.out' })

            // Style overrides for hover
            ctaRef.current.style.background = 'var(--text)'
            ctaRef.current.style.boxShadow = '0 10px 50px rgba(201, 168, 76, 0.8), 0 0 120px rgba(201, 168, 76, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.6)'

            // Arrow sweep animation
            const arrow = ctaRef.current.querySelector('.btn-arrow') as HTMLElement
            if (arrow) {
              arrow.style.transform = 'translateX(8px) scale(1.1)'
              arrow.style.opacity = '1'
            }
          }}
          onMouseLeave={() => {
            if (!ctaRef.current) return
            // Elastic snap back to center
            gsap.to(ctaRef.current, { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.4)' })

            const content = ctaRef.current.querySelector('.btn-content')
            if (content) gsap.to(content, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })

            // Revert styles
            ctaRef.current.style.background = 'var(--gold)'
            ctaRef.current.style.boxShadow = '0 0 30px rgba(201, 168, 76, 0.6), 0 0 80px rgba(201, 168, 76, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.4)'

            // Revert arrow
            const arrow = ctaRef.current.querySelector('.btn-arrow') as HTMLElement
            if (arrow) {
              arrow.style.transform = 'translateX(0px) scale(1)'
              arrow.style.opacity = '0.7'
            }
          }}
          style={{
            position: 'relative',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--gold)', color: 'var(--bg)',
            padding: '1rem 3rem', borderRadius: '4px',
            textDecoration: 'none', transition: 'background 0.3s ease, box-shadow 0.3s ease',
            boxShadow: '0 0 30px rgba(201, 168, 76, 0.6), 0 0 80px rgba(201, 168, 76, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.4)',
            border: '2px solid rgba(255,255,255,0.2)',
            zIndex: 10,
            willChange: 'transform'
          }}>
          <div className="btn-content" style={{ display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'none', willChange: 'transform' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(14px, 2vw, 18px)', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              JOIN THE CLUB
            </span>
            <svg className="btn-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7, transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease' }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      </div>

      {/* ── Footer ── */}
      <footer className="encore-footer" style={{
        position: 'relative', zIndex: 3,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.5rem 4rem', width: '100%',
      }}>
        {/* Left: Logo/Branding */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="3" strokeLinejoin="miter">
              <path d="M4 6h16M4 12h16l-10 6h10" />
            </svg>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--text)', letterSpacing: '0.05em' }}>PYROS</span>
          </div>
        </div>

        {/* Center: Socials — flex: 1 ensures perfect centering */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '3rem', alignItems: 'center' }}>
          {/* Instagram */}
          <a
            href="https://www.instagram.com/pyros_official_kare?igsh=MXh1aHVxcnFuampweA=="
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--muted)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--gold)';
              e.currentTarget.style.transform = 'scale(1.25) translateY(-6px)';
              e.currentTarget.style.filter = 'drop-shadow(0 8px 16px rgba(201, 168, 76, 0.4))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--muted)';
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.filter = 'drop-shadow(0 0px 0px rgba(201, 168, 76, 0))';
            }}
            aria-label="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com/@fineartsclubkare5944?si=4vl1kOgoZ5YhOMOf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--muted)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--gold)';
              e.currentTarget.style.transform = 'scale(1.25) translateY(-6px)';
              e.currentTarget.style.filter = 'drop-shadow(0 8px 16px rgba(201, 168, 76, 0.4))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--muted)';
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.filter = 'drop-shadow(0 0px 0px rgba(201, 168, 76, 0))';
            }}
            aria-label="YouTube"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 7.1c-.2 1.3-.3 2.7-.3 4.9s.1 3.6.3 4.9c.3 2 1.9 3.6 3.9 3.9 1.5.2 5.3.2 5.6.2s4.1 0 5.6-.2c2-.3 3.6-1.9 3.9-3.9.2-1.3.3-2.7.3-4.9s-.1-3.6-.3-4.9c-.3-2-1.9-3.6-3.9-3.9-1.5-.2-5.3-.2-5.6-.2s-4.1 0-5.6.2c-2 .3-3.6 1.9-3.9 3.9z" />
              <polygon points="10 15 15 12 10 9 10 15" />
            </svg>
          </a>

          {/* Discord */}
          <a
            href="https://discord.gg/XVFZKB6aNr"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--muted)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--gold)';
              e.currentTarget.style.transform = 'scale(1.25) translateY(-6px)';
              e.currentTarget.style.filter = 'drop-shadow(0 8px 16px rgba(201, 168, 76, 0.4))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--muted)';
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.filter = 'drop-shadow(0 0px 0px rgba(201, 168, 76, 0))';
            }}
            aria-label="Discord"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
            </svg>
          </a>
        </div>


        {/* Right: Copyright */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', textAlign: 'right' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--sub)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            © {new Date().getFullYear()} PYROS FINE ARTS CLUB<br />ALL RIGHTS RESERVED
          </span>
        </div>
      </footer>
    </section>
  )
}
