import { useCallback, useMemo, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { SectionFilters, SectionSort } from '../types/section.types'
import { SECTIONS_PER_PAGE } from '../utils/sectionPayload'

const DEFAULT_SORT: SectionSort = '-created_at'

/** Owns list filters. Any change resets to page 1; search is debounced. */
export function useSectionFilterState() {
    const [search, setSearchRaw] = useState('')
    const [sort, setSortRaw] = useState<SectionSort>(DEFAULT_SORT)
    const [departmentIds, setDepartmentIdsRaw] = useState<number[]>([])
    const [hasImage, setHasImage] = useState(false)
    const [createdThisMonth, setCreatedThisMonth] = useState(false)
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(search.trim(), 300)

    const setSearch = useCallback((v: string) => { setSearchRaw(v); setPage(1) }, [])
    const setSort = useCallback((v: SectionSort) => { setSortRaw(v); setPage(1) }, [])
    const setDepartmentIds = useCallback((v: number[]) => { setDepartmentIdsRaw(v); setPage(1) }, [])
    const toggleHasImage = useCallback(() => { setHasImage((v) => !v); setPage(1) }, [])
    const toggleCreatedThisMonth = useCallback(() => { setCreatedThisMonth((v) => !v); setPage(1) }, [])
    const clear = useCallback(() => {
        setSearchRaw('')
        setSortRaw(DEFAULT_SORT)
        setDepartmentIdsRaw([])
        setHasImage(false)
        setCreatedThisMonth(false)
        setPage(1)
    }, [])

    const filters = useMemo<SectionFilters>(
        () => ({
            search: debouncedSearch || undefined,
            sort,
            departmentIds: departmentIds.length ? departmentIds : undefined,
            hasImage: hasImage || undefined,
            createdThisMonth: createdThisMonth || undefined,
            page,
            perPage: SECTIONS_PER_PAGE,
        }),
        [debouncedSearch, sort, departmentIds, hasImage, createdThisMonth, page],
    )

    const hasActiveFilters =
        !!search || sort !== DEFAULT_SORT || departmentIds.length > 0 || hasImage || createdThisMonth

    return {
        filters, page, setPage, search, setSearch, sort, setSort, departmentIds, setDepartmentIds,
        hasImage, toggleHasImage, createdThisMonth, toggleCreatedThisMonth, hasActiveFilters, clear,
    }
}
