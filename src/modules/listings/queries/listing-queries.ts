import { useQuery } from '@tanstack/react-query'
import { getFeaturedListings, getListingBySlug } from '../api/listings'

export function useFeaturedListingsQuery() {
  return useQuery({
    queryKey: ['listings', 'featured'],
    queryFn: getFeaturedListings,
    staleTime: 5 * 60 * 1000,
  })
}

export function useListingBySlugQuery(slug: string | undefined) {
  return useQuery({
    queryKey: ['listings', slug],
    queryFn: () => getListingBySlug(slug!),
    enabled: !!slug,
  })
}
