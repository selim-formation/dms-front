/**
 * DocumentTypeView - Container Component
 * Renders documents grouped by type (establishment/operational)
 */

import React from 'react';
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
        <div className={`border-l-4 ${borderColor} pl-6`}>
            <h2 className="text-xl font-bold text-gray-900 mb-8">{title}</h2>
            <div className="space-y-12">
                {categories.map((cat) =>
                    cat.docs.length > 0 ? (
                        <div key={cat.label}>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <span className={`w-1 h-6 rounded ${cat.color}`}></span>
                                    {cat.icon} {cat.label} ({cat.docs.length})
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">{cat.desc}</p>
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
    const hasAnyDocs =
        establishment.renewal.length > 0 ||
        establishment.oneTime.length > 0 ||
        operational.renewal.length > 0 ||
        operational.oneTime.length > 0;

    if (!hasAnyDocs) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">No documents found for this type</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <SectionBlock
                title="Establishment Documents"
                borderColor="border-green-500"
                categories={[
                    {
                        label: 'Renewable',
                        icon: '✓',
                        color: 'bg-blue-500',
                        docs: establishment.renewal,
                        desc: 'Establishment documents requiring renewal',
                    },
                    {
                        label: 'One-Time',
                        icon: '◆',
                        color: 'bg-amber-500',
                        docs: establishment.oneTime,
                        desc: 'One-time establishment documents',
                    },
                ]}
                searchQuery={searchQuery}
                onUploadClick={onUploadClick}
            />

            <SectionBlock
                title="Operational Documents"
                borderColor="border-purple-500"
                categories={[
                    {
                        label: 'Renewable',
                        icon: '✓',
                        color: 'bg-blue-500',
                        docs: operational.renewal,
                        desc: 'Operational documents requiring renewal',
                    },
                    {
                        label: 'One-Time',
                        icon: '◆',
                        color: 'bg-amber-500',
                        docs: operational.oneTime,
                        desc: 'One-time operational documents',
                    },
                ]}
                searchQuery={searchQuery}
                onUploadClick={onUploadClick}
            />
        </div>
    );
}
