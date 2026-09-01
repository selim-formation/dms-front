import { Search } from "lucide-react";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import RemindersDrawer from "@/features/documents/components/RemindersDrawer";
import { UserMenu } from "./UserMenu";

/**
 * Right-hand action cluster for the Navbar: language, theme, search,
 * notifications, and the current user's menu (profile / logout).
 */
export function NavbarActions() {
  return (
    <div className="flex items-center gap-3">
      <LanguageSwitcher />
      <ThemeToggle />
      <button className="flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
        <Search className="h-4 w-4" />
      </button>
      <RemindersDrawer />
      <UserMenu />
    </div>
  );
}
