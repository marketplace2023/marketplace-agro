import { axiosInstance } from '../../shared/lib/axios'
import axios from 'axios'

// ─── My Listings ──────────────────────────────────────────────────────────────

export type ListingStatus =
  | 'draft'
  | 'pending_review'
  | 'published'
  | 'paused'
  | 'rejected'
  | 'expired'
  | 'deleted'

export type ListingType = 'sale' | 'rent' | 'service' | 'quote' | 'alliance'

export interface MyListing {
  id: number
  title: string
  slug: string
  price: string | null
  priceUnit: string | null
  listingType: ListingType
  status: ListingStatus
  department: string | null
  municipality: string | null
  isFeatured: boolean
  viewCount: number
  categoryId: number | null
  subcategoryId: number | null
  storeId: number | null
  userId: number
  createdAt: string
  updatedAt: string
}

export async function getMyListings(): Promise<MyListing[]> {
  const res = await axiosInstance.get<MyListing[]>('/listings/my/listings')
  return res.data
}

// ─── My Store ─────────────────────────────────────────────────────────────────

export type StoreRoleType =
  | 'seller'
  | 'producer'
  | 'farm_owner'
  | 'input_supplier'
  | 'machinery_supplier'
  | 'agronomist'
  | 'transporter'
  | 'cooperative'
  | 'laboratory'
  | 'certifier'
  | 'quality_inspector'

export interface MyStore {
  id: number
  userId: number
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  bannerUrl: string | null
  roleType: StoreRoleType | null
  department: string | null
  municipality: string | null
  isVerified: boolean
  status: string
  createdAt: string
  updatedAt: string
}

export async function getMyStore(): Promise<MyStore | null> {
  try {
    const res = await axiosInstance.get<MyStore>('/stores/my/store')
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) return null
    throw err
  }
}

// ─── Store Creation (Onboarding) ──────────────────────────────────────────────

export interface CreateStorePayload {
  roleType: StoreRoleType
  name: string
  slug: string
  description?: string
  department?: string
  municipality?: string
}

export async function createMyStore(payload: CreateStorePayload): Promise<{ id: number }> {
  const res = await axiosInstance.post<{ id: number }>('/stores/my/onboarding', payload)
  return res.data
}

// ─── Received Quotes ──────────────────────────────────────────────────────────

export type QuoteStatus =
  | 'sent'
  | 'viewed'
  | 'responded'
  | 'accepted'
  | 'rejected'
  | 'cancelled'
  | 'expired'

export interface ReceivedQuote {
  id: number
  buyerId: number
  sellerId: number
  listingId: number | null
  status: QuoteStatus
  message: string | null
  totalPrice: string | null
  currency: string | null
  validUntil: string | null
  createdAt: string
  updatedAt: string
}

export async function getReceivedQuotes(): Promise<ReceivedQuote[]> {
  const res = await axiosInstance.get<ReceivedQuote[]>('/quotes/received')
  return res.data
}
