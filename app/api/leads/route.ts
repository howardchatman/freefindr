import { NextRequest, NextResponse } from 'next/server'
import { createLead } from '@/lib/db/mutations'
import type { LeadFormData } from '@/lib/types/lead'

export async function POST(req: NextRequest) {
  let body: Partial<LeadFormData>

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Validate required fields
  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 422 })
  }
  if (!body.phone?.trim()) {
    return NextResponse.json({ error: 'phone is required' }, { status: 422 })
  }
  if (!body.listing_id) {
    return NextResponse.json({ error: 'listing_id is required' }, { status: 422 })
  }

  try {
    const lead = await createLead({
      listing_id: body.listing_id,
      name:       body.name.trim(),
      phone:      body.phone.trim(),
      email:      body.email?.trim() || undefined,
      zip:        body.zip?.trim()   || undefined,
      message:    body.message?.trim() || undefined,
      lead_type:  body.lead_type ?? 'pickup_help',
    })
    return NextResponse.json({ lead }, { status: 201 })
  } catch (err) {
    console.error('POST /api/leads error:', err)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }
}
