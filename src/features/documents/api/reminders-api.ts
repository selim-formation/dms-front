/**
 * Reminder API Functions
 * 
 * Handles API calls for reminders with real API integration
 * Uses ReminderApiService and data transformations
 */

import { reminderApiService } from './reminderApi';
import { logger } from '@/shared/utils/logger';
import type {
    ReminderDocument,
    Notification,
} from '../types/reminder.types';

const log = logger.createScoped('reminderApi');

/**
 * Fetch all reminders from API
 * 
 * @param tenant - Tenant identifier
 * @returns Promise with array of reminder documents
 */
export async function getAllReminders(
    tenant: string
): Promise<ReminderDocument[]> {
    try {
        log.info('Fetching all reminders from API', { tenant });

        const reminders = await reminderApiService.fetchAllReminders(tenant);

        log.info(`Successfully fetched ${reminders.length} reminders`);

        return reminders;
    } catch (error) {
        log.error('Failed to fetch all reminders', { error });
        throw error;
    }
}

/**
 * Fetch active reminders from API
 * 
 * @param tenant - Tenant identifier
 * @returns Promise with array of active reminder documents
 */
export async function getActiveReminders(
    tenant: string
): Promise<ReminderDocument[]> {
    try {
        log.info('Fetching active reminders from API', { tenant });

        const reminders = await reminderApiService.fetchActiveReminders(tenant);

        log.info(`Successfully fetched ${reminders.length} active reminders`);

        return reminders;
    } catch (error) {
        log.error('Failed to fetch active reminders', { error });
        throw error;
    }
}

/**
 * Fetch notifications from API
 * 
 * @param tenant - Tenant identifier
 * @returns Promise with array of notifications
 */
export async function getNotifications(
    tenant: string
): Promise<Notification[]> {
    try {
        log.info('Fetching notifications from API', { tenant });

        const notifications = await reminderApiService.fetchNotifications(tenant);

        log.info(`Successfully fetched ${notifications.length} notifications`);

        return notifications;
    } catch (error) {
        log.error('Failed to fetch notifications', { error });
        throw error;
    }
}
