/**
 * Seed script — populates Supabase with Houston-area free listings.
 * Run: npm run seed
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

// ─── Helpers ──────────────────────────────────────────────────────────────────

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString()
const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`

// ─── Listings to seed ─────────────────────────────────────────────────────────

const LISTINGS = [
  {
    source_code: 'facebook_marketplace',
    source_listing_id: 'fb-seed-001',
    title: 'Free Wooden Pallets – 20+ Available',
    description: 'Have a large stack of wooden pallets available for free. Good condition, heat treated, no broken boards. Great for DIY projects, fencing, garden beds. Must take at least 5. Located near Garden Oaks. Bring your own truck.',
    category: 'pallets',
    image_url: img('pallets-houston-1'),
    image_urls: [img('pallets-houston-1'), img('pallets-houston-2')],
    city: 'Houston', state: 'TX', zip: '77018',
    lat: 29.8279, lng: -95.4138,
    posted_at: hoursAgo(1.5),
    has_image: true,
  },
  {
    source_code: 'craigslist',
    source_listing_id: 'cl-seed-002',
    title: 'Free Grey Sectional Sofa',
    description: 'Large grey sectional sofa. Good condition, some normal wear. Non-smoking home. You pick up. Must be gone by this weekend.',
    category: 'furniture',
    image_url: img('couch-grey-sectional'),
    image_urls: [img('couch-grey-sectional')],
    city: 'Houston', state: 'TX', zip: '77018',
    lat: 29.8200, lng: -95.4200,
    posted_at: hoursAgo(3),
    has_image: true,
  },
  {
    source_code: 'nextdoor',
    source_listing_id: 'nd-seed-003',
    title: 'Free Refrigerator – Whirlpool Side-by-Side, Works Great',
    description: 'Upgrading our kitchen. Giving away a Whirlpool side-by-side refrigerator. Works perfectly. Dimensions: 36"W x 69"H. You haul. Must be picked up this week.',
    category: 'appliances',
    image_url: img('whirlpool-fridge-white'),
    image_urls: [img('whirlpool-fridge-white')],
    city: 'Houston', state: 'TX', zip: '77088',
    lat: 29.8900, lng: -95.4400,
    posted_at: hoursAgo(5),
    has_image: true,
  },
  {
    source_code: 'offerup',
    source_listing_id: 'ou-seed-004',
    title: 'Free Lumber / Wood Scraps – 2x4s, Plywood, 4x4 Posts',
    description: 'Leftover construction materials from a deck build. Various 2x4s, plywood sheets, 4x4 posts. All pressure treated. Come take what you need. Near 290.',
    category: 'wood',
    image_url: img('lumber-pile-construction'),
    image_urls: [img('lumber-pile-construction')],
    city: 'Houston', state: 'TX', zip: '77064',
    lat: 29.8700, lng: -95.5800,
    posted_at: hoursAgo(7),
    has_image: true,
  },
  {
    source_code: 'trashnothing',
    source_listing_id: 'tn-seed-005',
    title: 'Free GE Washer & Dryer Set – Both Working',
    description: 'GE top-load washer and matching dryer. Both work. Moving to a place with in-unit laundry. First come, first served. Must bring help to load.',
    category: 'appliances',
    image_url: img('washer-dryer-set-white'),
    image_urls: [img('washer-dryer-set-white')],
    city: 'Houston', state: 'TX', zip: '77008',
    lat: 29.7970, lng: -95.4030,
    posted_at: hoursAgo(10),
    has_image: true,
  },
  {
    source_code: 'facebook_marketplace',
    source_listing_id: 'fb-seed-006',
    title: 'Free Tools – Assorted Hand Tools, Garage Cleanout',
    description: 'Cleaning out garage. Assorted hand tools: hammers, wrenches, screwdrivers, levels. Some drill bits. Nothing fancy but all functional. Come take what you need.',
    category: 'tools',
    image_url: img('hand-tools-garage'),
    image_urls: [img('hand-tools-garage')],
    city: 'Houston', state: 'TX', zip: '77055',
    lat: 29.7760, lng: -95.5050,
    posted_at: hoursAgo(14),
    has_image: true,
  },
  {
    source_code: 'craigslist',
    source_listing_id: 'cl-seed-007',
    title: 'Free 6-Drawer Solid Wood Dresser',
    description: 'Solid wood dresser, 6 drawers, all working. Some scratches on top but sturdy. Moving and cannot take it. You pick up, it is heavy so bring help.',
    category: 'furniture',
    image_url: img('wood-dresser-bedroom'),
    image_urls: [img('wood-dresser-bedroom')],
    city: 'Cypress', state: 'TX', zip: '77064',
    lat: 29.9700, lng: -95.6900,
    posted_at: hoursAgo(18),
    has_image: true,
  },
  {
    source_code: 'nextdoor',
    source_listing_id: 'nd-seed-008',
    title: 'Free Metal Patio Set – Table + 4 Chairs',
    description: 'Metal patio dining set. Table and 4 chairs. Surface rust but fully functional. Cushions not included. Great for a fixer-upper or yard.',
    category: 'outdoor',
    image_url: img('patio-furniture-metal'),
    image_urls: [img('patio-furniture-metal')],
    city: 'Houston', state: 'TX', zip: '77096',
    lat: 29.6900, lng: -95.4700,
    posted_at: hoursAgo(22),
    has_image: true,
  },
  {
    source_code: 'facebook_marketplace',
    source_listing_id: 'fb-seed-009',
    title: 'Free Baby Crib – Good Condition, White',
    description: 'Standard size baby crib. White finish, some minor scuffs. No mattress included. Hardware all present. Good for a second baby or first-time parents.',
    category: 'baby_kids',
    image_url: img('baby-crib-white'),
    image_urls: [img('baby-crib-white')],
    city: 'Kingwood', state: 'TX', zip: '77339',
    lat: 29.9900, lng: -95.2000,
    posted_at: hoursAgo(28),
    has_image: true,
  },
  {
    source_code: 'craigslist',
    source_listing_id: 'cl-seed-010',
    title: 'Free Pallets – 30+ Stack Near Tidwell',
    description: 'Business clearing storage. Approximately 30 standard size pallets. Mix of sizes. Free to whoever hauls them. Call before coming – first come first served.',
    category: 'pallets',
    image_url: null,
    image_urls: [],
    city: 'Houston', state: 'TX', zip: '77091',
    lat: 29.8600, lng: -95.3900,
    posted_at: hoursAgo(32),
    has_image: false,
  },
  {
    source_code: 'offerup',
    source_listing_id: 'ou-seed-011',
    title: 'Free Weber Kettle Grill – Needs Cleaning',
    description: 'Old Weber kettle grill. Works fine, needs a good cleaning and maybe new grates. Giving it away to make room. Katy area.',
    category: 'outdoor',
    image_url: img('weber-grill-kettle'),
    image_urls: [img('weber-grill-kettle')],
    city: 'Katy', state: 'TX', zip: '77450',
    lat: 29.7850, lng: -95.8200,
    posted_at: hoursAgo(36),
    has_image: true,
  },
  {
    source_code: 'trashnothing',
    source_listing_id: 'tn-seed-012',
    title: 'Free Metal Wire Shelving Units – 3 Available',
    description: 'Three wire metal shelving units. Standard 5-shelf style. Some rust on hardware. Great for garage or storage room. Pearland area.',
    category: 'miscellaneous',
    image_url: img('metal-shelving-garage'),
    image_urls: [img('metal-shelving-garage')],
    city: 'Pearland', state: 'TX', zip: '77581',
    lat: 29.5630, lng: -95.2860,
    posted_at: hoursAgo(48),
    has_image: true,
  },
]

// ─── Run ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱  Seeding FreeFindr...\n')

  // Get sources
  const { data: sources, error: srcErr } = await supabase.from('sources').select('id, code')
  if (srcErr) { console.error('Error fetching sources:', srcErr.message); process.exit(1) }

  const sourceMap = Object.fromEntries((sources ?? []).map((s: { id: string; code: string }) => [s.code, s.id]))
  console.log('✓  Found sources:', Object.keys(sourceMap).join(', '))

  // Insert listings
  let inserted = 0
  let skipped  = 0

  for (const listing of LISTINGS) {
    const { source_code, ...rest } = listing
    const source_id = sourceMap[source_code]

    if (!source_id) {
      console.warn(`  ⚠  Source not found: ${source_code}`)
      continue
    }

    const { error } = await supabase
      .from('listings')
      .upsert({ ...rest, source_id, is_active: true }, { onConflict: 'source_id,source_listing_id' })

    if (error) {
      console.error(`  ✗  Failed: ${listing.title.slice(0, 40)} — ${error.message}`)
      skipped++
    } else {
      console.log(`  ✓  ${listing.title.slice(0, 60)}`)
      inserted++
    }
  }

  console.log(`\n✅  Done. ${inserted} inserted/updated, ${skipped} skipped.`)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
