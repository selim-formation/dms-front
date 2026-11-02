import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/components/ui/badge'
import { groupPermissions, humanize, splitPermission } from '../utils/rolePayload'
import type { RolePermission } from '../types/role.types'

interface RolePermissionChipsProps {
    permissions: RolePermission[]
}

/** Read-only grouped view of a role's permissions. */
function RolePermissionChips({ permissions }: RolePermissionChipsProps) {
    const { t } = useTranslation('roles')
    const groups = useMemo(() => groupPermissions(permissions), [permissions])

    if (groups.length === 0) {
        return <p className="text-sm text-muted-foreground">{t('details.noPermissions')}</p>
    }

    return (
        <div className="space-y-3">
            {groups.map((g) => (
                <div key={g.action}>
                    <h5 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {t(`permissions.actions.${g.action}`, { defaultValue: humanize(g.action) })}
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                        {g.items.map((p) => (
                            <Badge key={p.id} variant="secondary" className="font-medium capitalize" title={p.name}>
                                {t(`permissions.resources.${splitPermission(p.name).resource}`, {
                                    defaultValue: humanize(splitPermission(p.name).resource),
                                })}
                            </Badge>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default memo(RolePermissionChips)
