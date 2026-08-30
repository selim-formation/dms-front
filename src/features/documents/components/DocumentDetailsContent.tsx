<<<<<<< Updated upstream
import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { ExternalLink, FileText, Tag, Building2, FolderOpen, User, Calendar, Clock, Bell, Share2, Copy } from 'lucide-react';
import { format } from 'date-fns';

interface DocumentDetailsContentProps {
    doc: any;
    fileIcon: React.ReactNode;
    fileColorClass: string;
    fileTypeColors: Record<string, string>;
}

const DocumentDetailsContent: React.FC<DocumentDetailsContentProps> = ({
    doc,
    fileIcon,
    fileColorClass,
    fileTypeColors,
}) => {
    const relatedDocuments = [
        { title: 'Q3 2024 Revenue Analysis', type: 'pdf' },
        { title: 'Annual Budget Plan 2025', type: 'xlsx' },
        { title: 'Board Meeting Minutes – Dec 2024', type: 'docx' },
    ];

    const handleDocumentClick = useCallback((id: string) => {
        console.log('Navigate to document:', id);
    }, []);
=======
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
  // document_activities heuristic — shares the same cache the comments
  // panel writes to, so it stays in sync when comments are added/removed.
  const { meta: commentsMeta } = useDocumentComments(doc.id, { perPage: 1 });

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
>>>>>>> Stashed changes

  console.log("DocumentDetailsContent rendered with document:", doc);

<<<<<<< Updated upstream
                {/* Description */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            This document contains the quarterly financial report for Q4 2024, including revenue analysis, expense breakdown, and projections for the upcoming fiscal year. All data has been reviewed and approved by the finance department.
                        </p>
                    </CardContent>
                </Card>

                {/* Related Documents */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Related Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {relatedDocuments.map((rd, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                                onClick={() => handleDocumentClick(String(i))}
                            >
                                <div className={`h-9 w-9 rounded-lg ${fileTypeColors[rd.type] || 'bg-muted text-muted-foreground'} flex items-center justify-center`}>
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                        {rd.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground uppercase">.{rd.type}</p>
                                </div>
                                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Metadata */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <MetaRow icon={Tag} label="Category" value={doc.category.name} />
                        <MetaRow icon={Building2} label="Department" value={doc.department.name} />
                        <MetaRow icon={FolderOpen} label="Entity" value={doc.entity.name} />
                        <Separator />
                        <MetaRow icon={User} label="Created by" value={doc.created_by.name} />
                        <MetaRow icon={Calendar} label="Created" value={format(new Date(doc.created_at), 'MMM d, yyyy')} />
                        <MetaRow icon={Clock} label="Last modified" value={format(new Date(doc.updated_at), 'MMM d, yyyy')} />
                        {doc.reminder_date && (
                            <>
                                <Separator />
                                <MetaRow icon={Bell} label="Reminder" value={format(new Date(doc.reminder_date), 'MMM d, yyyy')} highlight />
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Stats & Quick Actions */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Engagement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 rounded-lg bg-muted/50">
                                <p className="text-2xl font-bold text-foreground">245</p>
                                <p className="text-xs text-muted-foreground">Views</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-muted/50">
                                <p className="text-2xl font-bold text-foreground">3</p>
                                <p className="text-xs text-muted-foreground">Comments</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-muted/50">
                                <p className="text-2xl font-bold text-foreground">42</p>
                                <p className="text-xs text-muted-foreground">Downloads</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-foreground mb-2">Collaborators</h4>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex -space-x-2">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold border-2 border-white">
                                        SC
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold border-2 border-white">
                                        JP
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold border-2 border-white">
                                        LM
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground">+2 more</span>
                            </div>
                            <Button variant="outline" className="w-full justify-start" size="sm">
                                <Share2 className="mr-2 h-4 w-4" /> Add Collaborator
                            </Button>
                            <Button variant="outline" className="w-full justify-start" size="sm">
                                <User className="mr-2 h-4 w-4" /> Manage Access
                            </Button>
                            <Button variant="outline" className="w-full justify-start" size="sm">
                                <Copy className="mr-2 h-4 w-4" /> Duplicate
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
=======
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
              <Button variant="outline" size="sm">
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
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
const MetaRow: React.FC<MetaRowProps> = ({ icon: Icon, label, value, highlight }) => {
    return (
        <div className="flex items-center gap-3">
            <Icon className={`h-4 w-4 flex-shrink-0 ${highlight ? 'text-warning' : 'text-muted-foreground'}`} />
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-sm font-medium ${highlight ? 'text-warning' : 'text-foreground'}`}>{value}</p>
            </div>
        </div>
    );
=======
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
>>>>>>> Stashed changes
};

export default React.memo(DocumentDetailsContent);
