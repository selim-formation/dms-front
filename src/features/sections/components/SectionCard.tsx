import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import DepartmentImage from '@/features/departments/components/DepartmentImage'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import SectionCardActions, { type SectionRowActions } from './SectionCardActions'
import { DESCRIPTION_PREVIEW_CHARS, truncate } from '../utils/sectionPayload'
import type { Section } from '../types/section.types'
import type { SectionPermissions } from '../hooks/useSectionPermissions'

interface SectionCardProps extends SectionRowActions {
    section: Section
    permissions: SectionPermissions
    selectable: boolean
    selected: boolean
    onToggleSelect: (id: number) => void
    onImageError: () => void
}

/** Memoised: selecting one card or typing in search doesn't re-render the others. */
function SectionCard({ section, permissions, selectable, selected, onToggleSelect, onImageError, ...actions }: SectionCardProps) {
    const { t, i18n } = useTranslation('sections')

    return (
        <article
            className={cn(
                'flex flex-col gap-4 rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md',
                selected ? 'border-primary ring-1 ring-primary' : 'border-border',
            )}
        >
            <div className="flex items-start gap-3">
                {selectable && (
                    <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 shrink-0 accent-primary"
                        checked={selected}
                        onChange={() => onToggleSelect(section.id)}
                        aria-label={t('card.select', { name: section.name })}
                    />
                )}

                <DepartmentImage src={section.image_url ?? section.image} alt={section.name} onLoadError={onImageError} />

                <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-foreground" title={section.name}>
                        {section.name}
                    </h3>
                    {section.description && (
                        <p className="text-sm text-muted-foreground" dir="auto">
                            {truncate(section.description, DESCRIPTION_PREVIEW_CHARS)}
                        </p>
                    )}
                </div>

                <SectionCardActions section={section} permissions={permissions} {...actions} />
            </div>

            <div>
                <Badge variant="secondary" className="max-w-full truncate font-medium">
                    {section.department?.title ?? t('card.noDepartment')}
                </Badge>
            </div>

            <div className="mt-auto border-t border-border pt-3 text-xs text-muted-foreground">
                {t('card.created', { time: relativeTime(section.created_at, i18n.language) })}
            </div>
        </article>
    )
}

export default memo(SectionCard)
