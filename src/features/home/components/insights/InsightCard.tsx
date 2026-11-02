import { memo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  title: string;
  subtitle?: ReactNode;
  /** Chart area height in px — fixed so loading/empty/data never shift layout */
  height?: number;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
  className?: string;
  children?: ReactNode;
}

function InsightCardBase({
  title,
  subtitle,
  height = 280,
  isLoading,
  isError,
  isEmpty,
  onRetry,
  className,
  children,
}: InsightCardProps) {
  const { t } = useTranslation("home");

  let body: ReactNode = children;
  if (isLoading) {
    body = <Skeleton className="h-full w-full rounded-lg" />;
  } else if (isError) {
    body = (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
        <AlertCircle className="h-6 w-6 text-destructive" aria-hidden />
        <p>{t("insights.error")}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-xs font-medium text-primary hover:underline"
          >
            {t("insights.retry")}
          </button>
        )}
      </div>
    );
  } else if (isEmpty) {
    body = (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
        <BarChart3 className="h-6 w-6 opacity-50" aria-hidden />
        <p>{t("insights.empty")}</p>
      </div>
    );
  }

  return (
    <Card className={cn("rounded-xl border-border", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">{title}</CardTitle>
        {subtitle ? (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </CardHeader>
      <CardContent>
        <div style={{ height }} className="w-full" aria-busy={isLoading}>
          {body}
        </div>
      </CardContent>
    </Card>
  );
}

export const InsightCard = memo(InsightCardBase);
