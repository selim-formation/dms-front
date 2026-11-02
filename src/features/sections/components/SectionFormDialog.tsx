import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Layers, Loader2 } from 'lucide-react'
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
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import DepartmentImageField from '@/features/departments/components/DepartmentImageField'
import { errorMessage, fieldErrors } from '@/features/departments/utils/departmentErrors'
import SectionDepartmentSelect from './SectionDepartmentSelect'
import SectionDescriptionField from './SectionDescriptionField'
import { useCreateSection, useUpdateSection } from '../hooks/useSaveSection'
import { SECTION_DESCRIPTION_MAX, SECTION_NAME_MAX } from '../utils/sectionPayload'
import type { Section, SectionPayload } from '../types/section.types'

interface SectionFormDialogProps {
    /** `null` = create mode. */
    section: Section | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSaved: (mode: 'created' | 'updated') => void
}

/**
 * Create / edit form. Parent keys it by section id (or "new") so a new target
 * remounts it with fresh state. Edit sends only the fields that changed.
 */
function SectionFormDialog({ section, open, onOpenChange, onSaved }: SectionFormDialogProps) {
    const { t } = useTranslation(['sections', 'common'])
    const isEdit = !!section

    const [name, setName] = useState(section?.name ?? '')
    const [departmentId, setDepartmentId] = useState<number | null>(section?.department_id ?? null)
    const [description, setDescription] = useState(section?.description ?? '')
    const [file, setFile] = useState<File | null>(null)
    const [removeImage, setRemoveImage] = useState(false)
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

    const create = useCreateSection()
    const update = useUpdateSection()
    const mutation = isEdit ? update : create
    const isPending = mutation.isPending

    const serverErrors = useMemo(() => fieldErrors(mutation.error), [mutation.error])
    const errors = { ...serverErrors, ...localErrors }
    const generalError =
        mutation.error && Object.keys(serverErrors).length === 0 ? errorMessage(mutation.error) : null

    const clearError = useCallback(
        (field: string) => setLocalErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev)),
        [],
    )
    const handleName = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value); clearError('name') },
        [clearError],
    )
    const handleDepartment = useCallback(
        (id: number | null) => { setDepartmentId(id); clearError('department_id') },
        [clearError],
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const trimmedName = name.trim()
        const errs: Record<string, string> = {}
        if (!trimmedName) errs.name = t('sections:form.nameRequired')
        else if (trimmedName.length > SECTION_NAME_MAX) errs.name = t('sections:form.nameTooLong')
        if (departmentId === null) errs.department_id = t('sections:form.departmentRequired')
        if (description.length > SECTION_DESCRIPTION_MAX) errs.description = t('sections:form.descriptionTooLong')
        setLocalErrors(errs)
        if (Object.keys(errs).length || departmentId === null) return

        const trimmedDescription = description.trim()

        if (!section) {
            const payload: SectionPayload = { name: trimmedName, department_id: departmentId, image: file }
            if (trimmedDescription) payload.description = trimmedDescription
            create.mutate(payload, { onSuccess: () => onSaved('created') })
            return
        }

        const payload: SectionPayload = {}
        if (trimmedName !== section.name) payload.name = trimmedName
        if (departmentId !== section.department_id) payload.department_id = departmentId
        if (trimmedDescription !== (section.description ?? '')) payload.description = trimmedDescription || null
        if (file) payload.image = file
        else if (removeImage) payload.removeImage = true

        if (Object.keys(payload).length === 0) {
            onOpenChange(false)
            return
        }
        update.mutate({ id: section.id, payload }, { onSuccess: () => onSaved('updated') })
    }

    return (
        <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Layers className="h-5 w-5 text-primary" />
                        {t(isEdit ? 'sections:form.editTitle' : 'sections:form.createTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {t(isEdit ? 'sections:form.editDescription' : 'sections:form.createDescription')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <DepartmentFormField label={t('sections:form.name')} htmlFor="section-name" error={errors.name}>
                        <Input
                            id="section-name"
                            value={name}
                            onChange={handleName}
                            placeholder={t('sections:form.namePlaceholder')}
                            maxLength={SECTION_NAME_MAX}
                            disabled={isPending}
                            autoFocus
                        />
                    </DepartmentFormField>

                    <DepartmentFormField
                        label={t('sections:form.department')}
                        htmlFor="section-department"
                        error={errors.department_id}
                    >
                        <SectionDepartmentSelect
                            id="section-department"
                            value={departmentId}
                            onChange={handleDepartment}
                            fallback={section?.department}
                            invalid={!!errors.department_id}
                            disabled={isPending}
                        />
                    </DepartmentFormField>

                    <DepartmentFormField
                        label={t('sections:form.description')}
                        htmlFor="section-description"
                        error={errors.description}
                    >
                        <SectionDescriptionField
                            id="section-description"
                            value={description}
                            onChange={setDescription}
                            placeholder={t('sections:form.descriptionPlaceholder')}
                            invalid={!!errors.description}
                            disabled={isPending}
                        />
                    </DepartmentFormField>

                    <DepartmentFormField label={t('sections:form.image')} error={errors.image}>
                        <DepartmentImageField
                            currentSrc={section?.image_url ?? section?.image ?? null}
                            file={file}
                            removed={removeImage}
                            onFileChange={setFile}
                            onRemoveChange={setRemoveImage}
                            disabled={isPending}
                        />
                    </DepartmentFormField>

                    {generalError && <p className="text-sm text-destructive">{generalError}</p>}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                            {t('common:actions.cancel')}
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                            {t(isEdit ? 'sections:form.save' : 'sections:form.create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default memo(SectionFormDialog)
