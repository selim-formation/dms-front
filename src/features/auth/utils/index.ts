/**
 * Auth Feature Utilities
 */

export * from "./error-handling";

/**
 * Format email for display
 */
export function formatEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check password strength
 */
export function getPasswordStrength(password: string): {
  score: number;
  label: "weak" | "fair" | "good" | "strong";
} {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const labels: Array<"weak" | "fair" | "good" | "strong"> = [
    "weak",
    "weak",
    "fair",
    "fair",
    "good",
    "strong",
  ];

  return {
    score,
    label: labels[Math.min(score, 5)],
  };
}
