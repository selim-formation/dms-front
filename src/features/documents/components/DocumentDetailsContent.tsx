import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  ExternalLink,
  FileText,
  Tag,
  Building2,
  FolderOpen,
  User,
  Calendar,
  Clock,
  Bell,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { format, parse } from "date-fns";
import { useDocumentComments } from "../hooks/useDocumentComments";
import { usePermissions } from "@/core/auth/hooks/usePermissions";
import CreateShareDialog from "./document-shares/CreateShareDialog";
import type { DocumentViewData } from "../types/api.types";

interface DocumentDetailsContentProps {
  doc: DocumentViewData;
  fileIcon: React.ReactNode;
  fileColorClass: string;
}

const DocumentDetailsContent: React.FC<DocumentDetailsContentProps> = ({
  doc,
  fileIcon,
  fileColorClass,
}) => {
  const { t } = useTranslation(["documents", "common"]);
  const { can } = usePermissions();
  const canShare = can("create_document_shares");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Real comment total (top-level count from the comments API), not a
  // document_activities heuristic. perPage matches CommentsPanel's
  // DEFAULT_PER_PAGE (20) on purpose — same query key, so this shares
  // one cached fetch with the comments panel instead of firing a second
  // request, and stays in sync when comments are added/removed. It also
  // has to be >1: the API returns no real pagination total (see
  // extractPaginationMeta), so the count here is derived from how many
  // comments actually came back — perPage:1 would always read back "1".
  const { meta: commentsMeta } = useDocumentComments(doc.id, { perPage: 20 });

  // Views/downloads have no dedicated count endpoint yet — derived from the activity log
  const engagementMetrics = useMemo(() => {
    const viewCount =
      doc.document_activities?.filter((a) => a.action === "view").length || 0;
    const downloadCount =
      doc.document_activities?.filter((a) => a.action === "download").length ||
      0;

    return {
      views: viewCount,
      comments: commentsMeta?.totalCount ?? 0,
      downloads: downloadCount,
    };
  }, [doc.document_activities, commentsMeta?.totalCount]);

  // Format created/updated dates safely
  const formatDateSafe = (dateStr: string | null | undefined): string => {
    if (!dateStr) return t("documentDetails.notAvailable");
    try {
      if (dateStr.includes("T")) {
        return format(new Date(dateStr), "MMM d, yyyy");
      } else if (dateStr.includes("/")) {
        const parsed = parse(dateStr, "dd/MM/yyyy", new Date());
        if (!isNaN(parsed.getTime())) {
          return format(parsed, "MMM d, yyyy");
        }
      }
      return dateStr;
    } catch {
      return dateStr || t("documentDetails.notAvailable");
    }
  };

  const handleOpenInViewer = () => {
    if (doc.path) {
      window.open(doc.path, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Preview Placeholder */}
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
              <div
                className={`h-16 w-16 rounded-2xl ${fileColorClass} flex items-center justify-center`}
              >
                {fileIcon}
              </div>
              <p className="text-muted-foreground text-sm">
                {t("documentDetails.preview")}
              </p>
              <Button
                variant="outline"
                size="sm"
                disabled={!doc.path}
                onClick={handleOpenInViewer}
              >
                <ExternalLink className="me-2 h-4 w-4" />{" "}
                {t("documentDetails.openInViewer")}
              </Button>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                {t("documentDescription.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {doc.description || t("documentDetails.noDescription")}
              </p>
            </CardContent>
          </Card>

          {/* Document Types/Categories */}
          {doc.types && doc.types.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  {t("documentDetails.documentTypes")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {doc.types.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <div
                      className={`h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center`}
                    >
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {type.title}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                {t("documentDetails.information")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <MetaRow
                icon={Tag}
                label={t("documentDetails.category")}
                value={
                  doc.category === "operational"
                    ? t("entityType.operational")
                    : t("entityType.establishment")
                }
              />
              {doc.departments && doc.departments.length > 0 && (
                <MetaRow
                  icon={Building2}
                  label={t("documentDetails.department")}
                  value={
                    doc.departments[0]?.title ||
                    t("documentDetails.notAvailable")
                  }
                />
              )}
              {doc.entities && doc.entities.length > 0 && (
                <MetaRow
                  icon={FolderOpen}
                  label={t("documentDetails.entity")}
                  value={
                    doc.entities[0]?.title || t("documentDetails.notAvailable")
                  }
                />
              )}
              <Separator />
              <MetaRow
                icon={User}
                label={t("documentDetails.uploadedBy")}
                value={
                  doc.uploaded_by?.name || t("documentDetails.notAvailable")
                }
              />
              <MetaRow
                icon={Calendar}
                label={t("documentDetails.created")}
                value={formatDateSafe(doc.created_at)}
              />
              <MetaRow
                icon={Clock}
                label={t("documentDetails.lastModified")}
                value={formatDateSafe(doc.updated_at)}
              />
              {doc.expire_date && (
                <>
                  <Separator />
                  <MetaRow
                    icon={Bell}
                    label={t("common:status.expires")}
                    value={formatDateSafe(doc.expire_date)}
                    highlight
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Stats & Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                {t("documentEngagement.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-foreground">
                    {engagementMetrics.views}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("documentEngagement.views")}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-foreground">
                    {engagementMetrics.comments}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("comments.title")}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-foreground">
                    {engagementMetrics.downloads}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("documentEngagement.downloads")}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {t("documentDetails.documentOwner")}
                </h4>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    {doc.uploaded_by?.name?.substring(0, 2).toUpperCase() ||
                      "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {doc.uploaded_by?.name || t("documentDetails.unknown")}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {doc.uploaded_by?.email ||
                        t("documentDetails.notAvailable")}
                    </p>
                  </div>
                </div>
                {canShare && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => setIsShareOpen(true)}
                  >
                    <Share2 className="me-2 h-4 w-4" />{" "}
                    {t("documentDetails.shareDocument")}
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                  onClick={handleCopyLink}
                >
                  {isCopied ? (
                    <Check className="me-2 h-4 w-4 text-success" />
                  ) : (
                    <Copy className="me-2 h-4 w-4" />
                  )}
                  {isCopied
                    ? t("common:actions.copied")
                    : t("common:actions.copyLink")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {canShare && (
        <CreateShareDialog
          documentId={doc.id}
          documentTitle={doc.title}
          open={isShareOpen}
          onOpenChange={setIsShareOpen}
        />
      )}
    </>
  );
};

interface MetaRowProps {
  icon: typeof Tag;
  label: string;
  value: string;
  highlight?: boolean;
}

const MetaRow: React.FC<MetaRowProps> = ({
  icon: Icon,
  label,
  value,
  highlight,
}) => {
  return (
    <div className="flex items-center gap-3">
      <Icon
        className={`h-4 w-4 shrink-0 ${highlight ? "text-warning" : "text-muted-foreground"}`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={`text-sm font-medium ${highlight ? "text-warning" : "text-foreground"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default React.memo(DocumentDetailsContent);
