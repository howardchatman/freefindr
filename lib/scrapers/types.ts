/**
 * Common interface every scraper must return.
 * Maps to the `listings` table schema.
 */
export interface RawListing {
  source_code: string          // e.g. 'craigslist'
  source_listing_id: string    // unique ID on the source platform
  title: string
  description?: string
  category?: string            // will be auto-detected if omitted
  image_url?: string
  image_urls?: string[]
  source_url?: string
  city?: string
  state?: string
  zip?: string
  lat?: number
  lng?: number
  posted_at?: string           // ISO string
}

export interface ScrapeResult {
  source: string
  listings: RawListing[]
  error?: string
  duration_ms: number
}

export interface ScraperConfig {
  /** Houston metro Craigslist subdomain */
  craigslist: {
    subdomain: string          // 'houston'
    maxPages: number
  }
  trashnothing: {
    groupIds: string[]         // TrashNothing group IDs for Houston
  }
  /** Third-party aggregator (ScraperAPI, Scrapeak, etc.) */
  aggregator?: {
    apiKey: string
    endpoint: string
    sources: ('facebook_marketplace' | 'offerup' | 'nextdoor')[]
    location: string           // e.g. 'Houston, TX'
    radius: number             // miles
  }
}

export const DEFAULT_SCRAPER_CONFIG: ScraperConfig = {
  craigslist: {
    subdomain: 'houston',
    maxPages: 3,
  },
  trashnothing: {
    groupIds: ['8083', '17482', '7534'], // Houston-area TrashNothing groups
  },
}
