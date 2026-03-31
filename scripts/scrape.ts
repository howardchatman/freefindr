/**
 * Manual scrape runner — runs from the CLI.
 *
 * Usage:
 *   npm run scrape                          # all sources
 *   npm run scrape -- --source craigslist   # single source
 *   npm run scrape -- --source trashnothing
 *
 * Requires .env.local with Supabase credentials.
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { runAllScrapers } from '../lib/scrapers'

async function main() {
  const args = process.argv.slice(2)
  const sourceIdx = args.indexOf('--source')
  const source = sourceIdx !== -1 ? args[sourceIdx + 1] : undefined

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌  Missing Supabase env vars. Add them to .env.local')
    process.exit(1)
  }

  await runAllScrapers({
    sources: source ? [source as never] : undefined,
    verbose: true,
  })
}

main().catch((err) => {
  console.error('Scrape failed:', err)
  process.exit(1)
})
