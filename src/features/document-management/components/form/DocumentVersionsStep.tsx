import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import VersionRow from './VersionRow'
import { formErrorText } from './formErrorText'
import { MAX_VERSIONS, type FormErrors, type VersionDraft } from '../../utils/documentForm'

interface DocumentVersionsStepProps {
    versions: VersionDraft[]
    errors: FormErrors
    onAdd: () => void
    onPatch: (key: string, patch: Partial<VersionDraft>) => void
    onRemove: (key: string) => void
    disabled?: boolean
}

/** Step 4 (create only): zero or more version rows, each with its own upload. */
function DocumentVersionsStep({ versions, errors, onAdd, onPatch, onRemove, disabled }: DocumentVersionsStepProps) {
    const { t } = useTranslation('management')
    const general = formErrorText(t, errors.versions)

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{t('form.versionsHint')}</p>
            {general && <p role="alert" className="text-sm text-destructive">{general}</p>}

            {versions.length === 0 && (
                <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                    {t('form.noVersions')}
                </p>
            )}

            {versions.map((draft, i) => (
                <VersionRow key={draft.key} draft={draft} index={i} errors={errors} disabled={disabled} onPatch={onPatch} onRemove={onRemove} />
            ))}

            <Button type="button" variant="outline" onClick={onAdd} disabled={disabled || versions.length >= MAX_VERSIONS}>
                <Plus className="h-4 w-4" />
                {t('form.addVersion')}
            </Button>
        </div>
    )
}

export default memo(DocumentVersionsStep)
