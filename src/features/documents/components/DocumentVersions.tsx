import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Download, ExternalLink, HardDrive, Loader2, User } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/lib/utils';
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

/** The API sends bytes as a plain number string; anything else is shown as-is. */
function formatSize(raw: string): string {
    const bytes = Number(raw);
    if (!raw || !Number.isFinite(bytes)) return raw;
    if (bytes < 1024) return `${bytes} B`;
    const units = ['KB', 'MB', 'GB'];
    let value = bytes / 1024;
    let i = 0;
    while (value >= 1024 && i < units.length - 1) {
        value /= 1024;
        i++;
    }
    return `${value.toFixed(1)} ${units[i]}`;
}

const MetaChip = memo(function MetaChip({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-1 text-xs text-muted-foreground">
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span dir="auto" className="truncate">{children}</span>
        </span>
    );
});

interface VersionItemProps {
    version: Version;
    isLast: boolean;
    isDownloading: boolean;
    onDownload: (v: Version) => void;
}

/** One timeline entry. Memoised: a download on one row re-renders only that row. */
const VersionItem = memo(function VersionItem({ version: v, isLast, isDownloading, onDownload }: VersionItemProps) {
    const { t } = useTranslation('documents');

    return (
        <li className="relative flex gap-4">
            {!isLast && <span className="absolute start-5 top-12 bottom-0 w-px bg-border" aria-hidden="true" />}
            <div
                className={cn(
                    'z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold tabular-nums',
                    v.isCurrent ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-border bg-card text-muted-foreground',
                )}
                aria-hidden="true"
            >
                {v.version}
            </div>

            <div
                className={cn(
                    'mb-5 min-w-0 flex-1 space-y-3 rounded-2xl border p-4 transition-colors',
                    v.isCurrent ? 'border-primary/30 bg-primary/5' : 'border-border/60 bg-card hover:border-border hover:bg-muted/30',
                )}
            >
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                    <div className="flex min-w-0 items-center gap-2">
                        <h4 className="truncate text-sm font-semibold text-foreground">{t('documentVersions.title', { version: v.version })}</h4>
                        {v.isCurrent && <Badge className="shrink-0 border-0 bg-primary/10 text-primary">{t('documentVersions.current')}</Badge>}
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 px-2.5"
                            disabled={!v.path}
                            onClick={() => window.open(v.path, '_blank', 'noopener,noreferrer')}
                            aria-label={t('documentVersions.view')}
                            title={t('documentVersions.view')}
                        >
                            <ExternalLink className="h-4 w-4 shrink-0" />
                            <span className="hidden md:inline">{t('documentVersions.view')}</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 px-2.5"
                            disabled={isDownloading}
                            onClick={() => onDownload(v)}
                            aria-label={t('documentVersions.download')}
                            title={t('documentVersions.download')}
                        >
                            {isDownloading ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" /> : <Download className="h-4 w-4 shrink-0" />}
                            <span className="hidden md:inline">{t('documentVersions.download')}</span>
                        </Button>
                    </div>
                </div>

                <p className={cn('text-sm', v.note ? 'text-muted-foreground' : 'text-muted-foreground/60')} dir="auto">
                    {v.note || t('documentVersions.noNote')}
                </p>

                <div className="flex flex-wrap gap-2">
                    <MetaChip icon={User}>{v.user}</MetaChip>
                    <MetaChip icon={CalendarDays}>{v.date}</MetaChip>
                    <MetaChip icon={HardDrive}>{formatSize(v.size)}</MetaChip>
                </div>
            </div>
        </li>
    );
});

const DocumentVersions: React.FC<DocumentVersionsProps> = ({ versions, documentId, documentTitle }) => {
    const { t } = useTranslation('documents');
    const { download, isDownloading } = useDownloadDocument();
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const handleDownload = useCallback(
        (v: Version) => {
            setDownloadingId(v.id);
            download({ documentId, versionId: v.versionId, filename: `${documentTitle}_v${v.version}` });
        },
        [download, documentId, documentTitle],
    );

    return (
        <section className="rounded-2xl border border-border bg-card p-4 sm:p-6" aria-label={t('documentVersions.heading')}>
            <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-foreground">{t('documentVersions.heading')}</h3>
                <Badge variant="outline">{t('documentVersions.count', { count: versions.length })}</Badge>
            </div>
            {versions.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">{t('documentVersions.empty')}</p>
            ) : (
            <ol>
                {versions.map((v, i) => (
                    <VersionItem key={v.id} version={v} isLast={i === versions.length - 1} isDownloading={isDownloading && downloadingId === v.id} onDownload={handleDownload} />
                ))}
            </ol>
            )}
        </section>
    );
};

export default memo(DocumentVersions);
