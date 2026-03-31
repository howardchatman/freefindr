/**
 * Import pipeline — takes raw listings from any scraper and
 * upserts them into Supabase, deduplicating by (source_id, source_listing_id).
 */

import type { RawListing } from './types'
import { detectCategory } from '@/lib/utils/category'

interface ImportResult {
  inserted: number
  updated: number
  skipped: number
  errors: number
}

/**
 * Upsert listings into Supabase.
 * Safe to call repeatedly — won't create duplicates.
 */
export async function importListings(rawListings: RawListing[]): Promise<ImportResult> {
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const result: ImportResult = { inserted: 0, updated: 0, skipped: 0, errors: 0 }

  // Fetch source ID map once
  const { data: sources } = await supabase.from('sources').select('id, code')
  const sourceMap = Object.fromEntries((sources ?? []).map((s: { id: string; code: string }) => [s.code, s.id]))

  // Process in batches of 20 to stay within Supabase free tier limits
  const BATCH_SIZE = 20
  for (let i = 0; i < rawListings.length; i += BATCH_SIZE) {
    const batch = rawListings.slice(i, i + BATCH_SIZE)

    const rows = batch
      .filter((l) => {
        if (!sourceMap[l.source_code]) {
          console.warn(`Unknown source: ${l.source_code} — skipping`)
          result.skipped++
          return false
        }
        if (!l.title?.trim()) {
          result.skipped++
          return false
        }
        return true
      })
      .map((l) => ({
        source_id:         sourceMap[l.source_code],
        source_listing_id: l.source_listing_id,
        title:             l.title.trim().slice(0, 300),
        description:       l.description?.trim().slice(0, 5000) ?? null,
        category:          l.category ?? detectCategory(l.title, l.description),
        image_url:         l.image_url ?? null,
        image_urls:        l.image_urls ?? [],
        source_url:        l.source_url ?? null,
        city:              l.city ?? null,
        state:             l.state ?? null,
        zip:               l.zip ?? null,
        lat:               l.lat ?? null,
        lng:               l.lng ?? null,
        posted_at:         l.posted_at ?? null,
        is_active:         true,
        has_image:         !!(l.image_url || (l.image_urls && l.image_urls.length > 0)),
        scraped_at:        new Date().toISOString(),
      }))

    if (rows.length === 0) continue

    const { data, error } = await supabase
      .from('listings')
      .upsert(rows, {
        onConflict: 'source_id,source_listing_id',
        ignoreDuplicates: false, // update existing
      })
      .select('id')

    if (error) {
      console.error('Import batch error:', error.message)
      result.errors += rows.length
    } else {
      result.inserted += data?.length ?? rows.length
    }
  }

  return result
}

/**
 * Mark listings from a source that weren't in the latest scrape as inactive.
 * Call after each scrape to expire old listings.
 */
export async function expireOldListings(
  sourceCode: string,
  activeSourceListingIds: string[],
  olderThanHours = 72
): Promise<void> {
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const cutoff = new Date(Date.now() - olderThanHours * 3_600_000).toISOString()

  const { error } = await supabase
    .from('listings')
    .update({ is_active: false })
    .eq('is_active', true)
    .lt('scraped_at', cutoff)
    .not('source_listing_id', 'in', `(${activeSourceListingIds.map((id) => `'${id}'`).join(',')})`)
    .eq('sources.code', sourceCode)

  if (error) console.error('Expire listings error:', error.message)
}
