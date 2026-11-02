import { useCallback, useMemo, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { TrashedFilter } from '../components/DepartmentFilterBar'
import type { DepartmentFilters, DepartmentSort } from '../types/department.types'
import { DEPARTMENTS_PER_PAGE } from '../utils/departmentPayload'

const DEFAULT_SORT: DepartmentSort = '-created_at'

/**
 * Owns every list filter. Any filter change resets to page 1; only the
 * debounced search reaches the query so typing doesn't spam the API.
 */
export function useDepartmentFilterState() {
    const [search, setSearchRaw] = useState('')
    const [trashed, setTrashedRaw] = useState<TrashedFilter>('active')
    const [sort, setSortRaw] = useState<DepartmentSort>(DEFAULT_SORT)
    const [hasImage, setHasImage] = useState(false)
    const [createdThisMonth, setCreatedThisMonth] = useState(false)
    const [sectionIds, setSectionIdsRaw] = useState<number[]>([])
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(search.trim(), 300)

    const setSearch = useCallback((v: string) => { setSearchRaw(v); setPage(1) }, [])
    const setTrashed = useCallback((v: TrashedFilter) => { setTrashedRaw(v); setPage(1) }, [])
    const setSort = useCallback((v: DepartmentSort) => { setSortRaw(v); setPage(1) }, [])
    const setSectionIds = useCallback((v: number[]) => { setSectionIdsRaw(v); setPage(1) }, [])
    const toggleHasImage = useCallback(() => { setHasImage((v) => !v); setPage(1) }, [])
    const toggleCreatedThisMonth = useCallback(() => { setCreatedThisMonth((v) => !v); setPage(1) }, [])

    const clear = useCallback(() => {
        setSearchRaw('')
        setTrashedRaw('active')
        setSortRaw(DEFAULT_SORT)
        setHasImage(false)
        setCreatedThisMonth(false)
        setSectionIdsRaw([])
        setPage(1)
    }, [])

    const filters = useMemo<DepartmentFilters>(
        () => ({
            search: debouncedSearch || undefined,
            sort,
            trashed: trashed === 'active' ? undefined : trashed,
            hasImage: hasImage || undefined,
            createdThisMonth: createdThisMonth || undefined,
            sectionIds: sectionIds.length ? sectionIds : undefined,
            page,
            perPage: DEPARTMENTS_PER_PAGE,
        }),
        [debouncedSearch, sort, trashed, hasImage, createdThisMonth, sectionIds, page],
    )

    const hasActiveFilters =
        !!search || trashed !== 'active' || sort !== DEFAULT_SORT || hasImage || createdThisMonth || sectionIds.length > 0

    return {
        filters,
        page,
        setPage,
        search,
        setSearch,
        trashed,
        setTrashed,
        sort,
        setSort,
        hasImage,
        toggleHasImage,
        createdThisMonth,
        toggleCreatedThisMonth,
        sectionIds,
        setSectionIds,
        hasActiveFilters,
        clear,
    }
}
