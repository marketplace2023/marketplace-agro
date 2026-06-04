import { useQuery } from '@tanstack/react-query'
import { getMyListings, getMyStore, getReceivedQuotes } from '../api/seller-api'

export const SELLER_QUERY_KEYS = {
  myListings: ['seller', 'my-listings'] as const,
  myStore: ['seller', 'my-store'] as const,
  receivedQuotes: ['seller', 'received-quotes'] as const,
}

export function useMyListingsQuery() {
  return useQuery({
    queryKey: SELLER_QUERY_KEYS.myListings,
    queryFn: getMyListings,
    staleTime: 2 * 60 * 1000,
  })
}

export function useMyStoreQuery() {
  return useQuery({
    queryKey: SELLER_QUERY_KEYS.myStore,
    queryFn: getMyStore,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

export function useReceivedQuotesQuery() {
  return useQuery({
    queryKey: SELLER_QUERY_KEYS.receivedQuotes,
    queryFn: getReceivedQuotes,
    staleTime: 2 * 60 * 1000,
  })
}
