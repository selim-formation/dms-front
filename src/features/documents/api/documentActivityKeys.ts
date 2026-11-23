import type { ActivityFilters } from '../types/activity.types';

export const documentActivityKeys = {
  all: (tenant: string, documentId: number) => ['document-management', tenant, 'activities', documentId] as const,
  list: (tenant: string, documentId: number, filters: ActivityFilters) =>
    [...documentActivityKeys.all(tenant, documentId), 'list', filters] as const,
};
