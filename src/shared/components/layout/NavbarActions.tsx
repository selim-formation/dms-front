import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
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
      <button className="flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors relative">
        <Bell className="h-4 w-4" />
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
      </button>
      <UserMenu />
    </div>
  );
}
