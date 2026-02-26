/**
 * useLocalStorage Hook
 * Provides a simple interface to interact with browser localStorage
 */

export function useLocalStorage(key: string) {
    const setItem = (value: string): void => {
        try {
            localStorage.setItem(key, value)
        } catch (error) {
            console.error(`Failed to set localStorage item "${key}":`, error)
        }
    }

    const getItem = (): string | null => {
        try {
            return localStorage.getItem(key)
        } catch (error) {
            console.error(`Failed to get localStorage item "${key}":`, error)
            return null
        }
    }

    const removeItem = (): void => {
        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.error(`Failed to remove localStorage item "${key}":`, error)
        }
    }

    return { setItem, getItem, removeItem }
}
