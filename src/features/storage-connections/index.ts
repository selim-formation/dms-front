/**
 * Storage Connections Feature Module
 *
 * Where a company's document files are kept: S3-compatible buckets, SharePoint
 * drives or a server folder. List with filters, create, edit settings, replace
 * credentials (write-only secrets), run the connection test, choose the
 * default, disable (permanent) and delete.
 *
 * Structure mirrors the other features (api, hooks, components, pages, types,
 * utils); provider forms are config-driven (utils/providerFields.ts).
 */

export const STORAGE_CONNECTIONS_FEATURE = {
  name: "storage-connections",
  description: "Storage connections management feature",
  routes: ["/$tenant/storage-connections"],
  permissions: [
    "read_storage_connections",
    "create_storage_connections",
    "update_storage_connections",
    "test_storage_connections",
    "delete_storage_connections",
  ],
} as const;
