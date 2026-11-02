import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import DepartmentImage from '@/features/departments/components/DepartmentImage'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import { useSectionDetail } from '../hooks/useSectionDetail'

interface SectionDetailsDialogProps {
    sectionId: number | null
    onOpenChange: (open: boolean) => void
}

/** Read-only view (id, department, dates, documents_count, image, description); fetches only while open. */
function SectionDetailsDialog({ sectionId, onOpenChange }: SectionDetailsDialogProps) {
    const { t, i18n } = useTranslation('sections')
    const { section, isLoading, isError, refetch } = useSectionDetail(sectionId)

    return (
        <Dialog open={sectionId !== null} onOpenChange={onOpenChange}>
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

                {section && (
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <DepartmentImage
                                src={section.image_url ?? section.image}
                                alt={section.name}
                                className="h-20 w-20"
                                iconClassName="h-8 w-8"
                                onLoadError={() => refetch()}
                            />
                            <h3 className="min-w-0 truncate text-xl font-semibold text-foreground">{section.name}</h3>
                        </div>

                        <div>
                            <h4 className="mb-1 text-sm font-medium text-foreground">{t('details.description')}</h4>
                            <p className="whitespace-pre-line text-sm text-muted-foreground" dir="auto">
                                {section.description || t('details.noDescription')}
                            </p>
                        </div>

                        <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm">
                            <div>
                                <dt className="text-muted-foreground">{t('details.id')}</dt>
                                <dd className="font-medium text-foreground">{section.id}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">{t('details.department')}</dt>
                                <dd>
                                    <Badge variant="secondary">{section.department?.title ?? t('card.noDepartment')}</Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">{t('details.documents')}</dt>
                                <dd className="font-medium text-foreground">{section.documents_count ?? 0}</dd>
                            </div>
                            <div />
                            <div>
                                <dt className="text-muted-foreground">{t('details.created')}</dt>
                                <dd className="font-medium text-foreground">{relativeTime(section.created_at, i18n.language)}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">{t('details.updated')}</dt>
                                <dd className="font-medium text-foreground">{relativeTime(section.updated_at, i18n.language)}</dd>
                            </div>
                        </dl>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default memo(SectionDetailsDialog)
