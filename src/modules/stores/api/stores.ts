import { axiosInstance } from '../../shared/lib/axios'

export interface StoreListItem {
  id: number
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  roleType: string
  department: string | null
  municipality: string | null
  isVerified: boolean
  createdAt: string
}

export interface StoreContact {
  id: number
  contactType: 'phone' | 'whatsapp' | 'email' | 'website' | 'instagram' | 'facebook'
  value: string
  label: string | null
  isPrimary: boolean
  sortOrder: number
}

export interface StoreProfile extends StoreListItem {
  bannerUrl: string | null
  profile: {
    id: number
    tagline: string | null
    about: string | null
    yearFounded: number | null
    specialties: string | null
    certifications: string[] | null
  } | null
  hours: {
    id: number
    dayOfWeek: number
    openTime: string | null
    closeTime: string | null
    isClosed: boolean
  }[]
  contacts: StoreContact[]
  media: {
    id: number
    url: string
    mediaType: string
    caption: string | null
    isPrimary: boolean
    sortOrder: number
  }[]
  gbp: {
    latitude: string | null
    longitude: string | null
    address: string | null
    isLocationApproximate: boolean
  } | null
  rating: { average: number; total: number }
}

export interface StoreReview {
  id: number
  storeId: number
  userId: number
  rating: number
  comment: string | null
  ownerReply: string | null
  isVerified: boolean
  status: string
  createdAt: string
}

export async function getFeaturedStores(limit = 3): Promise<StoreListItem[]> {
  const res = await axiosInstance.get<{ stores: StoreListItem[]; page: number; limit: number }>(
    '/stores',
    { params: { limit } },
  )
  return res.data.stores
}

export async function getStoreBySlug(slug: string): Promise<StoreProfile> {
  const res = await axiosInstance.get<StoreProfile>(`/stores/${slug}`)
  return res.data
}

export async function getStoreReviews(slug: string): Promise<StoreReview[]> {
  const res = await axiosInstance.get<StoreReview[]>(`/stores/${slug}/reviews`)
  return res.data
}
