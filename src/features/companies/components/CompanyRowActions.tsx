import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, MoreVertical, Pencil, RotateCcw, Trash2, XOctagon } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Button } from '@/shared/components/ui/button'
import type { Company } from '../types/company.types'

export interface CompanyRowHandlers {
    onView: (company: Company) => void
    onEdit: (company: Company) => void
    onDelete: (company: Company) => void
    onRestore: (company: Company) => void
    onForceDelete: (company: Company) => void
}

/** Only what `abilities` allows — it already folds in permission (as held in that company) and state. */
function CompanyRowActions({ company, ...h }: { company: Company } & CompanyRowHandlers) {
    const { t } = useTranslation('companies')
    const a = company.abilities

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t('actions.menu', { name: company.name })}>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => h.onView(company)}>
                    <Eye className="me-2 h-4 w-4" />
                    {t('actions.view')}
                </DropdownMenuItem>
                {a.update && (
                    <DropdownMenuItem onClick={() => h.onEdit(company)}>
                        <Pencil className="me-2 h-4 w-4" />
                        {t('actions.edit')}
                    </DropdownMenuItem>
                )}
                {a.restore && (
                    <DropdownMenuItem onClick={() => h.onRestore(company)}>
                        <RotateCcw className="me-2 h-4 w-4" />
                        {t('actions.restore')}
                    </DropdownMenuItem>
                )}
                {(a.delete || a.force_delete) && <DropdownMenuSeparator />}
                {a.delete && (
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => h.onDelete(company)}>
                        <Trash2 className="me-2 h-4 w-4" />
                        {t('actions.delete')}
                    </DropdownMenuItem>
                )}
                {a.force_delete && (
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => h.onForceDelete(company)}>
                        <XOctagon className="me-2 h-4 w-4" />
                        {t('actions.forceDelete')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default memo(CompanyRowActions)
