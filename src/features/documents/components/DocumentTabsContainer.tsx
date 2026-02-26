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

    return (
        <Tabs defaultValue="details" className="w-full">
            <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 gap-0 mt-4">
                <TabsTrigger
                    value="details"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-2 text-sm"
                >
                    Details
                </TabsTrigger>
                <TabsTrigger
                    value="activity"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-2 text-sm"
                >
                    Activity
                </TabsTrigger>
                <TabsTrigger
                    value="versions"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-2 text-sm"
                >
                    Versions
                </TabsTrigger>
                <TabsTrigger
                    value="permissions"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-2 text-sm"
                >
                    Permissions
                </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="py-6">
                <DocumentDetailsTab
                    mainContent={<div>{/* Rendered by parent */}</div>}
                    sidebar={<div>{/* Rendered by parent */}</div>}
                />
            </TabsContent>

            <TabsContent value="activity" className="py-6">
                <DocumentActivity activities={formattedActivities} />
            </TabsContent>

            <TabsContent value="versions" className="py-6">
                <DocumentVersions versions={formattedVersions} />
            </TabsContent>

            <TabsContent value="permissions" className="py-6">
                <DocumentPermissions people={accessControl} />
            </TabsContent>
        </Tabs>
    );
};

export default React.memo(DocumentTabsContainer);
