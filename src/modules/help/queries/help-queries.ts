import { useQuery } from '@tanstack/react-query'
import { getHelpArticle, getHelpArticles, getHelpCategories } from '../api/help'
import type { HelpArticleListParams } from '../api/help'

export const HELP_QUERY_KEYS = {
  categories: () => ['help', 'categories'] as const,
  articles: (params?: HelpArticleListParams) => ['help', 'articles', params] as const,
  article: (slug: string) => ['help', 'article', slug] as const,
}

export function useHelpCategoriesQuery() {
  return useQuery({
    queryKey: HELP_QUERY_KEYS.categories(),
    queryFn: getHelpCategories,
    staleTime: 1000 * 60 * 10,
  })
}

export function useHelpArticlesQuery(params?: HelpArticleListParams) {
  return useQuery({
    queryKey: HELP_QUERY_KEYS.articles(params),
    queryFn: () => getHelpArticles(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useHelpArticleQuery(slug: string) {
  return useQuery({
    queryKey: HELP_QUERY_KEYS.article(slug),
    queryFn: () => getHelpArticle(slug),
    staleTime: 1000 * 60 * 5,
    enabled: !!slug,
  })
}
