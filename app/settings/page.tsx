'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SOURCES } from '@/lib/types/listing'
import type { UserSettings } from '@/lib/types/user'
import { DEFAULT_SETTINGS } from '@/lib/types/user'

const STORAGE_KEY = 'ff:settings'

function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setSettings(loadSettings()) }, [])

  function update(patch: Partial<UserSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }))
    setSaved(false)
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-surface pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB]">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-black text-[#111111]">Settings</h1>
          <p className="mt-0.5 text-sm text-[#6B7280]">FreeFindr preferences</p>
        </div>
      </header>

      <div className="px-4 py-5 space-y-4">

        {/* Location */}
        <SectionCard title="Location" icon="📍">
          <div className="space-y-4">
            <FieldGroup label="Home ZIP code" hint="We use this to find listings near you">
              <input
                type="text"
                value={settings.home_zip}
                onChange={(e) => update({ home_zip: e.target.value })}
                maxLength={5}
                inputMode="numeric"
                placeholder="77002"
                className="field-input"
              />
            </FieldGroup>

            <FieldGroup
              label={`Search radius · ${settings.radius_miles} miles`}
              hint="Max distance from your ZIP"
            >
              <div className="pt-1">
                <input
                  type="range"
                  min={5}
                  max={75}
                  step={5}
                  value={settings.radius_miles}
                  onChange={(e) => update({ radius_miles: Number(e.target.value) })}
                  className="w-full accent-brand-500"
                />
                <div className="mt-1 flex justify-between text-[10px] text-[#9CA3AF]">
                  <span>5 mi</span>
                  <span>75 mi</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {[5, 10, 25, 50].map((mi) => (
                  <button
                    key={mi}
                    onClick={() => update({ radius_miles: mi })}
                    className={`flex-1 rounded-xl border py-2 text-xs font-bold transition-colors ${
                      settings.radius_miles === mi
                        ? 'border-brand-500 bg-brand-500 text-white'
                        : 'border-[#E5E7EB] bg-white text-[#6B7280] hover:border-gray-300'
                    }`}
                  >
                    {mi}mi
                  </button>
                ))}
              </div>
            </FieldGroup>
          </div>
        </SectionCard>

        {/* Preferences */}
        <SectionCard title="Feed" icon="🔍">
          <ToggleRow
            label="Photos only"
            description="Hide listings without images"
            checked={settings.only_items_with_image}
            onChange={(v) => update({ only_items_with_image: v })}
          />
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications" icon="🔔">
          <div className="space-y-4">
            <ToggleRow
              label="Enable alerts"
              description="Get notified when keyword matches are posted"
              checked={settings.notifications_enabled}
              onChange={(v) => update({ notifications_enabled: v })}
            />
            <ToggleRow
              label="Do Not Disturb"
              description="Pause all notifications"
              checked={settings.do_not_disturb}
              onChange={(v) => update({ do_not_disturb: v })}
            />
          </div>
        </SectionCard>

        {/* Sources */}
        <SectionCard title="Sources" icon="📡">
          <p className="mb-4 text-xs text-[#9CA3AF]">Choose which platforms to show in your feed</p>
          <div className="space-y-3">
            {SOURCES.map((src) => {
              const enabled = settings.source_preferences[src.code] ?? true
              return (
                <ToggleRow
                  key={src.code}
                  label={src.name}
                  checked={enabled}
                  onChange={(v) =>
                    update({ source_preferences: { ...settings.source_preferences, [src.code]: v } })
                  }
                />
              )
            })}
          </div>
        </SectionCard>

        {/* Keyword alerts link */}
        <SectionCard title="Keyword Alerts" icon="⚡">
          <p className="mb-4 text-sm text-[#6B7280]">
            Watch for specific items — pallets, fridges, tools, and more.
          </p>
          <Link
            href="/alerts"
            className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] px-4 py-3 transition-colors hover:bg-gray-100"
          >
            <span className="text-sm font-bold text-[#111111]">Manage Keyword Alerts</span>
            <svg className="h-4 w-4 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </SectionCard>

        {/* Admin link */}
        <SectionCard title="Developer" icon="⚙️">
          <Link
            href="/admin"
            className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] px-4 py-3 transition-colors hover:bg-gray-100"
          >
            <span className="text-sm font-bold text-[#111111]">Admin Panel</span>
            <svg className="h-4 w-4 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </SectionCard>

        {/* Save */}
        <button
          onClick={save}
          className={`w-full rounded-2xl py-4 text-sm font-black tracking-wide transition-all ${
            saved
              ? 'bg-brand-500 text-white'
              : 'bg-[#111111] text-white hover:bg-[#222222]'
          }`}
        >
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>

        <p className="text-center text-xs text-[#9CA3AF]">
          Preferences saved locally · Cloud sync coming soon
        </p>
      </div>

      <style jsx>{`
        .field-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #E5E7EB;
          background: #F7F7F8;
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          color: #111111;
          transition: border-color 0.15s, background-color 0.15s;
          outline: none;
        }
        .field-input:focus {
          border-color: #22c55e;
          background: white;
          box-shadow: 0 0 0 3px rgb(34 197 94 / 0.15);
        }
        .field-input::placeholder {
          color: #9CA3AF;
        }
      `}</style>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="text-base">{icon}</span>
        <h2 className="text-xs font-black uppercase tracking-widest text-[#9CA3AF]">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function FieldGroup({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-[#374151]">{label}</p>
      {hint && <p className="mb-2 text-xs text-[#9CA3AF]">{hint}</p>}
      {children}
    </div>
  )
}

interface ToggleRowProps {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 text-left"
    >
      <div className="flex-1">
        <p className="text-sm font-semibold text-[#111111]">{label}</p>
        {description && <p className="text-xs text-[#9CA3AF]">{description}</p>}
      </div>
      <div
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-brand-500' : 'bg-[#E5E7EB]'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </div>
    </button>
  )
}
