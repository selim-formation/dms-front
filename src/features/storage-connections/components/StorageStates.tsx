import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HardDrive, Lock } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

export const StorageEmptyState = memo(function StorageEmptyState({
    canCreate,
    filtered,
    onCreate,
}: {
    canCreate: boolean
    filtered: boolean
    onCreate: () => void
}) {
    const { t } = useTranslation('storage')
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <HardDrive className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 font-medium text-muted-foreground">{t('states.emptyTitle')}</p>
            <p className="mt-1 text-sm text-muted-foreground/70">
                {filtered ? t('states.emptyFiltered') : canCreate ? t('states.emptyCreate') : t('states.emptyDescription')}
            </p>
            {canCreate && !filtered && (
                <Button className="mt-5" onClick={onCreate}>
                    {t('page.create')}
                </Button>
            )}
        </div>
    )
})

export const StorageTableSkeleton = memo(function StorageTableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card" aria-hidden="true">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex animate-pulse items-center gap-4 px-4 py-4">
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/4 rounded bg-muted" />
                        <div className="h-3 w-1/3 rounded bg-muted" />
                    </div>
                    <div className="h-5 w-24 rounded-md bg-muted" />
                    <div className="h-5 w-16 rounded-full bg-muted" />
                </div>
            ))}
        </div>
    )
})

/** 403 hides the whole screen. */
export const StorageForbiddenState = memo(function StorageForbiddenState() {
    const { t } = useTranslation('storage')
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <Lock className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 font-medium text-foreground">{t('states.forbiddenTitle')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('states.forbiddenDescription')}</p>
        </div>
    )
})
