import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import ImportToneBadge from './ImportToneBadge'
import { importTone, rowTone } from '../utils/importStatus'
import type { ImportStatus, RowStatus } from '../types/import.types'

export const ImportStatusBadge = memo(function ImportStatusBadge({
    status,
    live,
}: {
    status: ImportStatus
    live?: boolean
}) {
    const { t } = useTranslation('imports')
    return <ImportToneBadge tone={importTone(status)} label={t(`status.${status}`)} live={live} />
})

export const ImportRowStatusBadge = memo(function ImportRowStatusBadge({ status }: { status: RowStatus }) {
    const { t } = useTranslation('imports')
    return <ImportToneBadge tone={rowTone(status)} label={t(`rowStatus.${status}`)} />
})
