'use client'

interface MarqueeProps {
  text: string
  direction?: 'forward' | 'reverse'
  color?: 'gold' | 'crimson'
  separator?: string
}

export default function Marquee({
  text,
  direction = 'forward',
  color = 'gold',
  separator = '·',
}: MarqueeProps) {
  // Duplicate content enough to fill the screen seamlessly
  const repeated = Array(8).fill(`${text} ${separator} `).join('')

  return (
    <div className="marquee-wrapper" aria-hidden="true">
      <div className={`marquee-track marquee-${color} ${direction === 'reverse' ? 'marquee-crimson' : 'marquee-gold'}`}>
        <span>{repeated}</span>
        <span aria-hidden="true">{repeated}</span>
      </div>
    </div>
  )
}
