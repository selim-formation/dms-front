import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Building2, Lock, Trash2 } from 'lucide-react'
import type { CompanyTab } from '../types/company.types'

export const CompanyEmptyState = memo(function CompanyEmptyState({ tab }: { tab: CompanyTab }) {
    const { t } = useTranslation('companies')
    const Icon = tab === 'trash' ? Trash2 : Building2
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <Icon className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 font-medium text-muted-foreground">{t(tab === 'trash' ? 'states.emptyTrash' : 'states.emptyTitle')}</p>
            <p className="mt-1 text-sm text-muted-foreground/70">{t('states.emptyDescription')}</p>
        </div>
    )
})

export const CompanyTableSkeleton = memo(function CompanyTableSkeleton({ rows = 8 }: { rows?: number }) {
    return (
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card" aria-hidden="true">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex animate-pulse items-center gap-4 px-4 py-4">
                    <div className="h-4 w-4 rounded bg-muted" />
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/4 rounded bg-muted" />
                        <div className="h-3 w-1/5 rounded bg-muted" />
                    </div>
                    <div className="h-5 w-20 rounded-md bg-muted" />
                    <div className="h-5 w-12 rounded bg-muted" />
                </div>
            ))}
        </div>
    )
})

/** 403 hides the whole screen. */
export const CompanyForbiddenState = memo(function CompanyForbiddenState() {
    const { t } = useTranslation('companies')
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <Lock className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 font-medium text-foreground">{t('states.forbiddenTitle')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('states.forbiddenDescription')}</p>
        </div>
    )
})
