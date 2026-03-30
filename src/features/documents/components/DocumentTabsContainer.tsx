import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import DocumentActivity from './DocumentActivity';
import DocumentVersions from './DocumentVersions';
import DocumentPermissions from './DocumentPermissions';
import { Eye, Pencil, MessageSquare, Share2, FileText, FileIcon } from 'lucide-react';
import { format, parse } from 'date-fns';
import type { DocumentViewData } from '../types/api.types';
import DocumentDetailsContent from './DocumentDetailsContent';

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

const activityIcons: Record<string, React.ComponentType<{ className: string }>> = {
    edit: Pencil,
    view: Eye,
    comment: MessageSquare,
    share: Share2,
    create: FileText,
};

const DocumentTabsContainer: React.FC<TabContainerProps> = ({
    doc,
}) => {
    const formattedActivities = useMemo(() => {
        // Map real API activities to the format needed by DocumentActivity
        return (doc.document_activities || []).map((activity) => {
            let formattedDate = 'N/A';
            try {
                const dateStr = activity.created_at?.trim() || '';
                let parsedDate: Date;

                if (dateStr.includes('T')) {
                    // ISO format: "2026-03-17T12:05:18.000000Z"
                    parsedDate = new Date(dateStr);
                } else if (dateStr.includes('/')) {
                    // DD/MM/YYYY format: "17/03/2026"
                    parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
                } else if (dateStr.includes('-')) {
                    // ISO date only: "2026-03-17"
                    parsedDate = new Date(dateStr);
                } else {
                    throw new Error('Unrecognized date format');
                }

                if (!isNaN(parsedDate.getTime())) {
                    formattedDate = format(parsedDate, 'MMM d, yyyy · h:mm a');
                }
            } catch (error) {
                console.warn(`Failed to parse date: ${activity.created_at}`, error);
                formattedDate = activity.created_at || 'N/A';
            }

            return {
                id: String(activity.id),
                user: `User ${activity.user_id}`,
                action: activity.action,
                date: formattedDate,
                icon: React.createElement(activityIcons[activity.action] || Eye, { className: 'h-4 w-4 text-muted-foreground' }),
            };
        });
    }, [doc.document_activities]);

    const formattedVersions = useMemo(() => {
        // Map real version history to the format needed by DocumentVersions
        return (doc.version_history || []).map((v) => {
            let formattedDate = 'N/A';
            try {
                // Check if it's ISO format (contains T or hyphen) or DD/MM/YYYY format
                const dateStr = v.created_at?.trim() || '';
                let parsedDate: Date;

                if (dateStr.includes('T')) {
                    // ISO format: "2026-03-17T12:05:18.000000Z"
                    parsedDate = new Date(dateStr);
                } else if (dateStr.includes('/')) {
                    // DD/MM/YYYY format: "17/03/2026"
                    parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
                } else if (dateStr.includes('-')) {
                    // ISO date only: "2026-03-17"
                    parsedDate = new Date(dateStr);
                } else {
                    throw new Error('Unrecognized date format');
                }

                // Validate the parsed date
                if (!isNaN(parsedDate.getTime())) {
                    formattedDate = format(parsedDate, 'MMM d, yyyy');
                }
            } catch (error) {
                console.warn(`Failed to parse date: ${v.created_at}`, error);
                // Use the raw date string as fallback
                formattedDate = v.created_at || 'N/A';
            }

            return {
                id: String(v.id),
                version: v.version,
                user: v.uploaded_by?.name || 'Unknown',
                date: formattedDate,
                size: v.size || '0',
                note: v.version_description || '',
            };
        });
    }, [doc.version_history]);

    const accessControl = useMemo(() => {
        // Build access control from API data
        const people = [];

        // Add the document uploader as Owner
        if (doc.uploaded_by) {
            people.push({
                id: String(doc.uploaded_by.id),
                name: doc.uploaded_by.name,
                role: 'Owner',
                avatar: doc.uploaded_by.avatar || doc.uploaded_by.name.substring(0, 2).toUpperCase(),
            });
        }

        if (doc.cc) {
            doc.cc.forEach((ccUser, index) => {
                people.push({
                    id: `cc-${index}`,
                    name: ccUser,
                    role: 'Viewer',
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
    }, [doc.uploaded_by]);

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
                <DocumentPermissions people={accessControl} />
            </TabsContent>
        </Tabs>
    );
};

export default React.memo(DocumentTabsContainer);
