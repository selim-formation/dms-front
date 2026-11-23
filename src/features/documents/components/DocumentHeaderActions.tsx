import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Star,
  Pin,
  Share2,
  Download,
  Loader2,
//   Pencil,
//   MoreHorizontal,
} from "lucide-react";
import { useTogglePin } from "../hooks/usePinnedStatus";
import { useToggleFavorite } from "../hooks/useFavoriteStatus";
import { usePermissions } from "@/core/auth/hooks/usePermissions";

interface DocumentHeaderActionsProps {
  documentId: number;
  onShare?: () => void;
  onDownload?: () => void;
  isDownloading?: boolean;
  /** False when the document has no file (no version yet): no download button. */
  hasFile?: boolean;
  /** Extra buttons (e.g. management actions) shown before Share. */
  extraActions?: React.ReactNode;
  onEdit?: () => void;
  onMore?: () => void;
}

const DocumentHeaderActions: React.FC<DocumentHeaderActionsProps> = ({
  documentId,
  onShare,
  onDownload,
  isDownloading = false,
  hasFile = true,
  extraActions,
//   onEdit,
//   onMore,
}) => {
  const { t } = useTranslation(["documents", "common"]);
  const {
    isFavorited,
    isPending: isFavoritePending,
    toggle: toggleFavorite,
  } = useToggleFavorite(documentId);
  const {
    isPinned,
    isPending: isPinPending,
    toggle: togglePin,
  } = useTogglePin(documentId);
  const { can } = usePermissions();
  const canShare = can("create_document_shares");

  return (
    <div className="flex flex-wrap items-center gap-2 md:justify-end">
      <Button
        variant="ghost"
        size="icon"
        className={
          isFavorited
            ? "text-warning hover:text-warning"
            : "text-muted-foreground hover:text-foreground"
        }
        onClick={toggleFavorite}
        disabled={isFavoritePending}
        aria-pressed={isFavorited}
        title={
          isFavorited
            ? t("common:actions.unfavorite")
            : t("common:actions.favorite")
        }
      >
        <Star
          className="h-4 w-4"
          fill={isFavorited ? "currentColor" : "none"}
        />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={
          isPinned
            ? "text-warning hover:text-warning"
            : "text-muted-foreground hover:text-foreground"
        }
        onClick={togglePin}
        disabled={isPinPending}
        aria-pressed={isPinned}
        title={isPinned ? t("common:actions.unpin") : t("common:actions.pin")}
      >
        <Pin className="h-4 w-4" fill={isPinned ? "currentColor" : "none"} />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      {extraActions}
      {canShare && (
        <Button variant="outline" size="sm" onClick={onShare}>
          <Share2 className="me-2 h-4 w-4" /> {t("common:actions.share")}
        </Button>
      )}
      {hasFile && (
        <Button variant="outline" size="sm" onClick={onDownload} disabled={isDownloading}>
          {isDownloading ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <Download className="me-2 h-4 w-4" />} {t("common:actions.download")}
        </Button>
      )}
      
      {/* <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        onClick={onMore}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button> */}
    </div>
  );
};

export default React.memo(DocumentHeaderActions);
