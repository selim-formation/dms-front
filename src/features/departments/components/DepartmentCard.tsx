import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import DepartmentImage from './DepartmentImage'
import DepartmentSectionBadges from './DepartmentSectionBadges'
import DepartmentCardActions, { type DepartmentRowActions } from './DepartmentCardActions'
import { relativeTime } from '../utils/relativeTime'
import type { Department } from '../types/department.types'
import type { DepartmentPermissions } from '../hooks/useDepartmentPermissions'

interface DepartmentCardProps extends DepartmentRowActions {
    department: Department
    permissions: DepartmentPermissions
    selectable: boolean
    selected: boolean
    onToggleSelect: (id: number) => void
    onImageError: () => void
}

/**
 * Memoised on primitive-ish props + stable callbacks, so selecting one card
 * or typing in the search box doesn't re-render the other cards.
 */
function DepartmentCard({
    department,
    permissions,
    selectable,
    selected,
    onToggleSelect,
    onImageError,
    ...actions
}: DepartmentCardProps) {
    const { t, i18n } = useTranslation('departments')
    const trashed = !!department.deleted_at
    const sections = department.sections ?? []
    const hasActions =
        !trashed || permissions.canRestore || permissions.canForceDelete

    return (
        <article
            className={cn(
                'flex flex-col gap-4 rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md',
                selected ? 'border-primary ring-1 ring-primary' : 'border-border',
                trashed && 'bg-muted/40',
            )}
        >
            <div className="flex items-start gap-3">
                {selectable && (
                    <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 shrink-0 accent-primary"
                        checked={selected}
                        onChange={() => onToggleSelect(department.id)}
                        aria-label={t('card.select', { title: department.title })}
                    />
                )}

                <DepartmentImage
                    src={department.image_url ?? department.image}
                    alt={department.title}
                    onLoadError={onImageError}
                    className={trashed ? 'grayscale' : undefined}
                />

                <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-foreground" title={department.title}>
                        {department.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {t('card.sections', { count: department.sections_count })}
                    </p>
                    {trashed && (
                        <Badge variant="destructive" className="mt-1.5">
                            {t('card.deleted')}
                        </Badge>
                    )}
                </div>

                {hasActions && (
                    <DepartmentCardActions department={department} permissions={permissions} {...actions} />
                )}
            </div>

            <DepartmentSectionBadges sections={sections} total={department.sections_count} />

            <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                <span>{t('card.created', { time: relativeTime(department.created_at, i18n.language) })}</span>
                <span>{t('card.updated', { time: relativeTime(department.updated_at, i18n.language) })}</span>
            </div>
        </article>
    )
}

export default memo(DepartmentCard)
