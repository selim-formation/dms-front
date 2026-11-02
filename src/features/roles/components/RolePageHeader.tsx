import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface RolePageHeaderProps {
    canCreate: boolean
    onCreate: () => void
}

function RolePageHeader({ canCreate, onCreate }: RolePageHeaderProps) {
    const { t } = useTranslation('roles')
    return (
        <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('page.title')}</h1>
                <p className="mt-1 text-muted-foreground">{t('page.subtitle')}</p>
            </div>
            {canCreate && (
                <Button onClick={onCreate}>
                    <Plus className="h-4 w-4" />
                    {t('page.create')}
                </Button>
            )}
        </div>
    )
}

export default memo(RolePageHeader)
