'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/shared/Button'
import { CATEGORIES } from '@/lib/types/listing'
import type { UserSettings } from '@/lib/types/user'
import { DEFAULT_SETTINGS } from '@/lib/types/user'

const STORAGE_KEY = 'ff:settings'
const ONBOARDING_KEY = 'ff:onboarded'

const STARTER_KEYWORDS = ['pallet', 'couch', 'fridge', 'dresser', 'tools', 'wood', 'grill', 'washer']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [zip, setZip] = useState('')
  const [radius, setRadius] = useState(25)
  const [categories, setCategories] = useState<string[]>([])
  const [keywords, setKeywords] = useState<string[]>(['pallet', 'couch', 'fridge'])

  function toggleCategory(val: string) {
    setCategories((prev) =>
      prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]
    )
  }

  function toggleKeyword(kw: string) {
    setKeywords((prev) => (prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]))
  }

  function finish() {
    const settings: UserSettings = {
      ...DEFAULT_SETTINGS,
      home_zip: zip || DEFAULT_SETTINGS.home_zip,
      radius_miles: radius,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    localStorage.setItem(ONBOARDING_KEY, '1')

    // Store keywords locally for MVP
    if (keywords.length > 0) {
      localStorage.setItem('ff:keywords', JSON.stringify(keywords))
    }

    router.push('/feed')
  }

  const steps = [
    <StepZip key="zip" zip={zip} setZip={setZip} radius={radius} setRadius={setRadius} onNext={() => setStep(1)} />,
    <StepCategories key="cats" categories={categories} onToggle={toggleCategory} onNext={() => setStep(2)} />,
    <StepKeywords key="kw" keywords={keywords} onToggle={toggleKeyword} onFinish={finish} />,
  ]

  const titles = ['Where are you?', 'What are you into?', 'Set keyword alerts']
  const subtitles = [
    'We\'ll show you listings near your area',
    'Pick categories you\'re interested in (optional)',
    'Save keywords to get notified when matching items post',
  ]

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Progress */}
      <div className="flex gap-1.5 p-5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? 'bg-brand-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col px-6 pt-4">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mb-2 text-5xl">🏠</div>
          <h1 className="text-2xl font-bold text-gray-900">
            FreeFindr<span className="text-brand-500">.com</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">Find free stuff near you. Fast.</p>
        </div>

        <h2 className="mb-1 text-xl font-bold text-gray-900">{titles[step]}</h2>
        <p className="mb-6 text-sm text-gray-500">{subtitles[step]}</p>

        {steps[step]}
      </div>
    </div>
  )
}

// ─── Step 1: Location ─────────────────────────────────────────────────────────

function StepZip({ zip, setZip, radius, setRadius, onNext }: {
  zip: string; setZip: (v: string) => void
  radius: number; setRadius: (v: number) => void
  onNext: () => void
}) {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Your ZIP code</label>
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="77002"
          maxLength={5}
          inputMode="numeric"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-lg placeholder-gray-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Radius: <strong>{radius} miles</strong>
        </label>
        <input
          type="range" min={5} max={75} step={5}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full accent-brand-500"
        />
      </div>
      <div className="mt-auto pb-8">
        <Button onClick={onNext} size="lg" fullWidth>Continue →</Button>
      </div>
    </div>
  )
}

// ─── Step 2: Categories ───────────────────────────────────────────────────────

function StepCategories({ categories, onToggle, onNext }: {
  categories: string[]; onToggle: (v: string) => void; onNext: () => void
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="grid grid-cols-2 gap-3 pb-6">
        {CATEGORIES.map((cat) => {
          const active = categories.includes(cat.value)
          return (
            <button
              key={cat.value}
              onClick={() => onToggle(cat.value)}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
                active
                  ? 'border-brand-400 bg-brand-50 text-brand-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-sm font-medium">{cat.label}</span>
            </button>
          )
        })}
      </div>
      <div className="mt-auto pb-8 flex flex-col gap-2">
        <Button onClick={onNext} size="lg" fullWidth>Continue →</Button>
        <button onClick={onNext} className="text-sm text-gray-400 underline py-1">Skip for now</button>
      </div>
    </div>
  )
}

// ─── Step 3: Keywords ─────────────────────────────────────────────────────────

function StepKeywords({ keywords, onToggle, onFinish }: {
  keywords: string[]; onToggle: (v: string) => void; onFinish: () => void
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-wrap gap-2 pb-6">
        {STARTER_KEYWORDS.map((kw) => {
          const active = keywords.includes(kw)
          return (
            <button
              key={kw}
              onClick={() => onToggle(kw)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {active ? '✓ ' : ''}{kw}
            </button>
          )
        })}
      </div>
      <p className="mb-6 text-xs text-gray-400">
        You can edit these anytime in the Alerts tab.
      </p>
      <div className="mt-auto pb-8">
        <Button onClick={onFinish} size="lg" fullWidth>
          Start browsing free stuff 🚀
        </Button>
      </div>
    </div>
  )
}
