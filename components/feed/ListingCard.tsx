import Image from 'next/image'
import Link from 'next/link'
import type { Listing } from '@/lib/types/listing'
import { timeAgo } from '@/lib/utils/dates'
import { categoryEmoji } from '@/lib/utils/category'

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const location = [listing.city, listing.state].filter(Boolean).join(', ')
  const sourceLabel = listing.source?.name ?? listing.source_id ?? 'Free'

  return (
    <Link href={`/listing/${listing.id}`} className="group block">
      <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow group-hover:shadow-md group-active:scale-[0.98]">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {listing.image_url ? (
            <Image
              src={listing.image_url}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-gray-300">
              {categoryEmoji(listing.category)}
            </div>
          )}
          {/* Source badge */}
          <div className="absolute left-2 top-2">
            <span className="rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              {sourceLabel}
            </span>
          </div>
          {/* FREE badge */}
          <div className="absolute right-2 top-2">
            <span className="rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-bold text-white">
              FREE
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="mb-1 line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
            {listing.title}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span>{categoryEmoji(listing.category)}</span>
              <span className="capitalize">{listing.category.replace('_', ' ')}</span>
            </div>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs text-gray-400">
            {location && <span className="truncate">{location}</span>}
            <span className="ml-auto shrink-0">{timeAgo(listing.posted_at)}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
