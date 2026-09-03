import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import DocumentActivity from "./DocumentActivity";
import DocumentVersions from "./DocumentVersions";
import DocumentPermissions from "./DocumentPermissions";
import {
  Eye,
  Pencil,
  MessageSquare,
  Share2,
  FileText,
  FileIcon,
} from "lucide-react";
import { format, parse } from "date-fns";
import type { DocumentViewData } from "../types/api.types";
import DocumentDetailsContent from "./DocumentDetailsContent";

interface Comment {
  id: number | string;
  author: string;
  role: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
}

interface TabContainerProps {
  doc: DocumentViewData;
  fileTypeColors?: Record<string, string>;
  comments?: Comment[];
  onDetailsRender?: (content: React.ReactNode) => void;
}

const activityIcons: Record<
  string,
  React.ComponentType<{ className: string }>
> = {
  edit: Pencil,
  view: Eye,
  comment: MessageSquare,
  share: Share2,
  create: FileText,
};

const DocumentTabsContainer: React.FC<TabContainerProps> = ({ doc }) => {
  const { t } = useTranslation(["documents", "common"]);
  const notAvailableLabel = t("documentTabsContainer.notAvailable");
  const formattedActivities = useMemo(() => {
    // Map real API activities to the format needed by DocumentActivity
    return (doc.document_activities || []).map((activity) => {
      let formattedDate = notAvailableLabel;
      try {
        const dateStr = activity.created_at?.trim() || "";
        let parsedDate: Date;

        if (dateStr.includes("T")) {
          // ISO format: "2026-03-17T12:05:18.000000Z"
          parsedDate = new Date(dateStr);
        } else if (dateStr.includes("/")) {
          // DD/MM/YYYY format: "17/03/2026"
          parsedDate = parse(dateStr, "dd/MM/yyyy", new Date());
        } else if (dateStr.includes("-")) {
          // ISO date only: "2026-03-17"
          parsedDate = new Date(dateStr);
        } else {
          throw new Error("Unrecognized date format");
        }

        if (!isNaN(parsedDate.getTime())) {
          formattedDate = format(parsedDate, "MMM d, yyyy · h:mm a");
        }
      } catch (error) {
        console.warn(`Failed to parse date: ${activity.created_at}`, error);
        formattedDate = activity.created_at || notAvailableLabel;
      }

      return {
        id: String(activity.id),
        user: t("documentTabsContainer.userLabel", { id: activity.user_id }),
        action: activity.action,
        date: formattedDate,
        icon: React.createElement(activityIcons[activity.action] || Eye, {
          className: "h-4 w-4 text-muted-foreground",
        }),
      };
    });
  }, [doc.document_activities, notAvailableLabel, t]);

  const formatVersionDate = (dateStr: string | undefined | null): string => {
    const trimmed = dateStr?.trim() || "";
    try {
      let parsedDate: Date;
      if (trimmed.includes("T")) {
        // ISO format: "2026-03-17T12:05:18.000000Z"
        parsedDate = new Date(trimmed);
      } else if (trimmed.includes("/")) {
        // DD/MM/YYYY format: "17/03/2026"
        parsedDate = parse(trimmed, "dd/MM/yyyy", new Date());
      } else if (trimmed.includes("-")) {
        // ISO date only: "2026-03-17"
        parsedDate = new Date(trimmed);
      } else {
        throw new Error("Unrecognized date format");
      }
      if (!isNaN(parsedDate.getTime())) {
        return format(parsedDate, "MMM d, yyyy");
      }
    } catch (error) {
      console.warn(`Failed to parse date: ${dateStr}`, error);
    }
    return trimmed || notAvailableLabel;
  };

  const formattedVersions = useMemo(() => {
    // version_history deliberately EXCLUDES the current/latest version (see
    // DocumentResource docs) — its own fields live at the top level of
    // `doc`, so prepend it here rather than letting the oldest entry in
    // version_history wrongly get treated as "current".
    const current = {
      id: `current-${doc.id}`,
      version: doc.version,
      user: doc.uploaded_by?.name || t("documentTabsContainer.unknownUser"),
      date: formatVersionDate(doc.updated_at),
      size: doc.size || "0",
      note: t("documentTabsContainer.currentVersionNote"),
      path: doc.path,
      isCurrent: true,
    };

    const history = (doc.version_history || []).map((v) => ({
      id: String(v.id),
      versionId: v.id,
      version: v.version,
      user: v.uploaded_by?.name || t("documentTabsContainer.unknownUser"),
      date: formatVersionDate(v.created_at),
      size: v.size || "0",
      note: v.version_description || "",
      path: v.path ?? "",
      isCurrent: false,
    }));

    return [current, ...history];
  }, [doc.id, doc.version, doc.uploaded_by, doc.updated_at, doc.size, doc.path, doc.version_history, notAvailableLabel, t]);

  const accessControl = useMemo(() => {
    // Build access control from API data
    const people = [];

    // Add the document uploader as Owner
    if (doc.uploaded_by) {
      people.push({
        id: String(doc.uploaded_by.id),
        name: doc.uploaded_by.name,
        role: t("documentTabsContainer.roleOwner"),
        avatar:
          doc.uploaded_by.avatar ||
          doc.uploaded_by.name.substring(0, 2).toUpperCase(),
      });
    }

    if (doc.cc) {
      doc.cc.forEach((ccUser, index) => {
        people.push({
          id: `cc-${index}`,
          name: ccUser,
          role: t("documentTabsContainer.roleViewer"),
          avatar: ccUser.substring(0, 2).toUpperCase(),
        });
      });
    }

    // Add additional placeholder users for now (this should come from API in the future)
    // These are fallback values until proper permissions API is available
    // if (people.length === 0) {
    //     people.push(
    //         { id: '1', name: 'Document Owner', role: 'Owner', avatar: 'DO' },
    //     );
    // }

    // people.push(
    //     { id: '2', name: 'Engineering Team', role: 'Viewer', avatar: 'ET' },
    // );

    return people;
  }, [doc.uploaded_by, doc.cc, t]);

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 gap-0 mt-4">
        <TabsTrigger
          value="details"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-2 text-sm"
        >
          {t("documentTabsContainer.tabs.details")}
        </TabsTrigger>
        <TabsTrigger
          value="activity"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-2 text-sm"
        >
          {t("documentTabsContainer.tabs.activity")}
        </TabsTrigger>
        <TabsTrigger
          value="versions"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-2 text-sm"
        >
          {t("documentTabsContainer.tabs.versions")}
        </TabsTrigger>
        <TabsTrigger
          value="permissions"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-2 text-sm"
        >
          {t("documentTabsContainer.tabs.permissions")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="py-6">
        <DocumentDetailsContent
          doc={doc}
          fileIcon={<FileIcon className="h-8 w-8" />}
          fileColorClass="bg-muted text-muted-foreground"
        />
      </TabsContent>

      <TabsContent value="activity" className="py-6">
        <DocumentActivity activities={formattedActivities} />
      </TabsContent>

      <TabsContent value="versions" className="py-6">
        <DocumentVersions versions={formattedVersions} documentId={doc.id} documentTitle={doc.title} />
      </TabsContent>

      <TabsContent value="permissions" className="py-6">
        <DocumentPermissions people={accessControl} documentId={doc.id} documentTitle={doc.title} />
      </TabsContent>
    </Tabs>
  );
};

export default React.memo(DocumentTabsContainer);
