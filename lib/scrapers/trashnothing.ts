/**
 * TrashNothing scraper — uses their public RSS feed.
 *
 * TrashNothing is a free reuse network built on top of Freecycle.
 * They expose RSS feeds per group with no auth required.
 *
 * RSS format: https://trashnothing.com/beta/group/{groupId}/rss
 *
 * Houston-area groups:
 *   - Houston Freecycle: search at https://trashnothing.com/tx/houston
 */

import type { RawListing, ScrapeResult } from './types'
import { detectCategory } from '@/lib/utils/category'

// Find Houston group IDs at: https://trashnothing.com/tx/houston
const HOUSTON_GROUPS = [
  { id: 'H8TCF',  name: 'Houston TX Freecycle' },
  { id: 'HFreeCycle', name: 'HFreeCycle' },
]

// Alternative: use the main Houston area feed
const HOUSTON_AREA_RSS = 'https://trashnothing.com/rss/posts?latitude=29.7604&longitude=-95.3698&radius=25&types=offer'

export async function scrapeTrashNothing(): Promise<ScrapeResult> {
  const start = Date.now()
  const listings: RawListing[] = []

  // Try area-based RSS first (most listings)
  try {
    const res = await fetch(HOUSTON_AREA_RSS, {
      headers: { 'User-Agent': 'FreeFindr/1.0 (freefindr.com)' },
      signal: AbortSignal.timeout(15_000),
    })

    if (res.ok) {
      const xml = await res.text()
      const items = parseTrashNothingRSS(xml)
      listings.push(...items)
    }
  } catch (err) {
    console.error('TrashNothing area RSS error:', err)
  }

  // Also try individual groups
  for (const group of HOUSTON_GROUPS) {
    try {
      const url = `https://trashnothing.com/beta/group/${group.id}/rss`
      const res = await fetch(url, {
        headers: { 'User-Agent': 'FreeFindr/1.0 (freefindr.com)' },
        signal: AbortSignal.timeout(10_000),
      })

      if (!res.ok) continue
      const xml = await res.text()
      const items = parseTrashNothingRSS(xml)
      listings.push(...items)

      await sleep(1000)
    } catch (err) {
      console.error(`TrashNothing group ${group.id} error:`, err)
    }
  }

  return {
    source: 'trashnothing',
    listings: dedupeById(listings),
    duration_ms: Date.now() - start,
  }
}

function parseTrashNothingRSS(xml: string): RawListing[] {
  const listings: RawListing[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const title   = extractCdata(block, 'title')
    const link    = extractTag(block, 'link') || extractTag(block, 'guid')
    const desc    = stripHtml(extractCdata(block, 'description'))
    const pubDate = extractTag(block, 'pubDate')
    const guid    = extractTag(block, 'guid')
    const imgUrl  = extractAttr(block, 'enclosure', 'url') || extractImgSrc(desc)

    // Only keep OFFER posts (not WANTED)
    if (!title || title.toLowerCase().startsWith('wanted:')) continue
    if (!link) continue

    const id = guid.replace(/^.*\//, '') || link

    listings.push({
      source_code:       'trashnothing',
      source_listing_id: id,
      title:             cleanTitle(title),
      description:       desc || undefined,
      category:          detectCategory(title, desc),
      image_url:         imgUrl || undefined,
      image_urls:        imgUrl ? [imgUrl] : [],
      source_url:        link,
      city:              'Houston',
      state:             'TX',
      posted_at:         pubDate ? new Date(pubDate).toISOString() : undefined,
    })
  }

  return listings
}

function extractCdata(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))
  if (m) return m[1].trim()
  return extractTag(xml, tag)
}

function extractTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`))
  return (m?.[1] ?? '').trim()
}

function extractAttr(xml: string, tag: string, attr: string): string | undefined {
  const m = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, 'i'))
  return m?.[1]
}

function extractImgSrc(html: string): string | undefined {
  const m = html.match(/<img[^>]+src="([^"]+)"/i)
  return m?.[1]
}

function stripHtml(str: string): string {
  return str
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanTitle(title: string): string {
  return title
    .replace(/^\[OFFER\]\s*/i, '')
    .replace(/^OFFER\s*[-:]\s*/i, '')
    .replace(/^free[:\s-]*/i, 'Free ')
    .trim()
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
