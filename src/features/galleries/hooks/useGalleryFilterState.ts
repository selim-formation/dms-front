import { useCallback, useMemo, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { GalleryFilters, GallerySort, GalleryType } from '../types/gallery.types'
import { GALLERIES_PER_PAGE } from '../utils/galleryPayload'

const DEFAULT_SORT: GallerySort = '-created_at'
export type GalleryTab = 'all' | 'trash'
export type HasImages = '' | 'yes' | 'no'

/** Owns tab + list filters. Any change resets to page 1; search is debounced. */
export function useGalleryFilterState() {
    const [tab, setTabRaw] = useState<GalleryTab>('all')
    const [search, setSearchRaw] = useState('')
    const [type, setTypeRaw] = useState<GalleryType | ''>('')
    const [hasImages, setHasImagesRaw] = useState<HasImages>('')
    const [sort, setSortRaw] = useState<GallerySort>(DEFAULT_SORT)
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(search.trim(), 300)

    const setTab = useCallback((v: GalleryTab) => { setTabRaw(v); setPage(1) }, [])
    const setSearch = useCallback((v: string) => { setSearchRaw(v); setPage(1) }, [])
    const setType = useCallback((v: GalleryType | '') => { setTypeRaw(v); setPage(1) }, [])
    const setHasImages = useCallback((v: HasImages) => { setHasImagesRaw(v); setPage(1) }, [])
    const setSort = useCallback((v: GallerySort) => { setSortRaw(v); setPage(1) }, [])
    const clear = useCallback(() => {
        setSearchRaw('')
        setTypeRaw('')
        setHasImagesRaw('')
        setSortRaw(DEFAULT_SORT)
        setPage(1)
    }, [])

    const filters = useMemo<GalleryFilters>(
        () => ({
            trashed: tab === 'trash' ? 'only' : undefined,
            search: debouncedSearch || undefined,
            type: type || undefined,
            hasImages: hasImages ? hasImages === 'yes' : undefined,
            sort,
            page,
            perPage: GALLERIES_PER_PAGE,
        }),
        [tab, debouncedSearch, type, hasImages, sort, page],
    )

    const hasActiveFilters = !!search || !!type || !!hasImages || sort !== DEFAULT_SORT

    return {
        filters, tab, setTab, page, setPage, search, setSearch, type, setType,
        hasImages, setHasImages, sort, setSort, hasActiveFilters, clear,
    }
}
