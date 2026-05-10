import type { Metadata } from 'next'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'PYROS Fine Arts Club — KARE',
  description: 'A decade of creativity, passion, and fire at Kalasalingam Academy of Research and Education.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <div id="lightbox-portal" />
      </body>
    </html>
  )
}
