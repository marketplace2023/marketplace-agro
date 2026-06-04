import { useQuery } from '@tanstack/react-query'
import { getSentQuotes, getQuoteDetail } from '../api/buyer-api'

export const BUYER_QUERY_KEYS = {
  sentQuotes: ['buyer', 'sent-quotes'] as const,
  quoteDetail: (id: number) => ['buyer', 'quote', id] as const,
}

export function useSentQuotesQuery() {
  return useQuery({
    queryKey: BUYER_QUERY_KEYS.sentQuotes,
    queryFn: getSentQuotes,
    staleTime: 2 * 60 * 1000,
  })
}

export function useQuoteDetailQuery(id: number | undefined) {
  return useQuery({
    queryKey: BUYER_QUERY_KEYS.quoteDetail(id ?? 0),
    queryFn: () => getQuoteDetail(id!),
    enabled: !!id,
    staleTime: 60 * 1000,
  })
}
