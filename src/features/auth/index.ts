/**
 * Auth Feature Module
 *
 * This module handles authentication including:
 * - User login
 * - Form state management
 * - Session handling
 * - Login page UI
 *
 * Structure:
 * - components/: React components for login UI
 * - hooks/: Custom hooks for login operations
 * - types/: TypeScript types for auth feature
 * - utils/: Utility functions for auth
 */

export const AUTH_FEATURE = {
  name: "auth",
  description: "Authentication feature for login and session management",
};

// Components
export { LoginForm } from "./components/LoginForm";
export { LoginPage } from "./components/LoginPage";

// Hooks
export { useLoginForm } from "./hooks/useLoginForm";

// Types
export type { LoginFormData, LoginPageProps } from "./types";
