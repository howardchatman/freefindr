import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { BottomNav } from '@/components/shared/BottomNav'
import '@/app/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'FreeFindr – Find Free Stuff Near You',
    template: '%s | FreeFindr',
  },
  description: 'Find free furniture, appliances, pallets, tools, and more near you. Fast free stuff alerts on FreeFindr.',
  keywords: ['free stuff Houston', 'free furniture near me', 'free pallets', 'FreeFindr'],
  openGraph: {
    title: 'FreeFindr',
    description: 'Find free stuff near you. Fast.',
    type: 'website',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50">
        <main className="mx-auto max-w-2xl">{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}
