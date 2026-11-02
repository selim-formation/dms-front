import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Building2, Loader2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import DepartmentFormField from './DepartmentFormField'
import DepartmentImageField from './DepartmentImageField'
import DepartmentSectionsPicker from './DepartmentSectionsPicker'
import { useCreateDepartment, useUpdateDepartment } from '../hooks/useSaveDepartment'
import { fieldErrors, errorMessage } from '../utils/departmentErrors'
import { sameIds } from '../utils/departmentPayload'
import type { Department, DepartmentPayload } from '../types/department.types'

const TITLE_MAX = 255

interface DepartmentFormDialogProps {
    /** `null` = create mode. */
    department: Department | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSaved: (mode: 'created' | 'updated') => void
}

/**
 * Create / edit form. The parent keys it by department id (or "new") so
 * switching target remounts it with fresh state instead of syncing via effects.
 * Edit sends a partial payload: only fields that actually changed.
 */
function DepartmentFormDialog({ department, open, onOpenChange, onSaved }: DepartmentFormDialogProps) {
    const { t } = useTranslation(['departments', 'common'])
    const isEdit = !!department

    const initialSectionIds = useMemo(
        () => department?.sections?.map((s) => s.id) ?? [],
        [department],
    )
    const ownSections = department?.sections

    const [title, setTitle] = useState(department?.title ?? '')
    const [file, setFile] = useState<File | null>(null)
    const [removeImage, setRemoveImage] = useState(false)
    const [sectionIds, setSectionIds] = useState<number[]>(initialSectionIds)
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

    const create = useCreateDepartment()
    const update = useUpdateDepartment()
    const mutation = isEdit ? update : create
    const isPending = mutation.isPending

    const serverErrors = useMemo(() => fieldErrors(mutation.error), [mutation.error])
    const errors = { ...serverErrors, ...localErrors }
    const generalError =
        mutation.error && Object.keys(serverErrors).length === 0 ? errorMessage(mutation.error) : null

    const handleTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
        setLocalErrors((prev) => (prev.title ? { ...prev, title: '' } : prev))
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = title.trim()

        if (!trimmed) {
            setLocalErrors({ title: t('departments:form.titleRequired') })
            return
        }
        if (trimmed.length > TITLE_MAX) {
            setLocalErrors({ title: t('departments:form.titleTooLong') })
            return
        }
        setLocalErrors({})

        if (!department) {
            const payload: DepartmentPayload = { title: trimmed, sections: sectionIds, image: file }
            create.mutate(payload, { onSuccess: () => onSaved('created') })
            return
        }

        const payload: DepartmentPayload = {}
        if (trimmed !== department.title) payload.title = trimmed
        if (file) payload.image = file
        else if (removeImage) payload.removeImage = true
        if (!sameIds(sectionIds, initialSectionIds)) payload.sections = sectionIds

        if (Object.keys(payload).length === 0) {
            onOpenChange(false)
            return
        }
        update.mutate({ id: department.id, payload }, { onSuccess: () => onSaved('updated') })
    }

    return (
        <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        {t(isEdit ? 'departments:form.editTitle' : 'departments:form.createTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {t(isEdit ? 'departments:form.editDescription' : 'departments:form.createDescription')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <DepartmentFormField
                        label={t('departments:form.title')}
                        htmlFor="department-title"
                        error={errors.title}
                    >
                        <Input
                            id="department-title"
                            value={title}
                            onChange={handleTitle}
                            placeholder={t('departments:form.titlePlaceholder')}
                            maxLength={TITLE_MAX}
                            disabled={isPending}
                            autoFocus
                        />
                    </DepartmentFormField>

                    <DepartmentFormField label={t('departments:form.image')} error={errors.image}>
                        <DepartmentImageField
                            currentSrc={department?.image_url ?? department?.image ?? null}
                            file={file}
                            removed={removeImage}
                            onFileChange={setFile}
                            onRemoveChange={setRemoveImage}
                            disabled={isPending}
                        />
                    </DepartmentFormField>

                    <DepartmentFormField
                        label={t('departments:form.sections')}
                        hint={t('departments:form.sectionsHint')}
                        error={errors.sections}
                    >
                        <DepartmentSectionsPicker
                            selectedIds={sectionIds}
                            onChange={setSectionIds}
                            extraOptions={ownSections}
                            disabled={isPending}
                        />
                    </DepartmentFormField>

                    {generalError && <p className="text-sm text-destructive">{generalError}</p>}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            {t('common:actions.cancel')}
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                            {t(isEdit ? 'departments:form.save' : 'departments:form.create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default memo(DepartmentFormDialog)
