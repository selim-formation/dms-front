/**
 * TanStack Query Key Factory for Reminders
 * 
 * Defines all query keys for reminders feature using best practices
 */

export const reminderKeys = {
    all: ['reminders'] as const,
    lists: () => [...reminderKeys.all, 'list'] as const,
    allReminders: () => [...reminderKeys.lists(), 'all'] as const,
    active: () => [...reminderKeys.lists(), 'active'] as const,
    notifications: () => [...reminderKeys.all, 'notifications'] as const,
};
