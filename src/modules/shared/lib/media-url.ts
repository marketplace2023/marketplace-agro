import { env } from '@/modules/shared/config/env'

export function resolveMediaUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${env.VITE_API_URL}${path}`
}
