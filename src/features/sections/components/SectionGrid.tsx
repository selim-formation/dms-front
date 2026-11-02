import { memo } from 'react'
import SectionCard from './SectionCard'
import type { SectionRowActions } from './SectionCardActions'
import type { Section } from '../types/section.types'
import type { SectionPermissions } from '../hooks/useSectionPermissions'

interface SectionGridProps extends SectionRowActions {
    sections: Section[]
    permissions: SectionPermissions
    selectable: boolean
    selectedIds: ReadonlySet<number>
    onToggleSelect: (id: number) => void
    onImageError: () => void
}

function SectionGrid({ sections, selectedIds, ...rest }: SectionGridProps) {
    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
                <SectionCard key={section.id} section={section} selected={selectedIds.has(section.id)} {...rest} />
            ))}
        </div>
    )
}

export default memo(SectionGrid)
