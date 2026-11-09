import { useImportUpload } from '@/features/document-imports/hooks/useImportUpload';

/**
 * Logo upload = the chunked document upload (`kind: "document_file"`) under the open company.
 * A finished upload is cached per File, so retrying a refused save never re-uploads;
 * the upload can be used once.
 */
export function useCompanyLogoUpload() {
    return useImportUpload('document_file');
}
