import { useCallback, useMemo, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { TaskFilters, TaskPriority, TaskScope, TaskSort, TaskTab } from '../types/task.types'
import { TASKS_PER_PAGE, tabFilters } from '../utils/taskPayload'

const DEFAULT_SORT: TaskSort = '-created_at'

/** Owns tab + list filters. Any change resets to page 1; search is debounced. */
export function useTaskFilterState() {
    const [tab, setTabRaw] = useState<TaskTab>('all')
    const [search, setSearchRaw] = useState('')
    const [priority, setPriorityRaw] = useState<TaskPriority | ''>('')
    const [scope, setScopeRaw] = useState<TaskScope | ''>('')
    const [sort, setSortRaw] = useState<TaskSort>(DEFAULT_SORT)
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(search.trim(), 300)

    const setTab = useCallback((v: TaskTab) => { setTabRaw(v); setPage(1) }, [])
    const setSearch = useCallback((v: string) => { setSearchRaw(v); setPage(1) }, [])
    const setPriority = useCallback((v: TaskPriority | '') => { setPriorityRaw(v); setPage(1) }, [])
    const setScope = useCallback((v: TaskScope | '') => { setScopeRaw(v); setPage(1) }, [])
    const setSort = useCallback((v: TaskSort) => { setSortRaw(v); setPage(1) }, [])
    const clear = useCallback(() => {
        setSearchRaw('')
        setPriorityRaw('')
        setScopeRaw('')
        setSortRaw(DEFAULT_SORT)
        setPage(1)
    }, [])

    const filters = useMemo<TaskFilters>(
        () => ({
            ...tabFilters(tab),
            search: debouncedSearch || undefined,
            priority: priority ? [priority] : undefined,
            scope: scope || undefined,
            sort,
            page,
            perPage: TASKS_PER_PAGE,
        }),
        [tab, debouncedSearch, priority, scope, sort, page],
    )

    const hasActiveFilters = !!search || !!priority || !!scope || sort !== DEFAULT_SORT

    return {
        filters, tab, setTab, page, setPage, search, setSearch, priority, setPriority,
        scope, setScope, sort, setSort, hasActiveFilters, clear,
    }
}
