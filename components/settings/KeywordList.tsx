'use client'

import { useState } from 'react'
import { Button } from '@/components/shared/Button'

interface Keyword {
  id: string
  keyword: string
  is_active: boolean
  created_at: string
}

interface KeywordListProps {
  initialKeywords: Keyword[]
}

export function KeywordList({ initialKeywords }: KeywordListProps) {
  const [keywords, setKeywords] = useState<Keyword[]>(initialKeywords)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function addKeyword() {
    const kw = input.trim().toLowerCase()
    if (!kw) return
    if (keywords.some((k) => k.keyword === kw)) {
      setError('Already added')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: kw }),
      })
      const data = await res.json()
      setKeywords((prev) => [data, ...prev])
      setInput('')
    } catch {
      setError('Failed to add keyword')
    } finally {
      setLoading(false)
    }
  }

  async function removeKeyword(id: string) {
    setKeywords((prev) => prev.filter((k) => k.id !== id))
    try {
      await fetch(`/api/keywords?id=${id}`, { method: 'DELETE' })
    } catch {
      // optimistic — no-op on error for MVP
    }
  }

  return (
    <div>
      {/* Add keyword */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. pallet, couch, tools..."
          value={input}
          onChange={(e) => { setInput(e.target.value); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          maxLength={40}
        />
        <Button onClick={addKeyword} loading={loading} disabled={!input.trim()}>
          Add
        </Button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {/* Keyword chips */}
      {keywords.length === 0 ? (
        <p className="mt-4 text-sm text-gray-400">No keywords yet. Add one above to start getting alerts.</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <div
              key={kw.id}
              className="flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5"
            >
              <span className="text-sm font-medium text-brand-700">{kw.keyword}</span>
              <button
                onClick={() => removeKeyword(kw.id)}
                className="flex h-4 w-4 items-center justify-center rounded-full text-brand-400 transition hover:bg-brand-200 hover:text-brand-700"
                aria-label={`Remove ${kw.keyword}`}
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
