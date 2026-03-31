'use client'

import { useState, useMemo } from 'react'
import type { Listing } from '@/lib/types/listing'
import { CATEGORIES, SOURCES } from '@/lib/types/listing'
import { ListingCard } from '@/components/feed/ListingCard'
import { ActivityBanner } from '@/components/shared/ActivityBanner'
import { AppHeader } from '@/components/shared/AppHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import Link from 'next/link'

interface FeedClientProps {
  listings: Listing[]
  isMock?: boolean
}

export function FeedClient({ listings, isMock }: FeedClientProps) {
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('')
  const [source, setSource]     = useState('')
  const [imageOnly, setImageOnly] = useState(false)

  const filtered = useMemo(() => {
    let result = listings
    if (imageOnly) result = result.filter((l) => l.has_image)
    if (category)  result = result.filter((l) => l.category === category)
    if (source)    result = result.filter((l) => l.source?.code === source)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (l) => l.title.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q)
      )
    }
    return result
  }, [listings, search, category, source, imageOnly])

  const hasActiveFilters = !!(category || source || imageOnly || search)

  return (
    <div className="min-h-screen bg-surface">
      {/* Sticky header with integrated search */}
      <AppHeader
        showSearch
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* Mock mode notice */}
      {isMock && (
        <div className="border-b border-dashed border-amber-200 bg-amber-50 px-4 py-1.5 text-center text-[11px] text-amber-700">
          Preview mode · Connect Supabase for live data
        </div>
      )}

      {/* Live activity banner */}
      <ActivityBanner count={listings.length} />

      {/* Category filter row */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
          <Chip
            label="All"
            active={!category}
            onClick={() => setCategory('')}
          />
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.value}
              label={`${cat.emoji} ${cat.label}`}
              active={category === cat.value}
              onClick={() => setCategory(category === cat.value ? '' : cat.value)}
            />
          ))}
        </div>

        {/* Source + photo toggle row */}
        <div className="flex items-center gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
          {SOURCES.map((src) => (
            <Chip
              key={src.code}
              label={src.name}
              active={source === src.code}
              onClick={() => setSource(source === src.code ? '' : src.code)}
              small
            />
          ))}
          <div className="ml-auto shrink-0">
            <button
              onClick={() => setImageOnly(!imageOnly)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors ${
                imageOnly
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-[#E5E7EB] bg-white text-[#6B7280] hover:border-gray-300'
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Photos only
            </button>
          </div>
        </div>
      </div>

      {/* Results bar */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <p className="text-xs text-[#9CA3AF]">
          <span className="font-semibold text-[#6B7280]">{filtered.length}</span>
          {' '}listing{filtered.length !== 1 ? 's' : ''} near Houston
        </p>
        {hasActiveFilters && (
          <button
            onClick={() => { setCategory(''); setSource(''); setImageOnly(false); setSearch('') }}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No items found nearby"
          description="Try increasing your radius, adjusting filters, or adding more keywords."
          action={
            hasActiveFilters ? (
              <button
                onClick={() => { setCategory(''); setSource(''); setImageOnly(false); setSearch('') }}
                className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Clear all filters
              </button>
            ) : (
              <Link
                href="/alerts"
                className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Set keyword alerts
              </Link>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 pb-28 pt-1 sm:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Chip ──────────────────────────────────────────────────────────────────────

interface ChipProps {
  label: string
  active: boolean
  onClick: () => void
  small?: boolean
}

function Chip({ label, active, onClick, small }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border font-semibold whitespace-nowrap transition-colors ${
        small ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
      } ${
        active
          ? 'border-brand-500 bg-brand-500 text-white'
          : 'border-[#E5E7EB] bg-white text-[#6B7280] hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  )
}
