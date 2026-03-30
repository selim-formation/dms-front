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

interface LoadingScreenProps {
    /**
     * Whether to show the loading screen
     * Should be true while AuthProvider is validating cookies (isLoading: true)
     */
    isVisible?: boolean;

    /**
     * Custom message to display below spinner
     * Defaults to "Validating session..."
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
    message = "Validating session...",
}: LoadingScreenProps) {
    if (!isVisible) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm"
            role="status"
            aria-live="polite"
            aria-label="Loading application"
        >
            {/* Content container - centered */}
            <div className="flex flex-col items-center space-y-4">
                {/* Spinner */}
                <Loader2 className="h-12 w-12 animate-spin text-primary" />

                {/* Loading message */}
                <p className="text-center text-sm text-muted-foreground font-medium">
                    {message}
                </p>

                {/* Optional: Loading indicator text */}
                <p className="text-xs text-muted-foreground/60">
                    Please wait while we validate your session...
                </p>
            </div>
        </div>
    );
}

export default LoadingScreen;
