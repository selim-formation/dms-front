import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FolderKanban, Loader2 } from 'lucide-react'
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
import { errorMessage, fieldErrors } from '@/features/departments/utils/departmentErrors'
import SectionDescriptionField from '@/features/sections/components/SectionDescriptionField'
import ProjectSelectField from './ProjectSelectField'
import ProjectFileField from './ProjectFileField'
import { useCreateProject, useUpdateProject } from '../hooks/useSaveProject'
import {
    PROJECT_CATEGORY_MAX,
    PROJECT_DESCRIPTION_MAX,
    PROJECT_DURATION_MAX,
    PROJECT_MANAGER_MAX,
    PROJECT_NAME_MAX,
} from '../utils/projectPayload'
import {
    DURATION_TYPES,
    PROJECT_STATUSES,
    PROJECT_TYPES,
    type DurationType,
    type Project,
    type ProjectPayload,
    type ProjectStatus,
    type ProjectType,
} from '../types/project.types'

interface FormState {
    name: string
    description: string
    status: ProjectStatus | null
    type: ProjectType | null
    category: string
    start_date: string
    end_date: string
    duration: string
    duration_type: DurationType | null
    manager_name: string
}

function initialState(project: Project | null): FormState {
    // Create mode pre-selects the same defaults as the admin form.
    return {
        name: project?.name ?? '',
        description: project?.description ?? '',
        status: project ? project.status : 'active',
        type: project ? project.type : 'internal',
        category: project?.category ?? '',
        start_date: project?.start_date ?? '',
        end_date: project?.end_date ?? '',
        duration: project?.duration != null ? String(project.duration) : '',
        duration_type: project ? project.duration_type : 'days',
        manager_name: project?.manager_name ?? '',
    }
}

const orNull = (v: string): string | null => (v.trim() === '' ? null : v.trim())

interface ProjectFormDialogProps {
    /** `null` = create mode. */
    project: Project | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSaved: (mode: 'created' | 'updated') => void
}

/**
 * Create / edit form. Parent keys it by project id (or "new") so a new target
 * remounts it with fresh state. Edit sends only the fields that changed
 * (`null` clears an optional field); the file can be replaced but not removed.
 */
function ProjectFormDialog({ project, open, onOpenChange, onSaved }: ProjectFormDialogProps) {
    const { t } = useTranslation(['projects', 'common'])
    const isEdit = !!project

    const initial = useMemo(() => initialState(project), [project])
    const [form, setForm] = useState<FormState>(initial)
    const [file, setFile] = useState<File | null>(null)
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

    const create = useCreateProject()
    const update = useUpdateProject()
    const mutation = isEdit ? update : create
    const isPending = mutation.isPending

    const serverErrors = useMemo(() => fieldErrors(mutation.error), [mutation.error])
    const errors = { ...serverErrors, ...localErrors }
    const generalError =
        mutation.error && Object.keys(serverErrors).length === 0 ? errorMessage(mutation.error) : null

    const set = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }))
        setLocalErrors((prev) => (prev[key] ? { ...prev, [key]: '' } : prev))
    }, [])

    const handleFile = useCallback((f: File | null) => {
        setFile(f)
        setLocalErrors((prev) => (prev.project_file ? { ...prev, project_file: '' } : prev))
    }, [])

    const statusOptions = useMemo(() => PROJECT_STATUSES.map((v) => ({ value: v, label: t(`projects:status.${v}`) })), [t])
    const typeOptions = useMemo(() => PROJECT_TYPES.map((v) => ({ value: v, label: t(`projects:type.${v}`) })), [t])
    const durationOptions = useMemo(
        () => DURATION_TYPES.map((v) => ({ value: v, label: t(`projects:durationType.${v}`) })),
        [t],
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const name = form.name.trim()
        const errs: Record<string, string> = {}
        if (!name) errs.name = t('projects:form.nameRequired')
        else if (name.length > PROJECT_NAME_MAX) errs.name = t('projects:form.nameTooLong')
        if (form.description.length > PROJECT_DESCRIPTION_MAX) errs.description = t('projects:form.descriptionTooLong')
        if (form.category.trim().length > PROJECT_CATEGORY_MAX) errs.category = t('projects:form.categoryTooLong')
        if (form.manager_name.trim().length > PROJECT_MANAGER_MAX) errs.manager_name = t('projects:form.managerTooLong')
        const durationText = form.duration.trim()
        let duration: number | null = null
        if (durationText) {
            duration = Number(durationText)
            if (!/^\d+$/.test(durationText) || duration < 1 || duration > PROJECT_DURATION_MAX) {
                errs.duration = t('projects:form.durationInvalid')
            }
        }
        if (!isEdit && !file) errs.project_file = t('projects:form.fileRequired')
        setLocalErrors(errs)
        if (Object.keys(errs).length) return

        const next = {
            description: orNull(form.description),
            status: form.status,
            type: form.type,
            category: orNull(form.category),
            start_date: orNull(form.start_date),
            end_date: orNull(form.end_date),
            duration,
            duration_type: form.duration_type,
            manager_name: orNull(form.manager_name),
        }

        if (!project) {
            // Create: omit empty optionals; selects send null (empty) only when cleared.
            const payload: ProjectPayload = { name, project_file: file ?? undefined, status: next.status, type: next.type, duration_type: next.duration_type }
            if (next.description !== null) payload.description = next.description
            if (next.category !== null) payload.category = next.category
            if (next.start_date !== null) payload.start_date = next.start_date
            if (next.end_date !== null) payload.end_date = next.end_date
            if (next.duration !== null) payload.duration = next.duration
            if (next.manager_name !== null) payload.manager_name = next.manager_name
            create.mutate(payload, { onSuccess: () => onSaved('created') })
            return
        }

        const payload: ProjectPayload = {}
        if (name !== project.name) payload.name = name
        const original = {
            description: project.description ?? null,
            status: project.status,
            type: project.type,
            category: project.category ?? null,
            start_date: project.start_date,
            end_date: project.end_date,
            duration: project.duration,
            duration_type: project.duration_type,
            manager_name: project.manager_name ?? null,
        }
        for (const key of Object.keys(next) as (keyof typeof next)[]) {
            if (next[key] !== original[key]) (payload as Record<string, unknown>)[key] = next[key]
        }
        if (file) payload.project_file = file

        if (Object.keys(payload).length === 0) {
            onOpenChange(false)
            return
        }
        update.mutate({ id: project.id, payload }, { onSuccess: () => onSaved('updated') })
    }

    return (
        <Dialog open={open} onOpenChange={(next: boolean) => !isPending && onOpenChange(next)}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FolderKanban className="h-5 w-5 text-primary" />
                        {t(isEdit ? 'projects:form.editTitle' : 'projects:form.createTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {t(isEdit ? 'projects:form.editDescription' : 'projects:form.createDescription')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <DepartmentFormField label={t('projects:form.name')} htmlFor="project-name" error={errors.name}>
                        <Input
                            id="project-name"
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                            placeholder={t('projects:form.namePlaceholder')}
                            maxLength={PROJECT_NAME_MAX}
                            disabled={isPending}
                            autoFocus
                        />
                    </DepartmentFormField>

                    <DepartmentFormField
                        label={t('projects:form.description')}
                        htmlFor="project-description"
                        error={errors.description}
                    >
                        <SectionDescriptionField
                            id="project-description"
                            value={form.description}
                            onChange={(v) => set('description', v)}
                            placeholder={t('projects:form.descriptionPlaceholder')}
                            invalid={!!errors.description}
                            disabled={isPending}
                        />
                    </DepartmentFormField>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <DepartmentFormField label={t('projects:form.status')} htmlFor="project-status" error={errors.status}>
                            <ProjectSelectField
                                id="project-status"
                                value={form.status}
                                options={statusOptions}
                                onChange={(v) => set('status', v)}
                                invalid={!!errors.status}
                                disabled={isPending}
                            />
                        </DepartmentFormField>
                        <DepartmentFormField label={t('projects:form.type')} htmlFor="project-type" error={errors.type}>
                            <ProjectSelectField
                                id="project-type"
                                value={form.type}
                                options={typeOptions}
                                onChange={(v) => set('type', v)}
                                invalid={!!errors.type}
                                disabled={isPending}
                            />
                        </DepartmentFormField>
                        <DepartmentFormField label={t('projects:form.category')} htmlFor="project-category" error={errors.category}>
                            <Input
                                id="project-category"
                                value={form.category}
                                onChange={(e) => set('category', e.target.value)}
                                maxLength={PROJECT_CATEGORY_MAX}
                                disabled={isPending}
                            />
                        </DepartmentFormField>
                        <DepartmentFormField label={t('projects:form.manager')} htmlFor="project-manager" error={errors.manager_name}>
                            <Input
                                id="project-manager"
                                value={form.manager_name}
                                onChange={(e) => set('manager_name', e.target.value)}
                                maxLength={PROJECT_MANAGER_MAX}
                                disabled={isPending}
                            />
                        </DepartmentFormField>
                        <DepartmentFormField label={t('projects:form.startDate')} htmlFor="project-start" error={errors.start_date}>
                            <Input
                                id="project-start"
                                type="date"
                                value={form.start_date}
                                onChange={(e) => set('start_date', e.target.value)}
                                disabled={isPending}
                            />
                        </DepartmentFormField>
                        <DepartmentFormField label={t('projects:form.endDate')} htmlFor="project-end" error={errors.end_date}>
                            <Input
                                id="project-end"
                                type="date"
                                value={form.end_date}
                                onChange={(e) => set('end_date', e.target.value)}
                                disabled={isPending}
                            />
                        </DepartmentFormField>
                        <DepartmentFormField label={t('projects:form.duration')} htmlFor="project-duration" error={errors.duration}>
                            <Input
                                id="project-duration"
                                type="number"
                                inputMode="numeric"
                                min={1}
                                step={1}
                                value={form.duration}
                                onChange={(e) => set('duration', e.target.value)}
                                disabled={isPending}
                            />
                        </DepartmentFormField>
                        <DepartmentFormField
                            label={t('projects:form.durationType')}
                            htmlFor="project-duration-type"
                            error={errors.duration_type}
                        >
                            <ProjectSelectField
                                id="project-duration-type"
                                value={form.duration_type}
                                options={durationOptions}
                                onChange={(v) => set('duration_type', v)}
                                invalid={!!errors.duration_type}
                                disabled={isPending}
                            />
                        </DepartmentFormField>
                    </div>

                    <DepartmentFormField label={t('projects:form.file')} error={undefined}>
                        <ProjectFileField
                            file={file}
                            onFileChange={handleFile}
                            currentUrl={project?.project_file}
                            error={errors.project_file}
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
                            {t(isEdit ? 'projects:form.save' : 'projects:form.create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default memo(ProjectFormDialog)
