/**
 * Third-party aggregator adapter — covers Facebook Marketplace, OfferUp, Nextdoor.
 *
 * These platforms have NO public APIs. The only legal path is a
 * licensed data provider. Options ranked by quality/price:
 *
 * ┌─────────────────────┬──────────────────────────────────────────┬────────────┐
 * │ Service             │ Covers                                   │ Price      │
 * ├─────────────────────┼──────────────────────────────────────────┼────────────┤
 * │ ScraperAPI          │ General scraping + JS rendering          │ $49+/mo    │
 * │ Scrapeak            │ Facebook Marketplace specifically        │ $79+/mo    │
 * │ OutScraper          │ Facebook, OfferUp, general               │ Pay/use    │
 * │ Bright Data         │ Enterprise, all platforms                │ $500+/mo   │
 * │ Apify               │ FB Marketplace actor, OfferUp actor      │ $49+/mo    │
 * └─────────────────────┴──────────────────────────────────────────┴────────────┘
 *
 * RECOMMENDED FOR MVP: Apify
 * - Has pre-built actors for FB Marketplace and OfferUp
 * - Pay per use ($5-20/month at low volume)
 * - Easy REST API
 * - Sign up: https://apify.com
 *
 * Set env var: APIFY_API_TOKEN=your_token
 */

import type { RawListing, ScrapeResult } from './types'
import { detectCategory } from '@/lib/utils/category'

const APIFY_TOKEN = process.env.APIFY_API_TOKEN

// Apify actor IDs for each platform
const ACTORS = {
  facebook_marketplace: 'apify/facebook-marketplace-scraper',
  offerup:              'apify/offerup-scraper',
}

// Houston coordinates
const HOUSTON = { lat: 29.7604, lng: -95.3698, zip: '77002' }

// ─── Facebook Marketplace via Apify ──────────────────────────────────────────

export async function scrapeFacebookMarketplace(radiusMiles = 25): Promise<ScrapeResult> {
  const start = Date.now()

  if (!APIFY_TOKEN) {
    console.warn('APIFY_API_TOKEN not set — Facebook Marketplace scraping skipped')
    return { source: 'facebook_marketplace', listings: [], error: 'No API token', duration_ms: 0 }
  }

  try {
    // Run the Apify actor
    const runRes = await fetch(
      `https://api.apify.com/v2/acts/${ACTORS.facebook_marketplace}/runs?token=${APIFY_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchQuery: 'free',
          location: 'Houston, Texas',
          radius: radiusMiles,
          maxItems: 100,
          categoryId: 'free_stuff', // FB Marketplace category
          sortBy: 'creation_time_descend',
        }),
      }
    )

    if (!runRes.ok) throw new Error(`Apify run failed: ${runRes.status}`)
    const run = await runRes.json()
    const runId = run.data.id

    // Poll until done (max 2 minutes)
    const results = await pollApifyRun(runId)
    const listings = results.map(transformFBItem)

    return { source: 'facebook_marketplace', listings, duration_ms: Date.now() - start }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Facebook Marketplace scrape error:', msg)
    return { source: 'facebook_marketplace', listings: [], error: msg, duration_ms: Date.now() - start }
  }
}

// ─── OfferUp via Apify ────────────────────────────────────────────────────────

export async function scrapeOfferUp(radiusMiles = 25): Promise<ScrapeResult> {
  const start = Date.now()

  if (!APIFY_TOKEN) {
    console.warn('APIFY_API_TOKEN not set — OfferUp scraping skipped')
    return { source: 'offerup', listings: [], error: 'No API token', duration_ms: 0 }
  }

  try {
    const runRes = await fetch(
      `https://api.apify.com/v2/acts/${ACTORS.offerup}/runs?token=${APIFY_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchQuery: 'free',
          zipCode: HOUSTON.zip,
          radius: radiusMiles,
          maxItems: 100,
          priceMax: 0, // free items only
        }),
      }
    )

    if (!runRes.ok) throw new Error(`Apify OfferUp run failed: ${runRes.status}`)
    const run = await runRes.json()
    const results = await pollApifyRun(run.data.id)
    const listings = results.map(transformOfferUpItem)

    return { source: 'offerup', listings, duration_ms: Date.now() - start }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('OfferUp scrape error:', msg)
    return { source: 'offerup', listings: [], error: msg, duration_ms: Date.now() - start }
  }
}

// ─── Apify polling helper ─────────────────────────────────────────────────────

async function pollApifyRun(runId: string, maxWaitMs = 120_000): Promise<Record<string, unknown>[]> {
  const deadline = Date.now() + maxWaitMs

  while (Date.now() < deadline) {
    await sleep(5000)

    const statusRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
    )
    const status = await statusRes.json()
    const state: string = status.data.status

    if (state === 'SUCCEEDED') {
      const datasetId: string = status.data.defaultDatasetId
      const itemsRes = await fetch(
        `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&clean=true`
      )
      return await itemsRes.json()
    }

    if (state === 'FAILED' || state === 'ABORTED' || state === 'TIMED-OUT') {
      throw new Error(`Apify run ${state}: ${runId}`)
    }
  }

  throw new Error(`Apify run timed out: ${runId}`)
}

// ─── Transform Apify results ──────────────────────────────────────────────────

function transformFBItem(item: Record<string, unknown>): RawListing {
  const id = String(item.id ?? item.listing_id ?? '')
  const title = String(item.title ?? item.name ?? '')
  const desc = String(item.description ?? '')

  return {
    source_code:       'facebook_marketplace',
    source_listing_id: id,
    title,
    description:       desc || undefined,
    category:          detectCategory(title, desc),
    image_url:         String(item.primaryPhotoUrl ?? item.image ?? '') || undefined,
    image_urls:        Array.isArray(item.photos) ? item.photos.map(String) : [],
    source_url:        `https://www.facebook.com/marketplace/item/${id}`,
    city:              String(item.city ?? item.location ?? 'Houston') || 'Houston',
    state:             'TX',
    lat:               typeof item.lat === 'number' ? item.lat : undefined,
    lng:               typeof item.lng === 'number' ? item.lng : undefined,
    posted_at:         item.createdTime ? new Date(String(item.createdTime)).toISOString() : undefined,
  }
}

function transformOfferUpItem(item: Record<string, unknown>): RawListing {
  const id = String(item.id ?? item.item_id ?? '')
  const title = String(item.title ?? item.name ?? '')
  const desc = String(item.description ?? '')

  return {
    source_code:       'offerup',
    source_listing_id: id,
    title,
    description:       desc || undefined,
    category:          detectCategory(title, desc),
    image_url:         String(item.photo ?? item.pictureUrl ?? '') || undefined,
    image_urls:        [],
    source_url:        `https://offerup.com/item/detail/${id}`,
    city:              String(item.city ?? 'Houston') || 'Houston',
    state:             'TX',
    lat:               typeof item.latitude === 'number' ? item.latitude : undefined,
    lng:               typeof item.longitude === 'number' ? item.longitude : undefined,
    posted_at:         item.created ? new Date(String(item.created)).toISOString() : undefined,
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
