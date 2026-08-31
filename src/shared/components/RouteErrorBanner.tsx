import { AlertTriangle, ShieldOff, X } from "lucide-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const ICONS = {
  tenant_not_found: AlertTriangle,
  tenant_access_denied: ShieldOff,
  invalid_tenant: AlertTriangle,
} as const;

type RouteErrorCode = keyof typeof ICONS;

function isRouteErrorCode(value: unknown): value is RouteErrorCode {
  return typeof value === "string" && value in ICONS;
}

/**
 * Shows the reason a tenant-scoped navigation bounced the user back
 * here (tenant not found / access denied / generic failure), read from
 * the `?error=` search param set by the /$tenant route guard.
 */
export function RouteErrorBanner() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const code = search.error;

  if (!isRouteErrorCode(code)) return null;

  const Icon = ICONS[code];

  const dismiss = () => {
    navigate({
      to: ".",
      search: (prev: Record<string, unknown>) => ({ ...prev, error: undefined }),
      replace: true,
    });
  };

  return (
    <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
      <Icon className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-destructive">
          {t(`routeError.${code}.title`)}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t(`routeError.${code}.description`)}
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label={t("routeError.dismiss")}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
