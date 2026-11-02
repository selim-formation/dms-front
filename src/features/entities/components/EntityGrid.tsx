import { memo } from 'react'
import EntityCard from './EntityCard'
import type { EntityRowActions } from './EntityCardActions'
import type { DocumentEntity } from '../types/entity.types'
import type { EntityPermissions } from '../hooks/useEntityPermissions'

interface EntityGridProps extends EntityRowActions {
    entities: DocumentEntity[]
    permissions: EntityPermissions
    selectable: boolean
    selectedIds: ReadonlySet<number>
    onToggleSelect: (id: number) => void
    onImageError: () => void
}

function EntityGrid({ entities, selectedIds, ...rest }: EntityGridProps) {
    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {entities.map((entity) => (
                <EntityCard key={entity.id} entity={entity} selected={selectedIds.has(entity.id)} {...rest} />
            ))}
        </div>
    )
}

export default memo(EntityGrid)
