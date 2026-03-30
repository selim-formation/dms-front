/**
 * DocumentDepartmentView - Container Component
 * Renders documents grouped by department (renewable/one-time)
 */

import React from 'react';
import DocumentsGridSection from '@/features/documents/components/DocumentsGridSection';
import type { GridDocument } from '../adapters/documentAdapter';

interface DepartmentViewProps {
    renewal: GridDocument[];
    oneTime: GridDocument[];
    searchQuery: string;
    onUploadClick: () => void;
}

export default function DocumentDepartmentView({
    renewal,
    oneTime,
    searchQuery,
    onUploadClick,
}: DepartmentViewProps): React.ReactElement {
    const hasAnyDocs = renewal.length > 0 || oneTime.length > 0;

    if (!hasAnyDocs) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">No documents found in this department</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {renewal.length > 0 && (
                <div>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-1 h-6 bg-blue-500 rounded"></span>
                            Renewable Documents ({renewal.length})
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Documents that require periodic renewal
                        </p>
                    </div>
                    <DocumentsGridSection
                        documents={renewal}
                        searchQuery={searchQuery}
                        onUploadClick={onUploadClick}
                    />
                </div>
            )}

            {oneTime.length > 0 && (
                <div>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-1 h-6 bg-amber-500 rounded"></span>
                            One-Time Documents ({oneTime.length})
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            One-time documents that don't require renewal
                        </p>
                    </div>
                    <DocumentsGridSection
                        documents={oneTime}
                        searchQuery={searchQuery}
                        onUploadClick={onUploadClick}
                    />
                </div>
            )}
        </div>
    );
}
