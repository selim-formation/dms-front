import { memo } from 'react';
import { useTranslation } from 'react-i18next';

function FavoritesPageHeader() {
    const { t } = useTranslation('documents');
    return (
        <div className="mb-6">
            <h1 className="text-4xl font-bold text-foreground">{t('favoritesPage.title')}</h1>
            <p className="text-muted-foreground text-sm mt-2">{t('favoritesPage.subtitle')}</p>
        </div>
    );
}

export default memo(FavoritesPageHeader);
