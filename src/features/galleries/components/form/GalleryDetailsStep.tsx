import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/components/ui/input'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import DepartmentFilterSelect from '@/features/departments/components/DepartmentFilterSelect'
import { formErrorText } from './formErrorText'
import { GALLERY_TYPES } from '../../utils/galleryPayload'
import { DESCRIPTION_MAX, MANAGER_MAX, NAME_MAX, type FormErrors, type GalleryFormValues } from '../../utils/galleryForm'

interface GalleryDetailsStepProps {
    values: GalleryFormValues
    errors: FormErrors
    onChange: <F extends keyof GalleryFormValues>(field: F, value: GalleryFormValues[F]) => void
    disabled?: boolean
}

/** Step 1: name, type, description, manager, period. */
function GalleryDetailsStep({ values, errors, onChange, disabled }: GalleryDetailsStepProps) {
    const { t } = useTranslation('galleries')
    const typeOptions = useMemo(
        () => [{ value: '' as const, label: t('form.choose') }, ...GALLERY_TYPES.map((v) => ({ value: v, label: t(`type.${v}`) }))],
        [t],
    )

    return (
        <div className="space-y-5">
            <DepartmentFormField label={t('form.name')} htmlFor="gal-name" error={formErrorText(t, errors.name)}>
                <Input id="gal-name" value={values.name} onChange={(e) => onChange('name', e.target.value)} placeholder={t('form.namePlaceholder')} maxLength={NAME_MAX} disabled={disabled} autoFocus dir="auto" />
            </DepartmentFormField>

            <div className="grid gap-5 sm:grid-cols-2">
                <DepartmentFormField label={t('form.type')} error={formErrorText(t, errors.type)}>
                    <DepartmentFilterSelect label={t('form.type')} value={values.type} options={typeOptions} onChange={(v) => onChange('type', v)} />
                </DepartmentFormField>
                <DepartmentFormField label={t('form.period')} htmlFor="gal-period" hint={t('form.periodHint')} error={formErrorText(t, errors.time_period)}>
                    <Input id="gal-period" type="date" value={values.time_period} onChange={(e) => onChange('time_period', e.target.value)} disabled={disabled} />
                </DepartmentFormField>
            </div>

            <DepartmentFormField label={t('form.manager')} htmlFor="gal-manager" error={formErrorText(t, errors.manager_name)}>
                <Input id="gal-manager" value={values.manager_name} onChange={(e) => onChange('manager_name', e.target.value)} placeholder={t('form.managerPlaceholder')} maxLength={MANAGER_MAX} disabled={disabled} dir="auto" />
            </DepartmentFormField>

            <DepartmentFormField label={t('form.description')} htmlFor="gal-desc" hint={t('form.descriptionHint', { count: values.description.length, max: DESCRIPTION_MAX })} error={formErrorText(t, errors.description)}>
                <textarea
                    id="gal-desc"
                    value={values.description}
                    onChange={(e) => onChange('description', e.target.value)}
                    placeholder={t('form.descriptionPlaceholder')}
                    maxLength={DESCRIPTION_MAX}
                    rows={4}
                    disabled={disabled}
                    dir="auto"
                    className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                />
            </DepartmentFormField>
        </div>
    )
}

export default memo(GalleryDetailsStep)
