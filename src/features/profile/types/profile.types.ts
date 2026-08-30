/**
 * Profile Types
 * Matches backend API contract for GET /api/{tenant}/profile
 */

import type { FavoriteData } from '@/features/documents/types/favorites.types';
import type { PinnedDocumentData } from '@/features/documents/types/pinned.types';

export interface ProfileDepartment {
    id: number;
    title: string;
}

export interface ProfileUser {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    departments: ProfileDepartment[];
    joined_at: string;
}

export interface ProfileStats {
    documents_count: number;
    favorites_count: number;
    pinned_documents_count: number;
    tasks_count: number;
}

export interface ProfileDocument {
    id: number;
    title: string;
    description: string | null;
    status: string;
    created_at: string;
}

export interface ProfileTaskPerson {
    id: number;
    name: string;
    email: string;
}

export interface ProfileTaskDocumentRef {
    id: number;
    title: string;
}

export interface ProfileTaskDepartment {
    id: number;
    name: string;
}

export interface ProfileTask {
    id: number;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    task_type: string;
    assignee: ProfileTaskPerson | null;
    creator: ProfileTaskPerson;
    document: ProfileTaskDocumentRef | null;
    department: ProfileTaskDepartment | null;
    tags: string[];
    due_date: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProfileData {
    user: ProfileUser;
    stats: ProfileStats;
    documents: ProfileDocument[];
    favorites: FavoriteData[];
    pinned_documents: PinnedDocumentData[];
    tasks: ProfileTask[];
}

export interface GetProfileApiResponse {
    data: ProfileData;
    message: string;
}

export interface ProfileQueryParams {
    recent_limit?: number;
}
