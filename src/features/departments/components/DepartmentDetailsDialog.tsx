import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import DepartmentImage from './DepartmentImage'
import { useDepartmentDetail } from '../hooks/useDepartmentDetail'
import { relativeTime } from '../utils/relativeTime'

interface DepartmentDetailsDialogProps {
    departmentId: number | null
    onOpenChange: (open: boolean) => void
}

/** Read-only view; fetches the full department (with sections) only while open. */
function DepartmentDetailsDialog({ departmentId, onOpenChange }: DepartmentDetailsDialogProps) {
    const { t, i18n } = useTranslation('departments')
    const { department, isLoading, isError, refetch } = useDepartmentDetail(departmentId)

    return (
        <Dialog open={departmentId !== null} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
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
                        <p className="text-sm text-destructive">{t('states.viewError')}</p>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            {t('actions.retry', { ns: 'common' })}
                        </Button>
                    </div>
                )}

                {department && (
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <DepartmentImage
                                src={department.image_url ?? department.image}
                                alt={department.title}
                                className="h-20 w-20"
                                iconClassName="h-8 w-8"
                                onLoadError={() => refetch()}
                            />
                            <div className="min-w-0">
                                <h3 className="truncate text-xl font-semibold text-foreground">
                                    {department.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('card.sections', { count: department.sections_count })}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h4 className="mb-2 text-sm font-medium text-foreground">{t('details.sections')}</h4>
                            {department.sections?.length ? (
                                <ul className="flex flex-wrap gap-1.5">
                                    {department.sections.map((s) => (
                                        <li key={s.id}>
                                            <Badge variant="secondary">{s.name}</Badge>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">{t('card.noSections')}</p>
                            )}
                        </div>

                        <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm">
                            <div>
                                <dt className="text-muted-foreground">{t('details.created')}</dt>
                                <dd className="font-medium text-foreground">
                                    {relativeTime(department.created_at, i18n.language)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">{t('details.updated')}</dt>
                                <dd className="font-medium text-foreground">
                                    {relativeTime(department.updated_at, i18n.language)}
                                </dd>
                            </div>
                        </dl>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default memo(DepartmentDetailsDialog)
