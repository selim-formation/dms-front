import type { DocumentFilters } from '../types';

export const documentKeys = {
  all: (tenant: string) => ['documents', tenant] as const,
  lists: (tenant: string) => [...documentKeys.all(tenant), 'list'] as const,
  list: (tenant: string, filters: DocumentFilters) =>
    [...documentKeys.lists(tenant), filters] as const,
  detail: (tenant: string, id: number) =>
    [...documentKeys.all(tenant), 'detail', id] as const,
  stats: (tenant: string) => [...documentKeys.all(tenant), 'stats'] as const,
  byType: (tenant: string) => [...documentKeys.all(tenant), 'by-type'] as const,
  byDept: (tenant: string) => [...documentKeys.all(tenant), 'by-dept'] as const,
  reminders: (tenant: string) => [...documentKeys.all(tenant), 'reminders'] as const,
};
