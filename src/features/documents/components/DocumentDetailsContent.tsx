import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { ExternalLink, FileText, Tag, Building2, FolderOpen, User, Calendar, Clock, Bell, Share2, Copy } from 'lucide-react';
import { format, parse } from 'date-fns';
import type { DocumentViewData } from '../types/api.types';

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

    // Calculate engagement metrics from real data
    const engagementMetrics = useMemo(() => {
        const viewCount = doc.document_activities?.filter(a => a.action === 'view').length || 0;
        const commentCount = doc.document_activities?.filter(a => a.action === 'comment').length || 0;
        const downloadCount = doc.document_activities?.filter(a => a.action === 'download').length || 0;

        return {
            views: viewCount,
            comments: commentCount,
            downloads: downloadCount,
        };
    }, [doc.document_activities]);

    // Format created/updated dates safely
    const formatDateSafe = (dateStr: string | null | undefined): string => {
        if (!dateStr) return 'N/A';
        try {
            if (dateStr.includes('T')) {
                return format(new Date(dateStr), 'MMM d, yyyy');
            } else if (dateStr.includes('/')) {
                const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
                if (!isNaN(parsed.getTime())) {
                    return format(parsed, 'MMM d, yyyy');
                }
            }
            return dateStr;
        } catch {
            return dateStr || 'N/A';
        }
    };

    console.log('DocumentDetailsContent rendered with document:', doc);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
                {/* Document Preview Placeholder */}
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className={`h-16 w-16 rounded-2xl ${fileColorClass} flex items-center justify-center`}>
                            {fileIcon}
                        </div>
                        <p className="text-muted-foreground text-sm">Document preview</p>
                        <Button variant="outline" size="sm">
                            <ExternalLink className="mr-2 h-4 w-4" /> Open in viewer
                        </Button>
                    </CardContent>
                </Card>

                {/* Description */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {doc.description || 'No description available for this document.'}
                        </p>
                    </CardContent>
                </Card>

                {/* Document Types/Categories */}
                {(doc.types && doc.types.length > 0) && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Document Types</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {doc.types.map((type) => (
                                <div
                                    key={type.id}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                                >
                                    <div className={`h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center`}>
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
                        <CardTitle className="text-base font-semibold">Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <MetaRow
                            icon={Tag}
                            label="Category"
                            value={doc.category === 'operational' ? 'Operational' : 'Establishment'}
                        />
                        {doc.departments && doc.departments.length > 0 && (
                            <MetaRow
                                icon={Building2}
                                label="Department"
                                value={doc.departments[0]?.title || 'N/A'}
                            />
                        )}
                        {doc.entities && doc.entities.length > 0 && (
                            <MetaRow
                                icon={FolderOpen}
                                label="Entity"
                                value={doc.entities[0]?.title || 'N/A'}
                            />
                        )}
                        <Separator />
                        <MetaRow
                            icon={User}
                            label="Uploaded by"
                            value={doc.uploaded_by?.name || 'N/A'}
                        />
                        <MetaRow
                            icon={Calendar}
                            label="Created"
                            value={formatDateSafe(doc.created_at)}
                        />
                        <MetaRow
                            icon={Clock}
                            label="Last modified"
                            value={formatDateSafe(doc.updated_at)}
                        />
                        {doc.expire_date && (
                            <>
                                <Separator />
                                <MetaRow
                                    icon={Bell}
                                    label="Expires"
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
                        <CardTitle className="text-base font-semibold">Engagement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 rounded-lg bg-muted/50">
                                <p className="text-2xl font-bold text-foreground">{engagementMetrics.views}</p>
                                <p className="text-xs text-muted-foreground">Views</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-muted/50">
                                <p className="text-2xl font-bold text-foreground">{engagementMetrics.comments}</p>
                                <p className="text-xs text-muted-foreground">Comments</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-muted/50">
                                <p className="text-2xl font-bold text-foreground">{engagementMetrics.downloads}</p>
                                <p className="text-xs text-muted-foreground">Downloads</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-foreground mb-2">Document Owner</h4>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                                    {doc.uploaded_by?.name?.substring(0, 2).toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground">
                                        {doc.uploaded_by?.name || 'Unknown'}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {doc.uploaded_by?.email || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full justify-start" size="sm">
                                <Share2 className="mr-2 h-4 w-4" /> Share Document
                            </Button>
                            <Button variant="outline" className="w-full justify-start" size="sm">
                                <Copy className="mr-2 h-4 w-4" /> Copy Link
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

interface MetaRowProps {
    icon: typeof Tag;
    label: string;
    value: string;
    highlight?: boolean;
}

const MetaRow: React.FC<MetaRowProps> = ({ icon: Icon, label, value, highlight }) => {
    return (
        <div className="flex items-center gap-3">
            <Icon className={`h-4 w-4 shrink-0 ${highlight ? 'text-warning' : 'text-muted-foreground'}`} />
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-sm font-medium ${highlight ? 'text-warning' : 'text-foreground'}`}>{value}</p>
            </div>
        </div>
    );
};

export default React.memo(DocumentDetailsContent);
