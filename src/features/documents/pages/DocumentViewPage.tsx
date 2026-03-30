import { useParams, Link } from '@tanstack/react-router';
import { useDocument } from '../hooks/useDocument';
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

function formatFileSize(bytes: string | number | null): string {
    if (!bytes) return 'N/A';
    const numBytes = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
    if (isNaN(numBytes)) return 'N/A';
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
    pdf: 'bg-destructive/10 text-destructive',
    docx: 'bg-primary/10 text-primary',
    doc: 'bg-primary/10 text-primary',
    xlsx: 'bg-success/10 text-success',
    xls: 'bg-success/10 text-success',
    md: 'bg-muted text-muted-foreground',
    zip: 'bg-warning/10 text-warning',
    sdf: 'bg-muted text-muted-foreground',
};

const comments = [
    {
        id: 1,
        author: 'Jordan Lee',
        role: 'Senior Developer',
        avatar: '👩‍💻',
        time: '2 hours ago',
        content:
            'Great roadmap! I particularly like the microservices migration timeline. Let me know if you need more details on the infrastructure side.',
        likes: 5,
    },
    {
        id: 2,
        author: 'Morgan Smith',
        role: 'Product Manager',
        avatar: '👨‍💼',
        time: '4 hours ago',
        content:
            'This aligns perfectly with our product strategy. Have we considered the API deprecation impact on mobile?',
        likes: 3,
    },
    {
        id: 3,
        author: 'Casey Wong',
        role: 'Tech Lead',
        avatar: '👩‍💼',
        time: '1 day ago',
        content: 'Excellent work on the timeline estimation. I will coordinate with my team on the security audit phase.',
        likes: 8,
    },
];


export default function DocumentViewPage() {
    const tenant = useTenant();
    const { id } = useParams({ from: '/_protected/$tenant/documents/$id' });
    const numId = Number(id);

    const { data: doc, isLoading, isError, error } = useDocument(numId, {
        enabled: !!numId && !!tenant?.tenantId,
    });

    if (isLoading) return <DocumentViewSkeleton />;

    if (isError || !doc) {
        const errorMessage = error?.message || 'Document not found';
        const isPermissionError = errorMessage.includes('Permission');

        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <AlertTriangle className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold text-foreground">
                    {isPermissionError ? "Access Denied" : "Document not found"}
                </h2>
                <p className="text-muted-foreground">
                    {isPermissionError
                        ? "You don't have permission to view this document."
                        : "The document you're looking for doesn't exist or has been removed."}
                </p>
                <Button variant="outline" asChild>
                    <Link to="/$tenant/documents" params={{ tenant: tenant?.tenantId ?? '' }}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Documents
                    </Link>
                </Button>
            </div>
        );
    }

    const fileExt = (doc.extension || '').toLowerCase();
    const FileIcon = fileTypeIcons[fileExt] || File;
    const fileColorClass = fileTypeColors[fileExt] || 'bg-muted text-muted-foreground';

    console.log('Document data:', doc);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="space-y-6">
                    {/* Breadcrumb */}
                    <DocumentPageBreadcrumb
                        tenantId={tenant?.tenantId ?? ''}
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
                                    fileSize={formatFileSize(doc.size)}
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
    );
}
