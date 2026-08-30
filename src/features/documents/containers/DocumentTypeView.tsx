/**
 * DocumentTypeView - Container Component
 * Renders documents grouped by type (establishment/operational)
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import DocumentsGridSection from '@/features/documents/components/DocumentsGridSection';
import type { GridDocument } from '../adapters/documentAdapter';

interface TypeViewProps {
    establishment: {
        renewal: GridDocument[];
        oneTime: GridDocument[];
    };
    operational: {
        renewal: GridDocument[];
        oneTime: GridDocument[];
    };
    searchQuery: string;
    onUploadClick: () => void;
}

interface SectionProps {
    title: string;
    borderColor: string;
    categories: Array<{ label: string; icon: string; color: string; docs: GridDocument[]; desc: string }>;
    searchQuery: string;
    onUploadClick: () => void;
}

const SectionBlock: React.FC<SectionProps> = ({ title, borderColor, categories, searchQuery, onUploadClick }) => {
    const hasAnyDocs = categories.some((cat) => cat.docs.length > 0);

    if (!hasAnyDocs) return null;

    return (
        <div className={`border-s-4 ${borderColor} ps-6`}>
            <h2 className="text-xl font-bold text-foreground mb-8">{title}</h2>
            <div className="space-y-12">
                {categories.map((cat) =>
                    cat.docs.length > 0 ? (
                        <div key={cat.label}>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <span className={`w-1 h-6 rounded ${cat.color}`}></span>
                                    {cat.icon} {cat.label} ({cat.docs.length})
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">{cat.desc}</p>
                            </div>
                            <DocumentsGridSection
                                documents={cat.docs}
                                searchQuery={searchQuery}
                                onUploadClick={onUploadClick}
                            />
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
};

export default function DocumentTypeView({
    establishment,
    operational,
    searchQuery,
    onUploadClick,
}: TypeViewProps): React.ReactElement {
    const { t } = useTranslation(['documents', 'common']);
    const hasAnyDocs =
        establishment.renewal.length > 0 ||
        establishment.oneTime.length > 0 ||
        operational.renewal.length > 0 ||
        operational.oneTime.length > 0;

    if (!hasAnyDocs) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">{t('typeView.emptyState')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <SectionBlock
                title={t('typeView.establishmentDocuments')}
                borderColor="border-chart-3"
                categories={[
                    {
                        label: t('typeView.renewable'),
                        icon: '✓',
                        color: 'bg-chart-1',
                        docs: establishment.renewal,
                        desc: t('typeView.establishmentRenewableDescription'),
                    },
                    {
                        label: t('typeView.oneTime'),
                        icon: '◆',
                        color: 'bg-chart-2',
                        docs: establishment.oneTime,
                        desc: t('typeView.establishmentOneTimeDescription'),
                    },
                ]}
                searchQuery={searchQuery}
                onUploadClick={onUploadClick}
            />

            <SectionBlock
                title={t('typeView.operationalDocuments')}
                borderColor="border-chart-4"
                categories={[
                    {
                        label: t('typeView.renewable'),
                        icon: '✓',
                        color: 'bg-chart-1',
                        docs: operational.renewal,
                        desc: t('typeView.operationalRenewableDescription'),
                    },
                    {
                        label: t('typeView.oneTime'),
                        icon: '◆',
                        color: 'bg-chart-2',
                        docs: operational.oneTime,
                        desc: t('typeView.operationalOneTimeDescription'),
                    },
                ]}
                searchQuery={searchQuery}
                onUploadClick={onUploadClick}
            />
        </div>
    );
}
