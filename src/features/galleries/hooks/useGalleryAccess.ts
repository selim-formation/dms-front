import { useMemo } from 'react';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

/** Screen-level permissions; row-level buttons always come from `abilities`. */
export function useGalleryAccess() {
    const { can } = usePermissions();

    return useMemo(
        () => ({
            canRead: can('read_galleries'),
            canCreate: can('create_galleries'),
            canDelete: can('delete_galleries'),
            canRestore: can('restore_galleries'),
            canForceDelete: can('force_delete_galleries'),
            image: {
                canRead: can('read_gallery_images'),
                canCreate: can('create_gallery_images'),
                canDelete: can('delete_gallery_images'),
                canRestore: can('restore_gallery_images'),
                canForceDelete: can('force_delete_gallery_images'),
            },
            /** The picture files travel through the shared document-upload endpoints. */
            canUpload: can('create_documents'),
        }),
        [can],
    );
}

export type GalleryAccess = ReturnType<typeof useGalleryAccess>;
