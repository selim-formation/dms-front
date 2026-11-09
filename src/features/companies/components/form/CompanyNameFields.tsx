import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { TriangleAlert } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import CompanyCopyButton from '../CompanyCopyButton'
import { COMPANY_NAME_MAX, COMPANY_SLUG_MAX } from '../../utils/companyPayload'

interface CompanyNameFieldsProps {
    /** Edit: name / slug / id are shown read-only (they never change after creation). */
    readOnly: boolean
    name: string
    slug: string
    id: string
    errors: { name?: string; slug?: string; id?: string }
    disabled: boolean
    onNameChange: (value: string) => void
    onSlugChange: (value: string) => void
    onIdChange: (value: string) => void
}

function ReadOnlyValue({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
    return (
        <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">{label}</p>
            <div className="flex h-10 items-center justify-between gap-2 rounded-md border border-dashed border-border bg-muted/40 px-3 text-sm text-foreground">
                <span className="truncate" dir={ltr ? 'ltr' : 'auto'}>{value}</span>
                {ltr && <CompanyCopyButton value={value} />}
            </div>
        </div>
    )
}

/** Name first; slug and id follow it while typing (editable until saved). */
function CompanyNameFields({ readOnly, name, slug, id, errors, disabled, onNameChange, onSlugChange, onIdChange }: CompanyNameFieldsProps) {
    const { t } = useTranslation('companies')

    if (readOnly) {
        return (
            <div className="space-y-3">
                <div className="grid gap-4 sm:grid-cols-3">
                    <ReadOnlyValue label={t('form.name')} value={name} />
                    <ReadOnlyValue label={t('form.slug')} value={slug} ltr />
                    <ReadOnlyValue label={t('form.systemId')} value={id} ltr />
                </div>
                <p className="text-xs text-muted-foreground">{t('form.lockedHint')}</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <DepartmentFormField label={t('form.name')} htmlFor="company-name" error={errors.name}>
                <Input
                    id="company-name"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder={t('form.namePlaceholder')}
                    maxLength={COMPANY_NAME_MAX}
                    disabled={disabled}
                    autoComplete="off"
                    autoFocus
                    dir="auto"
                />
            </DepartmentFormField>

            <div className="grid gap-4 sm:grid-cols-2">
                <DepartmentFormField label={t('form.slug')} htmlFor="company-slug" hint={t('form.slugHint')} error={errors.slug}>
                    <Input
                        id="company-slug"
                        value={slug}
                        onChange={(e) => onSlugChange(e.target.value)}
                        placeholder="nile-trading"
                        maxLength={COMPANY_SLUG_MAX}
                        disabled={disabled}
                        autoComplete="off"
                        dir="ltr"
                    />
                </DepartmentFormField>
                <DepartmentFormField label={t('form.systemId')} htmlFor="company-id" hint={t('form.systemIdHint')} error={errors.id}>
                    <Input
                        id="company-id"
                        value={id}
                        onChange={(e) => onIdChange(e.target.value)}
                        placeholder="nile-trading"
                        maxLength={COMPANY_SLUG_MAX}
                        disabled={disabled}
                        autoComplete="off"
                        dir="ltr"
                    />
                </DepartmentFormField>
            </div>

            <p className="flex items-start gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
                <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {t('form.idWarning')}
            </p>
        </div>
    )
}

export default memo(CompanyNameFields)
