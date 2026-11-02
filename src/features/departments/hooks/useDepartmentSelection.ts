import { useCallback, useMemo, useState } from 'react'

/**
 * Row selection that auto-resets whenever `resetKey` changes (new page,
 * new filters) — derived during render, no effect needed.
 */
export function useDepartmentSelection(resetKey: string, pageIds: number[]) {
    const [state, setState] = useState<{ key: string; ids: number[] }>({ key: resetKey, ids: [] })

    const ids = useMemo(() => (state.key === resetKey ? state.ids : []), [state, resetKey])
    const selectedIds = useMemo<ReadonlySet<number>>(() => new Set(ids), [ids])

    const toggle = useCallback(
        (id: number) =>
            setState((prev) => {
                const current = prev.key === resetKey ? prev.ids : []
                return {
                    key: resetKey,
                    ids: current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
                }
            }),
        [resetKey],
    )

    const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

    const toggleAll = useCallback(
        () => setState({ key: resetKey, ids: allSelected ? [] : pageIds }),
        [resetKey, allSelected, pageIds],
    )

    const clear = useCallback(() => setState({ key: resetKey, ids: [] }), [resetKey])

    return { selectedIds, selectedList: ids, allSelected, toggle, toggleAll, clear }
}
