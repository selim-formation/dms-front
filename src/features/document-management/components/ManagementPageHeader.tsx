import { memo } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface ManagementPageHeaderProps {
    canCreate: boolean
    tenant: string
}

function ManagementPageHeader({ canCreate, tenant }: ManagementPageHeaderProps) {
    const { t } = useTranslation('management')
    return (
        <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('page.title')}</h1>
                <p className="mt-1 text-muted-foreground">{t('page.subtitle')}</p>
            </div>
            {canCreate && (
                <Button asChild>
                    <Link to="/$tenant/document-management/new" params={{ tenant }}>
                        <Plus className="h-4 w-4" />
                        {t('page.create')}
                    </Link>
                </Button>
            )}
        </div>
    )
}

export default memo(ManagementPageHeader)
