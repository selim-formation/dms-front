import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Users } from 'lucide-react'

export const TeamEmptyState = memo(function TeamEmptyState() {
    const { t } = useTranslation('teams')
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 bg-card">
            <Users className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 text-muted-foreground font-medium">{t('teamPage.noTeamMembersFound')}</p>
            <p className="mt-1 text-sm text-muted-foreground/70">{t('teamPage.noTeamMembersFoundDescription')}</p>
        </div>
    )
})

export const TeamErrorState = memo(function TeamErrorState({
    message,
    onRetry,
}: {
    message: string
    onRetry: () => void
}) {
    const { t } = useTranslation('common')
    return (
        <div className="rounded-2xl bg-destructive/10 border border-destructive/30 p-12 text-center">
            <p className="text-destructive font-semibold mb-2 text-lg">{message}</p>
            <button
                onClick={onRetry}
                className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
                {t('common.tryAgain')}
            </button>
        </div>
    )
})

export const TeamGridSkeleton = memo(function TeamGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
                    <div className="h-1.5 bg-muted" />
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-full bg-muted shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-2/3 rounded bg-muted" />
                                <div className="h-3 w-1/2 rounded bg-muted" />
                            </div>
                        </div>
                        <div className="h-3 w-full rounded bg-muted" />
                        <div className="grid grid-cols-2 gap-3">
                            <div className="h-12 rounded-lg bg-muted" />
                            <div className="h-12 rounded-lg bg-muted" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
})
