import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, RotateCcw } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import type { Employee } from '../types/employee.types'

interface EmployeeRestoreHintProps {
    employee: Employee
    isPending: boolean
    onRestore: (employee: Employee) => void
}

/** Shown when a duplicate email belongs to a deleted employee: restore it instead of creating a new one. */
function EmployeeRestoreHint({ employee, isPending, onRestore }: EmployeeRestoreHintProps) {
    const { t } = useTranslation('employees')
    return (
        <div
            role="status"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/50 p-3 text-sm"
        >
            <p className="min-w-0 flex-1 text-muted-foreground">
                {t('form.restoreHint', { name: employee.name })}
            </p>
            <Button type="button" size="sm" variant="outline" disabled={isPending} onClick={() => onRestore(employee)}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                {t('form.restoreAction')}
            </Button>
        </div>
    )
}

export default memo(EmployeeRestoreHint)
