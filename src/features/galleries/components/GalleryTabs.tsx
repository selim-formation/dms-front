import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface GalleryTabsProps<T extends string> {
    value: T
    tabs: readonly T[]
    onChange: (tab: T) => void
    /** Namespace key prefix, e.g. `tabs` → `tabs.all`. */
    labelPrefix?: string
    ariaLabel: string
}

/** Pill tabs (no counts endpoint here). Generic, so galleries and images share it. */
function GalleryTabsBase<T extends string>({ value, tabs, onChange, labelPrefix = 'tabs', ariaLabel }: GalleryTabsProps<T>) {
    const { t } = useTranslation('galleries')
    return (
        <div role="tablist" aria-label={ariaLabel} className="inline-flex flex-wrap gap-1 rounded-full border border-border bg-card p-1.5">
            {tabs.map((tab) => {
                const active = tab === value
                return (
                    <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(tab)}
                        className={cn(
                            'rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            active ? 'bg-foreground text-card shadow-sm' : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        {t(`${labelPrefix}.${tab}`)}
                    </button>
                )
            })}
        </div>
    )
}

export default memo(GalleryTabsBase) as typeof GalleryTabsBase
