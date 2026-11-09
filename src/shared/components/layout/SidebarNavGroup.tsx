import { memo } from "react";
import { useTranslation } from "react-i18next";
import SidebarNavItem from "./SidebarNavItem";
import { isNavActive, type NavGroupConfig } from "./nav.config";

interface SidebarNavGroupProps {
  group: NavGroupConfig;
  tenantId: string;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}

function SidebarNavGroup({ group, tenantId, pathname, collapsed, onNavigate }: SidebarNavGroupProps) {
  const { t } = useTranslation("common");

  return (
    <section aria-label={t(group.labelKey)} className="space-y-2">
      {collapsed ? (
        <div className="mx-3 my-2 h-px bg-border" aria-hidden="true" />
      ) : (
        <h2 className="px-4 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          {t(group.labelKey)}
        </h2>
      )}
      <ul className="space-y-2">
        {group.items.map((item) => (
          <li key={item.to}>
            <SidebarNavItem
              item={item}
              tenantId={tenantId}
              active={isNavActive(item.to, tenantId, pathname)}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default memo(SidebarNavGroup);
