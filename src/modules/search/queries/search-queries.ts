import { useQuery } from '@tanstack/react-query'
import type { SearchParams } from '../api/search'
import { searchListings } from '../api/search'

export function useSearchQuery(params: SearchParams) {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => searchListings(params),
    placeholderData: (prev) => prev,
  })
}
