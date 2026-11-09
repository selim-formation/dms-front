import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, MoreVertical, Pencil, Power, PowerOff, RotateCcw, Trash2, XOctagon } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Button } from '@/shared/components/ui/button'
import type { ManagedUser } from '../types/user.types'

export interface UserRowHandlers {
    onView: (user: ManagedUser) => void
    onEdit: (user: ManagedUser) => void
    onActivate: (user: ManagedUser) => void
    onDeactivate: (user: ManagedUser) => void
    onDelete: (user: ManagedUser) => void
    onRestore: (user: ManagedUser) => void
    onForceDelete: (user: ManagedUser) => void
}

/** Only what `abilities` allows — it already folds in permission, rank, yourself and state. */
function UserRowActions({ user, ...h }: { user: ManagedUser } & UserRowHandlers) {
    const { t } = useTranslation('users')
    const a = user.abilities

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t('actions.menu', { name: user.name })}>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => h.onView(user)}>
                    <Eye className="me-2 h-4 w-4" />
                    {t('actions.view')}
                </DropdownMenuItem>
                {a.update && (
                    <DropdownMenuItem onClick={() => h.onEdit(user)}>
                        <Pencil className="me-2 h-4 w-4" />
                        {t('actions.edit')}
                    </DropdownMenuItem>
                )}
                {a.activate && (
                    <DropdownMenuItem onClick={() => h.onActivate(user)}>
                        <Power className="me-2 h-4 w-4" />
                        {t('actions.activate')}
                    </DropdownMenuItem>
                )}
                {a.deactivate && (
                    <DropdownMenuItem onClick={() => h.onDeactivate(user)}>
                        <PowerOff className="me-2 h-4 w-4" />
                        {t('actions.deactivate')}
                    </DropdownMenuItem>
                )}
                {a.restore && (
                    <DropdownMenuItem onClick={() => h.onRestore(user)}>
                        <RotateCcw className="me-2 h-4 w-4" />
                        {t('actions.restore')}
                    </DropdownMenuItem>
                )}
                {(a.delete || a.force_delete) && <DropdownMenuSeparator />}
                {a.delete && (
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => h.onDelete(user)}>
                        <Trash2 className="me-2 h-4 w-4" />
                        {t('actions.delete')}
                    </DropdownMenuItem>
                )}
                {a.force_delete && (
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => h.onForceDelete(user)}>
                        <XOctagon className="me-2 h-4 w-4" />
                        {t('actions.forceDelete')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default memo(UserRowActions)
