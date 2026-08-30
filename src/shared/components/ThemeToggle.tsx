import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "@/core/theme/ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { t } = useTranslation("common");
  const { isDark, setTheme } = useThemeContext();

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
      title={isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors ${className}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
