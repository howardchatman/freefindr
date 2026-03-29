import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminListings } from '@/lib/db/queries'
import { timeAgo } from '@/lib/utils/dates'
import { categoryEmoji } from '@/lib/utils/category'

export const metadata: Metadata = { title: 'Admin – Listings' }

export default async function AdminListingsPage() {
  const listings = await getAdminListings()

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="border-b border-gray-200 bg-white px-6 py-5">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">← Admin</Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Listings</h1>
            <p className="text-sm text-gray-500">{listings.length} total</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {listings.length === 0 ? (
          <div className="py-20 text-center text-gray-400">No listings yet</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Title</th>
                  <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 sm:table-cell">Category</th>
                  <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 md:table-cell">Source</th>
                  <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 lg:table-cell">City</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Posted</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Active</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing: {
                  id: string
                  title: string
                  category: string
                  city: string | null
                  posted_at: string | null
                  is_active: boolean
                  source?: { name: string } | null
                }) => (
                  <tr key={listing.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/listing/${listing.id}`}
                        className="font-medium text-gray-800 hover:text-brand-600 hover:underline"
                      >
                        <span className="line-clamp-1">{listing.title}</span>
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="text-gray-600">
                        {categoryEmoji(listing.category)} {listing.category}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-gray-500 md:table-cell">
                      {listing.source?.name ?? '—'}
                    </td>
                    <td className="hidden px-4 py-3 text-gray-500 lg:table-cell">
                      {listing.city ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {timeAgo(listing.posted_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block h-2 w-2 rounded-full ${listing.is_active ? 'bg-green-400' : 'bg-gray-300'}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
