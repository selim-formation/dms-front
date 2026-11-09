import { useAuth } from '@/core/auth/hooks/useAuth';

/** Id of the signed-in user ("not on yourself" rules), or `null` while loading. */
export function useCurrentUserId(): number | null {
    return useAuth().user?.id ?? null;
}
