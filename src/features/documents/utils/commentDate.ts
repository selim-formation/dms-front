/**
 * The comments API returns dates as "d/m/Y H:i" (e.g. "19/08/2026 10:15"),
 * not ISO, and with no timezone marker - the backend sends these in UTC.
 * date-fns `parse()` always anchors naive strings to the browser's local
 * timezone, so parsing this string directly silently shifts it by the
 * local UTC offset (comments always read as stuck "N hours ago"). Extract
 * the wall-clock numbers, then re-anchor them explicitly as UTC.
 */
import { formatDistanceToNow, parse, isValid } from 'date-fns';

export function formatCommentTime(value: string): string {
  const parsedAsLocal = parse(value, 'dd/MM/yyyy HH:mm', new Date());
  if (!isValid(parsedAsLocal)) return value;

  const utcInstant = new Date(
    Date.UTC(
      parsedAsLocal.getFullYear(),
      parsedAsLocal.getMonth(),
      parsedAsLocal.getDate(),
      parsedAsLocal.getHours(),
      parsedAsLocal.getMinutes(),
    ),
  );

  return formatDistanceToNow(utcInstant, { addSuffix: true });
}
