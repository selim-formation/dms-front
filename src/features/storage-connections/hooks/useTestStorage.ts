import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { storageApiService } from '../api/storageApi';
import { useStorageCache } from './useStorageCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import { errorStatus } from '@/features/departments/utils/departmentErrors';
import { TEST_COOLDOWN_MS } from '../utils/storagePayload';

/**
 * Runs the connection test. The call answers 200 even when the test fails, so
 * callers read `data.passed`; the status changed either way, hence the refresh.
 * A 429 (5 per minute) turns `cooling` on for a minute so the button stays disabled.
 */
export function useTestStorage() {
    const { tenant, invalidate } = useStorageCache();
    const [cooling, setCooling] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current);
    }, []);

    const startCooldown = useCallback(() => {
        setCooling(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCooling(false), TEST_COOLDOWN_MS);
    }, []);

    const mutation = useMutation({
        mutationFn: (id: number) => storageApiService.test(requireTenant(tenant), id),
        onError: (err) => {
            if (errorStatus(err) === 429) startCooldown();
        },
        onSettled: invalidate,
    });

    return { mutation, cooling };
}
