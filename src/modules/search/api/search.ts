import { axiosInstance } from '../../shared/lib/axios'

export interface SearchListing {
  id: number
  title: string
  price: string | null
  priceUnit: string | null
  listingType: string
  department: string | null
  municipality: string | null
  isFeatured: boolean
  slug: string
  viewCount: number
  categoryId: number | null
  categoryName: string | null
  categorySlug: string | null
  subcategoryName: string | null
  storeName: string | null
  storeSlug: string | null
  storeLogoUrl: string | null
  storeIsVerified: boolean | null
  createdAt: string
  primaryImage: string | null
}

export interface SearchResult {
  listings: SearchListing[]
  total: number
  page: number
  limit: number
  filters: { id: number; label: string; filterType: string; attributeId: number | null; sortOrder: number }[]
}

export interface SearchParams {
  q?: string
  categoryId?: number
  listingType?: string
  department?: string
  minPrice?: number
  maxPrice?: number
  isVerifiedStore?: boolean
  sort?: 'recent' | 'price_asc' | 'price_desc' | 'featured'
  page?: number
  limit?: number
}

export async function searchListings(params: SearchParams): Promise<SearchResult> {
  const res = await axiosInstance.get<SearchResult>('/search', { params })
  return res.data
}
