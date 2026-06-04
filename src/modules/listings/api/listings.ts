import { axiosInstance } from '../../shared/lib/axios'

export interface FeaturedListing {
  id: number
  title: string
  price: string | null
  priceUnit: string | null
  slug: string
  department: string | null
  categoryName: string | null
  storeName: string | null
  storeSlug: string | null
  storeLogoUrl: string | null
}

export interface ListingDetail {
  id: number
  title: string
  description: string | null
  price: string | null
  priceUnit: string | null
  listingType: string
  status: string
  department: string | null
  municipality: string | null
  slug: string
  viewCount: number
  isFeatured: boolean
  userId: number
  storeId: number | null
  categoryId: number | null
  subcategoryId: number | null
  productId: number | null
  category: { id: number; name: string; slug: string } | null
  subcategory: { id: number; name: string; slug: string } | null
  store: {
    id: number
    name: string
    slug: string
    logoUrl: string | null
    isVerified: boolean
    department: string | null
    municipality: string | null
  } | null
  media: { id: number; url: string; mediaType: string; isPrimary: boolean; sortOrder: number }[]
  attributes: { id: number; listingId: number; attributeId: number; value: string }[]
}

export async function getFeaturedListings(): Promise<FeaturedListing[]> {
  const res = await axiosInstance.get<FeaturedListing[]>('/listings/featured')
  return res.data
}

export async function getListingBySlug(slug: string): Promise<ListingDetail> {
  const res = await axiosInstance.get<ListingDetail>(`/listings/${slug}`)
  return res.data
}
