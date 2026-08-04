import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export type LoginFormSchema = z.infer<typeof loginSchema>

const CEDULA_REGEX = /^[VE]-?\d{6,9}$/i
const RIF_REGEX = /^[VJGPE]-?\d{8}-?\d$/i

export const registerSchema = z
  .object({
    name: z.string().min(1, 'El nombre es requerido').max(100),
    email: z.string().email('Email inválido'),
    phone: z.string().optional(),
    documentType: z.enum(['cedula', 'rif']),
    documentNumber: z.string().min(6, 'Documento inválido').max(20),
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
  .refine(
    (data) =>
      data.documentType === 'cedula'
        ? CEDULA_REGEX.test(data.documentNumber)
        : RIF_REGEX.test(data.documentNumber),
    {
      message: 'Formato inválido. Ej: V-12345678 (cédula) o J-12345678-9 (RIF)',
      path: ['documentNumber'],
    },
  )

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
