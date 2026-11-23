import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export type DocumentScope = 'browse' | 'shares' | 'manage' | 'imports';

interface DocumentScopeSwitchProps {
    value: DocumentScope;
    onChange: (scope: DocumentScope) => void;
    /** Which scopes to offer (the rest are hidden for this user). */
    scopes: DocumentScope[];
}

/** Segmented control: browse approved documents, or manage every document you can (all statuses, trash, approvals), or bulk-import files. */
function DocumentScopeSwitch({ value, onChange, scopes }: DocumentScopeSwitchProps) {
    const { t } = useTranslation('documents');

    return (
        <div role="tablist" aria-label={t('documentScope.label')} className="inline-flex rounded-xl border border-border bg-card p-1">
            {scopes.map((scope) => (
                <button
                    key={scope}
                    type="button"
                    role="tab"
                    aria-selected={value === scope}
                    onClick={() => onChange(scope)}
                    className={cn(
                        'rounded-lg px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        value === scope ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    {t(`documentScope.${scope}`)}
                </button>
            ))}
        </div>
    );
}

export default memo(DocumentScopeSwitch);
