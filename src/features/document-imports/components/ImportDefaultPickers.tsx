import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartments } from '@/core/reference-data/hooks/useDepartments'
import { useSections } from '@/core/reference-data/hooks/useSections'
import { useTypes } from '@/core/reference-data/hooks/useTypes'
import { useEntities } from '@/core/reference-data/hooks/useEntities'
import ImportReferencePicker, { type PickerOption } from './ImportReferencePicker'
import type { ReferenceItem } from '@/core/reference-data/types/referenceData.types'

interface PickerProps {
    selectedIds: number[]
    onChange: (field: string, ids: number[]) => void
    disabled?: boolean
}

function toOptions(items: ReferenceItem[]): PickerOption[] {
    return items
        .map((i) => ({ id: i.id, name: i.name ?? i.title }))
        .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Thin adapters: each calls its cached lookup hook (30 min, one request per
 * tenant) and feeds the shared picker. Mounted only when "defaults" is open.
 */
export const ImportDepartmentsPicker = memo(function ImportDepartmentsPicker(p: PickerProps) {
    const { t } = useTranslation('imports')
    const { departments, isLoading } = useDepartments()
    const options = useMemo(() => toOptions(departments), [departments])
    return <ImportReferencePicker field="department_ids" label={t('form.departments')} options={options} isLoading={isLoading} {...p} />
})

export const ImportSectionsPicker = memo(function ImportSectionsPicker(p: PickerProps) {
    const { t } = useTranslation('imports')
    const { sections, isLoading } = useSections()
    const options = useMemo(() => toOptions(sections), [sections])
    return <ImportReferencePicker field="section_ids" label={t('form.sections')} options={options} isLoading={isLoading} {...p} />
})

export const ImportTypesPicker = memo(function ImportTypesPicker(p: PickerProps) {
    const { t } = useTranslation('imports')
    const { types, isLoading } = useTypes()
    const options = useMemo(() => toOptions(types), [types])
    return <ImportReferencePicker field="type_ids" label={t('form.types')} options={options} isLoading={isLoading} {...p} />
})

export const ImportEntitiesPicker = memo(function ImportEntitiesPicker(p: PickerProps) {
    const { t } = useTranslation('imports')
    const { entities, isLoading } = useEntities()
    const options = useMemo(() => toOptions(entities), [entities])
    return <ImportReferencePicker field="entity_ids" label={t('form.entities')} options={options} isLoading={isLoading} {...p} />
})
