import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import ImportToneBadge from '@/features/document-imports/components/ImportToneBadge'
import { importanceTone, statusTone } from '../utils/managementPayload'
import type { DocumentStatus, Importance } from '../types/management.types'

/** pending yellow, approved green, rejected red. */
export const DocumentStatusBadge = memo(function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
    const { t } = useTranslation('management')
    return <ImportToneBadge tone={statusTone(status)} label={t(`status.${status}`)} />
})

export const ImportanceBadge = memo(function ImportanceBadge({ importance }: { importance: Importance }) {
    const { t } = useTranslation('management')
    return <ImportToneBadge tone={importanceTone(importance)} label={t(`importance.${importance}`)} />
})
