/**
 * TanStack Query Key Factory for Profile
 */

import type { ProfileQueryParams } from '../types/profile.types';

export const profileKeys = {
    all: ['profile'] as const,
    details: () => [...profileKeys.all, 'detail'] as const,
    detail: (params?: ProfileQueryParams) => [...profileKeys.details(), params ?? {}] as const,
};
