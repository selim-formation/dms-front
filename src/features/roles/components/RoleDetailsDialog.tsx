import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyRound, Loader2, Users } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import RoleAvatar from './RoleAvatar'
import RoleStat from './RoleStat'
import RoleSystemBadge from './RoleSystemBadge'
import RolePermissionChips from './RolePermissionChips'
import { useRoleDetail } from '../hooks/useRoleDetail'
import { isSystemRoleName } from '../utils/rolePayload'

interface RoleDetailsDialogProps {
    roleId: number | null
    onOpenChange: (open: boolean) => void
}

/** Read-only view (counts, grouped permissions, dates); fetches only while open. */
function RoleDetailsDialog({ roleId, onOpenChange }: RoleDetailsDialogProps) {
    const { t, i18n } = useTranslation('roles')
    const { role, isLoading, isError, refetch } = useRoleDetail(roleId)

    return (
        <Dialog open={roleId !== null} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{t('details.title')}</DialogTitle>
                </DialogHeader>

                {isLoading && (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {isError && (
                    <div className="space-y-3 py-6 text-center">
                        <p className="text-sm text-destructive">{t('states.viewError')}</p>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            {t('actions.retry', { ns: 'common' })}
                        </Button>
                    </div>
                )}

                {role && (
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <RoleAvatar className="h-16 w-16" iconClassName="h-8 w-8" />
                            <div className="min-w-0 space-y-1.5">
                                <h3 className="truncate text-xl font-semibold text-foreground" title={role.name}>
                                    {role.name}
                                </h3>
                                {isSystemRoleName(role.name) && <RoleSystemBadge />}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                            <RoleStat icon={KeyRound} value={role.permissions_count} label={t('card.permissions')} />
                            <RoleStat icon={Users} value={role.users_count} label={t('card.users')} />
                        </div>

                        <div>
                            <h4 className="mb-2 text-sm font-medium text-foreground">{t('details.permissions')}</h4>
                            <div className="max-h-64 overflow-y-auto rounded-xl border border-border p-3">
                                <RolePermissionChips permissions={role.permissions ?? []} />
                            </div>
                        </div>

                        <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm">
                            <div>
                                <dt className="text-muted-foreground">{t('details.created')}</dt>
                                <dd className="font-medium text-foreground">{relativeTime(role.created_at, i18n.language)}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">{t('details.updated')}</dt>
                                <dd className="font-medium text-foreground">{relativeTime(role.updated_at, i18n.language)}</dd>
                            </div>
                        </dl>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default memo(RoleDetailsDialog)
