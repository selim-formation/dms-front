import { memo } from 'react';
import { useTranslation } from 'react-i18next';

interface ProfileErrorStateProps {
    message: string;
    onRetry: () => void;
}

function ProfileErrorState({ message, onRetry }: ProfileErrorStateProps) {
    const { t } = useTranslation('common');

    return (
        <div className="rounded-2xl bg-destructive/10 border border-destructive/30 p-12 text-center">
            <p className="text-destructive font-semibold mb-2 text-lg">{message}</p>
            <button
                onClick={onRetry}
                className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
                {t('common.tryAgain')}
            </button>
        </div>
    );
}

export default memo(ProfileErrorState);
