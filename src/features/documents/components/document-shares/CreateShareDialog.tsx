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
import ShareTargetPicker from "./ShareTargetPicker";
import ShareAccessFields from "./ShareAccessFields";
import ShareScheduleFields from "./ShareScheduleFields";
import { useCreateBulkDocumentShares } from "../../hooks/useCreateBulkDocumentShares";
import { useCreateDocumentShare } from "../../hooks/useCreateDocumentShare";
import { localToApiDateTime } from "../../utils/shareDateFormat";
import {
  MAX_SHARE_TARGETS_PER_TYPE,
  type CreateDocumentSharePayload,
  type SelectedShareTarget,
} from "../../types/documentShare.types";

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
 * "Share document" modal: pick any mix of users (any department), departments
 * and sections, grant view/download, optionally schedule a start/expiry window.
 * One target posts to `/document-shares`, several post to `/document-shares/bulk`.
 * Re-sharing to the same target updates/reactivates its existing grant.
 */
function CreateShareDialog({
  documentId,
  documentTitle,
  open,
  onOpenChange,
  onShared,
}: CreateShareDialogProps) {
  const { t } = useTranslation(["documents", "common"]);
  const [targets, setTargets] = useState<SelectedShareTarget[]>([]);
  const [canView, setCanView] = useState(true);
  const [canDownload, setCanDownload] = useState(false);
  const [startsAt, setStartsAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSuccess = () => {
    onShared?.();
    handleOpenChange(false);
  };

  const single = useCreateDocumentShare({ onSuccess: handleSuccess });
  const bulk = useCreateBulkDocumentShares({ onSuccess: handleSuccess });
  const isPending = single.isPending || bulk.isPending;
  const error = single.error ?? bulk.error;

  const resetForm = () => {
    setTargets([]);
    setCanView(true);
    setCanDownload(false);
    setStartsAt("");
    setExpiresAt("");
    setFormError(null);
    single.reset();
    bulk.reset();
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) resetForm();
    onOpenChange(next);
  };

  const handleSubmit = () => {
    if (targets.length === 0) {
      setFormError(t("documentShares.form.recipientRequired"));
      return;
    }
    if (startsAt && expiresAt && new Date(expiresAt) <= new Date(startsAt)) {
      setFormError(t("documentShares.form.expiresAfterStarts"));
      return;
    }
    const idsOf = (type: SelectedShareTarget["type"]) =>
      targets.filter((x) => x.type === type).map((x) => x.id);
    const userIds = idsOf("user");
    const departmentIds = idsOf("department");
    const sectionIds = idsOf("section");
    if (
      Math.max(userIds.length, departmentIds.length, sectionIds.length) >
      MAX_SHARE_TARGETS_PER_TYPE
    ) {
      setFormError(
        t("documentShares.form.tooManyTargets", { max: MAX_SHARE_TARGETS_PER_TYPE }),
      );
      return;
    }
    setFormError(null);

    const access = {
      can_view: canView,
      can_download: canDownload,
      starts_at: localToApiDateTime(startsAt),
      expires_at: localToApiDateTime(expiresAt),
    };

    if (targets.length === 1) {
      const [only] = targets;
      const target =
        only.type === "user"
          ? { shared_with: only.id }
          : only.type === "department"
            ? { department_id: only.id }
            : { section_id: only.id };
      single.mutate({
        document_id: documentId,
        ...access,
        ...target,
      } as CreateDocumentSharePayload);
      return;
    }

    bulk.mutate({
      document_id: documentId,
      ...access,
      ...(userIds.length && { user_ids: userIds }),
      ...(departmentIds.length && { department_ids: departmentIds }),
      ...(sectionIds.length && { section_ids: sectionIds }),
    });
  };

  const apiError = error as ApiErrorLike | null;
  const apiErrorMessage = apiError?.errors
    ? Object.values(apiError.errors).flat()[0]
    : apiError?.message;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
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
          <ShareTargetPicker
            value={targets}
            onChange={setTargets}
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
