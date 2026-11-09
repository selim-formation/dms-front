import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { TABS } from '../utils/userPayload'
import type { UserTab } from '../types/user.types'

interface UserTabsProps {
    value: UserTab
    onChange: (tab: UserTab) => void
}

/** View presets (all / active / inactive / trash). There is no counts endpoint, so no badges. */
function UserTabs({ value, onChange }: UserTabsProps) {
    const { t } = useTranslation('users')

    return (
        <div role="tablist" aria-label={t('tabs.label')} className="flex flex-wrap gap-1 rounded-3xl border border-border bg-card p-1.5">
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

export default memo(UserTabs)
