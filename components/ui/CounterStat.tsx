'use client'
import { useCountUp } from '@/hooks/useCountUp'

interface CounterStatProps {
  value: number
  suffix?: string
  label: string
  variant?: 'default' | 'crimson'
}

export default function CounterStat({
  value,
  suffix = '',
  label,
  variant = 'default',
}: CounterStatProps) {
  const ref = useCountUp(value, suffix)

  return (
    <div className={`stat-block ${variant === 'crimson' ? 'crimson' : ''}`}>
      <span ref={ref} className="stat-number">0</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
