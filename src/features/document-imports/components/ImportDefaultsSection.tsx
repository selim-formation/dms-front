import { memo, useId, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import DepartmentFilterSelect from '@/features/departments/components/DepartmentFilterSelect'
import {
    ImportDepartmentsPicker,
    ImportEntitiesPicker,
    ImportSectionsPicker,
    ImportTypesPicker,
} from './ImportDefaultPickers'
import type { ImportCategory, ImportImportance } from '../types/import.types'

export interface ImportDefaultsValue {
    department_ids: number[]
    section_ids: number[]
    type_ids: number[]
    entity_ids: number[]
    category: ImportCategory | ''
    importance: ImportImportance | ''
}

const CATEGORIES: ImportCategory[] = ['establishment', 'operational']
const IMPORTANCES: ImportImportance[] = ['low', 'medium', 'high', 'critical', 'informational', 'archival']

interface ImportDefaultsSectionProps {
    value: ImportDefaultsValue
    onIdsChange: (field: string, ids: number[]) => void
    onCategoryChange: (v: ImportCategory | '') => void
    onImportanceChange: (v: ImportImportance | '') => void
    error?: string
    disabled?: boolean
}

/** Collapsible defaults for rows that don't name their own. Lookups load only once opened. */
function ImportDefaultsSection({ value, onIdsChange, onCategoryChange, onImportanceChange, error, disabled }: ImportDefaultsSectionProps) {
    const { t } = useTranslation('imports')
    const [open, setOpen] = useState(false)
    const panelId = useId()
    const categoryOptions = useMemo(
        () => [{ value: '' as const, label: t('form.none') }, ...CATEGORIES.map((v) => ({ value: v, label: t(`category.${v}`) }))],
        [t],
    )
    const importanceOptions = useMemo(
        () => [{ value: '' as const, label: t('form.none') }, ...IMPORTANCES.map((v) => ({ value: v, label: t(`importance.${v}`) }))],
        [t],
    )
    const count =
        value.department_ids.length + value.section_ids.length + value.type_ids.length + value.entity_ids.length +
        (value.category ? 1 : 0) + (value.importance ? 1 : 0)

    return (
        <div className="rounded-xl border border-border">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <span>
                    <span className="block text-sm font-medium text-foreground">
                        {t('form.defaults')}
                        {count > 0 && <span className="ms-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{count}</span>}
                    </span>
                    <span className="block text-xs text-muted-foreground">{t('form.defaultsHint')}</span>
                </span>
                <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
            </button>

            {open && (
                <div id={panelId} className="space-y-4 border-t border-border p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <ImportDepartmentsPicker selectedIds={value.department_ids} onChange={onIdsChange} disabled={disabled} />
                        <ImportSectionsPicker selectedIds={value.section_ids} onChange={onIdsChange} disabled={disabled} />
                        <ImportTypesPicker selectedIds={value.type_ids} onChange={onIdsChange} disabled={disabled} />
                        <ImportEntitiesPicker selectedIds={value.entity_ids} onChange={onIdsChange} disabled={disabled} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <DepartmentFormField label={t('form.category')}>
                            <DepartmentFilterSelect label={t('form.category')} value={value.category} options={categoryOptions} onChange={onCategoryChange} />
                        </DepartmentFormField>
                        <DepartmentFormField label={t('form.importance')}>
                            <DepartmentFilterSelect label={t('form.importance')} value={value.importance} options={importanceOptions} onChange={onImportanceChange} />
                        </DepartmentFormField>
                    </div>
                </div>
            )}
            {error && <p className="px-4 pb-3 text-sm text-destructive">{error}</p>}
        </div>
    )
}

export default memo(ImportDefaultsSection)
