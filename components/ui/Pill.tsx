'use client'

type PillVariant = 'gold' | 'crimson' | 'neutral'

interface PillProps {
  label: string
  variant?: PillVariant
  className?: string
}

const variantClass: Record<PillVariant, string> = {
  gold:    'pill-gold',
  crimson: 'pill-crimson',
  neutral: 'pill-neutral',
}

export default function Pill({ label, variant = 'neutral', className = '' }: PillProps) {
  return (
    <span className={`${variantClass[variant]} ${className}`}>
      {label}
    </span>
  )
}
