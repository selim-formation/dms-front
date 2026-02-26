import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

interface DocumentErrorStateProps {
    tenantId: string;
}

const DocumentErrorState: React.FC<DocumentErrorStateProps> = ({ tenantId }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <AlertTriangle className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Document not found</h2>
            <p className="text-muted-foreground">The document you're looking for doesn't exist or has been removed.</p>
            <Button
                variant="outline"
                onClick={() => navigate({ to: `/${tenantId}/documents` })}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Documents
            </Button>
        </div>
    );
};

export default React.memo(DocumentErrorState);
