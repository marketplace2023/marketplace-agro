import { useQuery } from '@tanstack/react-query'
import { getFeaturedStores, getStoreBySlug, getStoreReviews } from '../api/stores'

export function useFeaturedStoresQuery() {
  return useQuery({
    queryKey: ['stores', 'featured'],
    queryFn: () => getFeaturedStores(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useStoreBySlugQuery(slug: string | undefined) {
  return useQuery({
    queryKey: ['stores', slug],
    queryFn: () => getStoreBySlug(slug!),
    enabled: !!slug,
  })
}

export function useStoreReviewsQuery(slug: string | undefined) {
  return useQuery({
    queryKey: ['stores', slug, 'reviews'],
    queryFn: () => getStoreReviews(slug!),
    enabled: !!slug,
  })
}
