import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Download, Eye, Loader2 } from 'lucide-react';
import { useDownloadDocument } from '../hooks/useDownloadDocument';

export interface Version {
    id: string;
    /** Numeric DocumentVersion PK — sent as `?version_id=` to the download endpoint. Omit for the current version (its own /download call needs none). */
    versionId?: number;
    version: number;
    note: string;
    user: string;
    date: string;
    size: string;
    /** Signed, time-limited file URL — used for "open in viewer" only, not for download (that goes through the backend so permissions/filename are correct). */
    path: string;
    isCurrent: boolean;
}

interface DocumentVersionsProps {
    versions: Version[];
    documentId: number;
    documentTitle: string;
}

const DocumentVersions: React.FC<DocumentVersionsProps> = ({ versions, documentId, documentTitle }) => {
    const { t } = useTranslation(['documents', 'common']);
    const { download, isDownloading } = useDownloadDocument();

    const handleView = (path: string) => {
        window.open(path, '_blank', 'noopener,noreferrer');
    };

    const handleDownload = (v: Version) => {
        download({
            documentId,
            versionId: v.versionId,
            filename: `${documentTitle}_v${v.version}`,
        });
    };

    return (
        <Card>
            <CardContent className="pt-6 space-y-4">
                {versions.map((v) => (
                    <div
                        key={v.id}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${v.isCurrent ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'
                            }`}
                    >
                        <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold ${v.isCurrent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            }`}>
                            {t('documentVersions.versionLabel', { version: v.version })}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{v.note}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {v.user} · {v.date} · {v.size}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {v.isCurrent && (
                                <Badge className="bg-primary/10 text-primary border-0">{t('documentVersions.current')}</Badge>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={!v.path}
                                onClick={() => handleView(v.path)}
                                title={t('documentVersions.view')}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={isDownloading}
                                onClick={() => handleDownload(v)}
                                title={t('documentVersions.download')}
                            >
                                {isDownloading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default React.memo(DocumentVersions);
