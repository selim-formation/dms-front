import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Eye, MoreVertical, RotateCcw, Trash2, X, XOctagon } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Button } from '@/shared/components/ui/button'
import type { ManagedDocument, ReviewDecision } from '../types/management.types'

export interface ManagementRowHandlers {
    onView: (doc: ManagedDocument) => void
    onReview: (doc: ManagedDocument, decision: ReviewDecision) => void
    onDelete: (doc: ManagedDocument) => void
    onRestore: (doc: ManagedDocument) => void
    onForceDelete: (doc: ManagedDocument) => void
}

/** Only what `abilities` allows. Edit / manage versions arrive in later phases. */
function ManagementRowActions({ doc, ...h }: { doc: ManagedDocument } & ManagementRowHandlers) {
    const { t } = useTranslation('management')
    const a = doc.abilities
    const review = a.approve || a.reject
    const destructive = a.delete || a.restore || a.force_delete

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t('actions.menu', { name: doc.title })}>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => h.onView(doc)}>
                    <Eye className="me-2 h-4 w-4" />
                    {t('actions.view')}
                </DropdownMenuItem>
                {a.approve && (
                    <DropdownMenuItem onClick={() => h.onReview(doc, 'approve')}>
                        <Check className="me-2 h-4 w-4 text-success" />
                        {t('actions.approve')}
                    </DropdownMenuItem>
                )}
                {a.reject && (
                    <DropdownMenuItem onClick={() => h.onReview(doc, 'reject')}>
                        <X className="me-2 h-4 w-4 text-destructive" />
                        {t('actions.reject')}
                    </DropdownMenuItem>
                )}
                {a.restore && (
                    <DropdownMenuItem onClick={() => h.onRestore(doc)}>
                        <RotateCcw className="me-2 h-4 w-4" />
                        {t('actions.restore')}
                    </DropdownMenuItem>
                )}
                {(review || destructive) && a.delete && <DropdownMenuSeparator />}
                {a.delete && (
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => h.onDelete(doc)}>
                        <Trash2 className="me-2 h-4 w-4" />
                        {t('actions.delete')}
                    </DropdownMenuItem>
                )}
                {a.force_delete && (
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => h.onForceDelete(doc)}>
                        <XOctagon className="me-2 h-4 w-4" />
                        {t('actions.forceDelete')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default memo(ManagementRowActions)
