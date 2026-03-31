import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const baseClass =
  'w-full rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] px-3.5 py-2.5 text-sm text-[#111111] placeholder-[#9CA3AF] transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/15 disabled:opacity-50 disabled:cursor-not-allowed'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-[#374151]">
          {label}
          {props.required && <span className="ml-0.5 text-brand-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`${baseClass} ${error ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-400/15' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#9CA3AF]">{hint}</p>}
    </div>
  )
)
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', rows = 3, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-[#374151]">
          {label}
          {props.required && <span className="ml-0.5 text-brand-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`${baseClass} resize-none ${error ? 'border-red-400 focus:border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#9CA3AF]">{hint}</p>}
    </div>
  )
)
Textarea.displayName = 'Textarea'
