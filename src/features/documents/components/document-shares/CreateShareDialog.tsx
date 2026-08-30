import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import ShareRecipientPicker from "./ShareRecipientPicker";
import ShareAccessFields from "./ShareAccessFields";
import ShareScheduleFields from "./ShareScheduleFields";
import { useCreateDocumentShare } from "../../hooks/useCreateDocumentShare";
import { localToApiDateTime } from "../../utils/shareDateFormat";
import type { ShareRecipientUser } from "../../types/documentShare.types";

interface CreateShareDialogProps {
  documentId: number;
  documentTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShared?: () => void;
}

interface ApiErrorLike {
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * "Share document" modal: pick a recipient outside your own department/section,
 * grant view/download, optionally schedule a start/expiry window.
 * Re-submitting for the same recipient updates/reactivates their existing grant.
 */
function CreateShareDialog({
  documentId,
  documentTitle,
  open,
  onOpenChange,
  onShared,
}: CreateShareDialogProps) {
  const { t } = useTranslation(["documents", "common"]);
  const [recipient, setRecipient] = useState<ShareRecipientUser | null>(null);
  const [canView, setCanView] = useState(true);
  const [canDownload, setCanDownload] = useState(false);
  const [startsAt, setStartsAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const {
    mutate: createShare,
    isPending,
    error,
    reset,
  } = useCreateDocumentShare({
    onSuccess: () => {
      onShared?.();
      handleOpenChange(false);
    },
  });

  const resetForm = () => {
    setRecipient(null);
    setCanView(true);
    setCanDownload(false);
    setStartsAt("");
    setExpiresAt("");
    setFormError(null);
    reset();
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) resetForm();
    onOpenChange(next);
  };

  const handleSubmit = () => {
    if (!recipient) {
      setFormError(t("documentShares.form.recipientRequired"));
      return;
    }
    if (startsAt && expiresAt && new Date(expiresAt) <= new Date(startsAt)) {
      setFormError(t("documentShares.form.expiresAfterStarts"));
      return;
    }
    setFormError(null);

    createShare({
      document_id: documentId,
      shared_with: recipient.id,
      can_view: canView,
      can_download: canDownload,
      starts_at: localToApiDateTime(startsAt),
      expires_at: localToApiDateTime(expiresAt),
    });
  };

  const apiError = error as ApiErrorLike | null;
  const apiErrorMessage = apiError?.errors
    ? Object.values(apiError.errors).flat()[0]
    : apiError?.message;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            {t("documentShares.form.createTitle")}
          </DialogTitle>
          <DialogDescription>
            {documentTitle
              ? t("documentShares.form.createDescriptionWithTitle", {
                  title: documentTitle,
                })
              : t("documentShares.form.createDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <ShareRecipientPicker
            value={recipient}
            onChange={setRecipient}
            disabled={isPending}
          />

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
            <p className="text-sm text-destructive">
              {formError || apiErrorMessage}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            {t("common:actions.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("documentShares.form.submitShare")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(CreateShareDialog);
