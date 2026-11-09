import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import CompanyRow from './CompanyRow'
import type { CompanyRowHandlers } from './CompanyRowActions'
import type { Company, CompanyTab } from '../types/company.types'
import { isSelectable } from '../utils/companyPayload'

const COLUMNS = ['company', 'id', 'domains', 'members', 'documents', 'features', 'created', 'updated'] as const

interface CompanyTableProps extends CompanyRowHandlers {
    companies: Company[]
    tab: CompanyTab
    /** System id of the company that is open right now. */
    currentTenantId: string | null
    /** Show the selection column (user holds a bulk permission). */
    bulkEnabled: boolean
    selectedIds: ReadonlySet<string>
    onToggleSelect: (id: string) => void
}

function CompanyTable({ companies, tab, currentTenantId, bulkEnabled, selectedIds, onToggleSelect, ...handlers }: CompanyTableProps) {
    const { t } = useTranslation('companies')

    return (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-250 text-start">
                <thead>
                    <tr className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                        <th scope="col" className="w-10 ps-4 py-3"><span className="sr-only">{t('table.selectColumn')}</span></th>
                        {COLUMNS.map((c) => (
                            <th key={c} scope="col" className="px-4 py-3 text-start font-semibold">
                                {t(`table.columns.${c}`)}
                            </th>
                        ))}
                        <th scope="col" className="w-12 pe-3 py-3"><span className="sr-only">{t('table.columns.actions')}</span></th>
                    </tr>
                </thead>
                <tbody>
                    {companies.map((company) => (
                        <CompanyRow
                            key={company.id}
                            company={company}
                            isCurrent={company.id === currentTenantId}
                            selectable={bulkEnabled && isSelectable(company, tab)}
                            selected={selectedIds.has(company.id)}
                            onToggleSelect={onToggleSelect}
                            {...handlers}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default memo(CompanyTable)
