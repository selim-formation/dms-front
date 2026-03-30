/**
 * DocumentAdapter - Data Transformation Layer
 * Converts between API and UI models
 */

import type { ApiDocument, UIDocument } from '@/features/documents/types/api.types';
import type { SearchDocument } from '../types/search.types';
import { ImportanceService } from '../services/importance.service';

export interface GridDocument {
    id: string;
    name: string;
    type: string;
    typeArabic: string;
    department: string;
    entity: string;
    renewal: 'Renewable' | 'One-Time';
    importance: 'Critical' | 'High' | 'Medium';
    expiryDate: string;
    status: 'Expires' | 'Expired';
    icon?: string;
}

export class DocumentAdapter {
    static fromApiToGrid(doc: ApiDocument): GridDocument {
        return {
            id: String(doc.id),
            name: doc.title,
            type: doc.types?.[0]?.title || 'Uncategorized',
            typeArabic: doc.types?.[0]?.title || 'غير مصنف',
            department: doc.departments?.[0]?.title || 'N/A',
            entity: doc.entities?.[0]?.title || 'N/A',
            renewal: (doc.version && doc.version > 1) ? 'Renewable' : 'One-Time',
            importance: ImportanceService.normalizeLevel(doc.importance),
            expiryDate: doc.expire_date || 'No expiry',
            status: doc.expire_date ? 'Expires' : 'Expires',
        };
    }

    static fromUIToGrid(doc: UIDocument): GridDocument {
        console.log('Transforming UIDocument to GridDocument:', doc);
        // return {
        //   id: String(doc.id),
        //   name: doc.title,
        //   type: doc.types[0]?.title || 'Uncategorized',
        //   typeArabic: doc.types[0]?.title || 'غير مصنف',
        //   department: doc.departments[0]?.title || 'N/A',
        //   entity: doc.entities[0]?.title || 'N/A',
        //   renewal: doc.isOneTime ? 'One-Time' : 'Renewable',
        //   importance: ImportanceService.normalizeLevel(doc.importance),
        //   expiryDate: doc.expireDate || 'No expiry',
        //   status: doc.expireDate ? 'Expires' : 'Expires',
        // };

        return {
            id: String(doc.id),
            name: doc.title,
            type: doc.types?.[0]?.title || 'Uncategorized',
            typeArabic: doc.types?.[0]?.title || 'غير مصنف',
            department: doc.departments?.[0]?.title || 'N/A',
            entity: doc.entities?.[0]?.title || 'N/A',
            renewal: doc.isOneTime ? 'One-Time' : 'Renewable',
            importance: ImportanceService.normalizeLevel(doc.importance),
            expiryDate: doc.expireDate || 'No expiry',
            status: doc.expireDate ? 'Expires' : 'Expires',
        };
    }

    static fromUIDocumentsToGrid(docs: UIDocument[]): GridDocument[] {
        return docs.map(doc => this.fromUIToGrid(doc));
    }

    static fromApiDocumentsToGrid(docs: ApiDocument[]): GridDocument[] {
        return docs.map(doc => this.fromApiToGrid(doc));
    }

    static fromSearchDocumentToGrid(doc: SearchDocument): GridDocument {
        return {
            id: String(doc.id),
            name: doc.title,
            type: doc.types?.[0]?.title || 'Uncategorized',
            typeArabic: doc.types?.[0]?.title || 'غير مصنف',
            department: doc.departments?.[0]?.title || 'N/A',
            entity: doc.entities?.[0]?.title || 'N/A',
            renewal: (doc.version && doc.version > 1) ? 'Renewable' : 'One-Time',
            importance: ImportanceService.normalizeLevel(doc.importance as 'critical' | 'high' | 'medium' | 'low' | 'archival'),
            expiryDate: doc.expire_date || 'No expiry',
            status: doc.expire_date ? 'Expires' : 'Expires',
        };
    }

    static fromSearchDocumentsToGrid(docs: SearchDocument[]): GridDocument[] {
        return docs.map(doc => this.fromSearchDocumentToGrid(doc));
    }
}
