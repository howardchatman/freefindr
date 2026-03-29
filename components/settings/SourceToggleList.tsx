'use client'

import { SOURCES } from '@/lib/types/listing'

interface SourceToggleListProps {
  value: Record<string, boolean>
  onChange: (value: Record<string, boolean>) => void
}

export function SourceToggleList({ value, onChange }: SourceToggleListProps) {
  function toggle(code: string) {
    onChange({ ...value, [code]: !value[code] })
  }

  return (
    <div className="flex flex-col gap-3">
      {SOURCES.map((src) => {
        const enabled = value[src.code] ?? true
        return (
          <div key={src.code} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{src.name}</span>
            <button
              role="switch"
              aria-checked={enabled}
              onClick={() => toggle(src.code)}
              className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                enabled ? 'bg-brand-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  enabled ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        )
      })}
    </div>
  )
}
