export interface GalleryPhoto {
  id: string
  src: string
  alt: string
  event: 'mirth' | 'sparkz' | 'halloween'
  size?: 'tall' | 'wide' | 'normal'
}

export interface Event {
  id: string
  name: string
  date: string
  type: 'upcoming' | 'internal' | 'special' | 'past'
  description: string
  countdownTarget?: string
}
