import { z } from 'zod'

export const operatorSchema = z.enum([
  'eq',
  'neq',
  'lt',
  'lte',
  'gt',
  'gte',
  'contains',
  'not_contains',
])

export type Operator = z.infer<typeof operatorSchema>

export const filterSchema = z.object({
  field: z.string(),
  operator: operatorSchema,
  value: z.union([z.string(), z.number(), z.boolean()]),
})

export type Filter = z.infer<typeof filterSchema>

export const sortSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']),
})

export type Sort = z.infer<typeof sortSchema>

export const criteriaSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
  filters: z.array(filterSchema).optional(),
  sorts: z.array(sortSchema).optional(),
})

export type Criteria = z.infer<typeof criteriaSchema>

export const strictCriteriaSchema = z.object({
  page: z.number(),
  size: z.number(),
  filters: z.array(filterSchema),
  sorts: z.array(sortSchema),
})

export type StrictCriteria = z.infer<typeof strictCriteriaSchema>

export type ConfigWithCriteria<T> = T & { criteria?: Criteria }
