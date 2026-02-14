/**
 * Utility function to merge Tailwind CSS classes
 * Uses clsx and tailwind-merge for optimal class merging
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with support for conditional classes
 *
 * @example
 * cn('px-2 py-1', 'bg-blue-500') // => 'px-2 py-1 bg-blue-500'
 * cn('px-2 py-1', { 'bg-blue-500': true }) // => 'px-2 py-1 bg-blue-500'
 * cn('px-2', 'px-4') // => 'px-4' (tailwind-merge handles conflicts)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
