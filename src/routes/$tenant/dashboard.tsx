/**
 * Dashboard Route
 * Main dashboard for authenticated users
 */

<<<<<<< Updated upstream:src/routes/$tenant/dashboard.tsx
import { createFileRoute } from "@tanstack/react-router";
import { requireAuthAndTenant } from "@/core/router";
=======
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { useAuth } from "@/core/auth/hooks/useAuth";
>>>>>>> Stashed changes:src/routes/_protected/$tenant/dashboard.tsx

export const Route = createFileRoute("/$tenant/dashboard")({
  beforeLoad: requireAuthAndTenant,
  component: DashboardPage,
});

function DashboardPage() {
  const { t } = useTranslation(["dashboard", "common"]);
  const { tenant } = Route.useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate({ to: "/login" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {t("tenant")}{" "}
                <span className="font-semibold text-primary">{tenant}</span>
              </span>
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-accent transition-colors"
              >
                {t("common:actions.logout")}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          {[
            { label: t("stats.documents"), value: "1,234", icon: "📄", color: "blue" },
            { label: t("stats.workspaces"), value: "12", icon: "🗂️", color: "green" },
            { label: t("stats.users"), value: "45", icon: "👥", color: "purple" },
            { label: t("stats.storage"), value: "45.2 GB", icon: "💾", color: "orange" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t("quickActions.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: t("quickActions.uploadDocument"),
                icon: "⬆️",
                href: `/${tenant}/documents/new`,
              },
              {
                label: t("quickActions.createWorkspace"),
                icon: "➕",
                href: `/${tenant}/workspaces/new`,
              },
              {
                label: t("quickActions.inviteUser"),
                icon: "✉️",
                href: `/${tenant}/users/invite`,
              },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/10 transition-colors"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="font-medium text-foreground">
                  {action.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t("recentActivity.title")}
          </h2>
          <div className="space-y-4">
            {[
              {
                user: "John Doe",
                action: t("recentActivity.uploaded"),
                item: "Project Proposal.pdf",
                time: "2 minutes ago",
              },
              {
                user: "Jane Smith",
                action: t("recentActivity.created"),
                item: "Q1 Reports workspace",
                time: "15 minutes ago",
              },
              {
                user: "Mike Johnson",
                action: t("recentActivity.edited"),
                item: "Budget_2024.xlsx",
                time: "1 hour ago",
              },
              {
                user: "Sarah Williams",
                action: t("recentActivity.shared"),
                item: "Marketing Plan.docx",
                time: "2 hours ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {activity.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>{" "}
                      <span className="font-medium">{activity.item}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
