import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export type LoginFormSchema = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: z.string().min(1, 'El nombre es requerido').max(100),
    email: z.string().email('Email inválido'),
    phone: z.string().optional(),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    passwordConfirmation: z.string(),
    acceptTermsOfService: z.boolean(),
    acceptAdvertising: z.boolean().optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirmation'],
  })
  .refine((data) => data.acceptTermsOfService === true, {
    message: 'Debés aceptar los términos de servicio',
    path: ['acceptTermsOfService'],
  })

export type RegisterFormSchema = z.infer<typeof registerSchema>

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
    newPasswordConfirmation: z.string(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['newPasswordConfirmation'],
  })

export type UpdatePasswordFormSchema = z.infer<typeof updatePasswordSchema>
