/**
 * Common validation schemas and utilities using Zod
 */

import { z } from "zod";

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address");

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  );

/**
 * Required string schema
 */
export const requiredString = (fieldName = "This field") =>
  z.string().min(1, `${fieldName} is required`);

/**
 * Optional string schema
 */
export const optionalString = z.string().optional();

/**
 * URL validation schema
 */
export const urlSchema = z.string().url("Invalid URL");

/**
 * Phone number validation schema (basic)
 */
export const phoneSchema = z
  .string()
  .regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number");

/**
 * File validation schema
 */
export const fileSchema = (maxSizeMB = 10, allowedTypes: string[] = []) => {
  return z
    .instanceof(File)
    .refine(
      (file) => file.size <= maxSizeMB * 1024 * 1024,
      `File size must be less than ${maxSizeMB}MB`,
    )
    .refine(
      (file) => allowedTypes.length === 0 || allowedTypes.includes(file.type),
      `File type must be one of: ${allowedTypes.join(", ")}`,
    );
};

/**
 * Date validation schema
 */
export const dateSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "Invalid date format",
});

/**
 * Positive number schema
 */
export const positiveNumber = z.number().positive("Must be a positive number");

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid("Invalid UUID format");

/**
 * Slug validation schema
 */
export const slugSchema = z
  .string()
  .regex(
    /^[a-z0-9-]+$/,
    "Slug can only contain lowercase letters, numbers, and hyphens",
  );

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  return urlSchema.safeParse(url).success;
}

/**
 * Validate UUID
 */
export function isValidUuid(uuid: string): boolean {
  return uuidSchema.safeParse(uuid).success;
}
