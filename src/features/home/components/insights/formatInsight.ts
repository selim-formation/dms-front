import type { InsightLocale } from "../../types/insights.types";

const EN_MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

const formatterCache = new Map<InsightLocale, Intl.DateTimeFormat>();

/** "Nov 2026" → month + year. */
const LABEL_RE = /^([A-Za-z]{3})[A-Za-z]*\.?\s+(\d{4})$/;

/**
 * Expiry-risk labels arrive as short English month + year ("Nov 2026") regardless
 * of `locale` — localize on the client, keeping the year ("November 2026" / "نوفمبر 2026").
 */
export function localizeMonth(label: string, locale: InsightLocale): string {
  const match = LABEL_RE.exec(label.trim());
  const index = match ? EN_MONTHS.indexOf(match[1].toLowerCase()) : -1;
  if (!match || index === -1) return label;

  let fmt = formatterCache.get(locale);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", numberingSystem: "latn" });
    formatterCache.set(locale, fmt);
  }
  return fmt.format(new Date(Number(match[2]), index, 1));
}
