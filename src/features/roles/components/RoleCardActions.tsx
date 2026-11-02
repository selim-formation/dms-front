import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Button } from '@/shared/components/ui/button'
import type { Role, RoleDeleteBlock } from '../types/role.types'
import type { RoleAccess } from '../hooks/useRoleAccess'

export interface RoleRowActions {
    onView: (role: Role) => void
    onEdit: (role: Role) => void
    onDelete: (role: Role) => void
}

interface RoleCardActionsProps extends RoleRowActions {
    role: Role
    access: RoleAccess
    deleteBlock: RoleDeleteBlock | null
}

function RoleCardActions({ role, access, deleteBlock, ...actions }: RoleCardActionsProps) {
    const { t } = useTranslation('roles')
    const blockReason = deleteBlock
        ? t(deleteBlock === 'system' ? 'actions.deleteSystem' : 'actions.deleteInUse', { count: role.users_count })
        : undefined

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={t('actions.menu', { name: role.name })}
                >
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-w-64">
                <DropdownMenuItem onClick={() => actions.onView(role)}>
                    <Eye className="me-2 h-4 w-4" />
                    {t('actions.view')}
                </DropdownMenuItem>
                {access.canUpdate && (
                    <DropdownMenuItem onClick={() => actions.onEdit(role)}>
                        <Pencil className="me-2 h-4 w-4" />
                        {t('actions.edit')}
                    </DropdownMenuItem>
                )}
                {access.canDelete && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="flex-col items-start gap-0.5 text-destructive focus:text-destructive"
                            disabled={!!deleteBlock}
                            title={blockReason}
                            onClick={() => actions.onDelete(role)}
                        >
                            <span className="flex items-center">
                                <Trash2 className="me-2 h-4 w-4" />
                                {t('actions.delete')}
                            </span>
                            {blockReason && (
                                <span className="whitespace-normal text-xs font-normal text-muted-foreground">
                                    {blockReason}
                                </span>
                            )}
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default memo(RoleCardActions)
