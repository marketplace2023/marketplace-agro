import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getMe, login, logout, register, updateMe, updatePassword } from '../api/auth'
import type { LoginFormSchema, RegisterFormSchema, UpdatePasswordFormSchema } from '../zod-schema/auth-schemas'

export const ME_QUERY_KEY = ['auth-me']

export function useMeQuery() {
  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: getMe,
    retry: false,
  })
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (data: LoginFormSchema) => login(data),
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (data: RegisterFormSchema) => register(data),
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.resetQueries()
    },
  })
}

export function useUpdateMeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
      toast.success('Perfil actualizado correctamente')
    },
    onError: () => {
      toast.error('Error al actualizar el perfil')
    },
  })
}

export function useUpdatePasswordMutation() {
  return useMutation({
    mutationFn: (data: UpdatePasswordFormSchema) => updatePassword(data),
    onSuccess: () => {
      toast.success('Contraseña actualizada correctamente')
    },
    onError: () => {
      toast.error('Error al actualizar la contraseña')
    },
  })
}
