import { ShoppingBag, DollarSign, Clock, CheckCircle2, FileText } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useReceivedQuotesQuery } from '../queries/seller-queries'
import type { QuoteStatus } from '../api/seller-api'

type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled'

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending:   'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  delivered: 'bg-agrobot-50 text-agrobot-700',
  cancelled: 'bg-gray-100 text-gray-500',
}
const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pendiente', confirmed: 'Confirmado', delivered: 'Entregado', cancelled: 'Cancelado',
}

function quoteToOrderStatus(s: QuoteStatus): OrderStatus {
  if (s === 'accepted') return 'delivered'
  if (s === 'responded') return 'confirmed'
  if (s === 'rejected' || s === 'cancelled' || s === 'expired') return 'cancelled'
  return 'pending'
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtAmount(price: string | null, currency: string | null) {
  if (!price) return 'A consultar'
  const sym = currency === 'USD' ? '$' : (currency ?? '$')
  return `${sym}${Number(price).toLocaleString('es-VE', { minimumFractionDigits: 2 })}`
}

export function SellerOrders() {
  const { data: quotes, isLoading } = useReceivedQuotesQuery()

  const orders = (quotes ?? []).map(q => ({
    ...q,
    orderStatus: quoteToOrderStatus(q.status),
  }))

  const total     = orders.length
  const pending   = orders.filter(o => o.orderStatus === 'pending').length
  const delivered = orders.filter(o => o.orderStatus === 'delivered').length

  const totalRevenue = orders
    .filter(o => o.orderStatus !== 'cancelled' && o.totalPrice)
    .reduce((s, o) => s + Number(o.totalPrice), 0)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Órdenes</h1>
        <p className="text-sm text-gray-400 mt-0.5">Cotizaciones y operaciones comerciales</p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-gray-500">Total órdenes</p>
              <ShoppingBag className="h-4 w-4 text-gray-300" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{total}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-gray-500">Pendientes</p>
              <Clock className="h-4 w-4 text-gray-300" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{pending}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-gray-500">Completadas</p>
              <CheckCircle2 className="h-4 w-4 text-gray-300" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{delivered}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-gray-500">Monto total</p>
              <DollarSign className="h-4 w-4 text-gray-300" />
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <Skeleton className="h-48 w-full rounded-xl" />
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-gray-200">
          <FileText className="h-10 w-10 text-gray-200 mb-3" />
          <p className="text-sm font-semibold text-gray-400">Sin órdenes aún</p>
          <p className="text-xs text-gray-400 mt-1">Las órdenes aparecen cuando recibes cotizaciones de compradores</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">ID</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Descripción</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-400">Monto</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Estado</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">#{String(o.id).padStart(4, '0')}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-[220px]">
                    <p className="truncate">{o.message ?? 'Sin descripción'}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">
                    {fmtAmount(o.totalPrice, o.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', STATUS_COLOR[o.orderStatus])}>
                      {STATUS_LABEL[o.orderStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{fmtDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
