import { axiosInstance } from '../../shared/lib/axios'

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  imageUrl: string | null
  category: string
  tags: string | null
  readTimeMinutes: number
  publishedAt: string | null
  viewCount: number
  authorName: string | null
}

export interface BlogPostDetail extends BlogPost {
  content: string
  related: Omit<BlogPost, 'excerpt' | 'viewCount' | 'authorName'>[]
}

export interface BlogListResponse {
  posts: BlogPost[]
  total: number
  page: number
  limit: number
}

export interface BlogListParams {
  category?: string
  search?: string
  page?: number
  limit?: number
}

export async function getBlogPosts(params?: BlogListParams): Promise<BlogListResponse> {
  const res = await axiosInstance.get<BlogListResponse>('/blog', { params })
  return res.data
}

export async function getBlogPost(slug: string): Promise<BlogPostDetail> {
  const res = await axiosInstance.get<BlogPostDetail>(`/blog/${slug}`)
  return res.data
}

export async function getBlogCategories(): Promise<string[]> {
  const res = await axiosInstance.get<string[]>('/blog/categories')
  return res.data
}
