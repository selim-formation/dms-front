import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronDown, Loader2, Search, UserRound } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useShareRecipientSearch } from "../../hooks/useShareRecipientSearch";
import type { ShareRecipientUser } from "../../types/documentShare.types";

interface ShareRecipientPickerProps {
  value: ShareRecipientUser | null;
  onChange: (user: ShareRecipientUser) => void;
  disabled?: boolean;
}

/**
 * Searchable "share with" user picker. Debounces the query and shows
 * loading/empty states inline — no dedicated cmdk dependency needed.
 */
function ShareRecipientPicker({
  value,
  onChange,
  disabled,
}: ShareRecipientPickerProps) {
  const { t } = useTranslation("documents");
  const [open, setOpen] = useState(false);
  const { query, setQuery, results, isLoading, isError } =
    useShareRecipientSearch();

  const handleSelect = (user: ShareRecipientUser) => {
    onChange(user);
    setOpen(false);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {t("documentShares.form.recipientLabel")}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm text-start disabled:opacity-50"
          >
            {value ? (
              <span className="flex items-center gap-2 truncate">
                <UserRound className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{value.name}</span>
                <span className="text-muted-foreground truncate">
                  ({value.email})
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">
                {t("documentShares.form.recipientPlaceholder")}
              </span>
            )}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("documentShares.form.recipientSearchPlaceholder")}
              className="w-full bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
            {isLoading && (
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
            )}
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {isError && (
              <li className="px-3 py-2 text-sm text-destructive">
                {t("documentShares.form.recipientSearchError")}
              </li>
            )}
            {!isError &&
              !isLoading &&
              query.trim().length >= 2 &&
              results.length === 0 && (
                <li className="px-3 py-2 text-sm text-muted-foreground">
                  {t("documentShares.form.recipientNoResults")}
                </li>
              )}
            {!isError && query.trim().length < 2 && (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                {t("documentShares.form.recipientTypeToSearch")}
              </li>
            )}
            {results.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(user)}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-sm text-start hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="truncate">
                    <span className="font-medium text-foreground">
                      {user.name}
                    </span>{" "}
                    <span className="text-muted-foreground">{user.email}</span>
                  </span>
                  {value?.id === user.id && (
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default memo(ShareRecipientPicker);
