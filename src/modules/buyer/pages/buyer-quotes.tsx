import { Link } from 'react-router'
import { FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useSentQuotesQuery } from '../queries/buyer-queries'
import type { QuoteStatus } from '../../seller/api/seller-api'

const STATUS_LABEL: Record<QuoteStatus, string> = {
  sent: 'Enviada',
  viewed: 'Vista por vendedor',
  responded: 'Con respuesta',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
  cancelled: 'Cancelada',
  expired: 'Expirada',
}

const STATUS_VARIANT: Record<QuoteStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  sent: 'secondary',
  viewed: 'secondary',
  responded: 'default',
  accepted: 'default',
  rejected: 'destructive',
  cancelled: 'outline',
  expired: 'outline',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-VE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function BuyerQuotes() {
  const { data: quotes, isLoading } = useSentQuotesQuery()

  const respondedCount = quotes?.filter((q) => q.status === 'responded').length ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Mis Cotizaciones</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {isLoading
            ? '...'
            : `${quotes?.length ?? 0} cotizaciones enviadas${respondedCount > 0 ? ` · ${respondedCount} con respuesta` : ''}`}
        </p>
      </div>

      {respondedCount > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-agrobot-200 bg-agrobot-50 px-4 py-3 text-sm text-agrobot-800">
          <span className="font-bold">{respondedCount}</span>
          {respondedCount === 1 ? 'cotización recibió una respuesta' : 'cotizaciones recibieron respuesta'}.
          Revísalas y decide si aceptarlas o rechazarlas.
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !quotes || quotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <FileText className="h-10 w-10 text-gray-300" />
            <p className="text-sm font-semibold text-gray-500">No has enviado cotizaciones aún</p>
            <p className="text-xs text-gray-400 max-w-xs">
              Encuentra un proveedor en el catálogo y solicita tu primera cotización.
            </p>
            <Link
              to="/catalogo"
              className="mt-1 rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700 transition-colors"
            >
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">#</TableHead>
                <TableHead>Publicación</TableHead>
                <TableHead>Mensaje enviado</TableHead>
                <TableHead>Precio respondido</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow
                  key={quote.id}
                  className={quote.status === 'responded' ? 'bg-agrobot-50/40' : ''}
                >
                  <TableCell>
                    <span className="text-xs font-mono text-gray-500">#{quote.id}</span>
                  </TableCell>
                  <TableCell>
                    {quote.listingId ? (
                      <Link
                        to={`/catalogo`}
                        className="text-xs text-sky-600 hover:underline"
                      >
                        Anuncio #{quote.listingId}
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {quote.message ? (
                      <p className="text-sm text-gray-700 line-clamp-2 max-w-[240px]">{quote.message}</p>
                    ) : (
                      <span className="text-xs text-gray-400">Sin mensaje</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {quote.totalPrice ? (
                      <span className="text-sm font-semibold text-gray-800">
                        {quote.currency ?? '$'}{quote.totalPrice}
                        {quote.validUntil && (
                          <span className="block text-[10px] text-gray-400 font-normal">
                            válido hasta {formatDate(quote.validUntil)}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[quote.status]} className="text-[10px]">
                      {STATUS_LABEL[quote.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-400">{formatDate(quote.createdAt)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
