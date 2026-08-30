/**
 * Document View Helpers - Utility Functions
 * Helper functions for extracting and preparing document data for views
 */

import type { TypeGroup, DepartmentGroup } from '../services/documentGrouping.service';
import { DocumentAdapter } from '../adapters/documentAdapter';
import type { GridDocument } from '../adapters/documentAdapter';
import { translateDocumentTypeName, translateDepartmentName } from './documentLabelDictionary';

export function getTypeViewDocuments(
    typeGroups: TypeGroup[] | undefined,
    selectedTypeTab: string
): {
    establishment: { renewal: GridDocument[]; oneTime: GridDocument[] };
    operational: { renewal: GridDocument[]; oneTime: GridDocument[] };
} {
    const establishment = { renewal: [] as GridDocument[], oneTime: [] as GridDocument[] };
    const operational = { renewal: [] as GridDocument[], oneTime: [] as GridDocument[] };

    if (!typeGroups) return { establishment, operational };

    const selectedGroup = typeGroups.find((g) => g.name === selectedTypeTab);
    if (!selectedGroup) return { establishment, operational };

    establishment.renewal = DocumentAdapter.fromUIDocumentsToGrid(
        selectedGroup.establishment?.renewal || []
    );
    establishment.oneTime = DocumentAdapter.fromUIDocumentsToGrid(
        selectedGroup.establishment?.oneTime || []
    );
    operational.renewal = DocumentAdapter.fromUIDocumentsToGrid(
        selectedGroup.operational?.renewal || []
    );
    operational.oneTime = DocumentAdapter.fromUIDocumentsToGrid(
        selectedGroup.operational?.oneTime || []
    );

    return { establishment, operational };
}

export function getDeptViewDocuments(
    deptGroups: DepartmentGroup[] | undefined,
    selectedDeptTab: string
): {
    renewal: GridDocument[];
    oneTime: GridDocument[];
} {
    const renewal = [] as GridDocument[];
    const oneTime = [] as GridDocument[];

    if (!deptGroups) return { renewal, oneTime };

    const selectedGroup = deptGroups.find((g) => g.department === selectedDeptTab);
    if (!selectedGroup) return { renewal, oneTime };

    renewal.push(...DocumentAdapter.fromUIDocumentsToGrid(selectedGroup.renewal || []));
    oneTime.push(...DocumentAdapter.fromUIDocumentsToGrid(selectedGroup.oneTime || []));

    return { renewal, oneTime };
}

export function getPageTitle(
    viewMode: 'all' | 'byType' | 'byDepartment',
    selectedTypeTab: string,
    selectedDeptTab: string,
    language: string = 'en'
): string {
    if (viewMode === 'byType' && selectedTypeTab) {
        return translateDocumentTypeName(selectedTypeTab, language);
    } else if (viewMode === 'byDepartment' && selectedDeptTab) {
        return translateDepartmentName(selectedDeptTab, language);
    }
    return 'All Documents';
}
