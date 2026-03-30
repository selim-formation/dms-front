/**
 * DocumentGroupingService - Data Extraction Helpers
 * Simplifies access to nested grouped document structures
 */

import type { UIDocument } from '@/features/documents/types/api.types';

export interface TypeGroup {
    name: string;
    establishment?: { renewal: UIDocument[]; oneTime: UIDocument[] };
    operational?: { renewal: UIDocument[]; oneTime: UIDocument[] };
    allDocuments: UIDocument[];
}

export interface DepartmentGroup {
    department: string;
    renewal: UIDocument[];
    oneTime: UIDocument[];
    allDocuments: UIDocument[];
}

export class DocumentGroupingService {
    static getEstablishmentDocs(group: TypeGroup): UIDocument[] {
        const renewal = group.establishment?.renewal || [];
        const oneTime = group.establishment?.oneTime || [];
        return [...renewal, ...oneTime];
    }

    static getOperationalDocs(group: TypeGroup): UIDocument[] {
        const renewal = group.operational?.renewal || [];
        const oneTime = group.operational?.oneTime || [];
        return [...renewal, ...oneTime];
    }

    static getRenewalDocs(group: DepartmentGroup): UIDocument[] {
        return group.renewal || [];
    }

    static getOneTimeDocs(group: DepartmentGroup): UIDocument[] {
        return group.oneTime || [];
    }

    static hasTypeGroupDocs(group: TypeGroup | undefined): boolean {
        if (!group) return false;
        return group.allDocuments?.length > 0;
    }

    static hasDeptGroupDocs(group: DepartmentGroup | undefined): boolean {
        if (!group) return false;
        const all = [...(group.renewal || []), ...(group.oneTime || [])];
        return all.length > 0;
    }
}
