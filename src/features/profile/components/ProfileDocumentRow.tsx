import { memo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { FileText } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { ProfileDocument } from '../types/profile.types';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    approved: 'default',
    pending: 'secondary',
    rejected: 'destructive',
    draft: 'outline',
};

interface ProfileDocumentRowProps {
    document: ProfileDocument;
}

function ProfileDocumentRow({ document }: ProfileDocumentRowProps) {
    const navigate = useNavigate();
    const tenant = useTenantId();
    const variant = STATUS_VARIANT[document.status?.toLowerCase()] ?? 'outline';

    return (
        <button
            onClick={() => navigate({ to: `/${tenant}/documents/${document.id}` })}
            className="w-full flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-start hover:shadow-md hover:border-primary transition-all"
        >
            <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{document.title}</p>
                <p className="text-xs text-muted-foreground">
                    {new Date(document.created_at).toLocaleDateString()}
                </p>
            </div>
            {document.status && (
                <Badge variant={variant} className="capitalize shrink-0">
                    {document.status}
                </Badge>
            )}
        </button>
    );
}

export default memo(ProfileDocumentRow);
