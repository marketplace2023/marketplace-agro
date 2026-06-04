import { z } from 'zod'

const envSchema = z.object({
  VITE_ENV: z.enum(['dev', 'production']).default('dev'),
  VITE_API_URL: z.string().default('http://localhost:3000'),
  VITE_SITE_URL: z.string().default('http://localhost:5173'),
})

export const env = envSchema.parse(import.meta.env)
export const IS_DEV = env.VITE_ENV === 'dev'
