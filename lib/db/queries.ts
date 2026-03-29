import type { Listing, ListingFilters } from '@/lib/types/listing'
import type { Lead } from '@/lib/types/lead'
import { MOCK_LISTINGS, MOCK_LEADS, MOCK_KEYWORDS } from '@/lib/mock/data'
import { DEV_USER_ID } from '@/lib/types/user'

export const isMockMode =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project.supabase.co'

// ─── Listings ─────────────────────────────────────────────────────────────────

export async function getListings(filters?: ListingFilters): Promise<Listing[]> {
  if (isMockMode) return filterMockListings(filters)

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  let query = supabase
    .from('listings')
    .select('*, source:sources(*)')
    .eq('is_active', true)
    .order('posted_at', { ascending: false })
    .limit(100)

  if (filters?.category) query = query.eq('category', filters.category)
  if (filters?.source)   query = query.eq('sources.code', filters.source)
  if (filters?.imageOnly) query = query.eq('has_image', true)
  if (filters?.search)   query = query.ilike('title', `%${filters.search}%`)

  const { data, error } = await query
  if (error) { console.error('getListings error:', error); return [] }
  return (data ?? []) as Listing[]
}

export async function getListingById(id: string): Promise<Listing | null> {
  if (isMockMode) return MOCK_LISTINGS.find((l) => l.id === id) ?? null

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('listings')
    .select('*, source:sources(*)')
    .eq('id', id)
    .single()

  if (error) { console.error('getListingById error:', error); return null }
  return data as Listing
}

// ─── Leads ────────────────────────────────────────────────────────────────────

export async function getLeads(): Promise<Lead[]> {
  if (isMockMode) return MOCK_LEADS

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('leads')
    .select('*, listing:listings(title)')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) { console.error('getLeads error:', error); return [] }
  return (data ?? []) as Lead[]
}

// ─── Keywords ─────────────────────────────────────────────────────────────────

export async function getKeywords(userId = DEV_USER_ID) {
  if (isMockMode) return MOCK_KEYWORDS

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('keywords')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) { console.error('getKeywords error:', error); return [] }
  return data ?? []
}

// ─── Admin helpers ────────────────────────────────────────────────────────────

export async function getAdminListings() {
  if (isMockMode) return MOCK_LISTINGS

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('listings')
    .select('*, source:sources(name)')
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) { console.error('getAdminListings error:', error); return [] }
  return data ?? []
}

// ─── Internal mock helpers ────────────────────────────────────────────────────

function filterMockListings(filters?: ListingFilters): Listing[] {
  let results = MOCK_LISTINGS

  if (filters?.category) results = results.filter((l) => l.category === filters.category)
  if (filters?.imageOnly) results = results.filter((l) => l.has_image)
  if (filters?.source)   results = results.filter((l) => l.source?.code === filters.source)
  if (filters?.search) {
    const q = filters.search.toLowerCase()
    results = results.filter(
      (l) => l.title.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q)
    )
  }

  return results
}
