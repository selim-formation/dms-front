import { useCallback, useMemo, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { ImportFilters, ImportMode, ImportStatus } from '../types/import.types'
import { IMPORTS_PER_PAGE } from '../utils/importPayload'

/** Owns list filters. Any change resets to page 1; search is debounced. */
export function useImportFilterState() {
    const [search, setSearchRaw] = useState('')
    const [status, setStatusRaw] = useState<ImportStatus | ''>('')
    const [mode, setModeRaw] = useState<ImportMode | ''>('')
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(search.trim(), 300)

    const setSearch = useCallback((v: string) => { setSearchRaw(v); setPage(1) }, [])
    const setStatus = useCallback((v: ImportStatus | '') => { setStatusRaw(v); setPage(1) }, [])
    const setMode = useCallback((v: ImportMode | '') => { setModeRaw(v); setPage(1) }, [])
    const clear = useCallback(() => {
        setSearchRaw('')
        setStatusRaw('')
        setModeRaw('')
        setPage(1)
    }, [])

    const filters = useMemo<ImportFilters>(
        () => ({
            search: debouncedSearch || undefined,
            status: status || undefined,
            mode: mode || undefined,
            sort: '-created_at',
            page,
            perPage: IMPORTS_PER_PAGE,
        }),
        [debouncedSearch, status, mode, page],
    )

    const hasActiveFilters = !!search || !!status || !!mode

    return { filters, page, setPage, search, setSearch, status, setStatus, mode, setMode, hasActiveFilters, clear }
}
