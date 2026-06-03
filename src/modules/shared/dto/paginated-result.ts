import { z } from 'zod'

export type PaginatedResult<T> = {
  results: T[]
  page: number
  size: number | null
  total: number
}

export const paginatedResultSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    results: z.array(schema),
    page: z.number(),
    size: z.number().nullable(),
    total: z.number(),
  })
