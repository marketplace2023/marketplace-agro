import { z } from 'zod'

export const authUserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
})

export type AuthUser = z.infer<typeof authUserSchema>
