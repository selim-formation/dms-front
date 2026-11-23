/**
 * Single source of truth for sidebar navigation: groups → items.
 * An item without `permission` is visible to everyone in the tenant.
 */

import {
  Building,
  Building2,
  CheckSquare,
  Contact,
  FileText,
  FolderKanban,
  HardDrive,
  Images,
  Home,
  Landmark,
  Layers,
  type LucideIcon,
  Pin,
  ShieldCheck,
  Star,
  Tags,
  UserCog,
  Users,
} from "lucide-react";

export interface NavItemConfig {
  /** i18n key in the `common` namespace. */
  labelKey: string;
  /** Route pattern; every one takes only the `$tenant` param. */
  to: string;
  icon: LucideIcon;
  permission?: string;
}

export interface NavGroupConfig {
  key: string;
  labelKey: string;
  items: NavItemConfig[];
}

export const navGroups: NavGroupConfig[] = [
  {
    key: "overview",
    labelKey: "navGroups.overview",
    items: [{ labelKey: "nav.home", to: "/$tenant", icon: Home }],
  },
  {
    key: "documents",
    labelKey: "navGroups.documents",
    items: [
      { labelKey: "nav.documents", to: "/$tenant/documents", icon: FileText },
      { labelKey: "nav.favorites", to: "/$tenant/favorites", icon: Star },
      { labelKey: "nav.pinnedDocuments", to: "/$tenant/pinned-documents", icon: Pin },
    ],
  },
  {
    key: "workspace",
    labelKey: "navGroups.workspace",
    items: [
      { labelKey: "nav.tasks", to: "/$tenant/task-management", icon: CheckSquare, permission: "read_tasks" },
      { labelKey: "nav.teams", to: "/$tenant/teams", icon: Users },
      { labelKey: "nav.galleries", to: "/$tenant/galleries", icon: Images, permission: "read_galleries" },
    ],
  },
  {
    key: "organization",
    labelKey: "navGroups.organization",
    items: [
      { labelKey: "nav.departments", to: "/$tenant/departments", icon: Building2, permission: "read_departments" },
      { labelKey: "nav.sections", to: "/$tenant/sections", icon: Layers, permission: "read_departments" },
      { labelKey: "nav.types", to: "/$tenant/types", icon: Tags, permission: "read_types" },
      { labelKey: "nav.entities", to: "/$tenant/entities", icon: Landmark, permission: "read_entities" },
      { labelKey: "nav.projects", to: "/$tenant/projects", icon: FolderKanban, permission: "read_projects" },
      { labelKey: "nav.employees", to: "/$tenant/employees", icon: Contact, permission: "read_employees" },
    ],
  },
  {
    key: "administration",
    labelKey: "navGroups.administration",
    items: [
      { labelKey: "nav.companies", to: "/$tenant/companies", icon: Building, permission: "read_tenants" },
      { labelKey: "nav.users", to: "/$tenant/users", icon: UserCog, permission: "read_users" },
      { labelKey: "nav.roles", to: "/$tenant/roles", icon: ShieldCheck, permission: "read_role" },
      {
        labelKey: "nav.storageConnections",
        to: "/$tenant/storage-connections",
        icon: HardDrive,
        permission: "read_storage_connections",
      },
    ],
  },
];

/** `/acme/documents/12` is inside `/$tenant/documents`; the home item only matches exactly. */
export function isNavActive(to: string, tenantId: string, pathname: string): boolean {
  const target = to.replace("$tenant", tenantId);
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  if (target === `/${tenantId}`) return path === target;
  return path === target || path.startsWith(`${target}/`);
}
