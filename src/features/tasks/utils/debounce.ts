/**
 * Debounce Utility
 * 
 * Prevents excessive function calls during rapid state updates (e.g., search input)
 * Standard pattern for optimizing React applications
 */

/**
 * Debounce a function with a specified delay
 * 
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * 
 * @example
 * const debouncedSearch = debounce((term: string) => {
 *   setSearch(term);
 * }, 300);
 * 
 * // In input handler
 * onChange={(e) => debouncedSearch(e.target.value)}
 */
export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number,
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            fn(...args);
            timeoutId = null;
        }, delay);
    };
}

/**
 * Create a debounced version of a state setter
 * 
 * @param setState - React setState function
 * @param delay - Delay in milliseconds
 * @returns Debounced setter function
 * 
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSetSearch = debounceState(setSearch, 300);
 * 
 * return (
 *   <input
 *     onChange={(e) => debouncedSetSearch(e.target.value)}
 *   />
 * );
 */
export function debounceState<T>(
    setState: (value: T) => void,
    delay: number,
): (value: T) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (value: T) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            setState(value);
            timeoutId = null;
        }, delay);
    };
}

/**
 * Advanced debounce with cancel support
 * Useful when you need to stop pending debounced calls
 */
export function createDebounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number,
): {
    (...args: Parameters<T>): void;
    cancel: () => void;
    flush: () => void;
} {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<T> | null = null;

    const debounced = (...args: Parameters<T>) => {
        lastArgs = args;

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            if (lastArgs) {
                fn(...lastArgs);
            }
            timeoutId = null;
            lastArgs = null;
        }, delay);
    };

    debounced.cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
            lastArgs = null;
        }
    };

    debounced.flush = () => {
        if (timeoutId && lastArgs) {
            clearTimeout(timeoutId);
            fn(...lastArgs);
            timeoutId = null;
            lastArgs = null;
        }
    };

    return debounced;
}
