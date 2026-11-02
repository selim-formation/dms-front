import { useCallback, useMemo, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { TrashedFilter } from '@/features/departments/components/DepartmentFilterBar'
import type { EntityFilters, EntitySort } from '../types/entity.types'
import { ENTITIES_PER_PAGE } from '../utils/entityPayload'

const DEFAULT_SORT: EntitySort = '-created_at'

/** Owns list filters. Any change resets to page 1; search is debounced. */
export function useEntityFilterState() {
    const [search, setSearchRaw] = useState('')
    const [trashed, setTrashedRaw] = useState<TrashedFilter>('active')
    const [sort, setSortRaw] = useState<EntitySort>(DEFAULT_SORT)
    const [hasImage, setHasImage] = useState(false)
    const [createdThisMonth, setCreatedThisMonth] = useState(false)
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(search.trim(), 300)

    const setSearch = useCallback((v: string) => { setSearchRaw(v); setPage(1) }, [])
    const setTrashed = useCallback((v: TrashedFilter) => { setTrashedRaw(v); setPage(1) }, [])
    const setSort = useCallback((v: EntitySort) => { setSortRaw(v); setPage(1) }, [])
    const toggleHasImage = useCallback(() => { setHasImage((v) => !v); setPage(1) }, [])
    const toggleCreatedThisMonth = useCallback(() => { setCreatedThisMonth((v) => !v); setPage(1) }, [])
    const clear = useCallback(() => {
        setSearchRaw('')
        setTrashedRaw('active')
        setSortRaw(DEFAULT_SORT)
        setHasImage(false)
        setCreatedThisMonth(false)
        setPage(1)
    }, [])

    const filters = useMemo<EntityFilters>(
        () => ({
            search: debouncedSearch || undefined,
            sort,
            trashed: trashed === 'active' ? undefined : trashed,
            hasImage: hasImage || undefined,
            createdThisMonth: createdThisMonth || undefined,
            page,
            perPage: ENTITIES_PER_PAGE,
        }),
        [debouncedSearch, sort, trashed, hasImage, createdThisMonth, page],
    )

    const hasActiveFilters = !!search || trashed !== 'active' || sort !== DEFAULT_SORT || hasImage || createdThisMonth

    return { filters, page, setPage, search, setSearch, trashed, setTrashed, sort, setSort, hasImage, toggleHasImage, createdThisMonth, toggleCreatedThisMonth, hasActiveFilters, clear }
}
