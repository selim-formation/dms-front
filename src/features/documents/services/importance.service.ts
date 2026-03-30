/**
 * Importance Service
 * Centralized business logic for importance level handling
 */

export type ImportanceLevel = 'Critical' | 'High' | 'Medium';

const IMPORTANCE_MAP: Record<string, ImportanceLevel> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Medium',
    archival: 'Medium',
};

export class ImportanceService {
    static normalizeLevel(apiValue: string | undefined): ImportanceLevel {
        if (!apiValue) return 'Medium';
        return IMPORTANCE_MAP[apiValue.toLowerCase()] || 'Medium';
    }

    static getColorClass(level: ImportanceLevel): string {
        switch (level) {
            case 'Critical': return 'bg-red-100 text-red-700 border-red-300';
            case 'High': return 'bg-orange-100 text-orange-700 border-orange-300';
            case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    }

    static getIcon(level: ImportanceLevel): string {
        switch (level) {
            case 'Critical': return '🔴';
            case 'High': return '🟠';
            case 'Medium': return '🔵';
            default: return '⚪';
        }
    }
}
