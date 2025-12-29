import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'School AI Assistant',
  description: 'AI-powered assistant for students and teachers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
