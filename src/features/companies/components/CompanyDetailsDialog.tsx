import { memo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, Loader2, Pencil, RotateCcw, ShieldCheck, Trash2, Users } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import ChipList from '@/shared/components/ChipList'
import { errorStatus } from '@/features/departments/utils/departmentErrors'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import CompanyLogo from './CompanyLogo'
import CompanyCopyButton from './CompanyCopyButton'
import CompanyStatTile from './CompanyStatTile'
import { companyDomainChips } from './companyChips'
import { useCompanyDetail } from '../hooks/useCompanyDetail'
import type { Company } from '../types/company.types'

function Row({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
    return (
        <div className={wide ? 'col-span-2' : undefined}>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="mt-0.5 font-medium text-foreground">{children}</dd>
        </div>
    )
}

interface CompanyDetailsDialogProps {
    companyId: string | null
    onOpenChange: (open: boolean) => void
    onEdit: (company: Company) => void
    onDelete: (company: Company) => void
    onRestore: (company: Company) => void
}

/** Read-only view with the statistics panel; fetches only while open (trashed companies can be opened too). */
function CompanyDetailsDialog({ companyId, onOpenChange, onEdit, onDelete, onRestore }: CompanyDetailsDialogProps) {
    const { t, i18n } = useTranslation('companies')
    const { company, isLoading, isError, error, refetch } = useCompanyDetail(companyId)
    const notFound = isError && errorStatus(error) === 404
    const date = (iso: string) => relativeTime(iso, i18n.language)
    const a = company?.abilities
    const hasActions = !!a && (a.update || a.delete || a.restore)

    return (
        <Dialog open={companyId !== null} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('details.title')}</DialogTitle>
                </DialogHeader>

                {isLoading && (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {isError && (
                    <div className="space-y-3 py-6 text-center">
                        <p className="text-sm text-destructive">{t(notFound ? 'states.notFound' : 'states.viewError')}</p>
                        {!notFound && (
                            <Button variant="outline" size="sm" onClick={() => refetch()}>
                                {t('actions.retry', { ns: 'common' })}
                            </Button>
                        )}
                    </div>
                )}

                {company && (
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <CompanyLogo name={company.name} src={company.logo_url} className="h-16 w-16 text-lg" muted={!!company.deleted_at} />
                            <div className="min-w-0 space-y-1">
                                <h3 className="truncate text-xl font-semibold text-foreground" dir="auto">{company.name}</h3>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <span dir="ltr">{company.slug}</span>
                                    <CompanyCopyButton value={company.slug} />
                                </div>
                                {company.deleted_at && (
                                    <span className="inline-block rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                                        {t('details.inTrash')}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <CompanyStatTile icon={<Users className="h-4 w-4" />} label={t('details.members')} value={company.users_count} />
                            <CompanyStatTile icon={<FileText className="h-4 w-4" />} label={t('details.documents')} value={company.documents_count} />
                            <CompanyStatTile icon={<ShieldCheck className="h-4 w-4" />} label={t('details.features')} value={company.permissions_count} />
                        </div>

                        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-4 text-sm">
                            <Row label={t('details.systemId')}>
                                <span className="flex items-center gap-1">
                                    <code className="rounded-md bg-muted px-2 py-0.5 text-xs" dir="ltr">{company.id}</code>
                                    <CompanyCopyButton value={company.id} />
                                </span>
                            </Row>
                            <Row label={t('details.domains')}><ChipList items={companyDomainChips(company)} max={99} /></Row>
                            <Row label={t('details.created')}>{date(company.created_at)}</Row>
                            <Row label={t('details.updated')}>{date(company.updated_at)}</Row>
                            {company.deleted_at && <Row label={t('details.deleted')}>{date(company.deleted_at)}</Row>}
                        </dl>
                    </div>
                )}

                {company && a && hasActions && (
                    <DialogFooter className="flex-wrap">
                        {a.restore && (
                            <Button variant="outline" onClick={() => onRestore(company)}>
                                <RotateCcw className="h-4 w-4" />
                                {t('actions.restore')}
                            </Button>
                        )}
                        {a.delete && (
                            <Button variant="outline" onClick={() => onDelete(company)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                {t('actions.delete')}
                            </Button>
                        )}
                        {a.update && (
                            <Button onClick={() => onEdit(company)}>
                                <Pencil className="h-4 w-4" />
                                {t('actions.edit')}
                            </Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default memo(CompanyDetailsDialog)
