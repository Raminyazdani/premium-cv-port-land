import { useMemo } from 'react'
import { useFilter, shouldShowEntry } from '@/context/FilterContext'

/**
 * Options for the useFilteredData hook
 */
export interface UseFilteredDataOptions<T> {
  /**
   * The raw data array to filter
   */
  data: T[]
  /**
   * Function to extract the type_key array from each item.
   * The type_key is used for focus-based filtering.
   */
  getTypeKey: (item: T) => string[] | undefined | null
  /**
   * Optional sorting function. If provided, the filtered data will be sorted using this function.
   */
  sortFn?: (a: T, b: T) => number
}

/**
 * A hook for filtering and sorting CV section data based on the selected focus.
 * 
 * This hook encapsulates the common pattern of:
 * 1. Filtering data based on the global focus filter (from FilterContext)
 * 2. Optionally sorting the filtered results
 * 
 * @example
 * ```tsx
 * const filteredEducation = useFilteredData({
 *   data: data?.education || [],
 *   getTypeKey: (item) => item.type_key,
 *   sortFn: (a, b) => {
 *     const dateA = parseDateSafe(a.startDate)
 *     const dateB = parseDateSafe(b.startDate)
 *     return (dateB?.getTime() || 0) - (dateA?.getTime() || 0)
 *   }
 * })
 * ```
 * 
 * @param options - Configuration options for filtering and sorting
 * @returns The filtered (and optionally sorted) array of items
 */
export function useFilteredData<T>({
  data,
  getTypeKey,
  sortFn,
}: UseFilteredDataOptions<T>): T[] {
  const { selectedFocus } = useFilter()

  return useMemo(() => {
    // Filter by selected focus
    const filtered = data.filter((item) =>
      shouldShowEntry(getTypeKey(item), selectedFocus)
    )

    // Apply sorting if provided
    if (sortFn) {
      return [...filtered].sort(sortFn)
    }

    return filtered
  }, [data, selectedFocus, getTypeKey, sortFn])
}
