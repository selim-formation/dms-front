import { memo } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import { ImportStatusBadge } from './ImportStatusBadge'
import ImportActions, { type ImportActionResult } from './ImportActions'
import type { DocumentImport } from '../types/import.types'

interface ImportDetailHeaderProps {
    item: DocumentImport
    tenant: string
    onResult: (result: ImportActionResult) => void
}

function ImportDetailHeader({ item, tenant, onResult }: ImportDetailHeaderProps) {
    const { t, i18n } = useTranslation('imports')
    return (
        <div className="space-y-4">
            <Link
                to="/$tenant/document-imports"
                params={{ tenant }}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                {t('detail.back')}
            </Link>

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 space-y-2">
                    <h1 className="truncate text-3xl font-bold tracking-tight text-foreground" title={item.name} dir="auto">
                        {item.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <ImportStatusBadge status={item.status} live={item.is_in_progress} />
                        <span>{t(`mode.${item.mode}`)}</span>
                        {item.creator && <span>{t('detail.by', { name: item.creator.name })}</span>}
                        <span>{relativeTime(item.created_at, i18n.language)}</span>
                    </div>
                </div>
                <ImportActions item={item} onResult={onResult} />
            </div>
        </div>
    )
}

export default memo(ImportDetailHeader)
