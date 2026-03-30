/**
 * Document API Service
 * Handles all document-related API calls with proper error handling
 */

import { apiClient } from '@/core/api/client';
import { logger } from '@/shared/utils/logger';
import type {
    DocumentsByTypeApiResponse,
    DocumentsByDepartmentApiResponse,
} from '../types/api.types';

const log = logger.createScoped("Document API");

/**
 * Document API Service Class
 * Provides methods for fetching documents organized by types and departments
 */
export class DocumentApiService {
    private static readonly DOCUMENTS_BASE = '/api/:tenant/documents';

    /**
     * Fetches documents organized by entity types
     * API: GET /api/:tenant/documents/documents-by-types
     */
    static async getDocumentsByTypes(
        tenant: string
    ): Promise<DocumentsByTypeApiResponse> {
        const url = `${this.DOCUMENTS_BASE.replace(':tenant', tenant)}/documents-by-types`;

        try {
            log.debug("Fetching documents by types", { tenant, url });
            const response = await apiClient.get<DocumentsByTypeApiResponse>(url);
            return response;
        } catch (error) {
            log.error('Error fetching documents by types:', { error, tenant, url });
            throw error;
        }
    }

    /**
     * Fetches documents organized by departments
     * API: GET /api/:tenant/documents/documents-by-departments
     */
    static async getDocumentsByDepartments(
        tenant: string
    ): Promise<DocumentsByDepartmentApiResponse> {
        const url = `${this.DOCUMENTS_BASE.replace(':tenant', tenant)}/documents-by-departments`;

        try {
            log.debug("Fetching documents by departments", { tenant, url });
            const response = await apiClient.get<DocumentsByDepartmentApiResponse>(url);
            log.info("Documents by departments fetched successfully", { tenant });
            console.log(response); // Debug log
            return response;
        } catch (error) {
            log.error('Error fetching documents by departments:', { error, tenant, url });
            throw error;
        }
    }
}

/**
 * Singleton instance for documents API
 */
export const documentApiService = DocumentApiService;
