'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Keyword {
  id: string
  keyword: string
  is_active: boolean
  created_at: string
}

interface AlertsClientProps {
  initialKeywords: Keyword[]
}

const POPULAR = ['pallet', 'couch', 'fridge', 'washer', 'dryer', 'dresser', 'tools', 'wood', 'grill', 'table', 'chair', 'stroller', 'crib', 'lumber']

export function AlertsClient({ initialKeywords }: AlertsClientProps) {
  const [keywords, setKeywords] = useState<Keyword[]>(initialKeywords)
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function addKeyword(kw: string) {
    const keyword = kw.trim().toLowerCase()
    if (!keyword) return
    if (keywords.some((k) => k.keyword === keyword)) {
      setError(`"${keyword}" is already saved`)
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
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
    try { await fetch(`/api/keywords?id=${id}`, { method: 'DELETE' }) } catch { /* optimistic */ }
  }

  const suggestionsNotSaved = POPULAR.filter((p) => !keywords.some((k) => k.keyword === p))

  return (
    <div className="min-h-screen bg-surface pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB]">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-black text-[#111111]">Keyword Alerts</h1>
          <p className="mt-0.5 text-sm text-[#6B7280]">Get notified the moment a match is posted</p>
        </div>
      </header>

      <div className="px-4 py-5 space-y-6">

        {/* How it works */}
        <div className="rounded-2xl bg-brand-50 border border-brand-100 px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-sm text-white font-bold">
              ⚡
            </div>
            <div>
              <p className="text-sm font-bold text-brand-900">How alerts work</p>
              <p className="mt-0.5 text-sm text-brand-800 leading-relaxed">
                Add keywords like <em>pallet</em> or <em>washer</em>. We scan every new listing and flag matches instantly — so you can snag it before anyone else.
              </p>
            </div>
          </div>
        </div>

        {/* Add keyword input */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">Add a keyword</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. pallet, couch, tools..."
              value={input}
              onChange={(e) => { setInput(e.target.value); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && addKeyword(input)}
              className="flex-1 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111111] placeholder-[#9CA3AF] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15 transition-colors"
              maxLength={40}
            />
            <button
              onClick={() => addKeyword(input)}
              disabled={!input.trim() || loading}
              className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </>
              )}
            </button>
          </div>
          {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
        </div>

        {/* Your saved alerts */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">
              Your Alerts
            </p>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-[#6B7280]">
              {keywords.length}
            </span>
          </div>

          {keywords.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-6 text-center">
              <p className="text-sm font-semibold text-[#9CA3AF]">No alerts yet</p>
              <p className="mt-1 text-xs text-[#9CA3AF]">Add your first keyword above</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {keywords.map((kw) => (
                <AlertCard key={kw.id} keyword={kw} onRemove={() => removeKeyword(kw.id)} />
              ))}
            </div>
          )}
        </div>

        {/* Popular suggestions */}
        {suggestionsNotSaved.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">
              Popular keywords
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestionsNotSaved.map((kw) => (
                <button
                  key={kw}
                  onClick={() => addKeyword(kw)}
                  className="flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#6B7280] transition-colors hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
                >
                  <svg className="h-3 w-3 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  {kw}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA to feed */}
        <Link
          href="/feed"
          className="flex items-center justify-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white py-4 text-sm font-bold text-[#6B7280] hover:bg-gray-50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Feed
        </Link>
      </div>
    </div>
  )
}

// ── Alert Card ────────────────────────────────────────────────────────────────

function AlertCard({ keyword, onRemove }: { keyword: { id: string; keyword: string; is_active: boolean }; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3.5 shadow-card">
      {/* Icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50">
        <svg className="h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Keyword */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#111111] capitalize">{keyword.keyword}</p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          <span className="text-[11px] text-brand-600 font-semibold">Active · Houston, TX</span>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#9CA3AF] transition-colors hover:bg-red-50 hover:text-red-500"
        aria-label={`Remove ${keyword.keyword}`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}
