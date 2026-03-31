import type { Metadata } from 'next'
import { getKeywords } from '@/lib/db/queries'
import { AlertsClient } from '@/components/settings/AlertsClient'

export const metadata: Metadata = { title: 'Alerts – FreeFindr' }

export default async function AlertsPage() {
  const keywords = await getKeywords()

  return <AlertsClient initialKeywords={keywords} />
}
