/**
 * Document activity log — /api/{tenant}/document-management/{id}/activities
 * (who viewed / downloaded one document, newest first).
 */

import type { ApiEnvelope, DepartmentPaginationMeta } from '@/features/departments/types/department.types';

export type { ApiEnvelope };

export type ActivityAction = 'view' | 'download';
export type ActivitySort = 'created_at' | '-created_at';

export interface ActivityUser {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  departments: { id: number; title: string }[];
  /** Sections the user manages. */
  sections: { id: number; title: string }[];
  roles: { id: number; name: string }[];
}

export interface DocumentActivityEntry {
  id: number;
  document_id: number;
  /** Null for document-level activity and for rows written before downloads were recorded per version. */
  document_version_id: number | null;
  version: number | null;
  /** Null when the account no longer exists. */
  user_id: number | null;
  action: ActivityAction;
  source: string | null;
  ip: string | null;
  user: ActivityUser | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityFilters {
  action?: ActivityAction;
  user_id?: number;
  version_id?: number;
  /** YYYY-MM-DD */
  from?: string;
  /** YYYY-MM-DD */
  to?: string;
  search?: string;
  sort?: ActivitySort;
  page?: number;
  perPage?: number;
}

export interface ActivityPage {
  data: DocumentActivityEntry[];
  links: { first: string | null; last: string | null; prev: string | null; next: string | null };
  meta: DepartmentPaginationMeta;
}
