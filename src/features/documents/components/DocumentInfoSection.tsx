import React from 'react';
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
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <DocumentMetaRow icon={Tag} label="Category" value={info.category} />
                <DocumentMetaRow icon={Building2} label="Department" value={info.department} />
                <DocumentMetaRow icon={FolderOpen} label="Entity" value={info.entity} />
                <Separator />
                <DocumentMetaRow icon={User} label="Created by" value={info.createdBy} />
                <DocumentMetaRow icon={Calendar} label="Created" value={info.createdDate} />
                <DocumentMetaRow icon={Clock} label="Last modified" value={info.lastModified} />
                {info.reminderDate && (
                    <>
                        <Separator />
                        <DocumentMetaRow
                            icon={Bell}
                            label="Reminder"
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
