import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getListingById } from '@/lib/db/queries'
import { ListingGallery } from '@/components/listing/ListingGallery'
import { LeadForm } from '@/components/listing/LeadForm'
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

  const location = [listing.city, listing.state, listing.zip].filter(Boolean).join(', ')

  return (
    <div className="min-h-screen pb-24">
      {/* Back nav */}
      <div className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/feed"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
            aria-label="Back to feed"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">{listing.title}</p>
          </div>
          <span className="shrink-0 rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-bold text-white">
            FREE
          </span>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Image gallery */}
        <ListingGallery images={images} title={listing.title} />

        {/* Title & meta */}
        <div className="mt-5">
          <h1 className="text-xl font-bold leading-snug text-gray-900">{listing.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              {categoryEmoji(listing.category)} {categoryLabel(listing.category)}
            </span>
            {listing.source && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {listing.source.name}
              </span>
            )}
          </div>
        </div>

        {/* Location + time */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
          {location && (
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{location}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Posted {timeAgo(listing.posted_at)}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-gray-100" />

        {/* Description */}
        {listing.description && (
          <div className="mb-5">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Description
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
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
              className="inline-flex items-center gap-1.5 text-sm text-brand-600 underline hover:text-brand-700"
            >
              View original listing
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        {/* MAIN CTA — Lead capture */}
        <LeadForm listingId={listing.id} listingTitle={listing.title} />

        {/* Posted details */}
        <p className="mt-4 text-center text-xs text-gray-400">
          Listed {formatDate(listing.posted_at)} · Scraped {timeAgo(listing.scraped_at)}
        </p>
      </div>
    </div>
  )
}
