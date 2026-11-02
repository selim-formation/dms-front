import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Layers } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Button } from '@/shared/components/ui/button'
import DepartmentSectionsPicker from './DepartmentSectionsPicker'

interface DepartmentSectionsFilterProps {
    selectedIds: number[]
    onChange: (ids: number[]) => void
}

/** Popover wrapper around the sections picker for the filter bar. */
function DepartmentSectionsFilter({ selectedIds, onChange }: DepartmentSectionsFilterProps) {
    const { t } = useTranslation('departments')
    const count = selectedIds.length

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={count ? 'default' : 'outline'} className="rounded-full">
                    <Layers className="h-4 w-4" />
                    {count ? t('filters.sectionsCount', { count }) : t('filters.sections')}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72">
                <DepartmentSectionsPicker selectedIds={selectedIds} onChange={onChange} />
            </PopoverContent>
        </Popover>
    )
}

export default memo(DepartmentSectionsFilter)
