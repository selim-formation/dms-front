import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import ManagementRow from './ManagementRow'
import type { ManagementRowHandlers } from './ManagementRowActions'
import type { ManagedDocument, ManagementTab } from '../types/management.types'
import { isSelectable } from '../utils/managementPayload'

const COLUMNS = ['title', 'status', 'creator', 'departments', 'importance', 'category', 'versions', 'created'] as const

interface ManagementTableProps extends ManagementRowHandlers {
    documents: ManagedDocument[]
    tab: ManagementTab
    /** Show the selection column (user holds a bulk permission). */
    bulkEnabled: boolean
    selectedIds: ReadonlySet<number>
    onToggleSelect: (id: number) => void
}

function ManagementTable({ documents, tab, bulkEnabled, selectedIds, onToggleSelect, ...handlers }: ManagementTableProps) {
    const { t } = useTranslation('management')

    return (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-240 text-start">
                <thead>
                    <tr className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                        <th scope="col" className="w-10 ps-4 py-3"><span className="sr-only">{t('table.select', { name: '' })}</span></th>
                        {COLUMNS.map((c) => (
                            <th key={c} scope="col" className="px-4 py-3 text-start font-semibold">
                                {t(`table.columns.${c}`)}
                            </th>
                        ))}
                        <th scope="col" className="w-12 pe-3 py-3"><span className="sr-only">{t('table.columns.actions')}</span></th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((doc) => (
                        <ManagementRow
                            key={doc.id}
                            doc={doc}
                            selectable={bulkEnabled && isSelectable(doc, tab)}
                            selected={selectedIds.has(doc.id)}
                            onToggleSelect={onToggleSelect}
                            {...handlers}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default memo(ManagementTable)
