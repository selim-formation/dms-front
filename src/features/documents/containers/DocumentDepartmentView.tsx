/**
 * DocumentDepartmentView - Container Component
 * Renders documents grouped by department (renewable/one-time)
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation(['documents', 'common']);
    const hasAnyDocs = renewal.length > 0 || oneTime.length > 0;

    if (!hasAnyDocs) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">{t('departmentView.emptyState')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {renewal.length > 0 && (
                <div>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <span className="w-1 h-6 bg-chart-1 rounded"></span>
                            {t('departmentView.renewableDocuments', { count: renewal.length })}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {t('departmentView.renewableDescription')}
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
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <span className="w-1 h-6 bg-chart-2 rounded"></span>
                            {t('departmentView.oneTimeDocuments', { count: oneTime.length })}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {t('departmentView.oneTimeDescription')}
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
