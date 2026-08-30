import { Plus, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DocumentRow from './DocumentRow';

interface GroupedDocument {
    id: string;
    name: string;
    department: string;
    entity: string;
    renewal: 'Renewable' | 'One-Time';
    importance: 'Critical' | 'High' | 'Medium';
    expiryDate: string;
    status: 'Expires' | 'Expired';
    isNew?: boolean;
}

interface DocumentGroupCardProps {
    typeNameArabic: string;
    typeNameEnglish: string;
    count: number;
    documents: GroupedDocument[];
    onAddNew: () => void;
}

export default function DocumentGroupCard({
    typeNameArabic,
    typeNameEnglish,
    count,
    documents,
    onAddNew,
}: DocumentGroupCardProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const { t } = useTranslation(['documents', 'common']);

    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Group Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted hover:bg-accent transition-colors cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4 flex-1">
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronDown
                            size={20}
                            className={`transition-transform duration-300 ${isExpanded ? '' : '-rotate-90'}`}
                        />
                    </button>
                    <div>
                        <h3 className="text-sm font-bold text-foreground">{typeNameArabic}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{typeNameEnglish}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-card rounded-full px-3 py-1 border border-border">
                        <span className="text-xs font-semibold text-muted-foreground">{t('documentGroupCard.documentsCount', { count })}</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddNew();
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-sm"
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">{t('documentGroupCard.add')}</span>
                    </button>
                </div>
            </div>

            {/* Group Content */}
            {isExpanded && (
                <div className="divide-y divide-border">
                    {/* Header Row */}
                    <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-muted text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <div className="w-6">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-border"
                                onChange={(e) => {
                                    // Handle select all
                                    console.log('Select all:', e.target.checked);
                                }}
                            />
                        </div>
                        <div className="flex-1">{t('documentGroupCard.columnName')}</div>
                        <div className="w-28">{t('documentGroupCard.columnDepartment')}</div>
                        <div className="w-28">{t('documentGroupCard.columnEntity')}</div>
                        <div className="w-24">{t('documentGroupCard.columnRenewal')}</div>
                        <div className="w-20">{t('documentGroupCard.columnImportance')}</div>
                        <div className="w-32">{t('documentGroupCard.columnExpiryDate')}</div>
                        <div className="w-20">{t('documentGroupCard.columnStatus')}</div>
                        <div className="w-20">{t('documentGroupCard.columnActions')}</div>
                    </div>

                    {/* Document Rows */}
                    {documents.map((doc) => (
                        <DocumentRow key={doc.id} {...doc} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {isExpanded && documents.length === 0 && (
                <div className="px-6 py-12 text-center">
                    <div className="text-muted-foreground text-4xl mb-4">📄</div>
                    <p className="text-muted-foreground text-sm mb-4">{t('documentEmptyState.withoutQuery')}</p>
                    <button
                        onClick={onAddNew}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm"
                    >
                        <Plus size={16} />
                        {t('documentGroupCard.addFirstDocument')}
                    </button>
                </div>
            )}
        </div>
    );
}
