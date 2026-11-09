import { useCallback, useReducer } from 'react';
import { MAX_NEW_IMAGES } from '../utils/galleryPayload';
import { newImageDraft, type ImageDraft } from '../utils/galleryForm';

type Action =
    | { type: 'add'; draft: ImageDraft }
    | { type: 'remove'; key: string }
    | { type: 'patch'; key: string; patch: Partial<ImageDraft> }
    | { type: 'reset' };

function reducer(state: ImageDraft[], action: Action): ImageDraft[] {
    switch (action.type) {
        case 'add':
            return state.length >= MAX_NEW_IMAGES ? state : [...state, action.draft];
        case 'remove':
            return state.filter((d) => d.key !== action.key);
        case 'patch':
            // Untouched rows keep their identity, so their memoised components skip rendering.
            return state.map((d) => (d.key === action.key ? { ...d, ...action.patch } : d));
        case 'reset':
            return [];
    }
}

/** List of picture drafts with stable setters (shared by the create wizard and the add-images dialog). */
export function useImageDrafts(initial: ImageDraft[] = []) {
    const [drafts, dispatch] = useReducer(reducer, initial);

    const add = useCallback(() => dispatch({ type: 'add', draft: newImageDraft() }), []);
    const remove = useCallback((key: string) => dispatch({ type: 'remove', key }), []);
    const patch = useCallback((key: string, p: Partial<ImageDraft>) => dispatch({ type: 'patch', key, patch: p }), []);
    const reset = useCallback(() => dispatch({ type: 'reset' }), []);

    return { drafts, add, remove, patch, reset };
}
