'use client'

import { useState, FormEvent } from 'react'
import { Input, Textarea } from '@/components/shared/Input'
import { Button } from '@/components/shared/Button'
import type { LeadFormData } from '@/lib/types/lead'

interface LeadFormProps {
  listingId: string
  listingTitle: string
}

export function LeadForm({ listingId, listingTitle }: LeadFormProps) {
  const [form, setForm] = useState<Omit<LeadFormData, 'listing_id'>>({
    name: '',
    phone: '',
    email: '',
    zip: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function validate(): boolean {
    const next: Partial<typeof form> = {}
    if (!form.name.trim())  next.name  = 'Name is required'
    if (!form.phone.trim()) next.phone = 'Phone number is required'
    else if (!/^\+?[\d\s\-().]{7,}$/.test(form.phone)) next.phone = 'Enter a valid phone number'
    setErrors(next)
    return Object.keys(next).length === 0
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
      if (!res.ok) throw new Error('Submission failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-green-50 p-6 text-center">
        <div className="mb-3 text-4xl">✅</div>
        <h3 className="mb-1 text-base font-bold text-green-800">We got it!</h3>
        <p className="text-sm text-green-700">
          We'll reach out to <strong>{form.phone}</strong> to coordinate pickup help.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
      {/* CTA Heading */}
      <div className="mb-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-2xl">🚚</span>
          <h2 className="text-lg font-bold text-gray-900">Need help picking this up?</h2>
        </div>
        <p className="text-sm text-gray-600">
          We'll connect you with local movers, haulers, and pickup helpers. Fast.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        <input type="hidden" value={listingId} name="listing_id" readOnly />

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
          label="Phone number"
          type="tel"
          placeholder="(713) 555-0100"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          error={errors.phone}
          required
          autoComplete="tel"
        />
        <Input
          label="Email"
          type="email"
          placeholder="Optional"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          autoComplete="email"
        />
        <Input
          label="Your ZIP code"
          placeholder="77002"
          value={form.zip}
          onChange={(e) => setForm({ ...form, zip: e.target.value })}
          maxLength={5}
          inputMode="numeric"
        />
        <Textarea
          label="Message"
          placeholder={`Anything else? (e.g. "I have a truck and can go today")`}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={3}
        />

        {status === 'error' && (
          <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
        )}

        <Button type="submit" size="lg" fullWidth loading={status === 'loading'}>
          Request Pickup Help
        </Button>

        <p className="text-center text-xs text-gray-400">
          No spam. We only use your info to connect you with local helpers.
        </p>
      </form>
    </div>
  )
}
