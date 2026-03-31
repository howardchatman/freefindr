import type { Metadata } from 'next'
import { getListings } from '@/lib/db/queries'
import { isMockMode } from '@/lib/db/queries'
import { FeedClient } from '@/components/feed/FeedClient'

export const metadata: Metadata = {
  title: 'FreeFindr – Free Stuff Near Houston',
}

export const revalidate = 300

export default async function FeedPage() {
  const listings = await getListings()

  return <FeedClient listings={listings} isMock={isMockMode} />
}
