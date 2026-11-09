import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { formatBytes } from '@/features/document-imports/utils/importPayload'
import { formatCalendarDate } from '../../utils/formatDate'
import VersionStatusBadge from './VersionStatusBadge'
import VersionRowActions, { type VersionRowHandlers } from './VersionRowActions'
import type { DocumentVersion } from '../../types/version.types'

interface VersionRowItemProps extends VersionRowHandlers {
    version: DocumentVersion
    selectable: boolean
    selected: boolean
    previewing: boolean
    onToggleSelect: (id: number) => void
}

/** Memoised: polling a status or selecting one row re-renders only the rows that changed. */
function VersionRowItem({ version, selectable, selected, previewing, onToggleSelect, ...handlers }: VersionRowItemProps) {
    const { t, i18n } = useTranslation('management')
    const lang = i18n.language

    return (
        <tr className={cn('border-t border-border align-top transition-colors hover:bg-accent/40', selected && 'bg-primary/5')}>
            <td className="w-10 ps-4 py-3">
                <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-primary disabled:opacity-30"
                    checked={selected}
                    disabled={!selectable}
                    onChange={() => onToggleSelect(version.id)}
                    aria-label={t('versions.select', { n: version.version })}
                />
            </td>
            <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums text-foreground">v{version.version}</td>
            <td className="whitespace-nowrap px-4 py-3 text-sm">
                <span className="font-medium uppercase text-foreground">{version.extension ?? '—'}</span>
                {version.size !== null && <p className="text-xs text-muted-foreground">{formatBytes(version.size, lang)}</p>}
            </td>
            <td className="max-w-64 px-4 py-3 text-sm">
                {version.version_description ? (
                    <p className="line-clamp-2 text-foreground" title={version.version_description} dir="auto">
                        {version.version_description}
                    </p>
                ) : (
                    <span className="text-muted-foreground">—</span>
                )}
                {version.special_document_number !== null && (
                    <p className="text-xs text-muted-foreground">{t('versions.specialNumber', { n: version.special_document_number })}</p>
                )}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm">
                {version.expire_date ? (
                    <>
                        <p className="text-foreground">{formatCalendarDate(version.expire_date, lang)}</p>
                        {version.reminder_before !== null && (
                            <p className="text-xs text-muted-foreground">{t('versions.reminder', { count: version.reminder_before })}</p>
                        )}
                    </>
                ) : (
                    <span className="text-muted-foreground">—</span>
                )}
            </td>
            <td className="max-w-40 px-4 py-3 text-sm">
                <p className="truncate text-foreground" title={version.uploaded_by?.name}>{version.uploaded_by?.name ?? '—'}</p>
                <p className="text-xs text-muted-foreground">{formatCalendarDate(version.created_at, lang)}</p>
            </td>
            <td className="px-4 py-3">
                <VersionStatusBadge status={version.upload_status} />
            </td>
            <td className="w-12 pe-3 py-2">
                <VersionRowActions version={version} previewing={previewing} {...handlers} />
            </td>
        </tr>
    )
}

export default memo(VersionRowItem)
