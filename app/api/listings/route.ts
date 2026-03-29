import { NextRequest, NextResponse } from 'next/server'
import { getListings } from '@/lib/db/queries'
import type { ListingFilters } from '@/lib/types/listing'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const filters: ListingFilters = {
    category:  searchParams.get('category')  ?? undefined,
    source:    searchParams.get('source')    ?? undefined,
    imageOnly: searchParams.get('imageOnly') === 'true',
    search:    searchParams.get('q')         ?? undefined,
  }

  try {
    const listings = await getListings(filters)
    return NextResponse.json({ listings, count: listings.length })
  } catch (err) {
    console.error('GET /api/listings error:', err)
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}
