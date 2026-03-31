/**
 * Craigslist scraper — uses the official RSS feed.
 *
 * Craigslist publishes RSS for every category. "Free stuff" is the
 * `zip` (free) category. This is the most legitimate data source
 * available — no auth, no ToS violation, no rate limiting issues.
 *
 * Feed URL format:
 *   https://{subdomain}.craigslist.org/search/zip?format=rss
 *
 * Docs: https://www.craigslist.org/about/rss
 */

import type { RawListing, ScrapeResult } from './types'
import { detectCategory } from '@/lib/utils/category'

const HOUSTON_AREAS = [
  'houston',
  'galveston',    // covers south Houston / Clear Lake
]

// Craigslist RSS item shape (parsed from XML)
interface CraigslistItem {
  title: string
  link: string
  description: string
  pubDate: string
  enclosure?: string          // image URL
  id: string                  // cl:id or guid
  lat?: string
  lng?: string
}

/**
 * Parse a Craigslist RSS feed and return raw listings.
 */
export async function scrapeCraigslist(
  subdomain = 'houston',
  maxPages = 3
): Promise<ScrapeResult> {
  const start = Date.now()
  const listings: RawListing[] = []

  for (const area of [subdomain, ...HOUSTON_AREAS.filter((a) => a !== subdomain)].slice(0, 2)) {
    for (let page = 0; page < maxPages; page++) {
      const offset = page * 120
      const url = `https://${area}.craigslist.org/search/zip?format=rss&s=${offset}`

      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'FreeFindr/1.0 (freefindr.com; listings aggregator)' },
          signal: AbortSignal.timeout(15_000),
        })

        if (!res.ok) break
        const xml = await res.text()
        const items = parseCraigslistRSS(xml)

        if (items.length === 0) break

        for (const item of items) {
          listings.push(transformCraigslistItem(item, area))
        }

        // Polite delay between pages
        if (page < maxPages - 1) await sleep(1500)
      } catch (err) {
        console.error(`Craigslist fetch error (${area}, page ${page}):`, err)
        break
      }
    }
  }

  return {
    source: 'craigslist',
    listings: dedupeById(listings),
    duration_ms: Date.now() - start,
  }
}

// ─── XML Parser ───────────────────────────────────────────────────────────────

function parseCraigslistRSS(xml: string): CraigslistItem[] {
  const items: CraigslistItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const item: CraigslistItem = {
      title:       extractTag(block, 'title'),
      link:        extractTag(block, 'link') || extractTag(block, 'guid'),
      description: stripHtml(extractTag(block, 'description')),
      pubDate:     extractTag(block, 'pubDate'),
      id:          extractTag(block, 'dc:identifier') || extractTag(block, 'guid'),
      enclosure:   extractAttr(block, 'enclosure', 'url'),
      lat:         extractTag(block, 'geo:lat'),
      lng:         extractTag(block, 'geo:long'),
    }

    if (item.title && item.link) items.push(item)
  }

  return items
}

function transformCraigslistItem(item: CraigslistItem, subdomain: string): RawListing {
  // Extract CL listing ID from URL: https://houston.craigslist.org/zip/12345678.html
  const idMatch = item.link.match(/\/(\d{7,12})\.html/)
  const sourceId = idMatch?.[1] ?? item.id ?? item.link

  // Extract ZIP from description if present
  const zipMatch = item.description.match(/\b(7\d{4})\b/)

  return {
    source_code:       'craigslist',
    source_listing_id: sourceId,
    title:             cleanTitle(item.title),
    description:       item.description || undefined,
    category:          detectCategory(item.title, item.description),
    image_url:         item.enclosure || undefined,
    image_urls:        item.enclosure ? [item.enclosure] : [],
    source_url:        item.link,
    city:              subdomain === 'houston' ? 'Houston' : capitalize(subdomain),
    state:             'TX',
    zip:               zipMatch?.[1],
    lat:               item.lat ? parseFloat(item.lat) : undefined,
    lng:               item.lng ? parseFloat(item.lng) : undefined,
    posted_at:         item.pubDate ? new Date(item.pubDate).toISOString() : undefined,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([^<]*)<\\/${tag}>`))
  return (match?.[1] ?? match?.[2] ?? '').trim()
}

function extractAttr(xml: string, tag: string, attr: string): string | undefined {
  const match = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, 'i'))
  return match?.[1]
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim()
}

function cleanTitle(title: string): string {
  return title.replace(/^free[:\s-]*/i, 'Free ').trim()
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function dedupeById(listings: RawListing[]): RawListing[] {
  const seen = new Set<string>()
  return listings.filter((l) => {
    const key = `${l.source_code}:${l.source_listing_id}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
