import type { Metadata } from 'next'
import { getKeywords } from '@/lib/db/queries'
import { KeywordList } from '@/components/settings/KeywordList'

export const metadata: Metadata = { title: 'Keyword Alerts' }

export default async function AlertsPage() {
  const keywords = await getKeywords()

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Keyword Alerts</h1>
          <p className="mt-0.5 text-sm text-gray-500">Get notified when matching items are posted</p>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* How it works */}
        <div className="rounded-2xl bg-brand-50 border border-brand-100 p-4">
          <p className="text-sm text-brand-800 font-medium mb-1">How alerts work</p>
          <p className="text-sm text-brand-700">
            Save keywords like <em>pallet</em>, <em>fridge</em>, or <em>dresser</em>.
            We'll flag new listings that match and notify you first.
          </p>
        </div>

        {/* Popular suggestions */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Popular keywords
          </p>
          <div className="flex flex-wrap gap-2">
            {['pallet', 'couch', 'fridge', 'washer', 'dryer', 'dresser', 'tools', 'wood', 'lumber', 'grill', 'table', 'chair', 'stroller', 'crib'].map((kw) => (
              <span key={kw} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Your keywords */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Your Keywords ({keywords.length})
          </p>
          <KeywordList initialKeywords={keywords} />
        </div>
      </div>
    </div>
  )
}
