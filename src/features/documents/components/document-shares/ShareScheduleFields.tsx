import { memo } from 'react';
import { useTranslation } from 'react-i18next';

interface ShareScheduleFieldsProps {
    startsAt: string; // datetime-local value, '' = unset
    expiresAt: string;
    onStartsAtChange: (value: string) => void;
    onExpiresAtChange: (value: string) => void;
    disabled?: boolean;
    error?: string | null;
}

const inputClass =
    'w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50';

/**
 * Optional starts_at / expires_at datetime range for a share grant.
 * Empty starts_at = active immediately; empty expires_at = never expires.
 */
function ShareScheduleFields({
    startsAt,
    expiresAt,
    onStartsAtChange,
    onExpiresAtChange,
    disabled,
    error,
}: ShareScheduleFieldsProps) {
    const { t } = useTranslation('documents');

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground" htmlFor="share-starts-at">
                    {t('documentShares.form.startsAt')}
                </label>
                <input
                    id="share-starts-at"
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => onStartsAtChange(e.target.value)}
                    disabled={disabled}
                    className={inputClass}
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground" htmlFor="share-expires-at">
                    {t('documentShares.form.expiresAt')}
                </label>
                <input
                    id="share-expires-at"
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => onExpiresAtChange(e.target.value)}
                    disabled={disabled}
                    className={inputClass}
                />
                <p className="text-xs text-muted-foreground">{t('documentShares.form.expiresAtHint')}</p>
            </div>
            {error && <p className="sm:col-span-2 text-xs text-destructive">{error}</p>}
        </div>
    );
}

export default memo(ShareScheduleFields);
