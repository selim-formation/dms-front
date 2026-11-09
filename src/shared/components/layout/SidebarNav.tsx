import { memo } from "react";
import { useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useVisibleNavGroups } from "@/shared/hooks/useVisibleNavGroups";
import SidebarNavGroup from "./SidebarNavGroup";

interface SidebarNavProps {
  tenantId: string;
  collapsed: boolean;
  onNavigate?: () => void;
}

/** Shared by the desktop rail and the mobile drawer. */
function SidebarNav({ tenantId, collapsed, onNavigate }: SidebarNavProps) {
  const { t } = useTranslation("common");
  const groups = useVisibleNavGroups();
  const pathname = useLocation({ select: (l) => l.pathname });

  return (
    <nav aria-label={t("sidebar.label")} className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4 pt-2">
      {groups.map((group) => (
        <SidebarNavGroup
          key={group.key}
          group={group}
          tenantId={tenantId}
          pathname={pathname}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

export default memo(SidebarNav);
