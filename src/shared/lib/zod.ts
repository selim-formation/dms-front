/**
 * Zod configuration and custom extensions
 */

import { z } from "zod";

/**
 * Custom error map for better error messages
 */
const customErrorMap: z.ZodErrorMap = (issue) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === "string") {
      return { message: "This field is required" };
    }
  }

  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.origin === "string") {
      if (issue.minimum === 1) {
        return { message: "This field is required" };
      }
      return { message: `Must be at least ${issue.minimum} characters` };
    }
    if (issue.origin === "array") {
      return { message: `Must have at least ${issue.minimum} items` };
    }
  }

  if (issue.code === z.ZodIssueCode.too_big) {
    if (issue.origin === "string") {
      return { message: `Must be at most ${issue.maximum} characters` };
    }
    if (issue.origin === "array") {
      return { message: `Must have at most ${issue.maximum} items` };
    }
  }

  return undefined;
};

// Set custom error map
z.setErrorMap(customErrorMap);

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
