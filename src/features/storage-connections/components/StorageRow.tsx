import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Star } from 'lucide-react'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import StorageStatusBadge from './StorageStatusBadge'
import StorageProviderBadge from './StorageProviderBadge'
import StorageExpiry from './StorageExpiry'
import StorageRowActions, { type StorageRowHandlers } from './StorageRowActions'
import type { StorageConnection } from '../types/storage.types'

interface StorageRowProps extends StorageRowHandlers {
    connection: StorageConnection
    testBlocked: boolean
}

/** Memoised: a refresh or a test cooldown re-renders only the rows whose data changed. */
function StorageRow({ connection: c, testBlocked, ...handlers }: StorageRowProps) {
    const { t, i18n } = useTranslation('storage')

    return (
        <tr className="border-t border-border align-top transition-colors hover:bg-accent/40">
            <td className="max-w-64 px-4 py-3">
                <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-foreground" title={c.name} dir="auto">{c.name}</p>
                    {c.is_default && (
                        <span
                            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary"
                            title={t('table.defaultHint')}
                        >
                            <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                            {t('table.default')}
                        </span>
                    )}
                </div>
                {!c.credentials_set && c.provider !== 'local' && (
                    <p className="text-xs text-destructive">{t('table.noCredentials')}</p>
                )}
            </td>
            <td className="px-4 py-3">
                <StorageProviderBadge provider={c.provider} />
            </td>
            <td className="max-w-56 px-4 py-3">
                <StorageStatusBadge status={c.status} />
                {c.last_test_error && (
                    <p className="mt-1 line-clamp-2 text-xs text-destructive" title={c.last_test_error} dir="auto">
                        {c.last_test_error}
                    </p>
                )}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                {c.last_tested_at ? relativeTime(c.last_tested_at, i18n.language) : t('table.neverTested')}
            </td>
            <td className="whitespace-nowrap px-4 py-3">
                <StorageExpiry iso={c.credentials_expires_at} />
            </td>
            <td className="w-12 pe-3 py-2">
                <StorageRowActions connection={c} testBlocked={testBlocked} {...handlers} />
            </td>
        </tr>
    )
}

export default memo(StorageRow)
