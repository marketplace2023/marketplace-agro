import { AxiosError } from 'axios'
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

interface ValidationError {
  field: string
  message: string
}

export function handleAxiosError<T extends FieldValues>(
  error: AxiosError,
  setError: UseFormSetError<T>,
) {
  const data = error.response?.data as { errors?: ValidationError[] } | undefined
  if (data?.errors) {
    data.errors.forEach(({ field, message }) => {
      setError(field as Path<T>, { type: 'server', message })
    })
  }
}
