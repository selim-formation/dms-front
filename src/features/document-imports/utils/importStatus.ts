/**
 * Status → tone / progress rules. The server's `actions` flags decide buttons;
 * this file only decides colours and which statuses show a progress bar.
 */

import type { ImportStatus, RowStatus, StatusTone } from '../types/import.types';

export const IMPORT_STATUSES: ImportStatus[] = [
    'draft', 'preparing', 'validating', 'ready', 'committing',
    'rolling_back', 'completed', 'completed_errors', 'failed', 'rolled_back',
];

export const ROW_STATUSES: RowStatus[] = ['pending', 'valid', 'invalid', 'committed', 'failed', 'skipped'];

/** completed green, ready blue, completed_errors / rolled_back orange, failed red, rest grey. */
const IMPORT_TONES: Record<ImportStatus, StatusTone> = {
    draft: 'neutral',
    preparing: 'neutral',
    validating: 'neutral',
    ready: 'info',
    committing: 'neutral',
    rolling_back: 'neutral',
    completed: 'success',
    completed_errors: 'warning',
    failed: 'danger',
    rolled_back: 'warning',
};

const ROW_TONES: Record<RowStatus, StatusTone> = {
    pending: 'neutral',
    valid: 'info',
    invalid: 'danger',
    committed: 'success',
    failed: 'danger',
    skipped: 'neutral',
};

export const importTone = (status: ImportStatus): StatusTone => IMPORT_TONES[status];
export const rowTone = (status: RowStatus): StatusTone => ROW_TONES[status];

/** Statuses whose progress_percent is meaningful. */
export const PROGRESS_STATUSES: ReadonlySet<ImportStatus> = new Set(['validating', 'committing', 'rolling_back']);

export const TONE_CLASSES: Record<StatusTone, string> = {
    success: 'bg-success/10 text-success',
    info: 'bg-primary/10 text-primary',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    danger: 'bg-destructive/10 text-destructive',
    neutral: 'bg-muted text-muted-foreground',
};
