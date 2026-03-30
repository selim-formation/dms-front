/**
 * Zod configuration and custom extensions
 */

import { z } from "zod";

/**
 * Re-export zod for consistent usage
 */
export { z };

/**
 * Helper to extract form errors from Zod validation error
 */
export function getFormErrors<T>(error: z.ZodError<T>): Record<string, string> {
  const errors: Record<string, string> = {};

  error.issues.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });

  return errors;
}
