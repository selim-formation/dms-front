import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import StorageRow from './StorageRow'
import type { StorageRowHandlers } from './StorageRowActions'
import type { StorageConnection } from '../types/storage.types'

const COLUMNS = ['name', 'provider', 'status', 'lastTested', 'expires'] as const

interface StorageTableProps extends StorageRowHandlers {
    connections: StorageConnection[]
    testBlocked: boolean
}

function StorageTable({ connections, testBlocked, ...handlers }: StorageTableProps) {
    const { t } = useTranslation('storage')

    return (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-200 text-start">
                <thead>
                    <tr className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                        {COLUMNS.map((c) => (
                            <th key={c} scope="col" className="px-4 py-3 text-start font-semibold">
                                {t(`table.columns.${c}`)}
                            </th>
                        ))}
                        <th scope="col" className="w-12 pe-3 py-3"><span className="sr-only">{t('table.columns.actions')}</span></th>
                    </tr>
                </thead>
                <tbody>
                    {connections.map((c) => (
                        <StorageRow key={c.id} connection={c} testBlocked={testBlocked} {...handlers} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default memo(StorageTable)
