import { axiosInstance } from '../../shared/lib/axios'
import type { QuoteStatus } from '../../seller/api/seller-api'

export interface SentQuote {
  id: number
  buyerId: number
  sellerId: number
  listingId: number | null
  status: QuoteStatus
  message: string | null
  totalPrice: string | null
  currency: string | null
  validUntil: string | null
  createdAt: string
  updatedAt: string
}

export interface QuoteItem {
  id: number
  quoteId: number
  description: string
  quantity: number | null
  unitPrice: string | null
  totalPrice: string | null
}

export interface QuoteMessage {
  id: number
  quoteId: number
  userId: number
  message: string
  createdAt: string
}

export interface QuoteDetail extends SentQuote {
  items: QuoteItem[]
  messages: QuoteMessage[]
  attachments: {
    id: number
    quoteId: number
    url: string
    filename: string
    fileSize: number | null
    uploadedByUserId: number
    createdAt: string
  }[]
}

export async function getSentQuotes(): Promise<SentQuote[]> {
  const res = await axiosInstance.get<SentQuote[]>('/quotes/sent')
  return res.data
}

export async function getQuoteDetail(id: number): Promise<QuoteDetail> {
  const res = await axiosInstance.get<QuoteDetail>(`/quotes/${id}`)
  return res.data
}
