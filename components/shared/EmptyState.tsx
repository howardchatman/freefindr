interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 text-5xl">{icon}</div>
      <h3 className="mb-1 text-lg font-semibold text-gray-800">{title}</h3>
      {description && <p className="mb-6 max-w-xs text-sm text-gray-500">{description}</p>}
      {action}
    </div>
  )
}
