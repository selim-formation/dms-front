import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { ImportRowStatusBadge } from './ImportStatusBadge'
import type { ImportRow } from '../types/import.types'

const RowLine = memo(function RowLine({ row }: { row: ImportRow }) {
    return (
        <tr className="border-t border-border align-top">
            <td className="w-16 px-4 py-2.5 text-sm tabular-nums text-muted-foreground">{row.row_number}</td>
            <td className="max-w-72 px-4 py-2.5">
                <p className="truncate text-sm font-medium text-foreground" title={row.file_name} dir="auto">
                    {row.file_name}
                </p>
                <p className="truncate text-xs text-muted-foreground" title={row.title} dir="auto">
                    {row.title}
                </p>
            </td>
            <td className="px-4 py-2.5 text-sm text-muted-foreground" dir="auto">
                {row.external_ref ?? '—'}
                {row.version_number !== null && <span className="ms-1 text-xs">v{row.version_number}</span>}
            </td>
            <td className="px-4 py-2.5">
                <ImportRowStatusBadge status={row.status} />
            </td>
            <td className="max-w-80 px-4 py-2.5 text-sm text-destructive" dir="auto">
                {row.error}
            </td>
        </tr>
    )
})

const COLUMNS = ['number', 'file', 'ref', 'status', 'problem'] as const

function ImportRowsTable({ rows }: { rows: ImportRow[] }) {
    const { t } = useTranslation('imports')
    return (
        <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-160 text-start">
                <thead>
                    <tr className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                        {COLUMNS.map((c) => (
                            <th key={c} scope="col" className="px-4 py-2.5 text-start font-semibold">
                                {t(`rows.columns.${c}`)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <RowLine key={row.id} row={row} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default memo(ImportRowsTable)
