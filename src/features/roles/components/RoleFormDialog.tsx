import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, ShieldCheck } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import RoleForm from './RoleForm'
import { useRoleDetail } from '../hooks/useRoleDetail'

interface RoleFormDialogProps {
    /** `null` = create mode; otherwise the role is fetched (with permissions) before editing. */
    roleId: number | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSaved: (mode: 'created' | 'updated') => void
}

/** Dialog shell: owns loading / error of the edit target, then mounts <RoleForm>. */
function RoleFormDialog({ roleId, open, onOpenChange, onSaved }: RoleFormDialogProps) {
    const { t } = useTranslation('roles')
    const isEdit = roleId !== null
    const { role, isLoading, isError, refetch } = useRoleDetail(roleId)
    const [pending, setPending] = useState(false)

    const handleOpenChange = useCallback(
        (next: boolean) => {
            if (!pending) onOpenChange(next)
        },
        [pending, onOpenChange],
    )
    const handleCancel = useCallback(() => onOpenChange(false), [onOpenChange])

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        {t(isEdit ? 'form.editTitle' : 'form.createTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {t(isEdit ? 'form.editDescription' : 'form.createDescription')}
                    </DialogDescription>
                </DialogHeader>

                {isEdit && isLoading && (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {isEdit && isError && (
                    <div className="space-y-3 py-8 text-center">
                        <p className="text-sm text-destructive">{t('states.viewError')}</p>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            {t('actions.retry', { ns: 'common' })}
                        </Button>
                    </div>
                )}

                {(!isEdit || role) && (
                    <RoleForm
                        key={role?.id ?? 'new'}
                        role={role}
                        onCancel={handleCancel}
                        onSaved={onSaved}
                        onPendingChange={setPending}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}

export default memo(RoleFormDialog)
