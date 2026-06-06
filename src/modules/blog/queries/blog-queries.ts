import { useQuery } from '@tanstack/react-query'
import { getBlogCategories, getBlogPost, getBlogPosts } from '../api/blog'
import type { BlogListParams } from '../api/blog'

export const BLOG_QUERY_KEYS = {
  posts: (params?: BlogListParams) => ['blog', 'posts', params] as const,
  post: (slug: string) => ['blog', 'post', slug] as const,
  categories: () => ['blog', 'categories'] as const,
}

export function useBlogPostsQuery(params?: BlogListParams) {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.posts(params),
    queryFn: () => getBlogPosts(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useBlogPostQuery(slug: string) {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.post(slug),
    queryFn: () => getBlogPost(slug),
    staleTime: 1000 * 60 * 5,
    enabled: !!slug,
  })
}

export function useBlogCategoriesQuery() {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.categories(),
    queryFn: getBlogCategories,
    staleTime: 1000 * 60 * 10,
  })
}
