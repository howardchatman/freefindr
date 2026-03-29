export interface Lead {
  id: string
  listing_id: string | null
  user_id: string | null
  name: string
  phone: string
  email: string | null
  zip: string | null
  message: string | null
  lead_type: string
  status: string
  assigned_to: string | null
  created_at: string
  // joined
  listing?: { title: string } | null
}

export interface LeadFormData {
  listing_id: string
  name: string
  phone: string
  email?: string
  zip?: string
  message?: string
  lead_type?: string
}

export type LeadStatus = 'new' | 'contacted' | 'scheduled' | 'completed' | 'cancelled'
