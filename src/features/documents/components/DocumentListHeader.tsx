import React from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { usePermissions } from '@/core/auth/hooks/usePermissions';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** Page title; the "New document" button shows only to users holding `create_documents`. */
const DocumentListHeader: React.FC = () => {
    const { t } = useTranslation(['documents', 'common']);
    const { can } = usePermissions();
    const tenant = useTenantId() ?? '';

    return (
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
                <h1 className="text-4xl font-bold text-foreground">{t('common:nav.documents')}</h1>
                <p className="text-muted-foreground text-sm mt-2">{t('documentListHeader.subtitle')}</p>
            </div>
            {can('create_documents') && (
                <Button asChild>
                    <Link to="/$tenant/document-management/new" params={{ tenant }}>
                        <Plus className="h-4 w-4" />
                        {t('documentListHeader.create')}
                    </Link>
                </Button>
            )}
        </div>
    );
};

export default React.memo(DocumentListHeader);
