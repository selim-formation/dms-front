/**
 * TaskSearchInput Component
 * 
 * Debounced search input field for task searches.
 * Per spec FR-022: 300ms debounce before API call
 * Per spec SC-012: User sees results within 2 seconds of debounce complete
 * 
 * Feature: 001-task-search
 * Date: 15 March 2026
 */

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { X } from 'lucide-react';

interface TaskSearchInputProps {
  /** Current search value */
  value: string;

  /** Called when search value changes (after debounce) */
  onChange: (value: string) => void;

  /** Optional callback for clearing search */
  onClear?: () => void;

  /** Debounce delay in milliseconds (default: 300ms per spec) */
  debounceMs?: number;

  /** Placeholder text */
  placeholder?: string;

  /** Whether search is currently loading */
  isLoading?: boolean;

  /** Auto-focus on mount */
  autoFocus?: boolean;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Search input with debouncing for task searches
 * 
 * Implements 300ms debounce as per specification FR-022
 * Prevents excessive API calls while user is typing
 * Provides immediate visual feedback, debounced API calls
 * 
 * @param props - Component props
 * @returns JSX.Element
 * 
 * @example
 * const [search, setSearch] = useState('');
 * 
 * <TaskSearchInput
 *   value={search}
 *   onChange={setSearch}
 *   onClear={() => setSearch('')}
 *   isLoading={isLoading}
 *   placeholder="Search tasks..."
 *   autoFocus
 * />
 */
export function TaskSearchInput({
  value,
  onChange,
  onClear,
  debounceMs = 300,
  placeholder,
  isLoading = false,
  autoFocus = false,
  className,
}: TaskSearchInputProps) {
  const { t } = useTranslation(['tasks', 'common']);
  const [localValue, setLocalValue] = useState(value);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update local value when prop changes (parent control)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  /**
   * Handle input change
   * Stores value locally for immediate feedback
   * Debounces onChange callback for API calls
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    console.log('Input changed:', newValue);

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer - wait 300ms before calling onChange
    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  };

  /**
   * Handle clear button
   * Immediately clears search and disables debounce
   */
  const handleClear = () => {
    setLocalValue('');

    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Notify parent immediately
    onChange('');
    onClear?.();
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative w-full ${className || ''}`}>
      <Input
        type="text"
        placeholder={placeholder ?? t('tasks:searchInput.placeholder')}
        value={localValue}
        onChange={handleInputChange}
        disabled={isLoading}
        autoFocus={autoFocus}
        aria-label={t('tasks:searchInput.searchTasks')}
        aria-describedby="search-debounce-info"
        className="pe-10"
      />

      {/* Clear button - visible when there's text */}
      {localValue && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          disabled={isLoading}
          className="absolute end-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
          aria-label={t('tasks:searchInput.clearSearch')}
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
      )}

      {/* Optional loading indicator */}
      {isLoading && (
        <div className="absolute end-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-border border-t-primary rounded-full" />
        </div>
      )}

      {/* Accessibility info about debounce */}
      <span
        id="search-debounce-info"
        className="sr-only"
      >
        {t('tasks:searchInput.debounceInfo')}
      </span>
    </div>
  );
}
