import { useCallback, useMemo, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { ImageFilters, ImageSort } from '../types/gallery.types'
import { IMAGES_PER_PAGE } from '../utils/galleryPayload'

export type ImageTab = 'live' | 'trash'

/** Filters of one gallery's picture grid. Any change resets to page 1; search is debounced. */
export function useImageFilterState(galleryId: number) {
    const [tab, setTabRaw] = useState<ImageTab>('live')
    const [search, setSearchRaw] = useState('')
    const [sort, setSortRaw] = useState<ImageSort>('-created_at')
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(search.trim(), 300)

    const setTab = useCallback((v: ImageTab) => { setTabRaw(v); setPage(1) }, [])
    const setSearch = useCallback((v: string) => { setSearchRaw(v); setPage(1) }, [])
    const setSort = useCallback((v: ImageSort) => { setSortRaw(v); setPage(1) }, [])

    const filters = useMemo<ImageFilters>(
        () => ({
            galleryId,
            trashed: tab === 'trash' ? 'only' : undefined,
            search: debouncedSearch || undefined,
            sort,
            page,
            perPage: IMAGES_PER_PAGE,
        }),
        [galleryId, tab, debouncedSearch, sort, page],
    )

    return { filters, tab, setTab, page, setPage, search, setSearch, sort, setSort }
}
