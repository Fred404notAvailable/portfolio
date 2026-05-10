'use client'
import { useEffect, useState } from 'react'

interface CountdownProps {
  targetDate: string
}

interface TimeLeft {
  days: number
  hours: number
  mins: number
  secs: number
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [time, setTime] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, mins: 0, secs: 0 })
        return
      }
      setTime({
        days:  Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins:  Math.floor((diff % 3600000) / 60000),
        secs:  Math.floor((diff % 60000) / 1000),
      })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(18px, 3vw, 32px)',
        color: 'var(--gold)',
        fontWeight: 500,
        letterSpacing: '0.05em',
        marginTop: '12px',
      }}
      aria-label={`Countdown: ${time.days} days, ${time.hours} hours, ${time.mins} minutes, ${time.secs} seconds`}
    >
      <span>{pad(time.days)}</span>
      <span style={{ color: 'var(--muted)', fontSize: '0.7em' }}>D</span>
      <span style={{ color: 'var(--gold-dim)' }}>:</span>
      <span>{pad(time.hours)}</span>
      <span style={{ color: 'var(--muted)', fontSize: '0.7em' }}>H</span>
      <span style={{ color: 'var(--gold-dim)' }}>:</span>
      <span>{pad(time.mins)}</span>
      <span style={{ color: 'var(--muted)', fontSize: '0.7em' }}>M</span>
      <span style={{ color: 'var(--gold-dim)' }}>:</span>
      <span>{pad(time.secs)}</span>
      <span style={{ color: 'var(--muted)', fontSize: '0.7em' }}>S</span>
    </div>
  )
}
