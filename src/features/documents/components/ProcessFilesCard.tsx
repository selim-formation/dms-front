import { memo } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, ExternalLink, FilePlus2, MinusCircle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { cn } from "@/lib/utils";

type ProcessKind = "creation" | "renewal";

const KIND_ICON = { creation: FilePlus2, renewal: RefreshCw } as const;

interface ProcessItemProps {
  kind: ProcessKind;
  /** Signed, time-limited file URL, or null when no file is attached. */
  url: string | null | undefined;
}

/** One procedure file: icon tile, title, state and a preview button. */
const ProcessItem = memo(function ProcessItem({ kind, url }: ProcessItemProps) {
  const { t } = useTranslation("documents");
  const Icon = KIND_ICON[kind];
  const available = !!url;

  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border p-4 transition-colors",
        available ? "border-border/60 bg-card hover:border-primary/40 hover:bg-muted/30" : "border-dashed border-border/60 bg-muted/20",
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          available ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
        )}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1 basis-44">
        <h4 className="truncate text-sm font-semibold text-foreground">{t(`processFiles.${kind}.title`)}</h4>
        <p className="mt-0.5 text-xs text-muted-foreground">{t(`processFiles.${kind}.description`)}</p>
        <span
          className={cn(
            "mt-2 inline-flex items-center gap-1.5 text-xs font-medium",
            available ? "text-success" : "text-muted-foreground",
          )}
        >
          {available ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : <MinusCircle className="h-3.5 w-3.5" aria-hidden="true" />}
          {t(available ? "processFiles.attached" : "processFiles.missing")}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="shrink-0 gap-1.5"
        disabled={!available}
        onClick={() => url && window.open(url, "_blank", "noopener,noreferrer")}
        aria-label={`${t("processFiles.preview")} — ${t(`processFiles.${kind}.title`)}`}
      >
        <ExternalLink className="h-4 w-4" />
        {t("processFiles.preview")}
      </Button>
    </li>
  );
});

interface ProcessFilesCardProps {
  creationProcess?: string | null;
  renewalProcess?: string | null;
}

/** Creation / renewal procedure files of a document, from the view endpoint's signed links. Hidden when neither exists. */
function ProcessFilesCard({ creationProcess, renewalProcess }: ProcessFilesCardProps) {
  const { t } = useTranslation("documents");
  if (!creationProcess && !renewalProcess) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{t("processFiles.title")}</CardTitle>
        <p className="text-xs text-muted-foreground">{t("processFiles.subtitle")}</p>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3 md:grid-cols-2">
          <ProcessItem kind="creation" url={creationProcess} />
          <ProcessItem kind="renewal" url={renewalProcess} />
        </ul>
      </CardContent>
    </Card>
  );
}

export default memo(ProcessFilesCard);
