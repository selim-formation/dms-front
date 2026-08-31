/**
 * Login Page Component
 * Full login page with design layout (form on left, background on right)
 */

import { useTranslation } from "react-i18next";
import { LoginForm } from "./LoginForm";
import LastLoginMethod from "./LastLoginMethod";
import { useLocalStorage } from "@/shared/hooks";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { appConfig } from "@/config/app.config";

interface LoginPageProps {
  backgroundImage?: string;
}

export function LoginPage({
  backgroundImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
}: LoginPageProps) {
  const { t } = useTranslation(['auth', 'common']);
  const { setItem, getItem } = useLocalStorage('lastLoginMethod')

  const handleSocialLogin = (method: string, url: string) => {
    setItem(method)
    window.location.href = `${appConfig.api.baseUrl}${url}`
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ThemeToggle className="fixed top-4 end-4 z-10" />
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
          {/* Left Side - Form */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <div className="max-w-md w-full mx-auto lg:mx-0">
              {/* Header */}
              <div className="mb-8">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  {t('auth:loginPage.startForFree')}
                </p>
                <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-2">
                  {t('auth:loginPage.signInToAccount')}
                  <span className="text-primary inline-block ms-1">
                    .
                  </span>
                </h1>

              </div>

              {/* Login Form */}
              <LoginForm />

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">
                  {t('auth:loginPage.or')}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <LastLoginMethod defaultOpen={getItem() === 'Microsoft'}>
                  <button
                    onClick={() => handleSocialLogin('Microsoft', '/auth/microsoft/redirect')}
                    className="cursor-pointer w-full border border-border bg-card hover:bg-background text-foreground font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor">
                      <path d="M11.4 24H0V12.6h11.4V24z" />
                      <path d="M24 24H12.6V12.6H24V24z" />
                      <path d="M11.4 11.4H0V0h11.4v11.4z" />
                      <path d="M24 11.4H12.6V0H24v11.4z" />
                    </svg>
                    {t('auth:loginPage.continueWithMicrosoft')}
                  </button>
                </LastLoginMethod>

                {getItem() !== undefined ? (
                  <p className="my-4 text-center font-medium text-muted-foreground text-sm">
                    {t('auth:loginPage.lastLoginMethodWas', { method: getItem() })}
                  </p>
                ) : null}
              </div>

              {/* Footer Text */}
              <p className="text-xs text-muted-foreground text-center mt-6">
                {t('auth:loginPage.agreeToTerms')}{" "}
                <a
                  href="#"
                  className="text-primary hover:underline">
                  {t('auth:loginPage.termsOfService')}
                </a>{" "}
                {t('auth:loginPage.and')}{" "}
                <a
                  href="#"
                  className="text-primary hover:underline">
                  {t('auth:loginPage.privacyPolicy')}
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
            <div className="absolute bottom-8 end-8 flex items-center justify-center">
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
