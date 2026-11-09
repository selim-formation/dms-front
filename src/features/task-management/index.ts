/**
 * Task Management Feature Module
 *
 * The admin "Tasks" screen as an API client (/api/{tenant}/task-management):
 * tabbed list with counts, filters and search, create / edit wizard, inline
 * status change, trash, restore, permanent delete and bulk actions.
 * Distinct from features/tasks, which keeps the old read-only dashboard routes.
 *
 * Structure mirrors the other features (api, hooks, components, pages, types,
 * utils) and reuses the language-neutral components of features/departments.
 */

export const TASK_MANAGEMENT_FEATURE = {
  name: "task-management",
  description: "Task management feature (list, create, edit, status, trash, bulk)",
  routes: ["/$tenant/task-management"],
  permissions: ["read_tasks", "create_tasks", "update_tasks", "delete_tasks", "restore_tasks", "force_delete_tasks"],
} as const;
