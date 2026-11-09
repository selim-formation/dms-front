import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { TABS } from '../utils/companyPayload'
import type { CompanyTab } from '../types/company.types'

interface CompanyTabsProps {
    value: CompanyTab
    onChange: (tab: CompanyTab) => void
}

/** View presets (companies / trash). There is no counts endpoint, so no badges. */
function CompanyTabs({ value, onChange }: CompanyTabsProps) {
    const { t } = useTranslation('companies')

    return (
        <div role="tablist" aria-label={t('tabs.label')} className="flex flex-wrap gap-1 rounded-3xl border border-border bg-card p-1.5 w-fit">
            {TABS.map((tab) => {
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
                        {t(`tabs.${tab}`)}
                    </button>
                )
            })}
        </div>
    )
}

export default memo(CompanyTabs)
