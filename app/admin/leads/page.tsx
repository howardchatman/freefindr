import type { Metadata } from 'next'
import Link from 'next/link'
import { getLeads } from '@/lib/db/queries'
import { formatDate } from '@/lib/utils/dates'

export const metadata: Metadata = { title: 'Admin – Leads' }

const STATUS_COLORS: Record<string, string> = {
  new:       'bg-brand-100 text-brand-700',
  contacted: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

export default async function AdminLeadsPage() {
  const leads = await getLeads()

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="border-b border-gray-200 bg-white px-6 py-5">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">← Admin</Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Leads</h1>
            <p className="text-sm text-gray-500">{leads.length} total submissions</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {leads.length === 0 ? (
          <div className="py-20 text-center text-gray-400">No leads yet</div>
        ) : (
          <div className="flex flex-col gap-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {/* Name + phone */}
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{lead.name}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[lead.status] ?? STATUS_COLORS.new}`}>
                        {lead.status}
                      </span>
                    </div>
                    <a
                      href={`tel:${lead.phone}`}
                      className="mt-0.5 block text-sm font-medium text-brand-600 hover:text-brand-700"
                    >
                      {lead.phone}
                    </a>
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="text-xs text-gray-500 hover:underline">
                        {lead.email}
                      </a>
                    )}
                  </div>
                  <div className="text-right text-xs text-gray-400 shrink-0">
                    <p>{formatDate(lead.created_at)}</p>
                    {lead.zip && <p>ZIP: {lead.zip}</p>}
                  </div>
                </div>

                {/* Listing */}
                {lead.listing?.title && (
                  <div className="mt-3 rounded-xl bg-gray-50 px-3 py-2 text-xs">
                    <span className="text-gray-400">Re: </span>
                    <span className="font-medium text-gray-700">{lead.listing.title}</span>
                  </div>
                )}

                {/* Message */}
                {lead.message && (
                  <p className="mt-2 text-sm italic text-gray-500">"{lead.message}"</p>
                )}

                {/* Lead type */}
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                  <span>Type: {lead.lead_type}</span>
                  {lead.assigned_to && <span>· Assigned: {lead.assigned_to}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
