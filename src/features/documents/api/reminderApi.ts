/**
 * ReminderApiService - API Service for Reminders
 * Handles all HTTP requests related to reminders and notifications
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import type {
    GetRemindersApiResponse,
    GetNotificationsApiResponse,
    ReminderDocument,
    Notification,
} from '../types/reminder.types';

const log = logger.createScoped('ReminderApiService');

/**
 * ReminderApiService class - Singleton pattern
 * Encapsulates all reminder-related API operations
 */
export class ReminderApiService {
    private static instance: ReminderApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints;

    /**
     * Private constructor for singleton pattern
     */
    private constructor() {
        log.info('ReminderApiService initialized');
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): ReminderApiService {
        if (!ReminderApiService.instance) {
            ReminderApiService.instance = new ReminderApiService();
        }
        return ReminderApiService.instance;
    }

    /**
     * Fetch all reminders for a tenant
     * @param tenant - Tenant identifier
     * @returns Promise with array of reminder documents
     */
    public async fetchAllReminders(
        tenant: string
    ): Promise<ReminderDocument[]> {
        try {
            log.info(`Fetching all reminders for tenant: ${tenant}`);

            const url = buildApiUrl(this.endpoints.reminders.all, { tenant });

            const response = await this.client.get<GetRemindersApiResponse>(url);

            if (!response.data || !response.data.data) {
                log.warn('Empty response received from reminders API');
                return [];
            }

            log.info(`Successfully fetched ${response.data.data.length} reminders`);
            return response.data.data;
        } catch (error) {
            log.error('Failed to fetch all reminders', { error });
            throw error;
        }
    }

    /**
     * Fetch active reminders for a tenant
     * @param tenant - Tenant identifier
     * @returns Promise with array of active reminder documents
     */
    public async fetchActiveReminders(
        tenant: string
    ): Promise<ReminderDocument[]> {
        try {
            log.info(`Fetching active reminders for tenant: ${tenant}`);

            const url = buildApiUrl(this.endpoints.reminders.active, { tenant });

            const response = await this.client.get<GetRemindersApiResponse>(url);

            if (!response.data || !response.data.data) {
                log.warn('Empty response received from active reminders API');
                return [];
            }

            log.info(
                `Successfully fetched ${response.data.data.length} active reminders`
            );
            return response.data.data;
        } catch (error) {
            log.error('Failed to fetch active reminders', { error });
            throw error;
        }
    }

    /**
     * Fetch notifications for a tenant
     * @param tenant - Tenant identifier
     * @returns Promise with array of notifications
     */
    public async fetchNotifications(tenant: string): Promise<Notification[]> {
        try {
            log.info(`Fetching notifications for tenant: ${tenant}`);

            const url = buildApiUrl(this.endpoints.notifications.list, { tenant });

            const response = await this.client.get<GetNotificationsApiResponse>(url);

            if (!response.data || !response.data.data) {
                log.warn('Empty response received from notifications API');
                return [];
            }

            log.info(
                `Successfully fetched ${response.data.data.length} notifications`
            );
            return response.data.data;
        } catch (error) {
            log.error('Failed to fetch notifications', { error });
            throw error;
        }
    }
}

/**
 * Export singleton instance
 */
export const reminderApiService = ReminderApiService.getInstance();
