/**
 * Register Route
 * User registration page
 */

import { createFileRoute } from "@tanstack/react-router";
<<<<<<< Updated upstream:src/routes/$tenant/register.tsx
import { requireGuest, requireTenant } from "@/core/router";
=======
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
>>>>>>> Stashed changes:src/routes/_guest/register.tsx

export const Route = createFileRoute("/$tenant/register")({
  beforeLoad: async (ctx) => {
    await requireTenant(ctx);
    await requireGuest(ctx);
  },
  component: RegisterPage,
});

function RegisterPage() {
<<<<<<< Updated upstream:src/routes/$tenant/register.tsx
  const { tenant } = Route.useParams();
=======
  const { t } = useTranslation(['auth', 'common']);
  const tenant = '';
>>>>>>> Stashed changes:src/routes/_guest/register.tsx

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <ThemeToggle className="fixed top-4 end-4" />
      <div className="max-w-md w-full">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t('auth:register.createAccount')}</h1>
            <p className="text-muted-foreground mt-2">
              {t('auth:register.join')} <span className="font-semibold text-primary">{tenant}</span>
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-muted-foreground mb-2"
                >
                  {t('auth:register.firstName')}
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder={t('auth:register.firstNamePlaceholder')}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-muted-foreground mb-2"
                >
                  {t('auth:register.lastName')}
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder={t('auth:register.lastNamePlaceholder')}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                {t('auth:register.emailAddress')}
              </label>
              <input
                id="email"
                type="email"
                placeholder={t('auth:register.emailPlaceholder')}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                {t('auth:register.password')}
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                {t('auth:register.confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="rounded border-border text-primary focus:ring-primary mt-1"
              />
              <label htmlFor="terms" className="ms-2 text-sm text-muted-foreground">
                {t('auth:register.agreeToTerms')}{" "}
                <a href="#" className="text-primary hover:text-primary/90">
                  {t('auth:register.termsOfService')}
                </a>{" "}
                {t('auth:register.and')}{" "}
                <a href="#" className="text-primary hover:text-primary/90">
                  {t('auth:register.privacyPolicy')}
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {t('auth:register.createAccount')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('auth:register.alreadyHaveAccount')}{" "}
              <a
                href={`/${tenant}/login`}
                className="text-primary hover:text-primary/90 font-medium"
              >
                {t('auth:register.signIn')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
