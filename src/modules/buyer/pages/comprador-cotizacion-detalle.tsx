import { Link, useParams } from 'react-router'
import { ArrowLeft, CheckCircle2, XCircle, MessageCircle, Loader2, FileText, Send, Paperclip } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuoteDetailQuery } from '../queries/buyer-queries'
import type { QuoteStatus } from '../../seller/api/seller-api'

const STATUS_LABEL: Record<QuoteStatus, string> = {
  sent: 'Enviada', viewed: 'Vista', responded: 'Con respuesta',
  accepted: 'Aceptada', rejected: 'Rechazada', cancelled: 'Cancelada', expired: 'Expirada',
}
const STATUS_VARIANT: Record<QuoteStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  sent: 'secondary', viewed: 'secondary', responded: 'default',
  accepted: 'default', rejected: 'destructive', cancelled: 'outline', expired: 'outline',
}

function formatDatetime(d: string) {
  return new Date(d).toLocaleString('es-VE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const TIMELINE_LABELS: Partial<Record<QuoteStatus, string>> = {
  sent: 'Cotización enviada al vendedor',
  viewed: 'El vendedor vio tu solicitud',
  responded: 'El vendedor respondió con una oferta',
  accepted: 'Aceptaste la cotización',
  rejected: 'Rechazaste la cotización',
  cancelled: 'Cotización cancelada',
}

export function CompradorCotizacionDetalle() {
  const { id } = useParams<{ id: string }>()
  const { data: quote, isLoading, isError } = useQuoteDetailQuery(id ? Number(id) : undefined)

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-agrobot-600" />
      </div>
    )
  }

  if (isError || !quote) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <FileText className="h-10 w-10 text-gray-300" />
        <p className="text-sm font-semibold text-gray-500">Cotización no encontrada</p>
        <Link to="/app/comprador/cotizaciones" className="text-sm text-agrobot-600 hover:underline">← Volver a cotizaciones</Link>
      </div>
    )
  }

  const canAccept = quote.status === 'responded'
  const canCancel = ['sent', 'viewed', 'responded'].includes(quote.status)

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to="/app/comprador/cotizaciones" className="text-sm text-gray-400 hover:text-agrobot-600 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Cotizaciones
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-semibold text-gray-700">#{quote.id}</span>
      </div>

      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-xl font-bold text-gray-900">Cotización #{quote.id}</h1>
            {quote.listingId && <p className="text-sm text-gray-500 mt-0.5">Anuncio #{quote.listingId}</p>}
          </div>
          <Badge variant={STATUS_VARIANT[quote.status]} className="text-xs">
            {STATUS_LABEL[quote.status]}
          </Badge>
        </div>

        {/* Timeline */}
        <div className="mt-5 border-t pt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Historial</p>
          <ol className="relative border-l border-gray-200 ml-2 flex flex-col gap-3">
            {(['sent', 'viewed', 'responded', quote.status] as QuoteStatus[])
              .filter((s, i, arr) => arr.indexOf(s) === i && TIMELINE_LABELS[s])
              .map((step) => {
                const isActive = quote.status === step || ['sent', 'viewed'].includes(step)
                return (
                  <li key={step} className="ml-4">
                    <div className={`absolute -left-1.5 mt-0.5 h-3 w-3 rounded-full border-2 ${isActive ? 'border-agrobot-500 bg-agrobot-500' : 'border-gray-300 bg-white'}`} />
                    <p className={`text-xs font-semibold ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                      {TIMELINE_LABELS[step]}
                    </p>
                  </li>
                )
              })}
          </ol>
        </div>

        {/* Respuesta del proveedor */}
        {quote.totalPrice && (
          <div className="mt-5 rounded-lg border border-agrobot-200 bg-agrobot-50 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-agrobot-700 mb-1">Oferta del proveedor</p>
            <p className="text-2xl font-bold text-gray-900">
              {quote.currency ?? '$'}{quote.totalPrice}
            </p>
            {quote.validUntil && (
              <p className="text-xs text-gray-500 mt-0.5">
                Válido hasta {new Date(quote.validUntil).toLocaleDateString('es-VE')}
              </p>
            )}
          </div>
        )}

        {/* Acciones */}
        {(canAccept || canCancel) && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {canAccept && (
              <button className="flex items-center gap-2 rounded-xl bg-agrobot-700 px-4 py-2 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">
                <CheckCircle2 className="h-4 w-4" /> Aceptar cotización
              </button>
            )}
            {canAccept && (
              <button className="flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                <XCircle className="h-4 w-4" /> Rechazar
              </button>
            )}
            {canCancel && !canAccept && (
              <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors">
                Cancelar solicitud
              </button>
            )}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-agrobot-700 px-4 py-2 text-sm font-bold text-agrobot-700 hover:bg-agrobot-50 transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> Abrir WhatsApp
            </a>
          </div>
        )}
      </div>

      {/* Mensajes */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-display text-base font-bold text-gray-900 mb-4">Mensajes</h2>
        {quote.messages.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Sin mensajes aún</p>
        ) : (
          <div className="flex flex-col gap-3 mb-4">
            {quote.messages.map((m) => (
              <div key={m.id} className="rounded-lg bg-gray-50 px-4 py-3">
                <p className="text-xs text-gray-400 mb-0.5">{formatDatetime(m.createdAt)}</p>
                <p className="text-sm text-gray-800">{m.message}</p>
              </div>
            ))}
          </div>
        )}
        {['sent', 'viewed', 'responded'].includes(quote.status) && (
          <div className="flex gap-2 mt-2">
            <input
              placeholder="Escribe un mensaje..."
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-agrobot-500"
            />
            <button className="flex items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-agrobot-700 transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Adjuntos */}
      {quote.attachments.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-display text-base font-bold text-gray-900 mb-3">Adjuntos</h2>
          <div className="flex flex-col gap-2">
            {quote.attachments.map((a) => (
              <a
                key={a.id}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-agrobot-600 hover:bg-gray-50 transition-colors"
              >
                <Paperclip className="h-4 w-4 shrink-0" />
                {a.filename}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
