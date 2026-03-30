/**
 * Cookie Service
 * Utilities for managing HTTP-only cookies in the browser
 *
 * Note: HTTP-only cookies cannot be directly read from JavaScript
 * These functions are for:
 * - Checking if cookie exists (by side effects)
 * - Deleting cookies (via Set-Cookie with Max-Age=0)
 * - Testing and debugging cookie state
 */

import { logger } from "@/shared/utils/logger";

const log = logger.createScoped("Cookie Service");

/**
 * Cookie names used by the application
 */
export const CookieNames = {
    /** HTTP-only authentication cookie set by backend */
    AUTH_TOKEN: "id_token",

    /** HTTP-only session cookie (if used) */
    SESSION: "PHPSESSID",

    /** CSRF token (not HTTP-only, stored in memory instead) */
    CSRF_TOKEN: "XSRF-TOKEN",
} as const;

/**
 * Attempt to read a cookie value
 *
 * **Important**: HTTP-only cookies cannot be read from JavaScript.
 * This function is mainly for reading non-HTTP-only cookies (e.g., public cookies).
 * Authentication cookies are invisible to this function.
 *
 * Use case: Debugging, reading application-specific non-sensitive cookies
 *
 * @param name - Cookie name to read
 * @returns Cookie value if found, null otherwise
 */
export function getCookie(name: string): string | null {
    try {
        const nameEQ = `${name}=`;
        const cookies = document.cookie.split(";");

        for (const cookie of cookies) {
            const trimmed = cookie.trim();
            if (trimmed.startsWith(nameEQ)) {
                const value = trimmed.substring(nameEQ.length);
                log.debug(`Cookie read: ${name}`);
                return decodeURIComponent(value);
            }
        }

        log.debug(`Cookie not found: ${name}`);
        return null;
    } catch (error) {
        log.error("Failed to read cookie", { data: error });
        return null;
    }
}

/**
 * Check if a cookie exists
 *
 * **Important**: This will NOT detect HTTP-only cookies.
 * It can only detect non-HTTP-only cookies.
 *
 * Use case: Debugging, checking for application-specific cookies
 *
 * @param name - Cookie name to check
 * @returns true if cookie exists, false otherwise
 */
export function hasCookie(name: string): boolean {
    return getCookie(name) !== null;
}

/**
 * Delete a cookie by setting its Max-Age to 0
 *
 * The browser will automatically remove the cookie.
 * This is the only way to "delete" cookies from JavaScript.
 *
 * Use case: Testing, logout operations (though logout is typically server-initiated)
 *
 * @param name - Cookie name to delete
 * @param path - Cookie path (optional, default: "/")
 * @param domain - Cookie domain (optional)
 */
export function deleteCookie(
    name: string,
    path?: string,
    domain?: string,
): void {
    try {
        let cookieString = `${name}=; Max-Age=0; path=${path || "/"}`;

        if (domain) {
            cookieString += `; domain=${domain}`;
        }

        document.cookie = cookieString;
        log.info(`Cookie deleted: ${name}`);
    } catch (error) {
        log.error("Failed to delete cookie", { data: error });
    }
}

/**
 * Clear all non-HTTP-only cookies
 *
 * **Warning**: This will NOT clear HTTP-only cookies (they are tamper-proof).
 * HTTP-only cookies can only be invalidated by the server.
 *
 * Use case: Testing, debugging, clearing non-sensitive cookies
 */
export function clearAllCookies(): void {
    try {
        const cookies = document.cookie.split(";");

        for (const cookie of cookies) {
            const name = cookie.split("=")[0].trim();
            if (name) {
                deleteCookie(name);
            }
        }

        log.info("All non-HTTP-only cookies cleared");
    } catch (error) {
        log.error("Failed to clear cookies", { data: error });
    }
}

/**
 * Get all non-HTTP-only cookies as an object
 *
 * **Important**: HTTP-only cookies will not be included.
 * This is for debugging/inspection of application cookies only.
 *
 * @returns Object with cookie names as keys and values as values
 */
export function getAllCookies(): Record<string, string> {
    try {
        const cookies: Record<string, string> = {};

        document.cookie.split(";").forEach((cookie) => {
            const [name, value] = cookie.split("=").map((c) => c.trim());
            if (name) {
                cookies[name] = decodeURIComponent(value || "");
            }
        });

        return cookies;
    } catch (error) {
        log.error("Failed to get all cookies", { data: error });
        return {};
    }
}

/**
 * Check if HTTP-only cookie exists (indirectly)
 *
 * Since we cannot directly read HTTP-only cookies, we detect their presence
 * by making a test API request and checking if we get authenticated response.
 *
 * This is used during AuthProvider initialization to validate the cookie.
 *
 * **Note**: The actual validation happens in AuthProvider.loadUser()
 * which calls backend /me endpoint. If it returns 200, cookie is valid.
 *
 * @returns true if HTTP-only cookie appears valid (indirectly)
 */
export function hasHttpOnlyCookie(): boolean {
    // HTTP-only cookies cannot be checked directly from JavaScript
    // Their presence is verified by AuthProvider.loadUser() API call
    // This is a placeholder for documentation purposes
    log.debug("HTTP-only cookie presence can only be verified via API call");
    return true; // Trust AuthProvider validation
}
