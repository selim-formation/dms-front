import { useCallback, useReducer } from 'react';
import { newVersionDraft, type DocumentFormValues, type ProcessDraft, type VersionDraft } from '../utils/documentForm';
import type { ProcessKind } from '../types/version.types';

type IdField = 'types' | 'departments' | 'sections' | 'entities' | 'cc';
type ScalarField = 'title' | 'description' | 'importance' | 'category' | 'origin_department_id' | 'responsible';

type Action =
    | { type: 'scalar'; field: ScalarField; value: DocumentFormValues[ScalarField] }
    | { type: 'ids'; field: IdField; ids: number[] }
    | { type: 'patchProcess'; kind: ProcessKind; patch: Partial<ProcessDraft> }
    | { type: 'addVersion' }
    | { type: 'removeVersion'; key: string }
    | { type: 'patchVersion'; key: string; patch: Partial<VersionDraft> };

function reducer(state: DocumentFormValues, action: Action): DocumentFormValues {
    switch (action.type) {
        case 'scalar':
            return { ...state, [action.field]: action.value };
        case 'ids':
            return { ...state, [action.field]: action.ids };
        case 'patchProcess':
            return { ...state, process: { ...state.process, [action.kind]: { ...state.process[action.kind], ...action.patch } } };
        case 'addVersion':
            return { ...state, versions: [...state.versions, newVersionDraft()] };
        case 'removeVersion':
            return { ...state, versions: state.versions.filter((v) => v.key !== action.key) };
        case 'patchVersion':
            // Untouched rows keep their identity, so their memoised components skip rendering.
            return {
                ...state,
                versions: state.versions.map((v) => (v.key === action.key ? { ...v, ...action.patch } : v)),
            };
    }
}

/** Form state with stable setters (safe to hand to memoised step components). */
export function useDocumentForm(initial: DocumentFormValues) {
    const [values, dispatch] = useReducer(reducer, initial);

    const setScalar = useCallback(
        <F extends ScalarField>(field: F, value: DocumentFormValues[F]) => dispatch({ type: 'scalar', field, value }),
        [],
    );
    const setIds = useCallback((field: string, ids: number[]) => dispatch({ type: 'ids', field: field as IdField, ids }), []);
    const addVersion = useCallback(() => dispatch({ type: 'addVersion' }), []);
    const removeVersion = useCallback((key: string) => dispatch({ type: 'removeVersion', key }), []);
    const patchVersion = useCallback((key: string, patch: Partial<VersionDraft>) => dispatch({ type: 'patchVersion', key, patch }), []);

    const patchProcess = useCallback((kind: ProcessKind, patch: Partial<ProcessDraft>) => dispatch({ type: 'patchProcess', kind, patch }), []);

    return { values, setScalar, setIds, addVersion, removeVersion, patchVersion, patchProcess };
}
