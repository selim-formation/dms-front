import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import ImportToneBadge from '@/features/document-imports/components/ImportToneBadge'
import { statusTone } from '../utils/storagePayload'
import type { StorageStatus } from '../types/storage.types'

/** active green, pending grey, disabled orange, error red. */
function StorageStatusBadge({ status }: { status: StorageStatus }) {
    const { t } = useTranslation('storage')
    return <ImportToneBadge tone={statusTone(status)} label={t(`status.${status}`)} />
}

export default memo(StorageStatusBadge)
