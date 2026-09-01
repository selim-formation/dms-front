import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import DynamicSliderTabs from '@/features/documents/components/DynamicSliderTabs'
import { useDepartments } from '@/core/reference-data/hooks/useDepartments'

const ALL_ID = 'all'

interface TeamSearchAndFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    departmentId: number | undefined
    onDepartmentChange: (id: number | undefined) => void
}

function TeamSearchAndFilters({
    search,
    onSearchChange,
    departmentId,
    onDepartmentChange,
}: TeamSearchAndFiltersProps) {
    const { t } = useTranslation('teams')
    const { departments } = useDepartments()

    const tabs = useMemo(
        () => [
            { id: ALL_ID, label: t('teamPage.all') },
            ...departments.map((dept) => ({ id: String(dept.id), label: dept.title })),
        ],
        [departments, t],
    )

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder={t('teamPage.searchPlaceholder')}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="ps-10"
                />
            </div>

            <DynamicSliderTabs
                tabs={tabs}
                activeTab={departmentId === undefined ? ALL_ID : String(departmentId)}
                onTabChange={(id) => onDepartmentChange(id === ALL_ID ? undefined : Number(id))}
            />
        </div>
    )
}

export default memo(TeamSearchAndFilters)
