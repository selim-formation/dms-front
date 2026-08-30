/**
 * Loading Screen Component
 * Displays full-screen spinner while AuthProvider validates HTTP-only cookies on app startup
 *
 * Purpose:
 * - Block route navigation until cookie validation completes
 * - Prevent route guards from redirecting while loading
 * - Provide visual feedback during initial auth check
 *
 * Behavior:
 * - Full-screen overlay with centered spinner
 * - Does NOT block non-navigation interactions (zoom, DevTools, etc.)
 * - Automatically unmounts when AuthProvider.isLoading becomes false
 */

import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LoadingScreenProps {
    /**
     * Whether to show the loading screen
     * Should be true while AuthProvider is validating cookies (isLoading: true)
     */
    isVisible?: boolean;

    /**
     * Custom message to display below spinner
     * Defaults to the translated "Validating session..." string
     */
    message?: string;
}

/**
 * LoadingScreen Component
 *
 * Shows a full-screen loading spinner while AuthProvider validates cookies.
 * Use within AppProviders to display while isLoading is true.
 */
export function LoadingScreen({
    isVisible = true,
    message,
}: LoadingScreenProps) {
    const { t } = useTranslation("common");

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
            role="status"
            aria-live="polite"
            aria-label={t("loadingScreen.loadingApplication")}
        >
            {/* Content container - centered */}
            <div className="flex flex-col items-center space-y-4">
                {/* Spinner */}
                <Loader2 className="h-12 w-12 animate-spin text-primary" />

                {/* Loading message */}
                <p className="text-center text-sm text-muted-foreground font-medium">
                    {message ?? t("loadingScreen.validatingSession")}
                </p>

                {/* Optional: Loading indicator text */}
                <p className="text-xs text-muted-foreground/60">
                    {t("loadingScreen.pleaseWait")}
                </p>
            </div>
        </div>
    );
}

export default LoadingScreen;
