import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CommentAvatar } from './CommentAvatar';

interface CommentComposerProps {
  authorName: string;
  initialValue?: string;
  placeholder?: string;
  submitLabel?: string;
  isPending?: boolean;
  autoFocus?: boolean;
  showAvatar?: boolean;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
}

function CommentComposerComponent({
  authorName,
  initialValue = '',
  placeholder,
  submitLabel,
  isPending = false,
  autoFocus = false,
  showAvatar = true,
  onSubmit,
  onCancel,
}: CommentComposerProps) {
  const { t } = useTranslation(['documents', 'common']);
  const [value, setValue] = useState(initialValue);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isPending) return;
    onSubmit(trimmed);
    setValue('');
  }, [value, isPending, onSubmit]);

  const handleCancel = useCallback(() => {
    setValue(initialValue);
    onCancel?.();
  }, [initialValue, onCancel]);

  return (
    <div className="flex gap-3">
      {showAvatar && <CommentAvatar name={authorName} size="sm" />}
      <div className="flex-1">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder ?? t('comments.placeholder')}
          autoFocus={autoFocus}
          disabled={isPending}
          maxLength={5000}
          className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm resize-none disabled:opacity-60"
          rows={showAvatar ? 3 : 2}
        />
        <div className="flex justify-end gap-2 mt-2">
          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="px-3 py-1.5 text-muted-foreground hover:bg-accent rounded-lg transition-colors text-xs font-medium disabled:opacity-60"
            >
              {t('common:actions.cancel')}
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!value.trim() || isPending}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? t('comments.posting') : submitLabel ?? t('comments.submitComment')}
          </button>
        </div>
      </div>
    </div>
  );
}

export const CommentComposer = memo(CommentComposerComponent);
