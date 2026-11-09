import { useCallback, useReducer } from 'react';
import type { TaskFormValues } from '../utils/taskForm';

type Action =
    | { type: 'scalar'; field: keyof TaskFormValues; value: TaskFormValues[keyof TaskFormValues] }
    | { type: 'patch'; patch: Partial<TaskFormValues> };

function reducer(state: TaskFormValues, action: Action): TaskFormValues {
    switch (action.type) {
        case 'scalar':
            return { ...state, [action.field]: action.value };
        case 'patch':
            return { ...state, ...action.patch };
    }
}

/** Form state with stable setters (safe to hand to memoised step components). */
export function useTaskForm(initial: TaskFormValues) {
    const [values, dispatch] = useReducer(reducer, initial);

    const setScalar = useCallback(
        <F extends keyof TaskFormValues>(field: F, value: TaskFormValues[F]) => dispatch({ type: 'scalar', field, value }),
        [],
    );
    const patch = useCallback((p: Partial<TaskFormValues>) => dispatch({ type: 'patch', patch: p }), []);

    return { values, setScalar, patch };
}
