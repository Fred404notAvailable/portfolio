'use client'

interface SectionDividerProps {
  label: string
  index: string
}

export default function SectionDivider({ label, index }: SectionDividerProps) {
  return (
    <div className="section-divider container mx-auto">
      <div className="divider-line" />
      <span className="divider-label">
        {index} / {label}
      </span>
      <div className="divider-line" />
    </div>
  )
}
