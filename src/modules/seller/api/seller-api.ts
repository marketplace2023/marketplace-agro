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
  featuredUntil: string | null
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

export interface StoreContact {
  id: number
  contactType: 'phone' | 'whatsapp' | 'email' | 'website' | 'instagram' | 'facebook'
  value: string
  label: string | null
  isPrimary: boolean
  sortOrder: number
}

export interface StoreMedia {
  id: number
  url: string
  mediaType: string
  caption: string | null
  isPrimary: boolean
  sortOrder: number
}

export interface StoreProfileData {
  id: number
  tagline: string | null
  about: string | null
  yearFounded: number | null
  specialties: string | null
  certifications: string[] | null
}

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
  profile: StoreProfileData | null
  contacts: StoreContact[]
  media: StoreMedia[]
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

export interface UpdateStorePayload {
  name?: string
  description?: string
  logoUrl?: string
  bannerUrl?: string
  department?: string
  municipality?: string
}

export async function updateMyStore(payload: UpdateStorePayload): Promise<void> {
  await axiosInstance.put('/stores/my/store', payload)
}

export interface UpdateStoreProfilePayload {
  tagline?: string
  about?: string
  yearFounded?: number
  specialties?: string
  certifications?: string[]
}

export async function updateMyStoreProfile(payload: UpdateStoreProfilePayload): Promise<void> {
  await axiosInstance.put('/stores/my/store/profile', payload)
}

export interface AddContactPayload {
  contactType: 'phone' | 'whatsapp' | 'email' | 'website' | 'instagram' | 'facebook'
  value: string
  label?: string
  isPrimary?: boolean
  sortOrder?: number
}

export async function addStoreContact(payload: AddContactPayload): Promise<{ id: number }> {
  const res = await axiosInstance.post<{ id: number }>('/stores/my/store/contacts', payload)
  return res.data
}

export async function deleteStoreContact(id: number): Promise<void> {
  await axiosInstance.delete(`/stores/my/store/contacts/${id}`)
}

export interface AddMediaPayload {
  url: string
  mediaType?: 'image' | 'video'
  caption?: string
  isPrimary?: boolean
  sortOrder?: number
}

export async function addStoreMedia(payload: AddMediaPayload): Promise<{ id: number }> {
  const res = await axiosInstance.post<{ id: number }>('/stores/my/store/media', payload)
  return res.data
}

export async function deleteStoreMedia(id: number): Promise<void> {
  await axiosInstance.delete(`/stores/my/store/media/${id}`)
}

export async function uploadStoreFile(file: File): Promise<{ url: string }> {
  const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
  const form = new FormData()
  form.append('file', file)
  const res = await axiosInstance.post<{ url: string }>('/stores/my/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  const { url } = res.data
  return { url: url.startsWith('http') ? url : `${BASE}${url}` }
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

// ─── Listing CRUD ─────────────────────────────────────────────────────────────

export interface CreateListingPayload {
  categoryId: number
  subcategoryId?: number
  title: string
  description?: string
  price?: string
  priceUnit?: string
  listingType: ListingType
  department?: string
  municipality?: string
  expiresAt?: string
}

export type UpdateListingPayload = Omit<Partial<CreateListingPayload>, 'categoryId' | 'expiresAt'>

export interface ListingMedia {
  id: number
  listingId: number
  mediaType: 'image' | 'video' | 'document'
  url: string
  caption: string | null
  isPrimary: boolean
  sortOrder: number
}

export interface ListingDetail extends MyListing {
  media: ListingMedia[]
}

export async function getMyListingDetail(id: number): Promise<ListingDetail> {
  const res = await axiosInstance.get<ListingDetail>(`/listings/manage/listings/${id}`)
  return res.data
}

export async function uploadListingFile(file: File): Promise<{ url: string }> {
  const form = new FormData()
  form.append('file', file)
  const res = await axiosInstance.post<{ url: string }>('/stores/my/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function addListingMedia(
  listingId: number,
  payload: { url: string; isPrimary?: boolean; sortOrder?: number; caption?: string },
): Promise<{ id: number }> {
  const res = await axiosInstance.post<{ id: number }>(
    `/listings/manage/listings/${listingId}/media`,
    { mediaType: 'image', isPrimary: false, sortOrder: 0, ...payload },
  )
  return res.data
}

export async function deleteListingMedia(listingId: number, mediaId: number): Promise<void> {
  await axiosInstance.delete(`/listings/manage/listings/${listingId}/media/${mediaId}`)
}

export async function createListing(payload: CreateListingPayload): Promise<{ id: number }> {
  const res = await axiosInstance.post<{ id: number }>('/listings/manage/listings', payload)
  return res.data
}

export async function updateListing(id: number, payload: UpdateListingPayload): Promise<void> {
  await axiosInstance.put(`/listings/manage/listings/${id}`, payload)
}

export async function changeListingStatus(
  id: number,
  status: ListingStatus,
  reason?: string,
): Promise<void> {
  await axiosInstance.patch(`/listings/manage/listings/${id}/status`, { status, reason })
}
