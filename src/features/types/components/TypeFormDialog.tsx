import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Tag } from 'lucide-react'
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
import TypeTitleTabs from './TypeTitleTabs'
import { useCreateType, useUpdateType } from '../hooks/useSaveType'
import { mapTypeErrors, TYPE_TITLE_MAX } from '../utils/typePayload'
import { TYPE_LOCALES, type DocumentType, type TypeLocale, type TypePayload } from '../types/type.types'

type Titles = Record<TypeLocale, string>

interface TypeFormDialogProps {
    /** `null` = create mode. */
    type: DocumentType | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSaved: (mode: 'created' | 'updated') => void
}

/**
 * Create / edit form. Parent keys it by type id (or "new") so a new target
 * remounts it with fresh state. Edit sends only the languages that changed.
 */
function TypeFormDialog({ type, open, onOpenChange, onSaved }: TypeFormDialogProps) {
    const { t } = useTranslation(['types', 'common'])
    const isEdit = !!type

    const initial = useMemo<Titles>(
        () => ({ en: type?.translations?.en?.title ?? '', ar: type?.translations?.ar?.title ?? '' }),
        [type],
    )

    const [titles, setTitles] = useState<Titles>(initial)
    const [activeLocale, setActiveLocale] = useState<TypeLocale>('en')
    const [file, setFile] = useState<File | null>(null)
    const [removeImage, setRemoveImage] = useState(false)
    const [localErrors, setLocalErrors] = useState<Partial<Record<TypeLocale, string>>>({})

    const create = useCreateType()
    const update = useUpdateType()
    const mutation = isEdit ? update : create
    const isPending = mutation.isPending

    const server = useMemo(() => mapTypeErrors(toApiError(mutation.error)?.errors), [mutation.error])
    const titleErrors = { ...server.titles, ...localErrors }
    const hasFieldErrors =
        Object.keys(server.titles).length > 0 || !!server.image || !!server.translations || !!server.unsupported
    const generalError =
        server.translations ?? server.unsupported ?? (mutation.error && !hasFieldErrors ? errorMessage(mutation.error) : null)

    const handleTitleChange = useCallback((locale: TypeLocale, value: string) => {
        setTitles((prev) => ({ ...prev, [locale]: value }))
        setLocalErrors((prev) => (prev[locale] ? { ...prev, [locale]: undefined } : prev))
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const trimmed = { en: titles.en.trim(), ar: titles.ar.trim() }
        const errs: Partial<Record<TypeLocale, string>> = {}
        for (const lang of TYPE_LOCALES) {
            if (!trimmed[lang]) errs[lang] = t('types:form.titleRequired')
            else if (trimmed[lang].length > TYPE_TITLE_MAX) errs[lang] = t('types:form.titleTooLong')
        }
        setLocalErrors(errs)
        const firstBad = TYPE_LOCALES.find((l) => errs[l])
        if (firstBad) {
            setActiveLocale(firstBad)
            return
        }

        if (!type) {
            const payload: TypePayload = { titles: trimmed, image: file }
            create.mutate(payload, { onSuccess: () => onSaved('created') })
            return
        }

        const changed: Partial<Titles> = {}
        for (const lang of TYPE_LOCALES) if (trimmed[lang] !== initial[lang]) changed[lang] = trimmed[lang]

        const payload: TypePayload = {}
        if (Object.keys(changed).length) payload.titles = changed
        if (file) payload.image = file
        else if (removeImage) payload.removeImage = true

        if (Object.keys(payload).length === 0) {
            onOpenChange(false)
            return
        }
        update.mutate(
            { id: type.id, payload },
            {
                onSuccess: () => onSaved('updated'),
                onError: (err) => {
                    const bad = TYPE_LOCALES.find((l) => mapTypeErrors(toApiError(err)?.errors).titles[l])
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
                        <Tag className="h-5 w-5 text-primary" />
                        {t(isEdit ? 'types:form.editTitle' : 'types:form.createTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {t(isEdit ? 'types:form.editDescription' : 'types:form.createDescription')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <TypeTitleTabs
                        titles={titles}
                        errors={titleErrors}
                        activeLocale={activeLocale}
                        onActiveChange={setActiveLocale}
                        onTitleChange={handleTitleChange}
                        disabled={isPending}
                    />

                    <DepartmentFormField label={t('types:form.image')} error={server.image}>
                        <DepartmentImageField
                            currentSrc={type?.image_url ?? type?.image ?? null}
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
                            {t(isEdit ? 'types:form.save' : 'types:form.create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default memo(TypeFormDialog)
