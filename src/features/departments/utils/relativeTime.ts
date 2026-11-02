const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['week', 604_800],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
];

/** Locale-aware "2 hours ago" (EN/AR) without pulling in date-fns locales. */
export function relativeTime(iso: string, locale: string): string {
    const diffSec = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    for (const [unit, secs] of UNITS) {
        if (Math.abs(diffSec) >= secs) return rtf.format(Math.round(diffSec / secs), unit);
    }
    return rtf.format(0, 'second');
}
