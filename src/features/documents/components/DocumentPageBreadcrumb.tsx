import React, { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

interface DocumentPageBreadcrumbProps {
    tenantId: string;
    documentTitle: string;
}

const DocumentPageBreadcrumb: React.FC<DocumentPageBreadcrumbProps> = ({ tenantId, documentTitle }) => {
    const { t } = useTranslation(['documents', 'common']);
    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
                to="/$tenant/documents"
                params={{ tenant: tenantId ?? '' }}
                className="hover:text-foreground transition-colors flex items-center gap-1"
            >
                <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
                {t('common:nav.documents')}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[300px]">{documentTitle}</span>
        </div>
    );
};

export default React.memo(DocumentPageBreadcrumb);
