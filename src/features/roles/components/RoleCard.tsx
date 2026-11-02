import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyRound, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import RoleAvatar from './RoleAvatar'
import RoleStat from './RoleStat'
import RoleSystemBadge from './RoleSystemBadge'
import RoleCardActions, { type RoleRowActions } from './RoleCardActions'
import { getDeleteBlock } from '../utils/rolePayload'
import type { Role } from '../types/role.types'
import type { RoleAccess } from '../hooks/useRoleAccess'

interface RoleCardProps extends RoleRowActions {
    role: Role
    access: RoleAccess
    selectable: boolean
    selected: boolean
    onToggleSelect: (id: number) => void
}

/** Memoised: selecting one card or typing in search doesn't re-render the others. */
function RoleCard({ role, access, selectable, selected, onToggleSelect, ...actions }: RoleCardProps) {
    const { t, i18n } = useTranslation('roles')
    const deleteBlock = getDeleteBlock(role)

    return (
        <article
            className={cn(
                'flex flex-col gap-4 rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md',
                selected ? 'border-primary ring-1 ring-primary' : 'border-border',
            )}
        >
            <div className="flex items-start gap-3">
                {selectable && (
                    <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 shrink-0 accent-primary disabled:cursor-not-allowed disabled:opacity-40"
                        checked={selected}
                        disabled={!!deleteBlock}
                        title={deleteBlock ? t(deleteBlock === 'system' ? 'actions.deleteSystem' : 'actions.deleteInUse', { count: role.users_count }) : undefined}
                        onChange={() => onToggleSelect(role.id)}
                        aria-label={t('card.select', { name: role.name })}
                    />
                )}

                <RoleAvatar />

                <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="truncate font-semibold text-foreground" title={role.name}>
                        {role.name}
                    </h3>
                    {deleteBlock === 'system' && <RoleSystemBadge />}
                </div>

                <RoleCardActions role={role} access={access} deleteBlock={deleteBlock} {...actions} />
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                <RoleStat icon={KeyRound} value={role.permissions_count} label={t('card.permissions')} />
                <RoleStat icon={Users} value={role.users_count} label={t('card.users')} />
            </div>

            <div className="mt-auto border-t border-border pt-3 text-xs text-muted-foreground">
                {t('card.created', { time: relativeTime(role.created_at, i18n.language) })}
            </div>
        </article>
    )
}

export default memo(RoleCard)
