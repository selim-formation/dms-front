import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import { DocumentStatusBadge, ImportanceBadge } from './DocumentBadges'
import DepartmentChips from './DepartmentChips'
import ManagementRowActions, { type ManagementRowHandlers } from './ManagementRowActions'
import type { ManagedDocument } from '../types/management.types'

interface ManagementRowProps extends ManagementRowHandlers {
    doc: ManagedDocument
    selectable: boolean
    selected: boolean
    onToggleSelect: (id: number) => void
}

/** Memoised: selecting a row or a counts refresh re-renders only the rows that changed. */
function ManagementRow({ doc, selectable, selected, onToggleSelect, ...handlers }: ManagementRowProps) {
    const { t, i18n } = useTranslation('management')

    return (
        <tr className={cn('border-t border-border align-top transition-colors hover:bg-accent/40', selected && 'bg-primary/5')}>
            <td className="w-10 ps-4 py-3">
                <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-primary disabled:opacity-30"
                    checked={selected}
                    disabled={!selectable}
                    onChange={() => onToggleSelect(doc.id)}
                    aria-label={t('table.select', { name: doc.title })}
                />
            </td>
            <td className="max-w-72 px-4 py-3">
                <button
                    type="button"
                    onClick={() => handlers.onView(doc)}
                    className="block max-w-full truncate text-start font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    title={doc.title}
                    dir="auto"
                >
                    {doc.title}
                </button>
                {doc.description && (
                    <p className="line-clamp-1 text-xs text-muted-foreground" title={doc.description} dir="auto">
                        {doc.description}
                    </p>
                )}
            </td>
            <td className="px-4 py-3">
                <DocumentStatusBadge status={doc.status} />
            </td>
            <td className="max-w-40 px-4 py-3 text-sm">
                <p className="truncate text-foreground" title={doc.creator?.name}>{doc.creator?.name ?? '—'}</p>
                {doc.responsible && doc.responsible.id !== doc.creator?.id && (
                    <p className="truncate text-xs text-muted-foreground" title={doc.responsible.name}>
                        {t('table.responsible', { name: doc.responsible.name })}
                    </p>
                )}
            </td>
            <td className="px-4 py-3">
                <DepartmentChips departments={doc.departments} />
            </td>
            <td className="px-4 py-3">
                <ImportanceBadge importance={doc.importance} />
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{t(`category.${doc.category}`)}</td>
            <td className="px-4 py-3 text-sm tabular-nums text-muted-foreground">{doc.versions_count}</td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                {relativeTime(doc.created_at, i18n.language)}
            </td>
            <td className="w-12 pe-3 py-2">
                <ManagementRowActions doc={doc} {...handlers} />
            </td>
        </tr>
    )
}

export default memo(ManagementRow)
