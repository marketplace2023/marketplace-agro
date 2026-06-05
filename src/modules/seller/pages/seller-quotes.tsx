import { FileText, MessageSquare, DollarSign, Calendar } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useReceivedQuotesQuery } from '../queries/seller-queries'
import type { QuoteStatus } from '../api/seller-api'
import { cn } from '@/lib/utils'

const STATUS_COLOR: Record<QuoteStatus, string> = {
  sent:       'bg-blue-50 text-blue-700 border-blue-100',
  viewed:     'bg-gray-100 text-gray-600 border-gray-200',
  responded:  'bg-agrobot-50 text-agrobot-700 border-agrobot-100',
  accepted:   'bg-agrobot-100 text-agrobot-800 border-agrobot-200',
  rejected:   'bg-red-50 text-red-600 border-red-100',
  cancelled:  'bg-gray-100 text-gray-500 border-gray-200',
  expired:    'bg-gray-100 text-gray-400 border-gray-200',
}
const STATUS_LABEL: Record<QuoteStatus, string> = {
  sent: 'Recibida', viewed: 'Vista', responded: 'Respondida',
  accepted: 'Aceptada', rejected: 'Rechazada', cancelled: 'Cancelada', expired: 'Expirada',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function SellerQuotes() {
  const { data: quotes, isLoading } = useReceivedQuotesQuery()

  const total    = quotes?.length ?? 0
  const newCount = quotes?.filter((q) => q.status === 'sent').length ?? 0

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Cotizaciones recibidas</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {isLoading ? '...' : `${total} cotización${total !== 1 ? 'es' : ''} en total`}
          </p>
        </div>
        {!isLoading && newCount > 0 && (
          <span className="shrink-0 rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white">
            {newCount} nueva{newCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : !quotes || quotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
            <FileText className="h-7 w-7 text-gray-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Sin cotizaciones aún</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Cuando alguien solicite cotización de tus publicaciones aparecerá aquí.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {quotes.map((q) => (
            <div
              key={q.id}
              className={cn(
                'rounded-xl border bg-white p-4 transition-shadow hover:shadow-sm',
                q.status === 'sent'
                  ? 'border-blue-200 ring-1 ring-blue-100'
                  : 'border-gray-200',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: id + listing + message */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-[11px] font-semibold text-gray-400">#{q.id}</span>
                    {q.listingId && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                        Anuncio #{q.listingId}
                      </span>
                    )}
                  </div>
                  {q.message ? (
                    <p className="flex items-start gap-1.5 text-sm text-gray-700">
                      <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300" />
                      <span className="line-clamp-2">{q.message}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Sin mensaje</p>
                  )}
                </div>

                {/* Right: status badge */}
                <span className={cn(
                  'shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
                  STATUS_COLOR[q.status],
                )}>
                  {STATUS_LABEL[q.status]}
                </span>
              </div>

              {/* Footer row */}
              <div className="mt-3 flex items-center gap-4 border-t border-gray-100 pt-2.5">
                {q.totalPrice && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                    <DollarSign className="h-3 w-3 text-gray-400" />
                    {q.currency ?? ''}{q.totalPrice}
                  </span>
                )}
                <span className="flex items-center gap-1 text-[11px] text-gray-400 ml-auto">
                  <Calendar className="h-3 w-3" />
                  {fmtDate(q.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
