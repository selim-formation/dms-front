import { memo } from 'react';
import { Loader2, Search } from 'lucide-react';
import ShareTargetRow from './ShareTargetRow';
import { targetKey } from './shareTargetMeta';
import type { SelectedShareTarget } from '../../types/documentShare.types';

interface ShareTargetListProps {
    items: SelectedShareTarget[];
    selectedKeys: Set<string>;
    onToggle: (target: SelectedShareTarget) => void;
    query: string;
    onQueryChange: (query: string) => void;
    searchPlaceholder: string;
    /** Shown instead of the list (e.g. "type at least 2 characters"). */
    hint?: string | null;
    emptyLabel: string;
    errorLabel?: string | null;
    isLoading?: boolean;
    disabled?: boolean;
}

/** Presentational searchable multi-select list shared by the users/departments/sections tabs. */
function ShareTargetList({
    items,
    selectedKeys,
    onToggle,
    query,
    onQueryChange,
    searchPlaceholder,
    hint,
    emptyLabel,
    errorLabel,
    isLoading,
    disabled,
}: ShareTargetListProps) {
    return (
        <div className="rounded-md border border-input">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    disabled={disabled}
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                {isLoading && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />}
            </div>
            <div role="listbox" aria-multiselectable className="max-h-52 overflow-y-auto py-1">
                {errorLabel ? (
                    <p className="px-3 py-2 text-sm text-destructive">{errorLabel}</p>
                ) : hint ? (
                    <p className="px-3 py-2 text-sm text-muted-foreground">{hint}</p>
                ) : items.length === 0 && !isLoading ? (
                    <p className="px-3 py-2 text-sm text-muted-foreground">{emptyLabel}</p>
                ) : (
                    items.map((item) => (
                        <ShareTargetRow
                            key={targetKey(item)}
                            target={item}
                            selected={selectedKeys.has(targetKey(item))}
                            disabled={disabled}
                            onToggle={onToggle}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default memo(ShareTargetList);
