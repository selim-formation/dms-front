import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Lock } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'

/** Marks roles the application treats specially (admin, manager, head, key_user). */
function RoleSystemBadge() {
    const { t } = useTranslation('roles')
    return (
        <Badge variant="outline" className="gap-1 text-muted-foreground" title={t('card.systemHint')}>
            <Lock className="h-3 w-3" />
            {t('card.system')}
        </Badge>
    )
}

export default memo(RoleSystemBadge)
