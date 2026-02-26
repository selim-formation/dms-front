/**
 * Auth Context
 * Provides authentication state throughout the application
 */

import { createContext } from "react";
import { type AuthContextValue } from "../types";

/**
 * Default context value
 */
const defaultValue: AuthContextValue = {
  user: null,
  permissions: [],
  isAuthenticated: false,
  isLoading: true,
  login: async () => {
    throw new Error("AuthProvider not initialized");
  },
  logout: async () => {
    throw new Error("AuthProvider not initialized");
  },
  register: async () => {
    throw new Error("AuthProvider not initialized");
  },
  refetchUser: async () => {
    throw new Error("AuthProvider not initialized");
  },
  can: () => false,
  canAny: () => false,
  canAll: () => false,
};

/**
 * Auth Context
 */
export const AuthContext = createContext<AuthContextValue>(defaultValue);
