import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Building2, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { errorStatus } from '@/features/departments/utils/departmentErrors'
import CompanyForm from './CompanyForm'
import { useCompanyDetail } from '../../hooks/useCompanyDetail'
import type { Company } from '../../types/company.types'

interface CompanyFormDialogProps {
    /** `null` = create mode; otherwise the company is fetched (with `permission_ids`) before editing. */
    companyId: string | null
    onOpenChange: (open: boolean) => void
    onSaved: (saved: Company, mode: 'create' | 'edit') => void
    onBlocked: (error: unknown) => void
}

/** Dialog shell: owns loading / error of the edit target and blocks closing while saving. */
function CompanyFormDialog({ companyId, onOpenChange, onSaved, onBlocked }: CompanyFormDialogProps) {
    const { t } = useTranslation('companies')
    const isEdit = companyId !== null
    const { company, isLoading, isError, error, refetch } = useCompanyDetail(companyId)
    const [pending, setPending] = useState(false)

    const handleOpenChange = useCallback(
        (next: boolean) => {
            if (!pending) onOpenChange(next)
        },
        [pending, onOpenChange],
    )
    const handleCancel = useCallback(() => onOpenChange(false), [onOpenChange])
    const notFound = isError && errorStatus(error) === 404

    return (
        <Dialog open onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        {t(isEdit ? 'form.editTitle' : 'form.createTitle')}
                    </DialogTitle>
                    <DialogDescription>{t(isEdit ? 'form.editDescription' : 'form.createDescription')}</DialogDescription>
                </DialogHeader>

                {isEdit && isLoading && (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {isEdit && isError && (
                    <div className="space-y-3 py-8 text-center">
                        <p className="text-sm text-destructive">{t(notFound ? 'states.notFound' : 'states.viewError')}</p>
                        {!notFound && (
                            <Button variant="outline" size="sm" onClick={() => refetch()}>
                                {t('actions.retry', { ns: 'common' })}
                            </Button>
                        )}
                    </div>
                )}

                {(!isEdit || company) && (
                    <CompanyForm
                        key={company?.id ?? 'new'}
                        company={company}
                        onCancel={handleCancel}
                        onSaved={onSaved}
                        onBlocked={onBlocked}
                        onPendingChange={setPending}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}

export default memo(CompanyFormDialog)
