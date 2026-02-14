/**
 * Login Page Component
 * Full login page with design layout (form on left, background on right)
 */

import { useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";

interface LoginPageProps {
  backgroundImage?: string;
  logoSrc?: string;
  showNavigation?: boolean;
}

export function LoginPage({
  backgroundImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
  logoSrc,
  showNavigation = true,
}: LoginPageProps) {
  const [isDark, setIsDark] = useState(false);

  // Check dark mode preference
  useEffect(() => {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(dark);

    // Listen for changes
    const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", listener);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", listener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-(--color-background) flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
          {/* Left Side - Form */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <div className="max-w-md w-full mx-auto lg:mx-0">
              {/* Header */}
              <div className="mb-8">
                <p className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wide mb-3">
                  Start for free
                </p>
                <h1 className="text-4xl lg:text-5xl font-black text-(--color-text-main) mb-2">
                  Sign in to your account
                  <span className="text-(--color-primary) inline-block ml-1">
                    .
                  </span>
                </h1>
              
              </div>

              {/* Login Form */}
              <LoginForm />

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-(--color-border)" />
                <span className="text-xs text-(--color-text-muted)">
                  OR
                </span>
                <div className="flex-1 h-px bg-(--color-border)" />
              </div>

              {/* Social Login */}
              <button className="w-full border border-(--color-border) bg-(--color-surface) hover:bg-(--color-background) text-(--color-text-main) font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              {/* Footer Text */}
              <p className="text-xs text-(--color-text-muted) text-center mt-6">
                By signing in, you agree to our{" "}
                <a
                  href="#"
                  className="text-(--color-primary) hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-(--color-primary) hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Right Side - Background Image */}
          <div className="hidden lg:block order-1 lg:order-2 relative rounded-3xl overflow-hidden h-96 lg:h-full min-h-96">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${backgroundImage}')`,
              }}>
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Branding in corner */}
            <div className="absolute bottom-8 right-8 flex items-center justify-center">
              <div className="text-white">
                <svg
                  className="h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
