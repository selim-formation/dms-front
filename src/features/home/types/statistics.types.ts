export interface DocumentTypeStats {
    type: string;
    total_documents: number;
    total_documents_by_percentage: number;
    total_versions: number;
    total_versions_by_percentage: number;
}

export interface StatisticsData {
    total_documents: number;
    total_operational: number;
    total_operational_by_percentage: number;
    total_establishment: number;
    total_establishment_by_percentage: number;
    total_versions: number;
    total_renewal_documents: number;
    total_renewal_documents_by_percentage: number;
    total_one_time_documents: number;
    total_one_time_documents_by_percentage: number;
    total_documents_by_types: DocumentTypeStats[];
    total_reminder_versions: number;
    total_reminder_versions_by_percentage: number;
    total_non_reminder_versions: number;
    total_non_reminder_versions_by_percentage: number;
    total_users: number;
    total_tasks: number;
}

export interface StatisticsResponse {
    data: StatisticsData;
    message: string;
}

// export interface StatisticsData {
//     users: number;
//     orders: number;
// }