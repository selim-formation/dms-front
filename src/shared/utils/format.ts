/**
 * Formatting utilities for dates, numbers, and currency
 */

import { format as formatDate, formatDistance, parseISO } from "date-fns";

/**
 * Format date to a standard format
 */
export function formatDateTime(
  date: string | Date,
  formatStr = "MMM dd, yyyy HH:mm",
): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return formatDate(dateObj, formatStr);
  } catch {
    return "Invalid date";
  }
}

/**
 * Format date only (no time)
 */
export function formatDateOnly(date: string | Date): string {
  return formatDateTime(date, "MMM dd, yyyy");
}

/**
 * Format time only (no date)
 */
export function formatTimeOnly(date: string | Date): string {
  return formatDateTime(date, "HH:mm");
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch {
    return "Invalid date";
  }
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${formatNumber(value * 100, decimals)}%`;
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number, suffix = "..."): string {
  if (text.length <= length) return text;
  return text.slice(0, length - suffix.length) + suffix;
}

/**
 * Capitalize first letter of string
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert camelCase to Title Case
 */
export function camelToTitle(text: string): string {
  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}
