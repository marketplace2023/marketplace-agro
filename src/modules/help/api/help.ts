import { axiosInstance } from '../../shared/lib/axios'

export interface HelpCategory {
  id: number
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  icon: string | null
  sortOrder: number
  articleCount: number
}

export interface HelpArticle {
  id: number
  title: string
  slug: string
  excerpt: string | null
  type: 'faq' | 'guide' | 'tutorial' | 'policy' | 'announcement'
  isFeatured: boolean
  sortOrder: number
  viewCount: number
  categoryId: number
  categoryName: string
  categorySlug: string
  categoryIcon: string | null
}

export interface HelpArticleDetail extends HelpArticle {
  content: string
  updatedAt: string
  related: Pick<HelpArticle, 'id' | 'title' | 'slug' | 'type'>[]
}

export interface HelpArticleListParams {
  search?: string
  categoryId?: number
  type?: string
  featured?: boolean
}

export async function getHelpCategories(): Promise<HelpCategory[]> {
  const res = await axiosInstance.get<HelpCategory[]>('/help/categories')
  return res.data
}

export async function getHelpArticles(params?: HelpArticleListParams): Promise<HelpArticle[]> {
  const res = await axiosInstance.get<HelpArticle[]>('/help/articles', { params })
  return res.data
}

export async function getHelpArticle(slug: string): Promise<HelpArticleDetail> {
  const res = await axiosInstance.get<HelpArticleDetail>(`/help/articles/${slug}`)
  return res.data
}
