'use client'

import { useState, useEffect } from 'react'

const MESSAGES = [
  { icon: '🔥', text: '12 new items posted today near you' },
  { icon: '⚡', text: '3 pallet listings in the last hour' },
  { icon: '🛋️', text: 'Furniture moves fast — check the feed' },
  { icon: '📦', text: 'Updated in real time · Local listings only' },
  { icon: '🏃', text: 'Items like these are usually gone in hours' },
]

interface ActivityBannerProps {
  count?: number
}

export function ActivityBanner({ count }: ActivityBannerProps) {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx((i) => (i + 1) % MESSAGES.length)
        setVisible(true)
      }, 300)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const msg = count !== undefined && count > 0
    ? { icon: '🔥', text: `${count} free listings near Houston right now` }
    : MESSAGES[idx]

  return (
    <div className="bg-amber-50 border-b border-amber-100 px-4 py-2">
      <p
        className={`flex items-center gap-1.5 text-xs font-medium text-amber-800 transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span>{msg.icon}</span>
        <span>{msg.text}</span>
        <span className="ml-auto text-amber-400 text-[10px] font-normal tracking-wide uppercase">Live</span>
      </p>
    </div>
  )
}
