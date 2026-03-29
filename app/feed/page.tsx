import type { Metadata } from 'next'
import Link from 'next/link'
import { getListings } from '@/lib/db/queries'
import { isMockMode } from '@/lib/db/queries'
import { FeedClient } from '@/components/feed/FeedClient'

export const metadata: Metadata = {
  title: 'Feed – Free Stuff Near Houston',
}

// Revalidate every 5 minutes in production
export const revalidate = 300

export default async function FeedPage() {
  const listings = await getListings()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              FreeFindr<span className="text-brand-500">.com</span>
            </h1>
            <p className="text-xs text-gray-400">Find free stuff near you. Fast.</p>
          </div>
          <Link
            href="/settings"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            aria-label="Settings"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Mock mode banner */}
      {isMockMode && (
        <div className="bg-amber-50 px-4 py-2 text-center text-xs text-amber-700">
          Running with mock data — add Supabase env vars to connect live data
        </div>
      )}

      {/* Feed with client-side filtering */}
      <FeedClient listings={listings} />
    </div>
  )
}
