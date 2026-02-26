import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface DocumentBreadcrumbProps {
    tenantId: string;
    documentTitle: string;
}

const DocumentBreadcrumb: React.FC<DocumentBreadcrumbProps> = ({ tenantId, documentTitle }) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button
                onClick={() => navigate({ to: `/${tenantId}/documents` })}
                className="hover:text-foreground transition-colors flex items-center gap-1"
            >
                <ArrowLeft className="h-3.5 w-3.5" />
                Documents
            </button>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[300px]">
                {documentTitle}
            </span>
        </div>
    );
};

export default React.memo(DocumentBreadcrumb);
