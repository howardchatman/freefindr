/**
 * Vercel Cron Job endpoint — runs all scrapers on a schedule.
 *
 * Schedule is configured in vercel.json (see below).
 * Vercel calls this with the Authorization header automatically.
 *
 * To trigger manually:
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://freefindr.com/api/cron/scrape
 */

import { NextRequest, NextResponse } from 'next/server'
import { runAllScrapers } from '@/lib/scrapers'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes — Vercel Pro limit

export async function GET(req: NextRequest) {
  // Verify the cron secret (Vercel sets this automatically)
  const authHeader = req.headers.get('authorization')
  const expectedToken = process.env.CRON_SECRET

  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const source = req.nextUrl.searchParams.get('source') as
    | 'craigslist' | 'trashnothing' | 'facebook_marketplace' | 'offerup'
    | null

  console.log(`[cron/scrape] Starting${source ? ` (${source} only)` : ' (all sources)'}`)

  try {
    const result = await runAllScrapers({
      sources: source ? [source] : undefined,
      verbose: true,
    })

    return NextResponse.json({
      ok: true,
      imported: result.totalImported,
      errors:   result.totalErrors,
      duration_ms: result.duration_ms,
      sources: result.results.map((r) => ({
        source:   r.source,
        count:    r.listings.length,
        error:    r.error ?? null,
        duration: r.duration_ms,
      })),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[cron/scrape] Fatal error:', message)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
