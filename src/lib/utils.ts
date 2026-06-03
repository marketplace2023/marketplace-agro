import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistance } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(amount: number, currency = 'ARS'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(
  date: Date | string,
  fmt = 'dd/MM/yyyy',
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, fmt, { locale: es })
}

export function formatDateShort(date: Date | string): string {
  return formatDate(date, 'dd/MM/yyyy')
}

export function formatDateLong(date: Date | string): string {
  return formatDate(date, "EEEE d 'de' MMMM 'de' yyyy")
}

export function formatDateISO(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, "yyyy-MM-dd'T'HH:mm:ss")
}

export function formatDistanceEs(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatDistance(d, new Date(), { locale: es, addSuffix: true })
}

export function exhaustiveSwitch(_: never): never {
  throw new Error('Unexpected value in exhaustive switch')
}
