import Link from 'next/link'

interface AppHeaderProps {
  /** Show search bar inline */
  showSearch?: boolean
  searchValue?: string
  onSearchChange?: (v: string) => void
}

/**
 * Reusable sticky top header for main app pages.
 * Search is optional — pass showSearch + handlers for feed page.
 */
export function AppHeader({ showSearch, searchValue, onSearchChange }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB]">
      {/* Top row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        {/* Wordmark */}
        <Link href="/feed" className="flex items-center gap-1">
          <span className="text-[22px] font-black tracking-tight text-[#111111]">
            Free<span className="text-brand-500">Findr</span>
          </span>
        </Link>

        {/* Location + actions */}
        <div className="flex items-center gap-2">
          {/* Location pill */}
          <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5">
            <svg className="h-3 w-3 text-brand-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold text-[#111111]">Houston, TX</span>
          </div>

          {/* Alerts link */}
          <Link
            href="/alerts"
            aria-label="Alerts"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280] hover:bg-gray-100 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Search row */}
      {showSearch && (
        <div className="px-4 pb-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Search pallets, fridges, furniture..."
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] py-2.5 pl-9 pr-4 text-sm text-[#111111] placeholder-[#9CA3AF] focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/15 transition-colors"
            />
            {searchValue && (
              <button
                onClick={() => onSearchChange?.('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

/** Simpler back-navigation header for inner pages */
export function BackHeader({ title, href = '/feed' }: { title: string; href?: string }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB]">
      <div className="flex items-center gap-3 px-4 py-3">
        <Link
          href={href}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <p className="flex-1 truncate text-[15px] font-semibold text-[#111111]">{title}</p>
        <span className="shrink-0 rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-bold text-white tracking-wide">
          FREE
        </span>
      </div>
    </header>
  )
}
