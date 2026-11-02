import type { InsightLocale } from "../../types/insights.types";

const EN_MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

const formatterCache = new Map<InsightLocale, Intl.DateTimeFormat>();

/**
 * Expiry-risk labels arrive as short English months ("Oct") regardless
 * of `locale` — localize on the client.
 */
export function localizeMonth(label: string, locale: InsightLocale): string {
  const index = EN_MONTHS.indexOf(label.slice(0, 3).toLowerCase());
  if (index === -1) return label;

  let fmt = formatterCache.get(locale);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, { month: "short" });
    formatterCache.set(locale, fmt);
  }
  return fmt.format(new Date(2000, index, 1));
}
