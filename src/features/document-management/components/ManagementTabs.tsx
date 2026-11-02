import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useDocumentCounts } from '../hooks/useDocumentCounts'
import { TABS } from '../utils/managementPayload'
import type { DocumentCounts, ManagementTab } from '../types/management.types'

const COUNT_KEY: Record<ManagementTab, keyof DocumentCounts> = {
    all: 'all',
    approved: 'approved',
    rejected: 'rejected',
    pending: 'pending',
    trash: 'trashed',
}

interface ManagementTabsProps {
    value: ManagementTab
    onChange: (tab: ManagementTab) => void
}

/** Owns the counts query, so a counts refresh never re-renders the table. */
function ManagementTabs({ value, onChange }: ManagementTabsProps) {
    const { t } = useTranslation('management')
    const { counts } = useDocumentCounts()

    return (
        <div role="tablist" aria-label={t('tabs.label')} className="flex flex-wrap gap-1 rounded-full border border-border bg-card p-1.5">
            {TABS.map((tab) => {
                const active = tab === value
                const count = counts?.[COUNT_KEY[tab]]
                return (
                    <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(tab)}
                        className={cn(
                            'flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            active ? 'bg-foreground text-card shadow-sm' : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        {t(`tabs.${tab}`)}
                        {count !== undefined && (
                            <span
                                className={cn(
                                    'rounded-full px-1.5 text-xs tabular-nums',
                                    active ? 'bg-card/20' : 'bg-muted',
                                )}
                            >
                                {count}
                            </span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}

export default memo(ManagementTabs)
