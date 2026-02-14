/**
 * Auth Feature Types
 */

export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginPageProps {
  isLoading?: boolean;
  error?: string | null;
}
