import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { formatCalendarDate } from '@/features/document-management/utils/formatDate'
import { expiryState } from '../utils/storagePayload'

/** Credentials expiry; red within 30 days (or past), muted otherwise. */
function StorageExpiry({ iso }: { iso: string | null }) {
    const { t, i18n } = useTranslation('storage')
    const state = expiryState(iso)
    if (!iso || !state) return <span className="text-muted-foreground">—</span>

    return (
        <div>
            <p className={cn('text-sm', state === 'ok' ? 'text-foreground' : 'font-medium text-destructive')}>
                {formatCalendarDate(iso, i18n.language)}
            </p>
            {state !== 'ok' && <p className="text-xs text-destructive">{t(`expiry.${state}`)}</p>}
        </div>
    )
}

export default memo(StorageExpiry)
