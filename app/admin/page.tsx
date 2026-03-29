import type { Metadata } from 'next'
import Link from 'next/link'
import { getLeads, getAdminListings } from '@/lib/db/queries'
import { isMockMode } from '@/lib/db/queries'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminPage() {
  const [leads, listings] = await Promise.all([getLeads(), getAdminListings()])

  const newLeads = leads.filter((l) => l.status === 'new').length
  const activeListings = listings.filter((l: { is_active: boolean }) => l.is_active).length

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">FreeFindr.com</p>
          </div>
          <Link
            href="/feed"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            ← Back to app
          </Link>
        </div>
        {isMockMode && (
          <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Mock mode — connect Supabase to see live data
          </div>
        )}
      </header>

      <div className="mx-auto max-w-3xl space-y-6 px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Listings" value={listings.length} />
          <StatCard label="Active Listings" value={activeListings} highlight />
          <StatCard label="New Leads" value={newLeads} highlight />
        </div>

        {/* Navigation cards */}
        <div className="grid gap-4">
          <AdminCard
            href="/admin/leads"
            title="Leads"
            description={`${leads.length} total leads · ${newLeads} new`}
            icon="📞"
            badge={newLeads > 0 ? `${newLeads} new` : undefined}
          />
          <AdminCard
            href="/admin/listings"
            title="Listings"
            description={`${listings.length} total · ${activeListings} active`}
            icon="📋"
          />
        </div>

        {/* Quick info */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Next Steps</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li className="flex items-start gap-2"><span className="mt-0.5 text-gray-300">○</span> Connect Supabase (add env vars)</li>
            <li className="flex items-start gap-2"><span className="mt-0.5 text-gray-300">○</span> Add scraper for Craigslist / Facebook</li>
            <li className="flex items-start gap-2"><span className="mt-0.5 text-gray-300">○</span> Set up Twilio for lead routing</li>
            <li className="flex items-start gap-2"><span className="mt-0.5 text-gray-300">○</span> Add auth (email magic link or phone)</li>
            <li className="flex items-start gap-2"><span className="mt-0.5 text-gray-300">○</span> Add push notifications for keyword matches</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 text-center shadow-sm ${highlight ? 'border-brand-200 bg-brand-50' : 'border-gray-100 bg-white'}`}>
      <p className={`text-2xl font-bold ${highlight ? 'text-brand-600' : 'text-gray-900'}`}>{value}</p>
      <p className="mt-0.5 text-xs font-medium text-gray-500">{label}</p>
    </div>
  )
}

function AdminCard({ href, title, description, icon, badge }: {
  href: string; title: string; description: string; icon: string; badge?: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-2xl">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {badge && (
            <span className="rounded-full bg-brand-500 px-2 py-0.5 text-xs font-bold text-white">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}
