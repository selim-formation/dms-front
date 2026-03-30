/**
 * DocumentFilterService - Business Logic for Filtering
 * All filtering logic centralized in pure functions
 */

import type { UIDocument } from '@/features/documents/types/api.types';

export interface FilterCriteria {
    types: string[];
    departments: string[];
    entities: string[];
    renewals: string[];
    importances: string[];
}

export class DocumentFilterService {
    static applySearchFilter(documents: UIDocument[], query: string): UIDocument[] {
        if (!query.trim()) {
            return documents;
        }
        const q = query.toLowerCase();
        return documents.filter((doc) =>
            doc.title?.toLowerCase().includes(q) ||
            doc.description?.toLowerCase().includes(q)
        );
    }

    static filterByTypes(documents: UIDocument[], types: string[]): UIDocument[] {
        if (types.length === 0) return documents;
        return documents.filter((doc) =>
            doc?.types?.some((t) => types?.includes(t.title))
        );
    }

    static filterByDepartments(documents: UIDocument[], departments: string[]): UIDocument[] {
        if (departments.length === 0) return documents;
        return documents.filter((doc) =>
            doc.departments.some((d) => departments.includes(d.title))
        );
    }

    static filterByEntities(documents: UIDocument[], entities: string[]): UIDocument[] {
        if (entities.length === 0) return documents;
        return documents.filter((doc) =>
            doc.entities.some((e) => entities.includes(e.title))
        );
    }

    static filterByImportance(documents: UIDocument[], importances: string[]): UIDocument[] {
        if (importances.length === 0) return documents;
        return documents.filter((doc) =>
            importances.includes(doc.importance)
        );
    }

    static filterByRenewal(documents: UIDocument[], renewals: string[]): UIDocument[] {
        if (renewals.length === 0) return documents;
        return documents.filter((doc) => {
            const isOneTime = doc.isOneTime;
            return renewals.includes(isOneTime ? 'one-time' : 'renewal');
        });
    }

    static applyAllFilters(documents: UIDocument[], searchQuery: string, filters: FilterCriteria): UIDocument[] {
        let result = documents;
        result = this.applySearchFilter(result, searchQuery);
        result = this.filterByTypes(result, filters.types);
        result = this.filterByDepartments(result, filters.departments);
        result = this.filterByEntities(result, filters.entities);
        result = this.filterByImportance(result, filters.importances);
        result = this.filterByRenewal(result, filters.renewals);
        return result;
    }
}
