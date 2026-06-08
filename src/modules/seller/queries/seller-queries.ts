import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMyStore, getMyListings, getMyStore, getReceivedQuotes,
  createListing, updateListing, changeListingStatus, updateMyStore,
  updateMyStoreProfile, addStoreContact, deleteStoreContact,
  addStoreMedia, deleteStoreMedia,
} from '../api/seller-api'
import type {
  CreateListingPayload, UpdateListingPayload, ListingStatus, UpdateStorePayload,
  UpdateStoreProfilePayload, AddContactPayload, AddMediaPayload,
} from '../api/seller-api'

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

export function useCreateStoreMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMyStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.myStore })
    },
  })
}

export function useUpdateMyStoreMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateStorePayload) => updateMyStore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.myStore })
    },
  })
}

export function useUpdateMyStoreProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateStoreProfilePayload) => updateMyStoreProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.myStore })
    },
  })
}

export function useAddStoreContactMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AddContactPayload) => addStoreContact(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.myStore })
    },
  })
}

export function useDeleteStoreContactMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteStoreContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.myStore })
    },
  })
}

export function useAddStoreMediaMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AddMediaPayload) => addStoreMedia(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.myStore })
    },
  })
}

export function useDeleteStoreMediaMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteStoreMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.myStore })
    },
  })
}

export function useCreateListingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateListingPayload) => createListing(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.myListings })
    },
  })
}

export function useUpdateListingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateListingPayload }) =>
      updateListing(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.myListings })
    },
  })
}

export function useChangeListingStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: number; status: ListingStatus; reason?: string }) =>
      changeListingStatus(id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.myListings })
    },
  })
}
