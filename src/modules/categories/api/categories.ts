import { axiosInstance } from '../../shared/lib/axios'

export interface Subcategory {
  id: number
  categoryId: number
  name: string
  slug: string
  sortOrder: number
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  imageUrl: string | null
  sortOrder: number
  subcategories: Subcategory[]
}

export async function getCategories(): Promise<Category[]> {
  const res = await axiosInstance.get<Category[]>('/categories')
  return res.data
}
