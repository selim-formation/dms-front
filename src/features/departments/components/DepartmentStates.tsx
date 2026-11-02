import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Building2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

export const DepartmentEmptyState = memo(function DepartmentEmptyState({
    canCreate,
    onCreate,
}: {
    canCreate: boolean
    onCreate: () => void
}) {
    const { t } = useTranslation('departments')
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 font-medium text-muted-foreground">{t('states.emptyTitle')}</p>
            <p className="mt-1 text-sm text-muted-foreground/70">
                {canCreate ? t('states.emptyCreate') : t('states.emptyDescription')}
            </p>
            {canCreate && (
                <Button className="mt-5" onClick={onCreate}>
                    {t('page.create')}
                </Button>
            )}
        </div>
    )
})

export const DepartmentErrorState = memo(function DepartmentErrorState({
    message,
    onRetry,
}: {
    message: string
    onRetry: () => void
}) {
    const { t } = useTranslation('common')
    return (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-12 text-center">
            <p className="mb-2 text-lg font-semibold text-destructive">{message}</p>
            <Button className="mt-2" onClick={onRetry}>
                {t('common.tryAgain')}
            </Button>
        </div>
    )
})

export const DepartmentGridSkeleton = memo(function DepartmentGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-4 rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 shrink-0 rounded-full bg-muted" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-2/3 rounded bg-muted" />
                            <div className="h-3 w-1/3 rounded bg-muted" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="h-5 w-16 rounded-full bg-muted" />
                        <div className="h-5 w-20 rounded-full bg-muted" />
                    </div>
                    <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
            ))}
        </div>
    )
})
