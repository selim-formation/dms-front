import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { formatProjectDate } from '../utils/projectPayload'
import type { Project } from '../types/project.types'

interface ProjectCardMetaProps {
    project: Pick<Project, 'start_date' | 'end_date' | 'duration' | 'duration_type' | 'manager_name'>
}

/** Dates, duration and manager as a compact definition grid (empty values are hidden). */
function ProjectCardMeta({ project }: ProjectCardMetaProps) {
    const { t, i18n } = useTranslation('projects')

    const items = [
        { label: t('card.start'), value: formatProjectDate(project.start_date, i18n.language) },
        { label: t('card.end'), value: formatProjectDate(project.end_date, i18n.language) },
        {
            label: t('card.duration'),
            value:
                project.duration !== null
                    ? `${project.duration}${project.duration_type ? ` ${t(`durationType.${project.duration_type}`)}` : ''}`
                    : null,
        },
        { label: t('card.manager'), value: project.manager_name },
    ].filter((i): i is { label: string; value: string } => !!i.value)

    if (items.length === 0) return null

    return (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {items.map((i) => (
                <div key={i.label} className="min-w-0">
                    <dt className="text-xs text-muted-foreground">{i.label}</dt>
                    <dd className="truncate font-medium text-foreground" title={i.value}>
                        {i.value}
                    </dd>
                </div>
            ))}
        </dl>
    )
}

export default memo(ProjectCardMeta)
