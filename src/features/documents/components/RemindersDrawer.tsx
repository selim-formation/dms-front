import { useState, memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Bell, AlertCircle, Clock, X, UserCircle2, History, Inbox } from "lucide-react";
import { useTenant } from "@/core/tenant/hooks/useTenant";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useDocumentReminders } from "../hooks/useDocumentReminders";
import { useActiveDocumentReminders } from "../hooks/useActiveDocumentReminders";
import type { ApiDocument } from "../types/api.types";

interface RemindersDrawerProps {
  className?: string;
}

/** Raw Eloquent dumps for uploaded_by/responsible — no stable resource contract, just probe for a name. */
function displayName(raw: Record<string, unknown> | null | undefined): string | null {
  if (!raw) return null;
  const name = raw.name;
  return typeof name === "string" ? name : null;
}

function importanceBadgeClass(importance: string): string {
  const lower = importance.toLowerCase();
  if (lower === "critical") return "border-destructive text-destructive bg-destructive/10";
  if (lower === "high" || lower === "medium") return "border-warning text-warning bg-warning/10";
  return "border-info text-info bg-info/10";
}

/**
 * Reminder Item Component
 */
const ReminderItem = memo(function ReminderItem({
  document,
  onSelect,
}: {
  document: ApiDocument;
  onSelect: (documentId: number) => void;
}) {
  const { t } = useTranslation(["documents", "common"]);
  const uploadedByName = displayName(document.uploaded_by);
  const responsibleName = displayName(document.responsible);

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(document.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(document.id);
        }
      }}
      className="border-border/50 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
    >
      <CardContent className="p-3 sm:p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground truncate">
              {document.title}
            </h4>
            {document.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {document.description}
              </p>
            )}
          </div>
          <Badge
            variant="outline"
            className={`text-xs whitespace-nowrap shrink-0 ${importanceBadgeClass(document.importance)}`}
          >
            {document.importance}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          {document.expire_date && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{t("remindersDrawer.due", { date: document.expire_date })}</span>
            </div>
          )}
          <span className="px-2 py-1 rounded text-xs font-medium bg-chart-4/10 text-chart-4">
            {document.category}
          </span>
        </div>

        {(uploadedByName || responsibleName) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-border/30 pt-2">
            {uploadedByName && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                  {uploadedByName[0]}
                </div>
                <span className="truncate">{t("remindersDrawer.by", { name: uploadedByName })}</span>
              </div>
            )}
            {responsibleName && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                <UserCircle2 className="h-4 w-4 shrink-0 text-primary/70" />
                <span className="truncate">
                  {t("remindersDrawer.responsible", { name: responsibleName })}
                </span>
              </div>
            )}
          </div>
        )}

        {(document.created_at || document.updated_at) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground/80 border-t border-border/30 pt-2">
            {document.created_at && (
              <div className="flex items-center gap-1.5">
                <History className="h-3 w-3" />
                <span>{t("remindersDrawer.createdAt", { date: document.created_at })}</span>
              </div>
            )}
            {document.updated_at && document.updated_at !== document.created_at && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                <span>{t("remindersDrawer.updatedAt", { date: document.updated_at })}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

const ReminderItemSkeleton = () => (
  <Card className="border-border/50">
    <CardContent className="p-3 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </CardContent>
  </Card>
);

const EmptyState = memo(function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <Icon className="h-12 w-12 text-muted-foreground/40 mb-3" />
      <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground text-center">{description}</p>
    </div>
  );
});

const ErrorState = memo(function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const { t } = useTranslation(["documents", "common"]);
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <AlertCircle className="h-12 w-12 text-destructive mb-3" />
      <h3 className="text-sm font-semibold text-foreground mb-1">
        {t("remindersDrawer.failedToLoad")}
      </h3>
      <p className="text-xs text-muted-foreground text-center mb-4">{message}</p>
      <Button size="sm" variant="outline" onClick={onRetry}>
        {t("common:common.tryAgain")}
      </Button>
    </div>
  );
});

/**
 * Shared tab body for the Reminders / Active Reminders tabs.
 */
const ReminderTabContent = memo(function ReminderTabContent({
  documents,
  isLoading,
  isError,
  error,
  onRefetch,
  onSelect,
}: {
  documents: ApiDocument[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onRefetch: () => void;
  onSelect: (documentId: number) => void;
}) {
  const { t } = useTranslation(["documents", "common"]);

  if (isLoading) {
    return (
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {[...Array(3)].map((_, i) => (
          <ReminderItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message || t("remindersDrawer.failedToFetchReminders")}
        onRetry={onRefetch}
      />
    );
  }

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title={t("remindersDrawer.noRemindersTitle")}
        description={t("remindersDrawer.noRemindersDescription")}
      />
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {documents.map((document) => (
        <ReminderItem key={document.id} document={document} onSelect={onSelect} />
      ))}
    </div>
  );
});

/**
 * RemindersDrawer — notification bell → right-side drawer.
 *
 * 3 tabs: "All" has no backend feed yet (no general notifications
 * endpoint exists) so it's always empty by design; "Reminders" is
 * GET /documents/reminder (configured, not necessarily firing);
 * "Active Reminders" is GET /documents/active-reminders (firing now
 * or overdue). Each tab's query only runs once that tab is open.
 */
const RemindersDrawerComponent = memo(function RemindersDrawer({
  className = "",
}: RemindersDrawerProps) {
  const { t } = useTranslation(["documents", "common"]);
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"all" | "reminders" | "active">("all");
  const navigate = useNavigate();
  const tenant = useTenant();

  const {
    documents: reminderDocs,
    isLoading: remindersLoading,
    isError: remindersError,
    error: remindersErrorObj,
    refetch: refetchReminders,
  } = useDocumentReminders({ enabled: isOpen && tab === "reminders" });

  const {
    documents: activeDocs,
    isLoading: activeLoading,
    isError: activeError,
    error: activeErrorObj,
    refetch: refetchActive,
  } = useActiveDocumentReminders({ enabled: isOpen && tab === "active" });

  const handleSelect = useCallback(
    (documentId: number) => {
      setIsOpen(false);
      navigate({
        to: "/$tenant/documents/$id",
        params: { tenant: tenant?.tenantId ?? "", id: String(documentId) },
      });
    },
    [navigate, tenant],
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors relative ${className}`}
        aria-label={t("remindersDrawer.openAriaLabel")}
      >
        <Bell className="h-4 w-4" />
        {activeDocs.length > 0 && (
          <span className="absolute -top-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
        )}
      </button>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent side="right" className="w-full sm:w-105 h-full rounded-none">
          <DrawerHeader className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <DrawerTitle>{t("remindersDrawer.title")}</DrawerTitle>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-accent rounded-md transition-colors"
              aria-label={t("remindersDrawer.closeAriaLabel")}
            >
              <X className="h-4 w-4" />
            </button>
          </DrawerHeader>

          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="flex flex-col flex-1 h-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50 border-b border-border/50 rounded-none">
                <TabsTrigger value="all">{t("common:common.all")}</TabsTrigger>
                <TabsTrigger value="reminders">
                  {t("remindersDrawer.remindersTab")}
                  {reminderDocs.length > 0 && (
                    <Badge variant="default" className="ms-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                      {reminderDocs.length > 9 ? "9+" : reminderDocs.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="active">
                  {t("remindersDrawer.activeTab")}
                  {activeDocs.length > 0 && (
                    <Badge variant="default" className="ms-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                      {activeDocs.length > 9 ? "9+" : activeDocs.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden p-4">
                <TabsContent value="all" className="mt-0 h-full">
                  <EmptyState
                    icon={Inbox}
                    title={t("remindersDrawer.noNotificationsTitle")}
                    description={t("remindersDrawer.emptyAllDescription")}
                  />
                </TabsContent>

                <TabsContent value="reminders" className="mt-0 h-full">
                  <ReminderTabContent
                    documents={reminderDocs}
                    isLoading={remindersLoading}
                    isError={remindersError}
                    error={remindersErrorObj}
                    onRefetch={refetchReminders}
                    onSelect={handleSelect}
                  />
                </TabsContent>

                <TabsContent value="active" className="mt-0 h-full">
                  <ReminderTabContent
                    documents={activeDocs}
                    isLoading={activeLoading}
                    isError={activeError}
                    error={activeErrorObj}
                    onRefetch={refetchActive}
                    onSelect={handleSelect}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
});

RemindersDrawerComponent.displayName = "RemindersDrawer";

export default RemindersDrawerComponent;
