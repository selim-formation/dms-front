import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserRound } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import UserForm from './UserForm'
import { useCurrentUserId } from '../../hooks/useCurrentUserId'
import type { ManagedUser } from '../../types/user.types'

interface UserFormDialogProps {
    /** `undefined` = create mode. */
    user?: ManagedUser
    onOpenChange: (open: boolean) => void
    onSaved: (saved: ManagedUser, mode: 'create' | 'edit') => void
    onBlocked: (error: unknown) => void
}

/** Dialog shell: blocks closing while saving, then mounts <UserForm>. */
function UserFormDialog({ user, onOpenChange, onSaved, onBlocked }: UserFormDialogProps) {
    const { t } = useTranslation('users')
    const currentUserId = useCurrentUserId()
    const isEdit = !!user
    const isSelf = isEdit && user.id === currentUserId
    const [pending, setPending] = useState(false)

    const handleOpenChange = useCallback(
        (next: boolean) => {
            if (!pending) onOpenChange(next)
        },
        [pending, onOpenChange],
    )
    const handleCancel = useCallback(() => onOpenChange(false), [onOpenChange])

    return (
        <Dialog open onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserRound className="h-5 w-5 text-primary" />
                        {t(isEdit ? 'form.editTitle' : 'form.createTitle')}
                    </DialogTitle>
                    <DialogDescription>{t(isEdit ? 'form.editDescription' : 'form.createDescription')}</DialogDescription>
                </DialogHeader>

                <UserForm
                    user={user ?? null}
                    isSelf={isSelf}
                    onCancel={handleCancel}
                    onSaved={onSaved}
                    onBlocked={onBlocked}
                    onPendingChange={setPending}
                />
            </DialogContent>
        </Dialog>
    )
}

export default memo(UserFormDialog)
