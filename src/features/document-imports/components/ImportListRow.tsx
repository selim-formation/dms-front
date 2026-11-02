import { memo } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import { ImportStatusBadge } from './ImportStatusBadge'
import ImportProgressBar from './ImportProgressBar'
import type { DocumentImport } from '../types/import.types'

interface ImportListRowProps {
    item: DocumentImport
    tenant: string
}

/** Memoised: a 5 s poll only re-renders rows whose data actually changed. */
function ImportListRow({ item, tenant }: ImportListRowProps) {
    const { t, i18n } = useTranslation('imports')

    return (
        <tr className="border-t border-border transition-colors hover:bg-accent/40">
            <td className="max-w-64 px-4 py-3">
                <Link
                    to="/$tenant/document-imports/$importId"
                    params={{ tenant, importId: String(item.id) }}
                    className="block truncate font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    title={item.name}
                >
                    {item.name}
                </Link>
                <span className="text-xs text-muted-foreground">{t(`mode.${item.mode}`)}</span>
            </td>
            <td className="px-4 py-3">
                <ImportStatusBadge status={item.status} live={item.is_in_progress} />
            </td>
            <td className="w-44 px-4 py-3">
                <ImportProgressBar value={item.progress_percent} label={t('list.progress')} />
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm tabular-nums text-muted-foreground">
                <span className="font-medium text-foreground">{item.total_rows}</span>
                {item.invalid_rows + item.failed_rows > 0 && (
                    <span className="ms-2 text-destructive">
                        {t('list.problems', { count: item.invalid_rows + item.failed_rows })}
                    </span>
                )}
            </td>
            <td className="max-w-40 truncate px-4 py-3 text-sm text-muted-foreground">{item.creator?.name ?? '—'}</td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                {relativeTime(item.created_at, i18n.language)}
            </td>
        </tr>
    )
}

export default memo(ImportListRow)
