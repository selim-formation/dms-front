import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import ImportListRow from './ImportListRow'
import type { DocumentImport } from '../types/import.types'

interface ImportListProps {
    items: DocumentImport[]
    tenant: string
}

const COLUMNS = ['name', 'status', 'progress', 'rows', 'creator', 'created'] as const

function ImportList({ items, tenant }: ImportListProps) {
    const { t } = useTranslation('imports')

    return (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-176 text-start">
                <thead>
                    <tr className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                        {COLUMNS.map((c) => (
                            <th key={c} scope="col" className="px-4 py-3 text-start font-semibold">
                                {t(`list.columns.${c}`)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <ImportListRow key={item.id} item={item} tenant={tenant} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default memo(ImportList)
