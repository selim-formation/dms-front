import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, TriangleAlert } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { useRevokeDocumentShare } from '../../hooks/useRevokeDocumentShare';
import type { DocumentShareData } from '../../types/documentShare.types';

interface RevokeShareDialogProps {
    share: DocumentShareData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRevoked?: () => void;
}

/** Confirm before soft-revoking a grant (destructive from the recipient's POV). */
function RevokeShareDialog({ share, open, onOpenChange, onRevoked }: RevokeShareDialogProps) {
    const { t } = useTranslation(['documents', 'common']);
    const { mutate: revoke, isPending } = useRevokeDocumentShare({
        onSuccess: () => {
            onRevoked?.();
            onOpenChange(false);
        },
    });

    if (!share) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <TriangleAlert className="h-5 w-5" />
                        {t('documentShares.revoke.title')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('documentShares.revoke.description', {
                            name: share.shared_with.name,
                            title: share.document.title,
                        })}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        {t('common:actions.cancel')}
                    </Button>
                    <Button variant="destructive" onClick={() => revoke(share.id)} disabled={isPending}>
                        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        {t('documentShares.revoke.confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default memo(RevokeShareDialog);
