import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLink, FolderKanban } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import ProjectCardActions, { type ProjectRowActions } from './ProjectCardActions'
import ProjectCardMeta from './ProjectCardMeta'
import { ProjectStatusBadge, ProjectTypeBadge } from './ProjectBadges'
import type { Project } from '../types/project.types'
import type { ProjectPermissions } from '../hooks/useProjectPermissions'

interface ProjectCardProps extends ProjectRowActions {
    project: Project
    permissions: ProjectPermissions
    selectable: boolean
    selected: boolean
    onToggleSelect: (id: number) => void
}

/** Memoised: selecting one card or typing in search doesn't re-render the others. */
function ProjectCard({ project, permissions, selectable, selected, onToggleSelect, ...actions }: ProjectCardProps) {
    const { t, i18n } = useTranslation('projects')
    const trashed = !!project.deleted_at
    const hasActions = !trashed ? permissions.canUpdate || permissions.canDelete : permissions.canRestore || permissions.canForceDelete

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
                        onChange={() => onToggleSelect(project.id)}
                        aria-label={t('card.select', { name: project.name })}
                    />
                )}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FolderKanban className="h-5 w-5" aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-foreground" title={project.name}>
                        {project.name}
                    </h3>
                    <p className="truncate text-sm text-muted-foreground">
                        {project.category || t('card.noCategory')}
                    </p>
                </div>

                {hasActions && <ProjectCardActions project={project} permissions={permissions} {...actions} />}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
                <ProjectStatusBadge status={project.status} />
                <ProjectTypeBadge type={project.type} />
                {trashed && <Badge variant="destructive">{t('card.deleted')}</Badge>}
            </div>

            <ProjectCardMeta project={project} />

            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                <span>{t('card.created', { time: relativeTime(project.created_at, i18n.language) })}</span>
                <a
                    href={project.project_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                >
                    {t('card.openFile')}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
            </div>
        </article>
    )
}

export default memo(ProjectCard)
