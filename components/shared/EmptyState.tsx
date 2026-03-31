interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
        {icon}
      </div>
      <h3 className="mb-2 text-base font-bold text-[#111111]">{title}</h3>
      {description && (
        <p className="mb-6 max-w-xs text-sm leading-relaxed text-[#6B7280]">{description}</p>
      )}
      {action}
    </div>
  )
}
