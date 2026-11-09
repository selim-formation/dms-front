import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import VersionRowItem from './VersionRowItem'
import type { VersionRowHandlers } from './VersionRowActions'
import type { DocumentVersion } from '../../types/version.types'

const COLUMNS = ['version', 'file', 'description', 'expires', 'uploadedBy', 'status'] as const

interface VersionsTableProps extends VersionRowHandlers {
    versions: DocumentVersion[]
    /** Show the selection column (user holds `delete_versions`). */
    bulkEnabled: boolean
    selectedIds: ReadonlySet<number>
    previewingId: number | null
    onToggleSelect: (id: number) => void
}

function VersionsTable({ versions, bulkEnabled, selectedIds, previewingId, onToggleSelect, ...handlers }: VersionsTableProps) {
    const { t } = useTranslation('management')

    return (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-200 text-start">
                <thead>
                    <tr className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                        <th scope="col" className="w-10 ps-4 py-3"><span className="sr-only">{t('versions.selectColumn')}</span></th>
                        {COLUMNS.map((c) => (
                            <th key={c} scope="col" className="px-4 py-3 text-start font-semibold">
                                {t(`versions.columns.${c}`)}
                            </th>
                        ))}
                        <th scope="col" className="w-12 pe-3 py-3"><span className="sr-only">{t('versions.columns.actions')}</span></th>
                    </tr>
                </thead>
                <tbody>
                    {versions.map((v) => (
                        <VersionRowItem
                            key={v.id}
                            version={v}
                            selectable={bulkEnabled && v.abilities.delete}
                            selected={selectedIds.has(v.id)}
                            previewing={previewingId === v.id}
                            onToggleSelect={onToggleSelect}
                            {...handlers}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default memo(VersionsTable)
