'use client'

import { useState } from 'react'

interface RadiusSelectorProps {
  value: number
  onChange: (value: number) => void
}

const PRESETS = [5, 10, 15, 25, 50]

export function RadiusSelector({ value, onChange }: RadiusSelectorProps) {
  return (
    <div>
      <div className="mb-3 flex gap-2">
        {PRESETS.map((miles) => (
          <button
            key={miles}
            onClick={() => onChange(miles)}
            className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-colors ${
              value === miles
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            {miles}mi
          </button>
        ))}
      </div>
      <input
        type="range"
        min={1}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-500"
      />
      <p className="mt-1 text-center text-sm text-gray-500">
        Showing listings within <strong>{value} miles</strong>
      </p>
    </div>
  )
}
