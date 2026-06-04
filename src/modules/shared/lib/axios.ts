import axios, { AxiosError } from 'axios'
import qs from 'qs'
import { toast } from 'sonner'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  withCredentials: true,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isAuthEndpoint = error.config?.url?.includes('/auth/')
    if (error.response?.status === 401 && !isAuthEndpoint) {
      toast.error('Tu sesión ha expirado. Por favor, iniciá sesión nuevamente.')
    }
    return Promise.reject(error)
  },
)

export function isAxios401(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 401
}

export function isAxios404(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 404
}

export function isAxios400(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 400
}

export function isAxios409(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 409
}

export function isAxios502(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 502
}
