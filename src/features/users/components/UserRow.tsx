import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import UserAvatar from './UserAvatar'
import UserChipList from './UserChipList'
import UserVerifiedCell from './UserVerifiedCell'
import UserRowActions, { type UserRowHandlers } from './UserRowActions'
import { UserStatusBadge } from './UserBadges'
import { userChips } from './userChips'
import type { ManagedUser } from '../types/user.types'

interface UserRowProps extends UserRowHandlers {
    user: ManagedUser
    selectable: boolean
    selected: boolean
    isSelf: boolean
    onToggleSelect: (id: number) => void
}

/** Memoised: selecting a row or a refresh re-renders only the rows that changed. */
function UserRow({ user, selectable, selected, isSelf, onToggleSelect, ...handlers }: UserRowProps) {
    const { t, i18n } = useTranslation('users')
    const chips = userChips(user)

    return (
        <tr className={cn('border-t border-border align-middle transition-colors hover:bg-accent/40', selected && 'bg-primary/5', user.deleted_at && 'opacity-80')}>
            <td className="w-10 ps-4 py-3">
                <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary disabled:opacity-30"
                    checked={selected}
                    disabled={!selectable}
                    onChange={() => onToggleSelect(user.id)}
                    aria-label={t('table.select', { name: user.name })}
                />
            </td>
            <td className="max-w-72 px-4 py-3">
                <div className="flex items-center gap-3">
                    <UserAvatar name={user.name} email={user.email} src={user.avatar} muted={!!user.deleted_at || user.status === 'inactive'} />
                    <div className="min-w-0">
                        <button
                            type="button"
                            onClick={() => handlers.onView(user)}
                            className="flex max-w-full items-center gap-2 text-start font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            title={user.name}
                        >
                            <span className="truncate" dir="auto">{user.name}</span>
                            {isSelf && (
                                <span className="shrink-0 rounded-full bg-primary/10 px-1.5 text-[10px] font-semibold uppercase text-primary">
                                    {t('table.you')}
                                </span>
                            )}
                        </button>
                        <p className="truncate text-xs text-muted-foreground" dir="ltr" title={user.email}>{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3">
                <UserStatusBadge status={user.status} trashed={!!user.deleted_at} />
            </td>
            <td className="px-4 py-3"><UserChipList items={chips.roles} /></td>
            <td className="px-4 py-3"><UserChipList items={chips.departments} /></td>
            <td className="px-4 py-3"><UserChipList items={chips.sections} /></td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                <UserVerifiedCell verifiedAt={user.email_verified_at} />
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                {relativeTime(user.created_at, i18n.language)}
            </td>
            <td className="w-12 pe-3 py-2">
                <UserRowActions user={user} {...handlers} />
            </td>
        </tr>
    )
}

export default memo(UserRow)
