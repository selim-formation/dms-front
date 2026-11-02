import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ProjectStatus, ProjectType } from '../types/project.types'

const STATUS_STYLES: Record<ProjectStatus, string> = {
    active: 'bg-success/10 text-success',
    completed: 'bg-primary/10 text-primary',
    pending: 'bg-amber-500/10 text-amber-600',
    in_progress: 'bg-primary/10 text-primary',
    on_hold: 'bg-amber-500/10 text-amber-600',
    cancelled: 'bg-destructive/10 text-destructive',
}

/** Translated status pill (never shows the raw key). */
export const ProjectStatusBadge = memo(function ProjectStatusBadge({ status }: { status: ProjectStatus | null }) {
    const { t } = useTranslation('projects')
    if (!status) return null
    return (
        <Badge variant="outline" className={cn('border-transparent font-medium', STATUS_STYLES[status])}>
            {t(`status.${status}`)}
        </Badge>
    )
})

export const ProjectTypeBadge = memo(function ProjectTypeBadge({ type }: { type: ProjectType | null }) {
    const { t } = useTranslation('projects')
    if (!type) return null
    return <Badge variant="secondary">{t(`type.${type}`)}</Badge>
})
