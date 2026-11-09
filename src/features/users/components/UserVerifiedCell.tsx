import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { relativeTime } from '@/features/departments/utils/relativeTime'

/** Verified date (relative) or a muted "not verified". */
function UserVerifiedCell({ verifiedAt }: { verifiedAt: string | null }) {
    const { t, i18n } = useTranslation('users')

    if (!verifiedAt) return <span className="text-muted-foreground">{t('table.notVerified')}</span>
    return (
        <time dateTime={verifiedAt} title={new Date(verifiedAt).toLocaleString(i18n.language)}>
            {relativeTime(verifiedAt, i18n.language)}
        </time>
    )
}

export default memo(UserVerifiedCell)
