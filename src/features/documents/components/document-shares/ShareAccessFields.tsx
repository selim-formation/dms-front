import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Download } from 'lucide-react';

interface ShareAccessFieldsProps {
    canView: boolean;
    canDownload: boolean;
    onChange: (next: { can_view: boolean; can_download: boolean }) => void;
    disabled?: boolean;
}

/**
 * Editable view/download toggles. Download implies view — checking
 * download forces view on; unchecking view forces download off.
 */
function ShareAccessFields({ canView, canDownload, onChange, disabled }: ShareAccessFieldsProps) {
    const { t } = useTranslation('documents');

    const toggleView = useCallback(() => {
        const nextView = !canView;
        onChange({ can_view: nextView, can_download: nextView ? canDownload : false });
    }, [canView, canDownload, onChange]);

    const toggleDownload = useCallback(() => {
        const nextDownload = !canDownload;
        onChange({ can_view: nextDownload ? true : canView, can_download: nextDownload });
    }, [canView, canDownload, onChange]);

    return (
        <div className="space-y-2">
            <span className="text-sm font-medium text-foreground">{t('documentShares.form.accessLabel')}</span>
            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input
                        type="checkbox"
                        checked={canView}
                        onChange={toggleView}
                        disabled={disabled}
                        className="h-4 w-4 rounded border-input accent-primary"
                    />
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    {t('documentShares.form.canView')}
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input
                        type="checkbox"
                        checked={canDownload}
                        onChange={toggleDownload}
                        disabled={disabled}
                        className="h-4 w-4 rounded border-input accent-primary"
                    />
                    <Download className="h-4 w-4 text-muted-foreground" />
                    {t('documentShares.form.canDownload')}
                </label>
            </div>
            <p className="text-xs text-muted-foreground">{t('documentShares.form.downloadImpliesView')}</p>
        </div>
    );
}

export default memo(ShareAccessFields);
