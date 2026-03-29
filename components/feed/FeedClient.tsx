'use client'

import { useState, useMemo } from 'react'
import type { Listing } from '@/lib/types/listing'
import { CATEGORIES, SOURCES } from '@/lib/types/listing'
import { ListingCard } from '@/components/feed/ListingCard'
import { EmptyState } from '@/components/shared/EmptyState'

interface FeedClientProps {
  listings: Listing[]
}

export function FeedClient({ listings }: FeedClientProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [source, setSource] = useState('')
  const [imageOnly, setImageOnly] = useState(false)

  const filtered = useMemo(() => {
    let result = listings
    if (imageOnly)  result = result.filter((l) => l.has_image)
    if (category)   result = result.filter((l) => l.category === category)
    if (source)     result = result.filter((l) => l.source?.code === source)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (l) => l.title.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q)
      )
    }
    return result
  }, [listings, search, category, source, imageOnly])

  return (
    <div>
      {/* Search bar */}
      <div className="px-4 pb-3 pt-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search free stuff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
        <FilterChip
          label="All"
          active={!category}
          onClick={() => setCategory('')}
        />
        {CATEGORIES.map((cat) => (
          <FilterChip
            key={cat.value}
            label={`${cat.emoji} ${cat.label}`}
            active={category === cat.value}
            onClick={() => setCategory(category === cat.value ? '' : cat.value)}
          />
        ))}
      </div>

      {/* Source chips + image toggle */}
      <div className="flex items-center gap-2 overflow-x-auto px-4 pb-4 scrollbar-hide">
        <div className="flex shrink-0 gap-2">
          {SOURCES.map((src) => (
            <FilterChip
              key={src.code}
              label={src.name}
              active={source === src.code}
              onClick={() => setSource(source === src.code ? '' : src.code)}
              small
            />
          ))}
        </div>
        <div className="ml-auto shrink-0">
          <button
            onClick={() => setImageOnly(!imageOnly)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              imageOnly
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <span>📷</span>
            <span>Photos only</span>
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="px-4 pb-2">
        <p className="text-xs text-gray-400">
          {filtered.length} listing{filtered.length !== 1 ? 's' : ''} near Houston
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No listings found"
          description="Try adjusting your filters or check back soon for new items."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 pb-24 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}

interface FilterChipProps {
  label: string
  active: boolean
  onClick: () => void
  small?: boolean
}

function FilterChip({ label, active, onClick, small }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 font-medium transition-colors ${
        small ? 'py-1 text-xs' : 'py-1.5 text-xs'
      } ${
        active
          ? 'border-brand-500 bg-brand-500 text-white'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  )
}
