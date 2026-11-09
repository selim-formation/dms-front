import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import ImportToneBadge from '@/features/document-imports/components/ImportToneBadge'
import type { StatusTone } from '@/features/document-imports/types/import.types'
import { isVersionBusy } from '../../utils/versionFields'

const TONES: Record<string, StatusTone> = {
    completed: 'success',
    failed: 'danger',
    pending: 'neutral',
    queued: 'neutral',
    processing: 'info',
}

/** Upload status of a stored file; pulses while the server is still working on it. */
function VersionStatusBadge({ status }: { status: string }) {
    const { t } = useTranslation('management')
    return <ImportToneBadge tone={TONES[status] ?? 'neutral'} label={t(`versions.status.${status}`, { defaultValue: status })} live={isVersionBusy(status)} />
}

export default memo(VersionStatusBadge)
