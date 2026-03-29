export interface Source {
  id: string
  code: string
  name: string
  is_enabled: boolean
  created_at: string
}

export interface Listing {
  id: string
  source_id: string | null
  source_listing_id: string
  title: string
  description: string | null
  category: string
  image_url: string | null
  image_urls: string[]
  source_url: string | null
  city: string | null
  state: string | null
  zip: string | null
  lat: number | null
  lng: number | null
  posted_at: string | null
  scraped_at: string
  is_active: boolean
  has_image: boolean
  created_at: string
  // joined
  source?: Source | null
}

export type ListingCategory =
  | 'pallets'
  | 'wood'
  | 'appliances'
  | 'furniture'
  | 'tools'
  | 'baby_kids'
  | 'outdoor'
  | 'miscellaneous'

export const CATEGORIES: { value: string; label: string; emoji: string }[] = [
  { value: 'pallets',      label: 'Pallets',     emoji: '📦' },
  { value: 'wood',         label: 'Wood',        emoji: '🌲' },
  { value: 'appliances',   label: 'Appliances',  emoji: '🧊' },
  { value: 'furniture',    label: 'Furniture',   emoji: '🛋️' },
  { value: 'tools',        label: 'Tools',       emoji: '🔧' },
  { value: 'baby_kids',    label: 'Baby & Kids', emoji: '🧸' },
  { value: 'outdoor',      label: 'Outdoor',     emoji: '🌿' },
  { value: 'miscellaneous',label: 'Other',       emoji: '📋' },
]

export const SOURCES: { code: string; name: string }[] = [
  { code: 'facebook_marketplace', name: 'Facebook' },
  { code: 'craigslist',           name: 'Craigslist' },
  { code: 'nextdoor',             name: 'Nextdoor' },
  { code: 'offerup',              name: 'OfferUp' },
  { code: 'trashnothing',         name: 'TrashNothing' },
]

export interface ListingFilters {
  category?: string
  source?: string
  imageOnly?: boolean
  search?: string
}
