import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartments } from '@/core/reference-data/hooks/useDepartments'
import { useSections } from '@/core/reference-data/hooks/useSections'
import { useTypes } from '@/core/reference-data/hooks/useTypes'
import { useEntities } from '@/core/reference-data/hooks/useEntities'
import ImportReferencePicker from '@/features/document-imports/components/ImportReferencePicker'
import { toPickerOptions } from './pickerOptions'
import type { ReferenceItem } from '@/core/reference-data/types/referenceData.types'

interface PickerProps {
    selectedIds: number[]
    onChange: (field: string, ids: number[]) => void
    disabled?: boolean
}


/** Cached lookups (one request per tenant) feeding the shared checkbox picker. */
export const TypesPicker = memo(function TypesPicker(p: PickerProps) {
    const { t } = useTranslation('management')
    const { types, isLoading } = useTypes()
    const options = useMemo(() => toPickerOptions(types), [types])
    return <ImportReferencePicker field="types" label={t('form.types')} options={options} isLoading={isLoading} {...p} />
})

export const DepartmentsPicker = memo(function DepartmentsPicker(p: PickerProps) {
    const { t } = useTranslation('management')
    const { departments, isLoading } = useDepartments()
    const options = useMemo(() => toPickerOptions(departments), [departments])
    return <ImportReferencePicker field="departments" label={t('form.departments')} options={options} isLoading={isLoading} {...p} />
})

export const EntitiesPicker = memo(function EntitiesPicker(p: PickerProps) {
    const { t } = useTranslation('management')
    const { entities, isLoading } = useEntities()
    const options = useMemo(() => toPickerOptions(entities), [entities])
    return <ImportReferencePicker field="entities" label={t('form.entities')} options={options} isLoading={isLoading} {...p} />
})

type SectionItem = ReferenceItem & { department_id?: number | null }

/** Sections of the chosen departments only. */
export const SectionsPicker = memo(function SectionsPicker({
    departmentIds,
    ...p
}: PickerProps & { departmentIds: number[] }) {
    const { t } = useTranslation('management')
    const { sections, isLoading } = useSections()
    const options = useMemo(() => {
        const wanted = new Set(departmentIds)
        const all = sections as SectionItem[]
        const knowsDepartments = all.some((s) => s.department_id != null)
        return toPickerOptions(knowsDepartments ? all.filter((s) => s.department_id != null && wanted.has(s.department_id)) : all)
    }, [sections, departmentIds])
    return <ImportReferencePicker field="sections" label={t('form.sections')} options={options} isLoading={isLoading} {...p} />
})
