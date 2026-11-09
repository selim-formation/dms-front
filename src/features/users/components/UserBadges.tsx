import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import ImportToneBadge from '@/features/document-imports/components/ImportToneBadge'
import { statusTone } from '../utils/userPayload'
import type { UserStatus } from '../types/user.types'

interface UserStatusBadgeProps {
    status: UserStatus | null
    /** A trashed user shows "In trash" whatever their status is. */
    trashed?: boolean
}

/** Active green, inactive grey, in trash red. */
export const UserStatusBadge = memo(function UserStatusBadge({ status, trashed }: UserStatusBadgeProps) {
    const { t } = useTranslation('users')
    if (trashed) return <ImportToneBadge tone="danger" label={t('status.trashed')} />
    return <ImportToneBadge tone={statusTone(status)} label={t(`status.${status ?? 'unknown'}`)} />
})
