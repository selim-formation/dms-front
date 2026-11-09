import { memo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Pencil, Power, PowerOff, RotateCcw, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { errorStatus } from '@/features/departments/utils/departmentErrors'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import UserAvatar from './UserAvatar'
import UserChipList from './UserChipList'
import UserVerifiedCell from './UserVerifiedCell'
import { UserStatusBadge } from './UserBadges'
import { userChips } from './userChips'
import { useUserDetail } from '../hooks/useUserDetail'
import type { ManagedUser } from '../types/user.types'

function Row({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
    return (
        <div className={wide ? 'col-span-2' : undefined}>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="mt-0.5 font-medium text-foreground">{children}</dd>
        </div>
    )
}

interface UserDetailsDialogProps {
    userId: number | null
    onOpenChange: (open: boolean) => void
    onEdit: (user: ManagedUser) => void
    onActivate: (user: ManagedUser) => void
    onDeactivate: (user: ManagedUser) => void
    onDelete: (user: ManagedUser) => void
    onRestore: (user: ManagedUser) => void
}

/** Read-only view; fetches only while open (trashed users can be opened too). */
function UserDetailsDialog({ userId, onOpenChange, onEdit, onActivate, onDeactivate, onDelete, onRestore }: UserDetailsDialogProps) {
    const { t, i18n } = useTranslation('users')
    const { user, isLoading, isError, error, refetch } = useUserDetail(userId)
    const notFound = isError && errorStatus(error) === 404
    const date = (iso: string) => relativeTime(iso, i18n.language)
    const a = user?.abilities
    const chips = user ? userChips(user) : null
    const hasActions = !!a && (a.update || a.activate || a.deactivate || a.delete || a.restore)

    return (
        <Dialog open={userId !== null} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
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
                        <p className="text-sm text-destructive">{t(notFound ? 'states.notFound' : 'states.viewError')}</p>
                        {!notFound && (
                            <Button variant="outline" size="sm" onClick={() => refetch()}>
                                {t('actions.retry', { ns: 'common' })}
                            </Button>
                        )}
                    </div>
                )}

                {user && chips && (
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <UserAvatar name={user.name} email={user.email} src={user.avatar} className="h-14 w-14 text-base" />
                            <div className="min-w-0 space-y-1">
                                <h3 className="truncate text-xl font-semibold text-foreground" dir="auto">{user.name}</h3>
                                <p className="truncate text-sm text-muted-foreground" dir="ltr">{user.email}</p>
                                <UserStatusBadge status={user.status} trashed={!!user.deleted_at} />
                            </div>
                        </div>

                        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-4 text-sm">
                            <Row label={t('details.roles')} wide><UserChipList items={chips.roles} max={99} /></Row>
                            <Row label={t('details.departments')} wide><UserChipList items={chips.departments} max={99} /></Row>
                            <Row label={t('details.sections')} wide><UserChipList items={chips.sections} max={99} /></Row>
                            <Row label={t('details.verified')}><UserVerifiedCell verifiedAt={user.email_verified_at} /></Row>
                            <Row label={t('details.created')}>{date(user.created_at)}</Row>
                            <Row label={t('details.updated')}>{date(user.updated_at)}</Row>
                            {user.deleted_at && <Row label={t('details.deleted')}>{date(user.deleted_at)}</Row>}
                        </dl>
                    </div>
                )}

                {user && a && hasActions && (
                    <DialogFooter className="flex-wrap">
                        {a.restore && (
                            <Button variant="outline" onClick={() => onRestore(user)}>
                                <RotateCcw className="h-4 w-4" />
                                {t('actions.restore')}
                            </Button>
                        )}
                        {a.activate && (
                            <Button variant="outline" onClick={() => onActivate(user)}>
                                <Power className="h-4 w-4" />
                                {t('actions.activate')}
                            </Button>
                        )}
                        {a.deactivate && (
                            <Button variant="outline" onClick={() => onDeactivate(user)}>
                                <PowerOff className="h-4 w-4" />
                                {t('actions.deactivate')}
                            </Button>
                        )}
                        {a.delete && (
                            <Button variant="outline" onClick={() => onDelete(user)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                {t('actions.delete')}
                            </Button>
                        )}
                        {a.update && (
                            <Button onClick={() => onEdit(user)}>
                                <Pencil className="h-4 w-4" />
                                {t('actions.edit')}
                            </Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default memo(UserDetailsDialog)
