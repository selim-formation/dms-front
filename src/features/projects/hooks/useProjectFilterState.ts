import { useCallback, useMemo, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { TrashedFilter } from '@/features/departments/components/DepartmentFilterBar'
import type { ProjectFilters, ProjectSort, ProjectStatus, ProjectType } from '../types/project.types'
import { PROJECTS_PER_PAGE } from '../utils/projectPayload'

const DEFAULT_SORT: ProjectSort = '-created_at'

/** Owns list filters. Any change resets to page 1; search is debounced. */
export function useProjectFilterState() {
    const [search, setSearchRaw] = useState('')
    const [trashed, setTrashedRaw] = useState<TrashedFilter>('active')
    const [sort, setSortRaw] = useState<ProjectSort>(DEFAULT_SORT)
    const [status, setStatusRaw] = useState<ProjectStatus[]>([])
    const [type, setTypeRaw] = useState<ProjectType[]>([])
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(search.trim(), 300)

    const setSearch = useCallback((v: string) => { setSearchRaw(v); setPage(1) }, [])
    const setTrashed = useCallback((v: TrashedFilter) => { setTrashedRaw(v); setPage(1) }, [])
    const setSort = useCallback((v: ProjectSort) => { setSortRaw(v); setPage(1) }, [])
    const setStatus = useCallback((v: ProjectStatus[]) => { setStatusRaw(v); setPage(1) }, [])
    const setType = useCallback((v: ProjectType[]) => { setTypeRaw(v); setPage(1) }, [])
    const clear = useCallback(() => {
        setSearchRaw('')
        setTrashedRaw('active')
        setSortRaw(DEFAULT_SORT)
        setStatusRaw([])
        setTypeRaw([])
        setPage(1)
    }, [])

    const filters = useMemo<ProjectFilters>(
        () => ({
            search: debouncedSearch || undefined,
            sort,
            status: status.length ? status : undefined,
            type: type.length ? type : undefined,
            trashed: trashed === 'active' ? undefined : trashed,
            page,
            perPage: PROJECTS_PER_PAGE,
        }),
        [debouncedSearch, sort, status, type, trashed, page],
    )

    const hasActiveFilters =
        !!search || trashed !== 'active' || sort !== DEFAULT_SORT || status.length > 0 || type.length > 0

    return {
        filters, page, setPage, search, setSearch, trashed, setTrashed, sort, setSort,
        status, setStatus, type, setType, hasActiveFilters, clear,
    }
}
