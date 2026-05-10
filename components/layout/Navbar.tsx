'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'TEAMS',    href: '#teams' },
  { label: 'GALLERY',  href: '#gallery' },
  { label: 'ABOUT',    href: '#crest' },
  { label: 'EVENTS',   href: '#setlist' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const smoothTo = (href: string) => {
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Wordmark */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="PYROS — back to top"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '26px',
              color: 'var(--gold)',
              letterSpacing: '0.1em',
              lineHeight: 1,
              filter: 'drop-shadow(0 0 8px rgba(201, 168, 76, 0.4))'
            }}
          >
            PYROS
          </span>
        </button>

        {/* Desktop nav */}
        <div
          className="hidden md:flex items-center"
          style={{ gap: '2rem' }}
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => smoothTo(link.href)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--muted)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'color 0.25s',
                padding: '4px 0',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--gold)')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--muted)')}
            >
              {link.label}
            </button>
          ))}

          <button
            className="btn-outline"
            style={{ fontSize: '11px', padding: '6px 16px' }}
            onClick={() => smoothTo('#encore')}
            aria-label="Join PYROS Fine Arts Club"
          >
            JOIN US
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            color: 'var(--gold)',
            width: '36px',
            height: '36px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
            padding: '6px',
          }}
        >
          <span
            style={{
              width: '18px',
              height: '1px',
              background: 'var(--gold)',
              transition: 'transform 0.25s, opacity 0.25s',
              transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
            }}
          />
          <span
            style={{
              width: '18px',
              height: '1px',
              background: 'var(--gold)',
              opacity: menuOpen ? 0 : 1,
              transition: 'opacity 0.2s',
            }}
          />
          <span
            style={{
              width: '18px',
              height: '1px',
              background: 'var(--gold)',
              transition: 'transform 0.25s, opacity 0.25s',
              transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
            }}
          />
        </button>
      </nav>

      {/* Mobile full-screen overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,10,8,0.98)',
            backdropFilter: 'blur(12px)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2.5rem',
          }}
          role="dialog"
          aria-label="Mobile navigation menu"
          aria-modal="true"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => smoothTo(link.href)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 8vw, 48px)',
                color: 'var(--muted)',
                letterSpacing: '0.15em',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--gold)')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--muted)')}
            >
              {link.label}
            </button>
          ))}
          <button
            className="btn-outline"
            onClick={() => smoothTo('#encore')}
            style={{ marginTop: '1rem', letterSpacing: '0.25em', padding: '10px 28px' }}
            aria-label="Join PYROS Fine Arts Club"
          >
            JOIN US
          </button>
        </div>
      )}
    </>
  )
}
