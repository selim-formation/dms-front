/**
 * Tenant Cookie Service
 * Manages tenant ID persistence in cookies
 */

import { logger } from "@/shared/utils/logger";

const log = logger.createScoped("Tenant Cookie");

const TENANT_COOKIE_KEY = "dms_tenant_id";
const COOKIE_DURATION_DAYS = 30;

/**
 * Save tenant ID to cookie
 */
export function setTenantCookie(tenantId: string): void {
    try {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + COOKIE_DURATION_DAYS);

        const cookieValue = `${TENANT_COOKIE_KEY}=${encodeURIComponent(tenantId)}; path=/; expires=${expirationDate.toUTCString()}`;
        document.cookie = cookieValue;

        log.debug("Tenant cookie set", { tenantId });
    } catch (error) {
        log.error("Failed to set tenant cookie", { data: error });
    }
}

/**
 * Get tenant ID from cookie
 */
export function getTenantCookie(): string | null {
    try {
        const cookies = document.cookie.split(";");

        for (const cookie of cookies) {
            const [key, value] = cookie.split("=").map((c) => c.trim());

            if (key === TENANT_COOKIE_KEY && value) {
                const tenantId = decodeURIComponent(value);
                log.debug("Tenant cookie retrieved", { tenantId });
                return tenantId;
            }
        }

        return null;
    } catch (error) {
        log.error("Failed to retrieve tenant cookie", { data: error });
        return null;
    }
}

/**
 * Clear tenant cookie
 */
export function clearTenantCookie(): void {
    try {
        document.cookie = `${TENANT_COOKIE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        log.debug("Tenant cookie cleared");
    } catch (error) {
        log.error("Failed to clear tenant cookie", { data: error });
    }
}

/**
 * Check if tenant cookie exists
 */
export function hasTenantCookie(): boolean {
    return getTenantCookie() !== null;
}
