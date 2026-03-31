import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getListingById } from '@/lib/db/queries'
import { ListingGallery } from '@/components/listing/ListingGallery'
import { LeadCTA } from '@/components/listing/LeadCTA'
import { BackHeader } from '@/components/shared/AppHeader'
import { timeAgo, formatDate } from '@/lib/utils/dates'
import { categoryEmoji, categoryLabel } from '@/lib/utils/category'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const listing = await getListingById(id)
  if (!listing) return { title: 'Listing Not Found' }
  return {
    title: listing.title,
    description: listing.description?.slice(0, 155) ?? `Free ${listing.category} in ${listing.city ?? 'Houston'}`,
  }
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params
  const listing = await getListingById(id)
  if (!listing) notFound()

  const images = listing.image_urls?.length
    ? listing.image_urls
    : listing.image_url
    ? [listing.image_url]
    : []

  const location = [listing.city, listing.state].filter(Boolean).join(', ')
  const fullLocation = [listing.city, listing.state, listing.zip].filter(Boolean).join(', ')

  // Posted within 6 hours = urgency
  const isUrgent = listing.posted_at
    ? (Date.now() - new Date(listing.posted_at).getTime()) / 3_600_000 < 6
    : false

  return (
    <div className="min-h-screen bg-surface pb-28">
      <BackHeader title={listing.title} />

      <div className="px-4 pt-4">
        {/* Gallery */}
        <ListingGallery images={images} title={listing.title} />

        {/* Urgency strip — only for very recent items */}
        {isUrgent && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5">
            <span className="text-base">⚡</span>
            <p className="text-xs font-semibold text-amber-800">
              Just posted — items like this go fast. Don't wait.
            </p>
          </div>
        )}

        {/* Title block */}
        <div className="mt-4">
          {/* FREE pill */}
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white tracking-wide">
              FREE
            </span>
            {listing.source && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-[#6B7280]">
                {listing.source.name}
              </span>
            )}
          </div>

          <h1 className="text-xl font-black leading-tight text-[#111111] text-balance">
            {listing.title}
          </h1>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#6B7280]">
            {fullLocation && (
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-[#9CA3AF] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{fullLocation}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-[#9CA3AF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Posted {timeAgo(listing.posted_at)}</span>
            </div>
          </div>

          {/* Category tag */}
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-[#6B7280]">
              <span>{categoryEmoji(listing.category)}</span>
              <span>{categoryLabel(listing.category)}</span>
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 h-px bg-[#E5E7EB]" />

        {/* Description */}
        {listing.description && (
          <div className="mb-5">
            <h2 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">
              Description
            </h2>
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-[#374151]">
              {listing.description}
            </p>
          </div>
        )}

        {/* Source link */}
        {listing.source_url && (
          <div className="mb-5">
            <a
              href={listing.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              View original listing
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        {/* ── PRIMARY CTA ──────────────────────────────── */}
        <LeadCTA listingId={listing.id} listingTitle={listing.title} />

        {/* Alert me link */}
        <div className="mt-4 text-center">
          <Link
            href="/alerts"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B7280] hover:text-brand-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Alert me when similar items appear
          </Link>
        </div>

        {/* Tiny footer */}
        <p className="mt-6 text-center text-[11px] text-[#9CA3AF]">
          Listed {formatDate(listing.posted_at)}
        </p>
      </div>
    </div>
  )
}
