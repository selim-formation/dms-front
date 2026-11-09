import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Cloud, Database, FolderOpen, type LucideIcon } from 'lucide-react'
import type { StorageProvider } from '../types/storage.types'

const ICONS: Record<StorageProvider, LucideIcon> = {
    s3_compatible: Database,
    sharepoint: Cloud,
    local: FolderOpen,
}

function StorageProviderBadge({ provider }: { provider: StorageProvider }) {
    const { t } = useTranslation('storage')
    const Icon = ICONS[provider]
    return (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            {t(`provider.${provider}`)}
        </span>
    )
}

export default memo(StorageProviderBadge)
