import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Landmark } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import DepartmentImageField from '@/features/departments/components/DepartmentImageField'
import { errorMessage, toApiError } from '@/features/departments/utils/departmentErrors'
import EntityTitleTabs from './EntityTitleTabs'
import { useCreateEntity, useUpdateEntity } from '../hooks/useSaveEntity'
import { mapEntityErrors, ENTITY_TITLE_MAX } from '../utils/entityPayload'
import { ENTITY_LOCALES, type DocumentEntity, type EntityLocale, type EntityPayload } from '../types/entity.types'

type Titles = Record<EntityLocale, string>

interface EntityFormDialogProps {
    /** `null` = create mode. */
    entity: DocumentEntity | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSaved: (mode: 'created' | 'updated') => void
}

/**
 * Create / edit form. Parent keys it by entity id (or "new") so a new target
 * remounts it with fresh state. Edit sends only the languages that changed.
 */
function EntityFormDialog({ entity, open, onOpenChange, onSaved }: EntityFormDialogProps) {
    const { t } = useTranslation(['entities', 'common'])
    const isEdit = !!entity

    const initial = useMemo<Titles>(
        () => ({ en: entity?.translations?.en?.title ?? '', ar: entity?.translations?.ar?.title ?? '' }),
        [entity],
    )

    const [titles, setTitles] = useState<Titles>(initial)
    const [activeLocale, setActiveLocale] = useState<EntityLocale>('en')
    const [file, setFile] = useState<File | null>(null)
    const [removeImage, setRemoveImage] = useState(false)
    const [localErrors, setLocalErrors] = useState<Partial<Record<EntityLocale, string>>>({})

    const create = useCreateEntity()
    const update = useUpdateEntity()
    const mutation = isEdit ? update : create
    const isPending = mutation.isPending

    const server = useMemo(() => mapEntityErrors(toApiError(mutation.error)?.errors), [mutation.error])
    const titleErrors = { ...server.titles, ...localErrors }
    const hasFieldErrors =
        Object.keys(server.titles).length > 0 || !!server.image || !!server.translations || !!server.unsupported
    const generalError =
        server.translations ?? server.unsupported ?? (mutation.error && !hasFieldErrors ? errorMessage(mutation.error) : null)

    const handleTitleChange = useCallback((locale: EntityLocale, value: string) => {
        setTitles((prev) => ({ ...prev, [locale]: value }))
        setLocalErrors((prev) => (prev[locale] ? { ...prev, [locale]: undefined } : prev))
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const trimmed = { en: titles.en.trim(), ar: titles.ar.trim() }
        const errs: Partial<Record<EntityLocale, string>> = {}
        for (const lang of ENTITY_LOCALES) {
            if (!trimmed[lang]) errs[lang] = t('entities:form.titleRequired')
            else if (trimmed[lang].length > ENTITY_TITLE_MAX) errs[lang] = t('entities:form.titleTooLong')
        }
        setLocalErrors(errs)
        const firstBad = ENTITY_LOCALES.find((l) => errs[l])
        if (firstBad) {
            setActiveLocale(firstBad)
            return
        }

        if (!entity) {
            const payload: EntityPayload = { titles: trimmed, image: file }
            create.mutate(payload, { onSuccess: () => onSaved('created') })
            return
        }

        const changed: Partial<Titles> = {}
        for (const lang of ENTITY_LOCALES) if (trimmed[lang] !== initial[lang]) changed[lang] = trimmed[lang]

        const payload: EntityPayload = {}
        if (Object.keys(changed).length) payload.titles = changed
        if (file) payload.image = file
        else if (removeImage) payload.removeImage = true

        if (Object.keys(payload).length === 0) {
            onOpenChange(false)
            return
        }
        update.mutate(
            { id: entity.id, payload },
            {
                onSuccess: () => onSaved('updated'),
                onError: (err) => {
                    const bad = ENTITY_LOCALES.find((l) => mapEntityErrors(toApiError(err)?.errors).titles[l])
                    if (bad) setActiveLocale(bad)
                },
            },
        )
    }

    return (
        <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Landmark className="h-5 w-5 text-primary" />
                        {t(isEdit ? 'entities:form.editTitle' : 'entities:form.createTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {t(isEdit ? 'entities:form.editDescription' : 'entities:form.createDescription')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <EntityTitleTabs
                        titles={titles}
                        errors={titleErrors}
                        activeLocale={activeLocale}
                        onActiveChange={setActiveLocale}
                        onTitleChange={handleTitleChange}
                        disabled={isPending}
                    />

                    <DepartmentFormField label={t('entities:form.image')} error={server.image}>
                        <DepartmentImageField
                            currentSrc={entity?.image_url ?? entity?.image ?? null}
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
                            {t(isEdit ? 'entities:form.save' : 'entities:form.create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default memo(EntityFormDialog)
