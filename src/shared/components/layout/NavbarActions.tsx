import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import RemindersDrawer from "@/features/documents/components/RemindersDrawer";
import { UserMenu } from "./UserMenu";

/**
 * Right-hand action cluster for the Navbar: language, theme,
 * notifications, and the current user's menu (profile / logout).
 */
export function NavbarActions() {
  return (
    <div className="flex items-center gap-3">
      <LanguageSwitcher />
      <ThemeToggle />
      <RemindersDrawer />
      <UserMenu />
    </div>
  );
}
