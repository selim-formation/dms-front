import { memo } from 'react'
import ProjectCard from './ProjectCard'
import type { ProjectRowActions } from './ProjectCardActions'
import type { Project } from '../types/project.types'
import type { ProjectPermissions } from '../hooks/useProjectPermissions'

interface ProjectGridProps extends ProjectRowActions {
    projects: Project[]
    permissions: ProjectPermissions
    selectable: boolean
    selectedIds: ReadonlySet<number>
    onToggleSelect: (id: number) => void
}

function ProjectGrid({ projects, selectedIds, ...rest }: ProjectGridProps) {
    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} selected={selectedIds.has(project.id)} {...rest} />
            ))}
        </div>
    )
}

export default memo(ProjectGrid)
