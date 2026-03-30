import { useQuery } from "@tanstack/react-query";
import * as authService from "../services/auth.service";

export function useAuthUser(tenantId?: string | null,) {
    return useQuery({
        queryKey: ["auth", "user", tenantId],
        queryFn: async () => {

            if (!tenantId) return null;

            return await authService.getUser(tenantId);
        },
        enabled: !!tenantId,
        retry: false,
        refetchOnWindowFocus: false,
    });
}