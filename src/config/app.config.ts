/**
 * Application-wide configuration
 * Centralizes all app settings and environment variables
 */

export const appConfig = {
  /**
   * Application metadata
   */
  app: {
    name: "Document Management System",
    shortName: "DMS",
    version: "1.0.0",
    environment: import.meta.env.MODE,
  },

  /**
   * API configuration
   */
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "https://dms.formation-obs.com",
    timeout: 30000, // 30 seconds
    withCredentials: true, // Required for Sanctum cookies
  },

  /**
   * Authentication configuration
   */
  auth: {
    sanctumEndpoint: "/sanctum/csrf-cookie",
    loginEndpoint: "/login",
    logoutEndpoint: "/logout",
    userEndpoint: "/api/user",
    permissionsEndpoint: "/api/user/permissions",
  },

  /**
   * Tenant configuration
   */
  tenant: {
    validationEndpoint: "/api/tenants/{tenant}/validate",
    cacheTime: 3600000, // 1 hour
    staleTime: 1800000, // 30 minutes
  },

  /**
   * Query client configuration
   */
  query: {
    defaultStaleTime: 300000, // 5 minutes
    defaultCacheTime: 600000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  },

  /**
   * Feature flags
   */
  features: {
    enableDarkMode: true,
    enableOfflineMode: false,
    enableAnalytics: import.meta.env.PROD,
    enableDebugMode: import.meta.env.DEV,
  },

  /**
   * Pagination defaults
   */
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },

  /**
   * File upload configuration
   */
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
      "image/gif",
      "text/plain",
    ],
    chunkSize: 1024 * 1024, // 1MB chunks for large file uploads
  },
} as const;

export type AppConfig = typeof appConfig;
