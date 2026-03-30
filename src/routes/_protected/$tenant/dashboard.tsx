/**
 * Dashboard Route
 * Main dashboard for authenticated users
 */

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/$tenant/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { tenant } = Route.useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Tenant:{" "}
                <span className="font-semibold text-blue-600">{tenant}</span>
              </span>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Logout
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
            { label: "Documents", value: "1,234", icon: "📄", color: "blue" },
            { label: "Workspaces", value: "12", icon: "🗂️", color: "green" },
            { label: "Users", value: "45", icon: "👥", color: "purple" },
            { label: "Storage", value: "45.2 GB", icon: "💾", color: "orange" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Upload Document",
                icon: "⬆️",
                href: `/${tenant}/documents/new`,
              },
              {
                label: "Create Workspace",
                icon: "➕",
                href: `/${tenant}/workspaces/new`,
              },
              {
                label: "Invite User",
                icon: "✉️",
                href: `/${tenant}/users/invite`,
              },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="font-medium text-gray-900">
                  {action.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              {
                user: "John Doe",
                action: "uploaded",
                item: "Project Proposal.pdf",
                time: "2 minutes ago",
              },
              {
                user: "Jane Smith",
                action: "created",
                item: "Q1 Reports workspace",
                time: "15 minutes ago",
              },
              {
                user: "Mike Johnson",
                action: "edited",
                item: "Budget_2024.xlsx",
                time: "1 hour ago",
              },
              {
                user: "Sarah Williams",
                action: "shared",
                item: "Marketing Plan.docx",
                time: "2 hours ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">
                      {activity.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      <span className="text-gray-600">{activity.action}</span>{" "}
                      <span className="font-medium">{activity.item}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
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
