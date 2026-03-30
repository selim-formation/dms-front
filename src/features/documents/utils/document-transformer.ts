/**
 * Document Data Transformation Utilities
 * Converts API responses to UI-ready formats with proper typing
 */

import type {
    ApiDocument,
    UIDocument,
    GroupedDocuments,
    DocumentsByTypeResponse,
    DepartmentGroupedDocuments,
    DocumentsByDepartmentItem,
} from '../types/api.types';

/**
 * Transforms API document to UI document format
 */
export class DocumentTransformer {
    /**
     * Convert API document to UI document
     */
    static toUIDocument(apiDoc: ApiDocument, isOneTime: boolean = false): UIDocument {
        return {
            id: apiDoc.id,
            title: apiDoc.title,
            description: apiDoc.description,
            importance: apiDoc.importance,
            category: apiDoc.category,
            expireDate: apiDoc.expire_date,
            entities: apiDoc.entities,
            departments: apiDoc.departments,
            types: apiDoc.types,
            createdAt: apiDoc.created_at,
            updatedAt: apiDoc.updated_at,
            isOneTime,
        };
    }

    /**
     * Transforms documents-by-types API response to grouped documents
     * API Response format: Array of { type, one_time[], renewal[] }
     * Each document has a `category` field: "establishment" or "operational"
     */
    static transformByTypes(data: DocumentsByTypeResponse[]): GroupedDocuments[] {
        console.log('Transforming documents by types with data:', data);
        return data.map((typeGroup) => {
            const oneTime = typeGroup.one_time || [];
            const renewal = typeGroup.renewal || [];

            const estOneTime = oneTime.filter((doc) => doc.category === 'establishment');
            const estRenewal = renewal.filter((doc) => doc.category === 'establishment');
            const opOneTime = oneTime.filter((doc) => doc.category === 'operational');
            const opRenewal = renewal.filter((doc) => doc.category === 'operational');

            return {
                name: typeGroup.type,
                establishment: {
                    renewal: estRenewal.map((doc) => this.toUIDocument(doc, false)),
                    oneTime: estOneTime.map((doc) => this.toUIDocument(doc, true)),
                },
                operational: {
                    renewal: opRenewal.map((doc) => this.toUIDocument(doc, false)),
                    oneTime: opOneTime.map((doc) => this.toUIDocument(doc, true)),
                },
                allDocuments: [
                    ...oneTime.map((doc) => this.toUIDocument(doc, true)),
                    ...renewal.map((doc) => this.toUIDocument(doc, false)),
                ],
            };
        });
    }

    /**
     * Transforms documents-by-departments API response to grouped documents
     */
    static transformByDepartments(
        data: DocumentsByDepartmentItem[]
    ): DepartmentGroupedDocuments[] {
        return data.map((deptGroup) => {
            const renewal = deptGroup.renewal || [];
            const oneTime = deptGroup.one_time || [];

            const renewalDocs = renewal.map((doc) =>
                this.toUIDocument(doc, false)
            );
            const oneTimeDocs = oneTime.map((doc) =>
                this.toUIDocument(doc, true)
            );

            return {
                department: deptGroup.department,
                renewal: renewalDocs,
                oneTime: oneTimeDocs,
                allDocuments: [...renewalDocs, ...oneTimeDocs],
            };
        });
    }

    /**
     * Flatten grouped documents to a single array
     */
    static flattenGroupedDocuments(grouped: GroupedDocuments[]): UIDocument[] {
        return grouped.flatMap((group) => group.allDocuments);
    }

    /**
     * Flatten department grouped documents to a single array
     */
    static flattenDepartmentDocuments(
        grouped: DepartmentGroupedDocuments[]
    ): UIDocument[] {
        return grouped.flatMap((group) => group.allDocuments);
    }
}
