import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Images, Lock, Trash2 } from 'lucide-react'

interface StateProps {
    trash?: boolean
    /** i18n prefix: `states` (galleries) or `imageStates`. */
    prefix?: 'states' | 'imageStates'
}

export const GalleryEmptyState = memo(function GalleryEmptyState({ trash, prefix = 'states' }: StateProps) {
    const { t } = useTranslation('galleries')
    const Icon = trash ? Trash2 : Images
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <Icon className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 font-medium text-muted-foreground">{t(trash ? `${prefix}.emptyTrash` : `${prefix}.emptyTitle`)}</p>
            <p className="mt-1 text-sm text-muted-foreground/70">{t(`${prefix}.emptyDescription`)}</p>
        </div>
    )
})

export const GalleryTableSkeleton = memo(function GalleryTableSkeleton({ rows = 8 }: { rows?: number }) {
    return (
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card" aria-hidden="true">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex animate-pulse items-center gap-4 px-4 py-4">
                    <div className="h-4 w-4 rounded bg-muted" />
                    <div className="h-12 w-12 rounded-lg bg-muted" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 rounded bg-muted" />
                        <div className="h-3 w-1/2 rounded bg-muted" />
                    </div>
                    <div className="h-5 w-20 rounded-full bg-muted" />
                </div>
            ))}
        </div>
    )
})

export const ImageGridSkeleton = memo(function ImageGridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="animate-pulse overflow-hidden rounded-xl border border-border bg-card">
                    <div className="aspect-square bg-muted" />
                    <div className="space-y-2 p-3">
                        <div className="h-4 w-2/3 rounded bg-muted" />
                    </div>
                </div>
            ))}
        </div>
    )
})

/** 403 hides the whole screen. */
export const GalleryForbiddenState = memo(function GalleryForbiddenState() {
    const { t } = useTranslation('galleries')
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <Lock className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 font-medium text-foreground">{t('states.forbiddenTitle')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('states.forbiddenDescription')}</p>
        </div>
    )
})
