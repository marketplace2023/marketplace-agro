import { AxiosError } from 'axios'
import type { FieldValues, UseFormSetError } from 'react-hook-form'
import { handleAxiosError } from './handle-axios-error'
import { IS_DEV } from '../config/env'

export function handleFormError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) {
  if (IS_DEV) console.error(error)
  if (error instanceof AxiosError) {
    handleAxiosError(error, setError)
  }
}
