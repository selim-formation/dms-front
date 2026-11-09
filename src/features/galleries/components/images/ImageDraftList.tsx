import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import ImageDraftRow from './ImageDraftRow'
import { errorsOfDraft, type FormErrors, type ImageDraft } from '../../utils/galleryForm'
import { MAX_NEW_IMAGES } from '../../utils/galleryPayload'

interface ImageDraftListProps {
    drafts: ImageDraft[]
    errors: FormErrors
    disabled?: boolean
    onAdd: () => void
    onPatch: (key: string, patch: Partial<ImageDraft>) => void
    onRemove: (key: string) => void
}

/** Add / remove picture rows. Shared by the create wizard and the "add images" dialog. */
function ImageDraftList({ drafts, errors, disabled, onAdd, onPatch, onRemove }: ImageDraftListProps) {
    const { t } = useTranslation('galleries')
    const full = drafts.length >= MAX_NEW_IMAGES

    return (
        <div className="space-y-4">
            {drafts.length === 0 && <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">{t('form.noImagesYet')}</p>}
            {drafts.map((d, i) => (
                <ImageDraftRow
                    key={d.key}
                    draft={d}
                    index={i}
                    errors={errorsOfDraft(errors, i)}
                    disabled={disabled}
                    onPatch={onPatch}
                    onRemove={onRemove}
                />
            ))}
            <Button type="button" variant="outline" onClick={onAdd} disabled={disabled || full}>
                <Plus className="h-4 w-4" />
                {full ? t('form.imagesLimit', { max: MAX_NEW_IMAGES }) : t('form.addImage')}
            </Button>
        </div>
    )
}

export default memo(ImageDraftList)
