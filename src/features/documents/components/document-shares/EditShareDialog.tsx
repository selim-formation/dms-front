import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Pencil } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import ShareAccessFields from './ShareAccessFields';
import ShareScheduleFields from './ShareScheduleFields';
import { useUpdateDocumentShare } from '../../hooks/useUpdateDocumentShare';
import { isoToLocalInput, localToApiDateTime } from '../../utils/shareDateFormat';
import type { DocumentShareData } from '../../types/documentShare.types';

interface ApiErrorLike {
    message?: string;
    errors?: Record<string, string[]>;
}

interface EditShareDialogProps {
    share: DocumentShareData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdated?: () => void;
}

/**
 * Edit an existing grant's access rights / schedule (granter only).
 * Recipient can't be changed here — revoke and re-share instead.
 *
 * The parent keys this component by `share.id` so switching targets remounts
 * it with fresh initial state instead of syncing via an effect.
 */
function EditShareDialog({ share, open, onOpenChange, onUpdated }: EditShareDialogProps) {
    const { t } = useTranslation(['documents', 'common']);
    const [canView, setCanView] = useState(() => share?.can_view ?? true);
    const [canDownload, setCanDownload] = useState(() => share?.can_download ?? false);
    const [startsAt, setStartsAt] = useState(() => isoToLocalInput(share?.starts_at ?? null));
    const [expiresAt, setExpiresAt] = useState(() => isoToLocalInput(share?.expires_at ?? null));
    const [formError, setFormError] = useState<string | null>(null);

    const { mutate: updateShare, isPending, error } = useUpdateDocumentShare({
        onSuccess: () => {
            onUpdated?.();
            onOpenChange(false);
        },
    });

    if (!share) return null;

    const handleSubmit = () => {
        if (startsAt && expiresAt && new Date(expiresAt) <= new Date(startsAt)) {
            setFormError(t('documentShares.form.expiresAfterStarts'));
            return;
        }
        setFormError(null);

        updateShare(share.id, {
            can_view: canView,
            can_download: canDownload,
            starts_at: localToApiDateTime(startsAt),
            expires_at: localToApiDateTime(expiresAt),
        });
    };

    const apiError = error as ApiErrorLike | null;
    const apiErrorMessage =
        apiError?.errors ? Object.values(apiError.errors).flat()[0] : apiError?.message;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Pencil className="h-5 w-5 text-primary" />
                        {t('documentShares.form.editTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('documentShares.form.editDescription', {
                            name: share.shared_with.name,
                            title: share.document.title,
                        })}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5">
                    <ShareAccessFields
                        canView={canView}
                        canDownload={canDownload}
                        onChange={({ can_view, can_download }) => {
                            setCanView(can_view);
                            setCanDownload(can_download);
                        }}
                        disabled={isPending}
                    />

                    <ShareScheduleFields
                        startsAt={startsAt}
                        expiresAt={expiresAt}
                        onStartsAtChange={setStartsAt}
                        onExpiresAtChange={setExpiresAt}
                        disabled={isPending}
                    />

                    {(formError || apiErrorMessage) && (
                        <p className="text-sm text-destructive">{formError || apiErrorMessage}</p>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        {t('common:actions.cancel')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        {t('common:actions.save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default memo(EditShareDialog);
