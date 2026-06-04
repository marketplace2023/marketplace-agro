import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../api/categories'

export const CATEGORIES_QUERY_KEY = ['categories']

export function useCategoriesQuery() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  })
}
