import Image from 'next/image'
import Link from 'next/link'
import type { Listing } from '@/lib/types/listing'
import { timeAgo } from '@/lib/utils/dates'
import { categoryEmoji } from '@/lib/utils/category'

interface ListingCardProps {
  listing: Listing
}

/** Derive an urgency badge from how recently the item was posted */
function getUrgencyBadge(postedAt: string | null): { label: string; color: string } | null {
  if (!postedAt) return null
  const diffHours = (Date.now() - new Date(postedAt).getTime()) / 3_600_000
  if (diffHours < 2)  return { label: 'Just Posted', color: 'bg-brand-500 text-white' }
  if (diffHours < 6)  return { label: 'Today',       color: 'bg-brand-500/90 text-white' }
  if (diffHours < 24) return { label: 'Today',        color: 'bg-brand-500/80 text-white' }
  return null
}

export function ListingCard({ listing }: ListingCardProps) {
  const location = [listing.city, listing.state].filter(Boolean).join(', ')
  const sourceLabel = listing.source?.name ?? 'Free'
  const badge = getUrgencyBadge(listing.posted_at)

  return (
    <Link href={`/listing/${listing.id}`} className="group block">
      <article className="overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-200 group-hover:shadow-card-hover group-active:scale-[0.97]">

        {/* Image — square on mobile for uniform grid */}
        <div className="relative aspect-square overflow-hidden bg-[#F7F7F8]">
          {listing.image_url ? (
            <Image
              src={listing.image_url}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <span className="text-4xl opacity-30">{categoryEmoji(listing.category)}</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-[#9CA3AF]">No photo</span>
            </div>
          )}

          {/* Urgency badge — top left */}
          {badge && (
            <div className="absolute left-2 top-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ${badge.color}`}>
                {badge.label}
              </span>
            </div>
          )}

          {/* Source badge — bottom left */}
          <div className="absolute bottom-2 left-2">
            <span className="rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              {sourceLabel}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="mb-1.5 line-clamp-2 text-[13px] font-bold leading-snug text-[#111111]">
            {listing.title}
          </h3>

          {/* Location */}
          {location && (
            <div className="mb-1 flex items-center gap-1 text-[11px] text-[#6B7280]">
              <svg className="h-3 w-3 shrink-0 text-[#9CA3AF]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="truncate">{location}</span>
            </div>
          )}

          {/* Time */}
          <p className="text-[11px] text-[#9CA3AF]">{timeAgo(listing.posted_at)}</p>
        </div>
      </article>
    </Link>
  )
}
