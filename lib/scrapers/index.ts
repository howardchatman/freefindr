/**
 * Scraper orchestrator — runs all enabled scrapers and imports results.
 *
 * Called by:
 *   - /api/cron/scrape (Vercel Cron)
 *   - scripts/scrape.ts (manual CLI run)
 */

import { scrapeCraigslist } from './craigslist'
import { scrapeTrashNothing } from './trashnothing'
import { scrapeFacebookMarketplace, scrapeOfferUp } from './aggregator'
import { importListings } from './importer'
import type { ScrapeResult } from './types'

export interface OrchestratorOptions {
  sources?: ('craigslist' | 'trashnothing' | 'facebook_marketplace' | 'offerup')[]
  radiusMiles?: number
  verbose?: boolean
}

export async function runAllScrapers(opts: OrchestratorOptions = {}): Promise<{
  results: ScrapeResult[]
  totalImported: number
  totalErrors: number
  duration_ms: number
}> {
  const start = Date.now()
  const sources = opts.sources ?? ['craigslist', 'trashnothing', 'facebook_marketplace', 'offerup']
  const verbose = opts.verbose ?? true
  const results: ScrapeResult[] = []

  if (verbose) console.log(`\n🔍  Running scrapers: ${sources.join(', ')}\n`)

  // Run scrapers — Craigslist and TrashNothing in parallel, aggregators after
  const freeScrapers: Promise<ScrapeResult>[] = []
  if (sources.includes('craigslist'))    freeScrapers.push(scrapeCraigslist())
  if (sources.includes('trashnothing'))  freeScrapers.push(scrapeTrashNothing())

  const freeResults = await Promise.allSettled(freeScrapers)

  for (const r of freeResults) {
    if (r.status === 'fulfilled') results.push(r.value)
    else console.error('Scraper failed:', r.reason)
  }

  // Aggregator scrapers (require API token — run sequentially to be polite)
  if (sources.includes('facebook_marketplace')) {
    const r = await scrapeFacebookMarketplace(opts.radiusMiles ?? 25)
    results.push(r)
  }
  if (sources.includes('offerup')) {
    const r = await scrapeOfferUp(opts.radiusMiles ?? 25)
    results.push(r)
  }

  // Print scrape summary
  let totalListings = 0
  for (const r of results) {
    totalListings += r.listings.length
    if (verbose) {
      const status = r.error ? `❌  ${r.error}` : `✓  ${r.listings.length} listings`
      console.log(`  ${r.source.padEnd(25)} ${status}  (${r.duration_ms}ms)`)
    }
  }

  if (verbose) console.log(`\n  Total: ${totalListings} listings scraped\n`)

  // Import everything into Supabase
  let totalImported = 0
  let totalErrors = 0

  if (totalListings > 0) {
    const allListings = results.flatMap((r) => r.listings)
    if (verbose) console.log(`📥  Importing ${allListings.length} listings into Supabase...`)

    const importResult = await importListings(allListings)
    totalImported = importResult.inserted
    totalErrors   = importResult.errors

    if (verbose) {
      console.log(`  ✓  Imported:  ${importResult.inserted}`)
      console.log(`  ○  Skipped:   ${importResult.skipped}`)
      console.log(`  ✗  Errors:    ${importResult.errors}`)
    }
  }

  const duration_ms = Date.now() - start
  if (verbose) console.log(`\n✅  Done in ${(duration_ms / 1000).toFixed(1)}s\n`)

  return { results, totalImported, totalErrors, duration_ms }
}
