'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/shared/Button'
import { Input, Textarea } from '@/components/shared/Input'
import type { LeadFormData } from '@/lib/types/lead'

interface LeadCTAProps {
  listingId: string
  listingTitle: string
}

/**
 * Progressive CTA:
 * 1. Show a bold "Get Pickup Help" card
 * 2. On tap → expand the lead form inline
 * 3. On submit → success state
 */
export function LeadCTA({ listingId, listingTitle }: LeadCTAProps) {
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', phone: '', email: '', zip: '', message: '' })
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  function validate() {
    const e: Partial<typeof form> = {}
    if (!form.name.trim())  e.name  = 'Name is required'
    if (!form.phone.trim()) e.phone = 'Phone is required'
    else if (!/^\+?[\d\s\-().]{7,}$/.test(form.phone)) e.phone = 'Enter a valid number'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, listing_id: listingId, lead_type: 'pickup_help' }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center">
        <div className="mb-3 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-2xl text-white">
            ✓
          </div>
        </div>
        <h3 className="mb-1 text-base font-black text-[#111111]">You're on the list!</h3>
        <p className="text-sm text-[#6B7280]">
          We'll text <strong className="text-[#111111]">{form.phone}</strong> to coordinate pickup.
          Usually within the hour.
        </p>
      </div>
    )
  }

  // ── Collapsed CTA card ─────────────────────────────────────────────────────
  if (!expanded) {
    return (
      <div
        className="cursor-pointer rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
        onClick={() => setExpanded(true)}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
            🚚
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-black text-[#111111]">Need help picking this up?</h2>
            <p className="mt-0.5 text-sm text-[#6B7280]">
              We connect you with local pickup helpers, movers, and haulers. Fast.
            </p>
          </div>
        </div>

        <Button
          size="xl"
          fullWidth
          className="mt-4 font-black tracking-wide"
          onClick={(e) => { e.stopPropagation(); setExpanded(true) }}
        >
          Get Pickup Help →
        </Button>

        <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-[#9CA3AF]">
          <span className="flex items-center gap-1"><span className="text-brand-500">✓</span> Free to request</span>
          <span className="flex items-center gap-1"><span className="text-brand-500">✓</span> Local helpers</span>
          <span className="flex items-center gap-1"><span className="text-brand-500">✓</span> No spam</span>
        </div>
      </div>
    )
  }

  // ── Expanded form ──────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-card">
      {/* Header */}
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xl">
          🚚
        </div>
        <div>
          <h2 className="text-base font-black text-[#111111]">Request Pickup Help</h2>
          <p className="text-xs text-[#6B7280]">We'll reach out within the hour.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Your name"
            placeholder="First name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            required
            autoComplete="given-name"
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="(713) 555-0100"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            error={errors.phone}
            required
            autoComplete="tel"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Email"
            type="email"
            placeholder="Optional"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
          />
          <Input
            label="Your ZIP"
            placeholder="77002"
            value={form.zip}
            onChange={(e) => setForm({ ...form, zip: e.target.value })}
            inputMode="numeric"
            maxLength={5}
          />
        </div>

        <Textarea
          label="Message"
          placeholder={`e.g. "I have a pickup truck and can go today"`}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={2}
        />

        {status === 'error' && (
          <p className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600">
            Something went wrong. Please try again.
          </p>
        )}

        <Button type="submit" size="xl" fullWidth loading={status === 'loading'} className="font-black tracking-wide">
          {status === 'loading' ? 'Sending...' : 'Send Request →'}
        </Button>

        <p className="text-center text-[11px] text-[#9CA3AF]">
          No spam · We only use your info to coordinate pickup
        </p>
      </form>
    </div>
  )
}
