/** `2027-01-31` (a calendar date) or a full ISO instant → locale date, without timezone drift. */
export function formatCalendarDate(value: string, locale: string): string {
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
    const date = new Date(dateOnly ? `${value}T00:00:00Z` : value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', ...(dateOnly ? { timeZone: 'UTC' } : {}) }).format(date);
}
