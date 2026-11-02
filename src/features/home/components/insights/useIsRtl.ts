import { useTranslation } from "react-i18next";
import { getLanguageDirection } from "@/core/i18n/i18n";

/** Recharts doesn't mirror axes by itself — charts flip them from this. */
export function useIsRtl(): boolean {
  const { i18n } = useTranslation();
  return getLanguageDirection(i18n.resolvedLanguage ?? i18n.language) === "rtl";
}
