/**
 * Feature flags configuration
 * Controls which features are enabled/disabled in the application
 */

export interface FeatureFlags {
  /**
   * UI Features
   */
  darkMode: boolean;
  responsiveDesign: boolean;

  /**
   * Document Features
   */
  documentVersioning: boolean;
  documentSharing: boolean;
  documentComments: boolean;
  documentPreview: boolean;
  advancedSearch: boolean;
  bulkOperations: boolean;

  /**
   * Collaboration Features
   */
  realTimeCollaboration: boolean;
  activityFeed: boolean;
  notifications: boolean;
  mentions: boolean;

  /**
   * Advanced Features
   */
  auditLog: boolean;
  analytics: boolean;
  advancedPermissions: boolean;
  customFields: boolean;
  workflows: boolean;
  integrations: boolean;

  /**
   * Security Features
   */
  twoFactorAuth: boolean;
  sessionManagement: boolean;
  ipWhitelist: boolean;

  /**
   * Performance Features
   */
  offlineMode: boolean;
  lazyLoading: boolean;
  virtualScrolling: boolean;

  /**
   * Development Features
   */
  debugMode: boolean;
  performanceMonitoring: boolean;
  errorReporting: boolean;
}

/**
 * Default feature flags
 * Override these with environment variables or tenant-specific settings
 */
export const defaultFeatureFlags: FeatureFlags = {
  // UI Features
  darkMode: true,
  responsiveDesign: true,

  // Document Features
  documentVersioning: true,
  documentSharing: true,
  documentComments: true,
  documentPreview: true,
  advancedSearch: true,
  bulkOperations: true,

  // Collaboration Features
  realTimeCollaboration: false, // Not yet implemented
  activityFeed: true,
  notifications: true,
  mentions: true,

  // Advanced Features
  auditLog: true,
  analytics: import.meta.env.PROD,
  advancedPermissions: true,
  customFields: false, // Future feature
  workflows: false, // Future feature
  integrations: false, // Future feature

  // Security Features
  twoFactorAuth: false, // Future feature
  sessionManagement: true,
  ipWhitelist: false, // Future feature

  // Performance Features
  offlineMode: false, // Not yet implemented
  lazyLoading: true,
  virtualScrolling: true,

  // Development Features
  debugMode: import.meta.env.DEV,
  performanceMonitoring: import.meta.env.PROD,
  errorReporting: import.meta.env.PROD,
};

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(
  feature: keyof FeatureFlags,
  flags: FeatureFlags = defaultFeatureFlags,
): boolean {
  return flags[feature];
}
