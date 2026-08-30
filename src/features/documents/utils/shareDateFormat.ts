/**
 * Converts between the <input type="datetime-local"> value shape
 * ("YYYY-MM-DDTHH:mm") and the API's "YYYY-MM-DD HH:mm:ss" shape.
 */

export function localToApiDateTime(local: string): string | null {
    if (!local) return null;
    const [datePart, timePart] = local.split('T');
    if (!datePart || !timePart) return null;
    const seconds = timePart.length === 5 ? `${timePart}:00` : timePart;
    return `${datePart} ${seconds}`;
}

export function isoToLocalInput(iso: string | null): string {
    if (!iso) return '';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
