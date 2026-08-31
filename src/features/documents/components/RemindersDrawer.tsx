import { useState, useMemo, memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  AlertCircle,
  Clock,
  X,
  UserCircle2,
  History,
} from "lucide-react";
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
import { useReminders } from "../hooks/useReminders";
import { useActiveReminders } from "../hooks/useActiveReminders";
import { useNotifications } from "../hooks/useNotifications";
import type { ReminderDocument, Notification } from "../types/reminder.types";

interface RemindersDrawerProps {
  className?: string;
}

/**
 * Reminder Item Component
 */
const ReminderItem = memo(function ReminderItem({
  reminder,
  onSelect,
}: {
  reminder: ReminderDocument;
  onSelect: (documentId: number) => void;
}) {
  const { t } = useTranslation(["documents", "common"]);
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(reminder.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(reminder.id);
        }
      }}
      className="border-border/50 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
    >
      <CardContent className="p-3 sm:p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground truncate">
              {reminder.title}
            </h4>
            {reminder.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {reminder.description}
              </p>
            )}
          </div>
          <Badge
            variant="outline"
            className={`
              text-xs whitespace-nowrap shrink-0
              ${
                reminder.importance === "critical"
                  ? "border-destructive text-destructive bg-destructive/10"
                  : reminder.importance === "high"
                    ? "border-warning text-warning bg-warning/10"
                    : reminder.importance === "medium"
                      ? "border-warning text-warning bg-warning/10"
                      : "border-info text-info bg-info/10"
              }
            `}
          >
            {reminder.importance}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {t("remindersDrawer.due", { date: reminder.expire_date })}
            </span>
          </div>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              reminder.category === "operational"
                ? "bg-chart-4/10 text-chart-4"
                : "bg-chart-5/10 text-chart-5"
            }`}
          >
            {reminder.category}
          </span>
        </div>

        {(reminder.uploaded_by || reminder.responsible) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-border/30 pt-2">
            {reminder.uploaded_by && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                  {reminder.uploaded_by.name[0]}
                </div>
                <span className="truncate">
                  {t("remindersDrawer.by", { name: reminder.uploaded_by.name })}
                </span>
              </div>
            )}
            {reminder.responsible && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                <UserCircle2 className="h-4 w-4 shrink-0 text-primary/70" />
                <span className="truncate">
                  {t("remindersDrawer.responsible", {
                    name: reminder.responsible,
                  })}
                </span>
              </div>
            )}
          </div>
        )}

        {(reminder.created_at || reminder.updated_at) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground/80 border-t border-border/30 pt-2">
            {reminder.created_at && (
              <div className="flex items-center gap-1.5">
                <History className="h-3 w-3" />
                <span>
                  {t("remindersDrawer.createdAt", {
                    date: new Date(reminder.created_at).toLocaleDateString(),
                  })}
                </span>
              </div>
            )}
            {reminder.updated_at &&
              reminder.updated_at !== reminder.created_at && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  <span>
                    {t("remindersDrawer.updatedAt", {
                      date: new Date(reminder.updated_at).toLocaleDateString(),
                    })}
                  </span>
                </div>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

/**
 * Notification Item Component
 */
const NotificationItem = memo(function NotificationItem({
  notification,
}: {
  notification: Notification;
}) {
  const { t } = useTranslation(["documents", "common"]);
  return (
    <Card className="border-border/50 hover:border-primary/50 transition-colors">
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground">
              {notification.title || t("remindersDrawer.notification")}
            </h4>
            {notification.message && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {notification.message}
              </p>
            )}
            {notification.created_at && (
              <p className="text-xs text-muted-foreground/70 mt-2">
                {new Date(notification.created_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

/**
 * Loading Skeleton
 */
const ReminderItemSkeleton = () => (
  <Card className="border-border/50">
    <CardContent className="p-3 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </CardContent>
  </Card>
);

/**
 * Empty State Component
 */
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

/**
 * Error State Component
 */
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
      <p className="text-xs text-muted-foreground text-center mb-4">
        {message}
      </p>
      <Button size="sm" variant="outline" onClick={onRetry}>
        {t("common:common.tryAgain")}
      </Button>
    </div>
  );
});

/**
 * Tab Content with Reminders
 */
const RemindersTabContent = memo(function RemindersTabContent({
  data,
  isLoading,
  isError,
  error,
  onRefetch,
  onSelect,
}: {
  data: ReminderDocument[];
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

  if (data.length === 0) {
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
      {data.map((reminder) => (
        <ReminderItem
          key={reminder.id}
          reminder={reminder}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
});

/**
 * Tab Content with Notifications
 */
const NotificationsTabContent = memo(function NotificationsTabContent({
  data,
  isLoading,
  isError,
  error,
  onRefetch,
}: {
  data: Notification[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onRefetch: () => void;
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
        message={
          error?.message || t("remindersDrawer.failedToFetchNotifications")
        }
        onRetry={onRefetch}
      />
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title={t("remindersDrawer.noNotificationsTitle")}
        description={t("remindersDrawer.noNotificationsDescription")}
      />
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {data.map((notification, index) => (
        <NotificationItem
          key={notification.id || index}
          notification={notification}
        />
      ))}
    </div>
  );
});

/**
 * RemindersDrawer Component
 *
 * Features:
 * - Tabbed interface with All Reminders, Active Reminders, and Notifications
 * - Real-time data fetching with TanStack Query
 * - Optimized re-renders with React.memo
 * - Modern design with smooth transitions
 * - Error handling and loading states
 * - Right-positioned drawer
 * - Dynamic unread counter
 */
const RemindersDrawerComponent = memo(function RemindersDrawer({
  className = "",
}: RemindersDrawerProps) {
  const { t } = useTranslation(["documents", "common"]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const tenant = useTenant();

  // Fetch reminders and notifications
  const {
    reminders: allReminders,
    isLoading: allRemindersLoading,
    isError: allRemindersError,
    error: allRemindersErrorObj,
    refetch: refetchAllReminders,
  } = useReminders();

  const {
    reminders: activeReminders,
    isLoading: activeRemindersLoading,
    isError: activeRemindersError,
    error: activeRemindersErrorObj,
    refetch: refetchActiveReminders,
  } = useActiveReminders();

  const {
    notifications,
    isLoading: notificationsLoading,
    isError: notificationsError,
    error: notificationsErrorObj,
    refetch: refetchNotifications,
  } = useNotifications();

  // Memoize total unread count
  const totalUnreadCount = useMemo(
    () => activeReminders.length + notifications.length,
    [activeReminders.length, notifications.length],
  );

  // Memoize refetch callbacks
  const handleRefetchAll = useCallback(
    () => refetchAllReminders(),
    [refetchAllReminders],
  );

  const handleRefetchActive = useCallback(
    () => refetchActiveReminders(),
    [refetchActiveReminders],
  );

  const handleRefetchNotifications = useCallback(
    () => refetchNotifications(),
    [refetchNotifications],
  );

  const handleSelectReminder = useCallback(
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
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors relative ${className}`}
        aria-label={t("remindersDrawer.openAriaLabel")}
      >
        <Bell className="h-4 w-4" />
        {totalUnreadCount > 0 && (
          <>
            <span className="absolute -top-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
            {totalUnreadCount > 9 && (
              <span className="absolute -top-1 -end-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center border-2 border-background">
                {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Drawer */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="w-full sm:w-105 h-full rounded-none">
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

          {/* Tabs */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs defaultValue="active" className="flex flex-col flex-1 h-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50 border-b border-border/50 rounded-none">
                <TabsTrigger value="all">
                  {t("common:common.all")}
                  {allReminders.length > 0 && (
                    <Badge
                      variant="default"
                      className="ms-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                    >
                      {allReminders.length > 9 ? "9+" : allReminders.length}
                    </Badge>
                  )}
                </TabsTrigger>

                <TabsTrigger value="active" className="relative">
                  {t("common:status.active")}
                  {activeReminders.length > 0 && (
                    <Badge
                      variant="default"
                      className="ms-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                    >
                      {activeReminders.length > 9
                        ? "9+"
                        : activeReminders.length}
                    </Badge>
                  )}
                </TabsTrigger>

                <TabsTrigger value="notifications">
                  {t("remindersDrawer.notificationsTab")}
                  {notifications.length > 0 && (
                    <Badge
                      variant="default"
                      className="ms-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                    >
                      {notifications.length > 9 ? "9+" : notifications.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Tab Contents */}
              <div className="flex-1 overflow-hidden p-4">
                <TabsContent value="all" className="mt-0 h-full">
                  <RemindersTabContent
                    data={allReminders}
                    isLoading={allRemindersLoading}
                    isError={allRemindersError}
                    error={allRemindersErrorObj}
                    onRefetch={handleRefetchAll}
                    onSelect={handleSelectReminder}
                  />
                </TabsContent>

                <TabsContent value="active" className="mt-0 h-full">
                  <RemindersTabContent
                    data={activeReminders}
                    isLoading={activeRemindersLoading}
                    isError={activeRemindersError}
                    error={activeRemindersErrorObj}
                    onRefetch={handleRefetchActive}
                    onSelect={handleSelectReminder}
                  />
                </TabsContent>

                <TabsContent value="notifications" className="mt-0 h-full">
                  <NotificationsTabContent
                    data={notifications}
                    isLoading={notificationsLoading}
                    isError={notificationsError}
                    error={notificationsErrorObj}
                    onRefetch={handleRefetchNotifications}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Footer */}
          {/* <div className="border-t border-border/50 p-4 space-y-2">
                        <Button variant="outline" className="w-full" size="sm">
                            <ChevronRight className="h-4 w-4 mr-2" />
                            View All
                        </Button>
                    </div> */}
        </DrawerContent>
      </Drawer>
    </>
  );
});

RemindersDrawerComponent.displayName = "RemindersDrawer";

export default RemindersDrawerComponent;
