/**
 * Reminder & Notification Types
 * Matches backend API contract for reminders and notifications
 */

/**
 * User information in reminder/notification
 */
export interface ReminderUser {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    avatar: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    socialite_provider: string | null;
    socialite_id: string | null;
    socialite_token: string | null;
    socialite_refresh_token: string | null;
    socialite_token_expires_at: string | null;
    social_only: number;
}

/**
 * Entity reference in reminder
 */
export interface ReminderEntity {
    id: number;
    title: string;
    image: string | null;
    tenant_id: string;
    created_at: string;
    updated_at: string;
}

/**
 * Department in reminder
 */
export interface ReminderDepartment {
    id: number;
    title: string;
    image: string | null;
    tenant_id: string;
    created_at: string;
    updated_at: string;
}

/**
 * Document type in reminder
 */
export interface ReminderDocumentType {
    id: number;
    title: string;
    image: string | null;
    tenant_id: string;
    created_at: string;
    updated_at: string;
}

/**
 * Document activity
 */
export interface ReminderDocumentActivity {
    id?: string | number;
    action?: string;
    timestamp?: string;
    userId?: string | number;
    details?: string | Record<string, unknown>;
}

/**
 * Reminder document from API
 */
export interface ReminderDocument {
    id: number;
    title: string;
    description: string | null;
    version: number;
    path: string;
    extension: string;
    size: string;
    last_viewed: string;
    expire_date: string;
    reminder_before: string;
    importance: 'critical' | 'high' | 'medium' | 'low' | 'archival';
    category: 'operational' | 'establishment';
    origin_department: string | null;
    manual: string | null;
    details: string | null;
    version_history: ReminderDocumentActivity[];
    uploaded_by: ReminderUser;
    responsible: string | null;
    cc: unknown[];
    entities: ReminderEntity[];
    departments: ReminderDepartment[];
    types: ReminderDocumentType[];
    document_activities: ReminderDocumentActivity[];
    created_at: string;
    updated_at: string;
}

/**
 * API Response for reminders
 */
export interface GetRemindersApiResponse {
    data: ReminderDocument[];
    message: string;
}

/**
 * Notification from API
 */
export interface Notification {
    // Add notification fields based on the API response
    // This will be extended based on actual API response
    id?: number;
    title?: string;
    message?: string;
    type?: string;
    read_at?: string | null;
    created_at?: string;
    updated_at?: string;
}

/**
 * API Response for notifications
 */
export interface GetNotificationsApiResponse {
    data: Notification[];
    message: string;
}

/**
 * Unified reminder display type
 */
export interface DisplayReminder {
    id: number;
    title: string;
    description: string | null;
    expireDate: string;
    uploadedBy: ReminderUser;
    category: 'operational' | 'establishment';
    importance: 'critical' | 'high' | 'medium' | 'low' | 'archival';
    documentPath: string;
    extension: string;
}
