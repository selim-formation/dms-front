/**
 * Companies Feature Module
 *
 * The admin "Companies" screen as an API client (/api/tenant-management — no `{tenant}` in the URL):
 * list (companies you belong to) with search and filters (trash, has logo, created this month, feature),
 * create with logo upload and features, edit features / logo, trash, restore, permanent delete
 * (empty companies only) and all-or-nothing bulk actions.
 *
 * Rules enforced in the UI (the server stays authoritative):
 * - name / slug / system id are read-only after creation (they are part of every URL),
 * - row buttons come from `abilities`, which the server checks per company,
 * - trashing or deleting the open company sends you back to the company chooser,
 * - the logo is a chunked upload (jpg / png / webp / gif, ≤ 5 MB, never SVG) passed as `logo_upload_id`.
 *
 * Structure mirrors the other features (api, hooks, components, pages, types, utils) and reuses
 * the language-neutral components of features/departments and shared/.
 */

export const COMPANIES_FEATURE = {
  name: "companies",
  description: "Company (tenant) management feature",
  routes: ["/$tenant/companies"],
  permissions: ["read_tenants", "create_tenants", "update_tenants", "delete_tenants", "restore_tenants", "force_delete_tenants"],
} as const;
