import type { Team } from '@/types/team'
import type { GalleryPhoto, Event } from '@/types/event'

export const STATS = [
  { value: 27, suffix: '+', label: 'Years of Fire', highlight: false },
  { value: 150, suffix: '+', label: 'Active Members', highlight: false },
  { value: 3, suffix: '×', label: 'MEPCO Champions', highlight: true },
  { value: 5, suffix: '+', label: 'Major Events', highlight: false },
]

export const TEAMS: Team[] = [
  {
    id: 'music',
    name: 'MUSIC',
    icon: '♪',
    category: 'Vocals · Instruments · Live Shows',
    description:
      'From soul-stirring solos to electrifying ensemble performances, the Music team brings every stage to life. We train, compose, and perform across genres with unmatched passion.',
    activities: ['Vocals', 'Instruments', 'Live Shows', 'Composition'],
    photo: '/images/teams/music.jpg',
  },
  {
    id: 'media',
    name: 'MEDIA',
    icon: '■',
    category: 'Photography · Videography · Design',
    description:
      'The eyes of PYROS. Our Media team captures every moment, crafts every frame, and tells the visual story of the club through photography, videography, and design.',
    activities: ['Photography', 'Videography', 'Graphic Design', 'Editing'],
    photo: '/images/teams/media.jpg',
  },
  {
    id: 'gaming',
    name: 'GAMING',
    icon: '◉',
    category: 'Tournaments · Competitions · E-Sports',
    description:
      'Competitive gaming meets college culture. The Gaming team represents PYROS at inter-college tournaments, organizing LAN events and dominating leaderboards across platforms.',
    activities: ['Tournaments', 'E-Sports', 'LAN Events', 'Strategy'],
    photo: '/images/teams/gaming.jpeg',
  },
  {
    id: 'drama',
    name: 'DRAMA',
    icon: '◈',
    category: 'Theatre · Stage Productions · Verity',
    description:
      'Verity — the drama wing of PYROS — transforms words into worlds. From one-act plays to full-scale theatrical productions, we command the stage with intensity and craft.',
    activities: ['Theatre', 'One-Act Plays', 'Improvisation', 'Scriptwriting'],
    photo: '/images/teams/drama.jpeg',
  },
  {
    id: 'dance',
    name: 'DANCE',
    icon: '▲',
    category: 'Choreography · Performances · Classical & Contemporary',
    description:
      'Movement is our language. The Dance team choreographs and performs across classical and contemporary forms, training relentlessly to deliver performances that leave audiences breathless.',
    activities: ['Choreography', 'Classical', 'Contemporary', 'Fusion'],
    photo: '/images/teams/dance.jpg',
  },
  {
    id: 'arts',
    name: 'ARTS',
    icon: '✦',
    category: 'Visual Arts · Installations · Illustration',
    description:
      'The Arts team paints, sculpts, and installs. Every fest sees a new visual world crafted by our artists — from live canvas painting to large-scale installations that define the space.',
    activities: ['Painting', 'Sculpture', 'Installation', 'Illustration'],
    photo: '/images/teams/arts.jpg',
  },
  {
    id: 'literature',
    name: 'LITERATURE',
    icon: '≡',
    category: 'Spoken Word · Writing · Debates',
    description:
      'Words are weapons and poetry is power. The Literature team debates, performs spoken word, publishes writing, and competes in every linguistic battleground with precision and fire.',
    activities: ['Spoken Word', 'Debate', 'Creative Writing', 'Quiz'],
    photo: '/images/teams/literature.jpg',
  },
  {
    id: 'fashion',
    name: 'FASHION',
    icon: '⬡',
    category: 'Styling · Ramp Walks · Fashion Shows',
    description:
      'Where artistry meets the runway. The Fashion team designs, styles, and walks — turning every ramp into a statement about identity, culture, and contemporary aesthetic.',
    activities: ['Styling', 'Ramp Walks', 'Fashion Design', 'Modelling'],
    photo: '/images/teams/fashion.jpg',
  },
]

export const COLLEGES = [
  'NIT Trichy',
  'VIT Vellore',
  'IIT Madras',
  'SRM Chennai',
  'KCT Coimbatore',
  'MEPCO Schlenk',
  'PSG Tech',
  'CIT Chennai',
  'SSN College',
  'Anna University',
]

export const GALLERY: GalleryPhoto[] = [
  { id: 'mirth-1', src: '/images/gallery/mirth-1.jpg', alt: 'MIRTH cultural fest performance', event: 'mirth', size: 'tall' },
  { id: 'mirth-2', src: '/images/gallery/mirth-2.jpg', alt: 'MIRTH group dance on stage', event: 'mirth', size: 'normal' },
  { id: 'mirth-3', src: '/images/gallery/mirth-3.jpg', alt: 'MIRTH drama performance', event: 'mirth', size: 'wide' },
  { id: 'mirth-4', src: '/images/gallery/mirth-4.jpg', alt: 'MIRTH music concert', event: 'mirth', size: 'normal' },
  { id: 'sparkz-1', src: '/images/gallery/sparkz-1.jpg', alt: 'Sparkz inter-college stage', event: 'sparkz', size: 'wide' },
  { id: 'sparkz-2', src: '/images/gallery/sparkz-2.jpg', alt: 'Sparkz competition finals', event: 'sparkz', size: 'tall' },
  { id: 'sparkz-3', src: '/images/gallery/sparkz-3.jpg', alt: 'Sparkz opening ceremony', event: 'sparkz', size: 'normal' },
  { id: 'sparkz-4', src: '/images/gallery/sparkz-4.jpg', alt: 'Sparkz crowd and performers', event: 'sparkz', size: 'normal' },
  { id: 'halloween-1', src: '/images/gallery/halloween-1.jpg', alt: 'Halloween special event costumes', event: 'halloween', size: 'normal' },
  { id: 'halloween-2', src: '/images/gallery/halloween-2.jpg', alt: 'Halloween night atmosphere', event: 'halloween', size: 'wide' },
  { id: 'halloween-3', src: '/images/gallery/halloween-3.jpg', alt: 'Halloween dramatic setup', event: 'halloween', size: 'tall' },
  { id: 'halloween-4', src: '/images/gallery/halloween-4.jpg', alt: 'Halloween costume showcase', event: 'halloween', size: 'normal' },
  // Extended gallery — placeholder images (replace src with real photos when ready)
  { id: 'mirth-5', src: 'https://picsum.photos/seed/mirth5/800/600', alt: 'MIRTH backstage moments', event: 'mirth', size: 'wide' },
  { id: 'mirth-6', src: 'https://picsum.photos/seed/mirth6/600/900', alt: 'MIRTH award ceremony', event: 'mirth', size: 'tall' },
  { id: 'mirth-7', src: 'https://picsum.photos/seed/mirth7/800/600', alt: 'MIRTH opening act', event: 'mirth', size: 'normal' },
  { id: 'mirth-8', src: 'https://picsum.photos/seed/mirth8/800/600', alt: 'MIRTH crowd cheering', event: 'mirth', size: 'normal' },
  { id: 'sparkz-5', src: 'https://picsum.photos/seed/sparkz5/800/600', alt: 'Sparkz fashion showcase', event: 'sparkz', size: 'normal' },
  { id: 'sparkz-6', src: 'https://picsum.photos/seed/sparkz6/600/900', alt: 'Sparkz cultural display', event: 'sparkz', size: 'tall' },
  { id: 'sparkz-7', src: 'https://picsum.photos/seed/sparkz7/1200/600', alt: 'Sparkz grand finale', event: 'sparkz', size: 'wide' },
  { id: 'sparkz-8', src: 'https://picsum.photos/seed/sparkz8/800/600', alt: 'Sparkz trophy presentation', event: 'sparkz', size: 'normal' },
  { id: 'halloween-5', src: 'https://picsum.photos/seed/hall5/800/600', alt: 'Halloween face-off contest', event: 'halloween', size: 'normal' },
  { id: 'halloween-6', src: 'https://picsum.photos/seed/hall6/1200/600', alt: 'Halloween haunted stage', event: 'halloween', size: 'wide' },
  { id: 'halloween-7', src: 'https://picsum.photos/seed/hall7/600/900', alt: 'Halloween winners podium', event: 'halloween', size: 'tall' },
  { id: 'halloween-8', src: 'https://picsum.photos/seed/hall8/800/600', alt: 'Halloween group photo', event: 'halloween', size: 'normal' },
]

export const EVENTS: Event[] = [
  {
    id: 'sparkz-26',
    name: 'SPARKZ',
    date: 'Mar 27–28, 2026',
    type: 'upcoming',
    description:
      'The flagship inter-college cultural extravaganza. 15+ colleges. One stage. The biggest PYROS event of the year.',
    countdownTarget: '2026-03-27T00:00:00',
  },
  {
    id: 'mirth-26',
    name: 'MIRTH',
    date: 'TBD 2026',
    type: 'internal',
    description:
      'Our beloved internal cultural fest. MIRTH is where PYROS members shine brightest in front of their own campus.',
  },
  {
    id: 'halloween-25',
    name: 'HALLOWEEN SPECIAL',
    date: 'Oct 31, 2025',
    type: 'past',
    description: 'An electrifying Halloween night of costumes, performances, and unforgettable memories.',
  },
]

export const SOCIALS = [
  { label: 'Instagram', url: 'https://www.instagram.com/pyros_official_kare?igsh=MXh1aHVxcnFuampweA==', icon: 'instagram' },
  { label: 'YouTube', url: 'https://youtube.com/@fineartsclubkare5944?si=4vl1kOgoZ5YhOMOf', icon: 'youtube' },
  { label: 'Discord', url: 'https://discord.gg/XVFZKB6aNr', icon: 'discord' },
]
