import { axiosInstance } from '../../modules/shared/lib/axios'

// ── Category ─────────────────────────────────────────────────────────────────

export interface ApiCategory {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  imageUrl: string | null
  sortOrder: number
}

export async function getCategories(): Promise<ApiCategory[]> {
  const res = await axiosInstance.get<ApiCategory[]>('/categories')
  return res.data
}

// ── Featured listing ──────────────────────────────────────────────────────────

export interface ApiFeaturedListing {
  id: number
  title: string
  price: string | null
  priceUnit: string | null
  slug: string
  department: string | null
  isFeatured: boolean
  categoryName: string | null
  categorySlug: string | null
  storeName: string | null
  storeSlug: string | null
  storeLogoUrl: string | null
}

export async function getFeaturedListings(): Promise<ApiFeaturedListing[]> {
  const res = await axiosInstance.get<ApiFeaturedListing[]>('/listings/featured')
  return res.data
}

// ── Featured stores ───────────────────────────────────────────────────────────

export interface ApiStore {
  id: number
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  roleType: string
  department: string | null
  municipality: string | null
  isVerified: boolean
}

export interface ApiStoresResponse {
  stores: ApiStore[]
  page: number
  limit: number
}

export async function getFeaturedStores(): Promise<ApiStore[]> {
  const res = await axiosInstance.get<ApiStoresResponse>('/stores', {
    params: { isVerified: true, limit: 6 },
  })
  return res.data.stores
}

// ── Departments ───────────────────────────────────────────────────────────────

export interface ApiDepartment {
  id: number
  name: string
  code: string | null
}

export async function getDepartments(): Promise<ApiDepartment[]> {
  const res = await axiosInstance.get<ApiDepartment[]>('/search/locations', {
    params: { type: 'department' },
  })
  return res.data
}
