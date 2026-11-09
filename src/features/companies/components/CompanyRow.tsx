import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import ChipList from '@/shared/components/ChipList'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import CompanyLogo from './CompanyLogo'
import CompanyCopyButton from './CompanyCopyButton'
import CompanyRowActions, { type CompanyRowHandlers } from './CompanyRowActions'
import { companyDomainChips } from './companyChips'
import type { Company } from '../types/company.types'

interface CompanyRowProps extends CompanyRowHandlers {
    company: Company
    selectable: boolean
    selected: boolean
    isCurrent: boolean
    onToggleSelect: (id: string) => void
}

const fmt = new Intl.NumberFormat()

/** Memoised: selecting a row or a refresh re-renders only the rows that changed. */
function CompanyRow({ company, selectable, selected, isCurrent, onToggleSelect, ...handlers }: CompanyRowProps) {
    const { t, i18n } = useTranslation('companies')

    return (
        <tr className={cn('border-t border-border align-middle transition-colors hover:bg-accent/40', selected && 'bg-primary/5', company.deleted_at && 'opacity-80')}>
            <td className="w-10 ps-4 py-3">
                <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary disabled:opacity-30"
                    checked={selected}
                    disabled={!selectable}
                    onChange={() => onToggleSelect(company.id)}
                    aria-label={t('table.select', { name: company.name })}
                />
            </td>
            <td className="max-w-72 px-4 py-3">
                <div className="flex items-center gap-3">
                    <CompanyLogo name={company.name} src={company.logo_url} muted={!!company.deleted_at} />
                    <div className="min-w-0">
                        <button
                            type="button"
                            onClick={() => handlers.onView(company)}
                            className="flex max-w-full items-center gap-2 text-start font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            title={company.name}
                        >
                            <span className="truncate" dir="auto">{company.name}</span>
                            {isCurrent && (
                                <span className="shrink-0 rounded-full bg-primary/10 px-1.5 text-[10px] font-semibold uppercase text-primary">
                                    {t('table.current')}
                                </span>
                            )}
                            {company.deleted_at && (
                                <span className="shrink-0 rounded-full bg-destructive/10 px-1.5 text-[10px] font-semibold uppercase text-destructive">
                                    {t('table.trashed')}
                                </span>
                            )}
                        </button>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="truncate" dir="ltr" title={company.slug}>{company.slug}</span>
                            <CompanyCopyButton value={company.slug} />
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3">
                <code className="rounded-md bg-muted px-2 py-0.5 text-xs text-foreground" dir="ltr">{company.id}</code>
            </td>
            <td className="px-4 py-3"><ChipList items={companyDomainChips(company)} max={2} /></td>
            <td className="px-4 py-3 text-sm tabular-nums text-foreground">{fmt.format(company.users_count)}</td>
            <td className="px-4 py-3 text-sm tabular-nums text-foreground">{fmt.format(company.documents_count)}</td>
            <td className="px-4 py-3 text-sm tabular-nums text-foreground">{fmt.format(company.permissions_count)}</td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{relativeTime(company.created_at, i18n.language)}</td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{relativeTime(company.updated_at, i18n.language)}</td>
            <td className="w-12 pe-3 py-2">
                <CompanyRowActions company={company} {...handlers} />
            </td>
        </tr>
    )
}

export default memo(CompanyRow)
