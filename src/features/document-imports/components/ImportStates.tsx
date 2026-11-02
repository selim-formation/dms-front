import { memo } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { FileArchive, Lock, SearchX } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

export const ImportEmptyState = memo(function ImportEmptyState({
    canCreate,
    onCreate,
}: {
    canCreate: boolean
    onCreate: () => void
}) {
    const { t } = useTranslation('imports')
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <FileArchive className="h-12 w-12 text-muted-foreground/40" />
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

export const ImportListSkeleton = memo(function ImportListSkeleton({ rows = 6 }: { rows?: number }) {
    return (
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card" aria-hidden="true">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex animate-pulse items-center gap-4 px-4 py-4">
                    <div className="h-4 w-1/4 rounded bg-muted" />
                    <div className="h-5 w-20 rounded-full bg-muted" />
                    <div className="h-2 w-32 rounded bg-muted" />
                    <div className="ms-auto h-3 w-16 rounded bg-muted" />
                </div>
            ))}
        </div>
    )
})

/** Full-screen replacement for 403 (hide the screen) and 404 (go back to the list). */
export const ImportBlockedState = memo(function ImportBlockedState({
    kind,
    tenant,
}: {
    kind: 'forbidden' | 'notFound'
    tenant: string
}) {
    const { t } = useTranslation('imports')
    const Icon = kind === 'forbidden' ? Lock : SearchX
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <Icon className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 font-medium text-foreground">{t(`states.${kind}Title`)}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t(`states.${kind}Description`)}</p>
            {kind === 'notFound' && (
                <Button asChild className="mt-5">
                    <Link to="/$tenant/document-imports" params={{ tenant }}>
                        {t('detail.back')}
                    </Link>
                </Button>
            )}
        </div>
    )
})
