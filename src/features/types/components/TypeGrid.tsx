import { memo } from 'react'
import TypeCard from './TypeCard'
import type { TypeRowActions } from './TypeCardActions'
import type { DocumentType } from '../types/type.types'
import type { TypePermissions } from '../hooks/useTypePermissions'

interface TypeGridProps extends TypeRowActions {
    types: DocumentType[]
    permissions: TypePermissions
    selectable: boolean
    selectedIds: ReadonlySet<number>
    onToggleSelect: (id: number) => void
    onImageError: () => void
}

function TypeGrid({ types, selectedIds, ...rest }: TypeGridProps) {
    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {types.map((type) => (
                <TypeCard key={type.id} type={type} selected={selectedIds.has(type.id)} {...rest} />
            ))}
        </div>
    )
}

export default memo(TypeGrid)
