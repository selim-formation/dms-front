<<<<<<< Updated upstream
import React, { useCallback, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import DocumentActivity from './DocumentActivity';
import DocumentVersions from './DocumentVersions';
import DocumentPermissions from './DocumentPermissions';
import DocumentDetailsTab from './DocumentDetailsTab';
import { Eye, Pencil, MessageSquare, Share2, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface TabContainerProps {
    doc: any;
    fileTypeColors: Record<string, string>;
    comments: any[];
    onDetailsRender: (content: React.ReactNode) => void;
}

const MOCK_ACTIVITIES = [
    { id: 1, type: 'edit', user: 'Sarah Chen', action: 'Updated document content', date: '2024-12-15T14:30:00Z' },
    { id: 2, type: 'view', user: 'James Park', action: 'Viewed the document', date: '2024-12-14T10:15:00Z' },
    { id: 3, type: 'comment', user: 'Lisa Müller', action: 'Added a comment: "Please review section 3"', date: '2024-12-13T16:45:00Z' },
    { id: 4, type: 'share', user: 'Sarah Chen', action: 'Shared with Engineering team', date: '2024-12-12T09:00:00Z' },
    { id: 5, type: 'create', user: 'Sarah Chen', action: 'Created the document', date: '2024-12-01T10:00:00Z' },
];

const MOCK_VERSIONS = [
    { id: 1, version: '3.0', user: 'Sarah Chen', date: '2024-12-15T14:30:00Z', size: 2456000, note: 'Updated financial projections' },
    { id: 2, version: '2.0', user: 'Sarah Chen', date: '2024-12-10T11:00:00Z', size: 2200000, note: 'Added Q4 revenue data' },
    { id: 3, version: '1.0', user: 'Sarah Chen', date: '2024-12-01T10:00:00Z', size: 1800000, note: 'Initial version' },
];

const activityIcons: Record<string, any> = {
    edit: Pencil,
    view: Eye,
    comment: MessageSquare,
    share: Share2,
    create: FileText,
};

const DocumentTabsContainer: React.FC<TabContainerProps> = ({
    doc,
    fileTypeColors,
    comments,
    onDetailsRender,
}) => {
    const formattedActivities = useMemo(() => {
        return MOCK_ACTIVITIES.map((activity) => ({
            id: String(activity.id),
            user: activity.user,
            action: activity.action,
            date: format(new Date(activity.date), 'MMM d, yyyy · h:mm a'),
            icon: React.createElement(activityIcons[activity.type] || Eye, { className: 'h-4 w-4 text-muted-foreground' }),
        }));
    }, []);

    const formattedVersions = useMemo(() => {
        return MOCK_VERSIONS.map((v) => ({
            id: String(v.id),
            version: v.version,
            user: v.user,
            date: format(new Date(v.date), 'MMM d, yyyy'),
            size: v.size,
            note: v.note,
        }));
    }, []);

    const accessControl = [
        { id: '1', name: 'Sarah Chen', role: 'Owner', avatar: 'SC' },
        { id: '2', name: 'James Park', role: 'Editor', avatar: 'JP' },
        { id: '3', name: 'Lisa Müller', role: 'Viewer', avatar: 'LM' },
        { id: '4', name: 'Engineering Team', role: 'Viewer', avatar: 'ET' },
    ];
=======
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

  const formattedVersions = useMemo(() => {
    // Map real version history to the format needed by DocumentVersions
    return (doc.version_history || []).map((v) => {
      let formattedDate = notAvailableLabel;
      try {
        // Check if it's ISO format (contains T or hyphen) or DD/MM/YYYY format
        const dateStr = v.created_at?.trim() || "";
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

        // Validate the parsed date
        if (!isNaN(parsedDate.getTime())) {
          formattedDate = format(parsedDate, "MMM d, yyyy");
        }
      } catch (error) {
        console.warn(`Failed to parse date: ${v.created_at}`, error);
        // Use the raw date string as fallback
        formattedDate = v.created_at || notAvailableLabel;
      }

      return {
        id: String(v.id),
        version: v.version,
        user: v.uploaded_by?.name || t("documentTabsContainer.unknownUser"),
        date: formattedDate,
        size: v.size || "0",
        note: v.version_description || "",
      };
    });
  }, [doc.version_history, notAvailableLabel, t]);

  const accessControl = useMemo(() => {
    // Build access control from API data
    const people = [];
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
            <TabsContent value="details" className="py-6">
                <DocumentDetailsTab
                    mainContent={<div>{/* Rendered by parent */}</div>}
                    sidebar={<div>{/* Rendered by parent */}</div>}
                />
            </TabsContent>
=======
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
>>>>>>> Stashed changes

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
        <DocumentVersions versions={formattedVersions} />
      </TabsContent>

      <TabsContent value="permissions" className="py-6">
        <DocumentPermissions people={accessControl} documentId={doc.id} documentTitle={doc.title} />
      </TabsContent>
    </Tabs>
  );
};

export default React.memo(DocumentTabsContainer);
