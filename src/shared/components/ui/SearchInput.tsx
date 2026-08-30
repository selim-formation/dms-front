import { InputHTMLAttributes } from "react"

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  containerClassName?: string
}

export default function SearchInput({
  placeholder = "Search documents, permits, licenses...",
  className = "",
  containerClassName = "",
  ...props
}: SearchInputProps) {
  return (
    <div className={`mt-4 max-w-xl ${containerClassName}`}>
      <div className="relative">
        {/* icon */}
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        {/* input */}
        <input
          type="text"
          placeholder={placeholder}
          className={`
            w-full h-11 rounded-full
            bg-card/95 backdrop-blur
            pl-12 pr-4
            text-sm text-muted-foreground
            placeholder-muted-foreground
            shadow-sm
            border border-border
            focus:outline-none
            focus:ring-2 focus:ring-primary
            focus:border-primary
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  )
}
