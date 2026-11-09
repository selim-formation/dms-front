import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import UserRow from './UserRow'
import type { UserRowHandlers } from './UserRowActions'
import type { ManagedUser, UserTab } from '../types/user.types'
import { isSelectable } from '../utils/userPayload'

const COLUMNS = ['user', 'status', 'roles', 'departments', 'sections', 'verified', 'created'] as const

interface UserTableProps extends UserRowHandlers {
    users: ManagedUser[]
    tab: UserTab
    currentUserId: number | null
    /** Show the selection column (user holds a bulk permission). */
    bulkEnabled: boolean
    selectedIds: ReadonlySet<number>
    onToggleSelect: (id: number) => void
}

function UserTable({ users, tab, currentUserId, bulkEnabled, selectedIds, onToggleSelect, ...handlers }: UserTableProps) {
    const { t } = useTranslation('users')

    return (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-250 text-start">
                <thead>
                    <tr className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                        <th scope="col" className="w-10 ps-4 py-3"><span className="sr-only">{t('table.selectColumn')}</span></th>
                        {COLUMNS.map((c) => (
                            <th key={c} scope="col" className="px-4 py-3 text-start font-semibold">
                                {t(`table.columns.${c}`)}
                            </th>
                        ))}
                        <th scope="col" className="w-12 pe-3 py-3"><span className="sr-only">{t('table.columns.actions')}</span></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <UserRow
                            key={user.id}
                            user={user}
                            isSelf={user.id === currentUserId}
                            selectable={bulkEnabled && isSelectable(user, tab, currentUserId)}
                            selected={selectedIds.has(user.id)}
                            onToggleSelect={onToggleSelect}
                            {...handlers}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default memo(UserTable)
