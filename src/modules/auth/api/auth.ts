import { axiosInstance } from '../../shared/lib/axios'
import { authUserSchema } from '../dtos/auth-user'
import type { AuthInfo } from '../dtos/auth-info'
import type { LoginFormSchema, RegisterFormSchema, UpdatePasswordFormSchema } from '../zod-schema/auth-schemas'

export async function login(data: LoginFormSchema): Promise<AuthInfo> {
  const response = await axiosInstance.post<AuthInfo>('/auth/login', data)
  return response.data
}

export async function register(data: RegisterFormSchema): Promise<AuthInfo> {
  const response = await axiosInstance.post<AuthInfo>('/auth/signup', data)
  return response.data
}

export async function getMe() {
  const response = await axiosInstance.get('/auth/me')
  return authUserSchema.parse(response.data)
}

export async function logout(): Promise<void> {
  await axiosInstance.post('/auth/logout')
}

export async function updateMe(data: { name?: string; email?: string }) {
  const response = await axiosInstance.put('/auth/me', data)
  return authUserSchema.parse(response.data)
}

export async function updatePassword(data: UpdatePasswordFormSchema): Promise<void> {
  await axiosInstance.put('/auth/update-password', data)
}
