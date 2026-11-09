import type { PickerOption } from '@/features/document-imports/components/ImportReferencePicker'
import type { ReferenceItem } from '@/core/reference-data/types/referenceData.types'

export const toPickerOptions = (items: ReferenceItem[]): PickerOption[] =>
    items.map((i) => ({ id: i.id, name: i.name ?? i.title })).sort((a, b) => a.name.localeCompare(b.name))
