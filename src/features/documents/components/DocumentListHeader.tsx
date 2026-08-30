import React from 'react';
<<<<<<< Updated upstream
import { Plus } from 'lucide-react';
=======
import { useTranslation } from 'react-i18next';
>>>>>>> Stashed changes

interface DocumentListHeaderProps {
    onUploadClick?: () => void;
}

<<<<<<< Updated upstream
const DocumentListHeader: React.FC<DocumentListHeaderProps> = ({ onUploadClick }) => {
=======
const DocumentListHeader: React.FC<DocumentListHeaderProps> = () => {
    const { t } = useTranslation(['documents', 'common']);
>>>>>>> Stashed changes
    return (
        <div className="flex items-start justify-between mb-6">
            <div>
                <h1 className="text-4xl font-bold text-foreground">{t('common:nav.documents')}</h1>
                <p className="text-muted-foreground text-sm mt-2">{t('documentListHeader.subtitle')}</p>
            </div>
            {/* <button
                onClick={onUploadClick}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-semibold"
            >
                <Plus size={18} />
                Upload
            </button> */}
        </div>
    );
};

export default React.memo(DocumentListHeader);
