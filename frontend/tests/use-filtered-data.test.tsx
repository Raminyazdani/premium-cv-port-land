/**
 * Tests for useFilteredData hook
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFilteredData } from '@/hooks/useFilteredData'
import { FilterProvider, useFilter } from '@/context/FilterContext'
import { ReactNode, useEffect } from 'react'

// Test data type
interface TestItem {
  name: string
  type_key?: string[]
  startDate?: string
}

// Helper to create wrapper with specific focus
function createWrapper(focus: string = 'Full CV') {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <FilterProvider>
        <FocusSetter focus={focus}>{children}</FocusSetter>
      </FilterProvider>
    )
  }
}

// Component to set focus for testing
function FocusSetter({ focus, children }: { focus: string; children: ReactNode }) {
  const { setSelectedFocus } = useFilter()
  useEffect(() => {
    setSelectedFocus(focus)
  }, [focus, setSelectedFocus])
  return <>{children}</>
}

describe('useFilteredData', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('Filtering', () => {
    it('returns all items when focus is "Full CV"', () => {
      const data: TestItem[] = [
        { name: 'A', type_key: ['Programming'] },
        { name: 'B', type_key: ['Bioinformatics'] },
        { name: 'C', type_key: ['Academic'] },
      ]

      const { result } = renderHook(
        () =>
          useFilteredData({
            data,
            getTypeKey: (item) => item.type_key,
          }),
        { wrapper: createWrapper('Full CV') }
      )

      expect(result.current).toHaveLength(3)
    })

    it('filters by selected focus', () => {
      const data: TestItem[] = [
        { name: 'A', type_key: ['Programming'] },
        { name: 'B', type_key: ['Bioinformatics'] },
        { name: 'C', type_key: ['Programming', 'Academic'] },
      ]

      const { result } = renderHook(
        () =>
          useFilteredData({
            data,
            getTypeKey: (item) => item.type_key,
          }),
        { wrapper: createWrapper('Programming') }
      )

      expect(result.current).toHaveLength(2)
      expect(result.current.map((item) => item.name)).toEqual(['A', 'C'])
    })

    it('includes items without type_key (they are always visible)', () => {
      const data: TestItem[] = [
        { name: 'A', type_key: ['Programming'] },
        { name: 'B' }, // No type_key
        { name: 'C', type_key: undefined },
      ]

      const { result } = renderHook(
        () =>
          useFilteredData({
            data,
            getTypeKey: (item) => item.type_key,
          }),
        { wrapper: createWrapper('Programming') }
      )

      // Items without type_key are always visible
      expect(result.current).toHaveLength(3)
    })

    it('returns empty array when no items match filter', () => {
      const data: TestItem[] = [
        { name: 'A', type_key: ['Programming'] },
        { name: 'B', type_key: ['Bioinformatics'] },
      ]

      const { result } = renderHook(
        () =>
          useFilteredData({
            data,
            getTypeKey: (item) => item.type_key,
          }),
        { wrapper: createWrapper('Academic') }
      )

      expect(result.current).toHaveLength(0)
    })

    it('handles empty data array', () => {
      const data: TestItem[] = []

      const { result } = renderHook(
        () =>
          useFilteredData({
            data,
            getTypeKey: (item) => item.type_key,
          }),
        { wrapper: createWrapper('Programming') }
      )

      expect(result.current).toHaveLength(0)
    })
  })

  describe('Sorting', () => {
    it('applies sorting function when provided', () => {
      const data: TestItem[] = [
        { name: 'A', type_key: ['Full CV'], startDate: '2020-01' },
        { name: 'B', type_key: ['Full CV'], startDate: '2022-01' },
        { name: 'C', type_key: ['Full CV'], startDate: '2021-01' },
      ]

      const sortByDateDesc = (a: TestItem, b: TestItem) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0
        return dateB - dateA
      }

      const { result } = renderHook(
        () =>
          useFilteredData({
            data,
            getTypeKey: (item) => item.type_key,
            sortFn: sortByDateDesc,
          }),
        { wrapper: createWrapper('Full CV') }
      )

      expect(result.current.map((item) => item.name)).toEqual(['B', 'C', 'A'])
    })

    it('does not mutate original data when sorting', () => {
      const data: TestItem[] = [
        { name: 'A', type_key: ['Full CV'], startDate: '2020-01' },
        { name: 'B', type_key: ['Full CV'], startDate: '2022-01' },
      ]
      const originalOrder = [...data.map((d) => d.name)]

      const sortByDateDesc = (a: TestItem, b: TestItem) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0
        return dateB - dateA
      }

      renderHook(
        () =>
          useFilteredData({
            data,
            getTypeKey: (item) => item.type_key,
            sortFn: sortByDateDesc,
          }),
        { wrapper: createWrapper('Full CV') }
      )

      // Original data should not be mutated
      expect(data.map((d) => d.name)).toEqual(originalOrder)
    })

    it('filters before sorting', () => {
      const data: TestItem[] = [
        { name: 'A', type_key: ['Programming'], startDate: '2020-01' },
        { name: 'B', type_key: ['Bioinformatics'], startDate: '2022-01' },
        { name: 'C', type_key: ['Programming'], startDate: '2021-01' },
      ]

      const sortByDateDesc = (a: TestItem, b: TestItem) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0
        return dateB - dateA
      }

      const { result } = renderHook(
        () =>
          useFilteredData({
            data,
            getTypeKey: (item) => item.type_key,
            sortFn: sortByDateDesc,
          }),
        { wrapper: createWrapper('Programming') }
      )

      // Should only have Programming items, sorted by date
      expect(result.current.map((item) => item.name)).toEqual(['C', 'A'])
    })
  })

  describe('Without sort function', () => {
    it('preserves original order when no sortFn is provided', () => {
      const data: TestItem[] = [
        { name: 'A', type_key: ['Full CV'] },
        { name: 'B', type_key: ['Full CV'] },
        { name: 'C', type_key: ['Full CV'] },
      ]

      const { result } = renderHook(
        () =>
          useFilteredData({
            data,
            getTypeKey: (item) => item.type_key,
          }),
        { wrapper: createWrapper('Full CV') }
      )

      expect(result.current.map((item) => item.name)).toEqual(['A', 'B', 'C'])
    })
  })
})
