import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, Building2, FolderOpen, User, Calendar, Clock, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import DocumentMetaRow from './DocumentMetaRow';

interface DocumentInfo {
    category: string;
    department: string;
    entity: string;
    createdBy: string;
    createdDate: string;
    lastModified: string;
    reminderDate?: string;
}

interface DocumentInfoSectionProps {
    info: DocumentInfo;
}

const DocumentInfoSection: React.FC<DocumentInfoSectionProps> = ({ info }) => {
    const { t } = useTranslation(['documents', 'common']);
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">{t('documentInfoSection.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <DocumentMetaRow icon={Tag} label={t('documentInfoSection.category')} value={info.category} />
                <DocumentMetaRow icon={Building2} label={t('documentInfoSection.department')} value={info.department} />
                <DocumentMetaRow icon={FolderOpen} label={t('documentInfoSection.entity')} value={info.entity} />
                <Separator />
                <DocumentMetaRow icon={User} label={t('documentInfoSection.createdBy')} value={info.createdBy} />
                <DocumentMetaRow icon={Calendar} label={t('documentInfoSection.created')} value={info.createdDate} />
                <DocumentMetaRow icon={Clock} label={t('documentInfoSection.lastModified')} value={info.lastModified} />
                {info.reminderDate && (
                    <>
                        <Separator />
                        <DocumentMetaRow
                            icon={Bell}
                            label={t('documentInfoSection.reminder')}
                            value={info.reminderDate}
                            highlight
                        />
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default React.memo(DocumentInfoSection);
