import type { LeadFormData } from '@/lib/types/lead'
import { isMockMode } from '@/lib/db/queries'
import { DEV_USER_ID } from '@/lib/types/user'

// ─── Leads ────────────────────────────────────────────────────────────────────

export async function createLead(data: LeadFormData) {
  if (isMockMode) {
    // Mock: just return a fake created lead
    return {
      id: `lead-mock-${Date.now()}`,
      ...data,
      lead_type: data.lead_type ?? 'pickup_help',
      status: 'new',
      user_id: null,
      assigned_to: null,
      created_at: new Date().toISOString(),
    }
  }

  const { createServiceClient } = await import('@/lib/supabase/server')
  const supabase = createServiceClient()

  const { data: lead, error } = await supabase
    .from('leads')
    .insert({
      listing_id: data.listing_id,
      name: data.name,
      phone: data.phone,
      email: data.email ?? null,
      zip: data.zip ?? null,
      message: data.message ?? null,
      lead_type: data.lead_type ?? 'pickup_help',
      status: 'new',
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return lead
}

// ─── Keywords ─────────────────────────────────────────────────────────────────

export async function addKeyword(keyword: string, userId = DEV_USER_ID) {
  if (isMockMode) {
    return { id: `kw-${Date.now()}`, keyword, is_active: true, user_id: userId, created_at: new Date().toISOString() }
  }

  const { createServiceClient } = await import('@/lib/supabase/server')
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('keywords')
    .insert({ user_id: userId, keyword: keyword.toLowerCase().trim(), is_active: true })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteKeyword(id: string) {
  if (isMockMode) return { success: true }

  const { createServiceClient } = await import('@/lib/supabase/server')
  const supabase = createServiceClient()

  const { error } = await supabase.from('keywords').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return { success: true }
}
