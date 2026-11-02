import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import DepartmentImage from '@/features/departments/components/DepartmentImage'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import { pickEntityTitle } from './EntityTitle'
import { useEntityDetail } from '../hooks/useEntityDetail'
import { ENTITY_LOCALES } from '../types/entity.types'

interface EntityDetailsDialogProps {
    entityId: number | null
    onOpenChange: (open: boolean) => void
}

/** Read-only view; fetches only while open. */
function EntityDetailsDialog({ entityId, onOpenChange }: EntityDetailsDialogProps) {
    const { t, i18n } = useTranslation('entities')
    const { entity, isLoading, isError, refetch } = useEntityDetail(entityId)

    return (
        <Dialog open={entityId !== null} onOpenChange={onOpenChange}>
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

                {entity && (
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <DepartmentImage
                                src={entity.image_url ?? entity.image}
                                alt={pickEntityTitle(entity, i18n.language) ?? ''}
                                className="h-20 w-20"
                                iconClassName="h-8 w-8"
                                onLoadError={() => refetch()}
                            />
                            <h3 className="min-w-0 truncate text-xl font-semibold text-foreground">
                                {pickEntityTitle(entity, i18n.language) ?? t('card.untitled')}
                            </h3>
                        </div>

                        <dl className="space-y-2 rounded-xl border border-border p-4 text-sm">
                            <dt className="font-medium text-foreground">{t('details.titles')}</dt>
                            {ENTITY_LOCALES.map((lang) => (
                                <dd key={lang} className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">{t(`locales.${lang}`)}</span>
                                    <span className="text-foreground" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                                        {entity.translations?.[lang]?.title ?? '—'}
                                    </span>
                                </dd>
                            ))}
                        </dl>

                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-muted-foreground">{t('details.created')}</dt>
                                <dd className="font-medium text-foreground">{relativeTime(entity.created_at, i18n.language)}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">{t('details.updated')}</dt>
                                <dd className="font-medium text-foreground">{relativeTime(entity.updated_at, i18n.language)}</dd>
                            </div>
                        </dl>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default memo(EntityDetailsDialog)
