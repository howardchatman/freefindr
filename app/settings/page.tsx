'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { RadiusSelector } from '@/components/settings/RadiusSelector'
import { SourceToggleList } from '@/components/settings/SourceToggleList'
import { Button } from '@/components/shared/Button'
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

  useEffect(() => {
    setSettings(loadSettings())
  }, [])

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
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          <p className="mt-0.5 text-sm text-gray-500">FreeFindr preferences</p>
        </div>
      </header>

      <div className="space-y-6 px-4 py-6">
        {/* Location */}
        <SettingsSection title="Location" icon="📍">
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Home ZIP code
              </label>
              <input
                type="text"
                value={settings.home_zip}
                onChange={(e) => update({ home_zip: e.target.value })}
                maxLength={5}
                inputMode="numeric"
                placeholder="77002"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Search radius</label>
              <RadiusSelector
                value={settings.radius_miles}
                onChange={(v) => update({ radius_miles: v })}
              />
            </div>
          </div>
        </SettingsSection>

        {/* Feed Preferences */}
        <SettingsSection title="Feed" icon="🔍">
          <ToggleRow
            label="Photos only"
            description="Only show listings that have images"
            checked={settings.only_items_with_image}
            onChange={(v) => update({ only_items_with_image: v })}
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications" icon="🔔">
          <div className="flex flex-col gap-3">
            <ToggleRow
              label="Enable notifications"
              description="Get alerted when keyword matches are found"
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
        </SettingsSection>

        {/* Sources */}
        <SettingsSection title="Sources" icon="📡">
          <SourceToggleList
            value={settings.source_preferences}
            onChange={(v) => update({ source_preferences: v })}
          />
        </SettingsSection>

        {/* Keywords link */}
        <SettingsSection title="Keyword Alerts" icon="🔑">
          <p className="mb-3 text-sm text-gray-600">
            Manage the keywords you're watching for — pallets, furniture, tools, and more.
          </p>
          <Link href="/alerts">
            <Button variant="secondary" fullWidth>
              Manage Keywords →
            </Button>
          </Link>
        </SettingsSection>

        {/* Admin link */}
        <SettingsSection title="Admin" icon="⚙️">
          <p className="mb-3 text-sm text-gray-500">Developer tools and admin panel.</p>
          <Link href="/admin">
            <Button variant="ghost" fullWidth>
              Open Admin Area
            </Button>
          </Link>
        </SettingsSection>

        {/* Save button */}
        <Button onClick={save} size="lg" fullWidth>
          {saved ? '✓ Saved!' : 'Save Settings'}
        </Button>

        <p className="text-center text-xs text-gray-400">
          Settings are saved locally.{' '}
          <span className="text-gray-300">Cloud sync coming soon.</span>
        </p>
      </div>
    </div>
  )
}

function SettingsSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500">
        <span>{icon}</span>
        {title}
      </h2>
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
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
          checked ? 'bg-brand-500' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'left-5' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  )
}
