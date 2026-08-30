<<<<<<< Updated upstream
import { useParams, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { documentKeys } from '../api/documentKeys';
import { getDocument } from '../api/documentApi';
import { useTenant } from '@/core/tenant/hooks/useTenant';
import Navbar from '@/shared/components/layout/Navbar';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { AlertTriangle, ArrowLeft, File, FileText, FileSpreadsheet, FileImage } from 'lucide-react';
import DocumentViewSkeleton from '../components/DocumentViewSkeleton';
import DocumentPageBreadcrumb from '../components/DocumentPageBreadcrumb';
import DocumentHeaderMeta from '../components/DocumentHeaderMeta';
import DocumentHeaderActions from '../components/DocumentHeaderActions';
import DocumentDetailsContent from '../components/DocumentDetailsContent';
import DocumentCommentsCard from '../components/DocumentCommentsCard';
import DocumentTabsContainer from '../components/DocumentTabsContainer';

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const fileTypeIcons: Record<string, typeof FileText> = {
    pdf: FileText,
    docx: FileText,
    doc: FileText,
    xlsx: FileSpreadsheet,
    xls: FileSpreadsheet,
    png: FileImage,
    jpg: FileImage,
    jpeg: FileImage,
    md: FileText,
};

const fileTypeColors: Record<string, string> = {
    pdf: 'bg-destructive/10 text-destructive',
    docx: 'bg-primary/10 text-primary',
    doc: 'bg-primary/10 text-primary',
    xlsx: 'bg-success/10 text-success',
    xls: 'bg-success/10 text-success',
    md: 'bg-muted text-muted-foreground',
    zip: 'bg-warning/10 text-warning',
=======
import { useParams, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDocument } from "../hooks/useDocument";
import { useTenant } from "@/core/tenant/hooks/useTenant";
import Navbar from "@/shared/components/layout/Navbar";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  AlertTriangle,
  ArrowLeft,
  File,
  FileText,
  FileSpreadsheet,
  FileImage,
} from "lucide-react";
import DocumentViewSkeleton from "../components/DocumentViewSkeleton";
import DocumentPageBreadcrumb from "../components/DocumentPageBreadcrumb";
import DocumentHeaderMeta from "../components/DocumentHeaderMeta";
import DocumentHeaderActions from "../components/DocumentHeaderActions";
import { CommentsPanel } from "../components/comments";
import DocumentTabsContainer from "../components/DocumentTabsContainer";
import CreateShareDialog from "../components/document-shares/CreateShareDialog";

function formatFileSize(
  bytes: string | number | null,
  notAvailableLabel: string,
): string {
  if (!bytes) return notAvailableLabel;
  const numBytes = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;
  if (isNaN(numBytes)) return notAvailableLabel;
  if (numBytes < 1024) return `${numBytes} B`;
  if (numBytes < 1024 * 1024) return `${(numBytes / 1024).toFixed(1)} KB`;
  return `${(numBytes / (1024 * 1024)).toFixed(1)} MB`;
}

const fileTypeIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  docx: FileText,
  doc: FileText,
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  md: FileText,
  sdf: File,
};

const fileTypeColors: Record<string, string> = {
  pdf: "bg-destructive/10 text-destructive",
  docx: "bg-primary/10 text-primary",
  doc: "bg-primary/10 text-primary",
  xlsx: "bg-success/10 text-success",
  xls: "bg-success/10 text-success",
  md: "bg-muted text-muted-foreground",
  zip: "bg-warning/10 text-warning",
  sdf: "bg-muted text-muted-foreground",
>>>>>>> Stashed changes
};

export default function DocumentViewPage() {
<<<<<<< Updated upstream
    const tenant = useTenant();
    const { id } = useParams({ from: `/$tenant/documents/$id` });
    const numId = Number(id);

    const { data: doc, isLoading, isError } = useQuery({
        queryKey: documentKeys.detail(tenant?.tenantId ?? '', numId),
        queryFn: () => getDocument(tenant?.tenantId ?? '', numId),
        enabled: !!numId && !!tenant?.tenantId,
    });
=======
  const { t } = useTranslation(["documents", "common"]);
  const tenant = useTenant();
  const { id } = useParams({ from: "/_protected/$tenant/documents/$id" });
  const numId = Number(id);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const {
    data: doc,
    isLoading,
    isError,
    error,
  } = useDocument(numId, {
    enabled: !!numId && !!tenant?.tenantId,
  });
>>>>>>> Stashed changes

  if (isLoading) return <DocumentViewSkeleton />;

<<<<<<< Updated upstream
    if (isError || !doc) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <AlertTriangle className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold text-foreground">Document not found</h2>
                <p className="text-muted-foreground">The document you're looking for doesn't exist or has been removed.</p>
                <Button variant="outline" asChild>
                    <Link to={`/${tenant?.tenantId}/documents`}  params={{ tenant: tenant.tenantId ?? '' }}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Documents
                    </Link>
                </Button>
            </div>
        );
    }

    const FileIcon = fileTypeIcons[doc.file_type] || File;
    const fileColorClass = fileTypeColors[doc.file_type] || 'bg-muted text-muted-foreground';

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="space-y-6">
                    {/* Breadcrumb */}
                    <DocumentPageBreadcrumb
                        tenantId={tenant.tenantId ?? ''}
                        documentTitle={doc.title}
                    />

                    {/* Header Card */}
                    <Card className="overflow-hidden border-border/60">
                        <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent p-6 pb-0">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <DocumentHeaderMeta
                                    title={doc.title}
                                    fileIcon={<FileIcon className="h-7 w-7" />}
                                    fileColorClass={fileColorClass}
                                    status={doc.status}
                                    importance={doc.importance}
                                    fileType={doc.file_type}
                                    fileSize={formatFileSize(doc.file_size)}
                                />

                                <DocumentHeaderActions
                                    onStar={() => console.log('Star')}
                                    onPin={() => console.log('Pin')}
                                    onShare={() => console.log('Share')}
                                    onDownload={() => console.log('Download')}
                                    onEdit={() => console.log('Edit')}
                                    onMore={() => console.log('More')}
                                />
                            </div>
                        </div>

                        {/* Tabs Section */}
                        <div className="px-6">
                            <DocumentTabsContainer
                                doc={doc}
                                fileTypeColors={fileTypeColors}
                                comments={comments}
                                onDetailsRender={() => { }}
                            />
                        </div>
                    </Card>

                    {/* Details Tab Content - Only shown when Details tab is active */}
                    <div className="hidden">
                        <DocumentDetailsContent
                            doc={doc}
                            fileIcon={<FileIcon className="h-8 w-8" />}
                            fileColorClass={fileColorClass}
                            fileTypeColors={fileTypeColors}
                        />
                    </div>

                    {/* Comments Section */}
                    <DocumentCommentsCard
                        comments={comments}
                        onAddComment={(comment) => console.log('New comment:', comment)}
                    />
                </div>
            </main>
        </div>
=======
  if (isError || !doc) {
    const errorMessage =
      error?.message || t("documentViewPage.documentNotFound");
    const isPermissionError = errorMessage.includes("Permission");

    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">
          {isPermissionError
            ? t("common:common.accessDenied")
            : t("documentViewPage.documentNotFound")}
        </h2>
        <p className="text-muted-foreground">
          {isPermissionError
            ? t("documentViewPage.noPermission")
            : t("documentViewPage.documentNotFoundDescription")}
        </p>
        <Button variant="outline" asChild>
          <Link
            to="/$tenant/documents"
            params={{ tenant: tenant?.tenantId ?? "" }}
          >
            <ArrowLeft className="me-2 h-4 w-4 rtl:rotate-180" />{" "}
            {t("documentViewPage.backToDocuments")}
          </Link>
        </Button>
      </div>
>>>>>>> Stashed changes
    );
  }

  const fileExt = (doc.extension || "").toLowerCase();
  const FileIcon = fileTypeIcons[fileExt] || File;
  const fileColorClass =
    fileTypeColors[fileExt] || "bg-muted text-muted-foreground";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Breadcrumb */}
          <DocumentPageBreadcrumb
            tenantId={tenant?.tenantId ?? ""}
            documentTitle={doc.title}
          />

          {/* Header Card */}
          <Card className="overflow-hidden border-border/60">
            <div className="bg-linear-to-r from-primary/5 via-primary/3 to-transparent p-6 pb-0">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <DocumentHeaderMeta
                  title={doc.title}
                  fileIcon={<FileIcon className="h-7 w-7" />}
                  fileColorClass={fileColorClass}
                  status="active"
                  importance={doc.importance}
                  fileType={fileExt}
                  fileSize={formatFileSize(
                    doc.size,
                    t("documentViewPage.notAvailable"),
                  )}
                />

                <DocumentHeaderActions
                  documentId={numId}
                  onShare={() => setIsShareOpen(true)}
                  onDownload={() => console.log("Download")}
                  onEdit={() => console.log("Edit")}
                  onMore={() => console.log("More")}
                />
              </div>
            </div>

            {/* Tabs Section */}
            <div className="px-6">
              <DocumentTabsContainer doc={doc} onDetailsRender={() => {}} />
            </div>
          </Card>

          {/* Comments Section */}
          <CommentsPanel documentId={numId} />
        </div>
      </main>

      <CreateShareDialog
        documentId={numId}
        documentTitle={doc.title}
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
      />
    </div>
  );
}
