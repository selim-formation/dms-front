/**
 * Galleries Feature Module
 *
 * The admin "Galleries" and "Gallery images" screens as an API client
 * (/api/{tenant}/galleries and /api/{tenant}/gallery-images): list with
 * filters and trash, create wizard with chunked picture uploads, gallery page
 * with a paginated picture grid, edit / replace / trash / restore / delete for
 * good, and bulk actions for both resources.
 *
 * Structure mirrors the other features (api, hooks, components, pages, types,
 * utils) and reuses the language-neutral components of features/departments.
 */

export const GALLERIES_FEATURE = {
  name: "galleries",
  description: "Galleries and gallery images (list, create, images, trash, bulk)",
  routes: ["/$tenant/galleries", "/$tenant/galleries/$galleryId"],
  permissions: [
    "read_galleries", "create_galleries", "update_galleries", "delete_galleries", "restore_galleries", "force_delete_galleries",
    "read_gallery_images", "create_gallery_images", "update_gallery_images", "delete_gallery_images", "restore_gallery_images", "force_delete_gallery_images",
  ],
} as const;
