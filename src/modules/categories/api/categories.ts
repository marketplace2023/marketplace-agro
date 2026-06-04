import { axiosInstance } from '../../shared/lib/axios'

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  imageUrl: string | null
  sortOrder: number
}

export async function getCategories(): Promise<Category[]> {
  const res = await axiosInstance.get<Category[]>('/categories')
  return res.data
}
