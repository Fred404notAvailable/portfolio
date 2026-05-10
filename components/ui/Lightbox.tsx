'use client'
import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

interface LightboxProps {
  src: string
  alt: string
  onClose: () => void
}

export default function Lightbox({ src, alt, onClose }: LightboxProps) {
  // Close on Escape
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  const portal = document.getElementById('lightbox-portal')
  if (!portal) return null

  return createPortal(
    <div
      role="dialog"
      aria-label={`Photo: ${alt}`}
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 'var(--z-lightbox)' as unknown as number,
        padding: '2rem',
        animation: 'fadeUp 0.3s ease forwards',
      }}
    >
      {/* Prevent close when clicking the image */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '85vh',
          borderRadius: '4px',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          animation: 'fadeUp 0.35s ease forwards',
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          style={{ objectFit: 'contain', maxHeight: '85vh', width: 'auto', height: 'auto' }}
          priority
        />
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          background: 'transparent',
          border: '1px solid var(--border)',
          color: 'var(--muted)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s, border-color 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
        }}
      >
        ✕
      </button>
    </div>,
    portal
  )
}
