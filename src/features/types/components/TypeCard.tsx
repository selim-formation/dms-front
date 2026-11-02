import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import DepartmentImage from '@/features/departments/components/DepartmentImage'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import TypeCardActions, { type TypeRowActions } from './TypeCardActions'
import { pickSecondaryTitle, pickTypeTitle } from './TypeTitle'
import type { DocumentType } from '../types/type.types'
import type { TypePermissions } from '../hooks/useTypePermissions'

interface TypeCardProps extends TypeRowActions {
    type: DocumentType
    permissions: TypePermissions
    selectable: boolean
    selected: boolean
    onToggleSelect: (id: number) => void
    onImageError: () => void
}

/** Memoised: selecting one card or typing in search doesn't re-render the others. */
function TypeCard({ type, permissions, selectable, selected, onToggleSelect, onImageError, ...actions }: TypeCardProps) {
    const { t, i18n } = useTranslation('types')
    const trashed = !!type.deleted_at
    const title = pickTypeTitle(type, i18n.language) ?? t('card.untitled')
    const secondary = pickSecondaryTitle(type, i18n.language)
    const hasActions = !trashed || permissions.canRestore || permissions.canForceDelete

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
                        onChange={() => onToggleSelect(type.id)}
                        aria-label={t('card.select', { title })}
                    />
                )}

                <DepartmentImage
                    src={type.image_url ?? type.image}
                    alt={title}
                    onLoadError={onImageError}
                    className={trashed ? 'grayscale' : undefined}
                />

                <div className="min-w-0 flex-1">
                    <h3 className="flex items-center gap-1.5 font-semibold text-foreground" title={title}>
                        <Tag className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                        <span className="truncate">{title}</span>
                    </h3>
                    {secondary && (
                        <p className="truncate text-sm text-muted-foreground" dir="auto">
                            {secondary}
                        </p>
                    )}
                    {trashed && (
                        <Badge variant="destructive" className="mt-1.5">
                            {t('card.deleted')}
                        </Badge>
                    )}
                </div>

                {hasActions && <TypeCardActions type={type} title={title} permissions={permissions} {...actions} />}
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                <span>{t('card.created', { time: relativeTime(type.created_at, i18n.language) })}</span>
                <span>{t('card.updated', { time: relativeTime(type.updated_at, i18n.language) })}</span>
            </div>
        </article>
    )
}

export default memo(TypeCard)
