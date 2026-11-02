import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { RotateCcw, Trash2, X, XOctagon } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import type { DepartmentBulkAction } from '../types/department.types'

interface DepartmentBulkBarProps {
    selectedCount: number
    allSelected: boolean
    onToggleAll: () => void
    onClear: () => void
    /** Actions already filtered by permission + current trashed view. */
    actions: DepartmentBulkAction[]
    onAction: (action: DepartmentBulkAction) => void
}

function DepartmentBulkBar({
    selectedCount,
    allSelected,
    onToggleAll,
    onClear,
    actions,
    onAction,
}: DepartmentBulkBarProps) {
    const { t } = useTranslation('departments')

    return (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary"
                    checked={allSelected}
                    onChange={onToggleAll}
                />
                {selectedCount > 0 ? t('bulk.selected', { count: selectedCount }) : t('bulk.selectAll')}
            </label>

            {selectedCount > 0 && (
                <div className="ms-auto flex flex-wrap items-center gap-2">
                    {actions.includes('delete') && (
                        <Button variant="outline" size="sm" onClick={() => onAction('delete')}>
                            <Trash2 className="h-4 w-4" />
                            {t('bulk.delete')}
                        </Button>
                    )}
                    {actions.includes('restore') && (
                        <Button variant="outline" size="sm" onClick={() => onAction('restore')}>
                            <RotateCcw className="h-4 w-4" />
                            {t('bulk.restore')}
                        </Button>
                    )}
                    {actions.includes('force_delete') && (
                        <Button variant="destructive" size="sm" onClick={() => onAction('force_delete')}>
                            <XOctagon className="h-4 w-4" />
                            {t('bulk.forceDelete')}
                        </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={onClear}>
                        <X className="h-4 w-4" />
                        {t('bulk.clear')}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default memo(DepartmentBulkBar)
