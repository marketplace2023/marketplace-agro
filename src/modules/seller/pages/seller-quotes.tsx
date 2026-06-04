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
import { useReceivedQuotesQuery } from '../queries/seller-queries'
import type { QuoteStatus } from '../api/seller-api'
import { FileText } from 'lucide-react'

const STATUS_LABEL: Record<QuoteStatus, string> = {
  sent: 'Recibida',
  viewed: 'Vista',
  responded: 'Respondida',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
  cancelled: 'Cancelada',
  expired: 'Expirada',
}

const STATUS_VARIANT: Record<QuoteStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  sent: 'default',
  viewed: 'secondary',
  responded: 'secondary',
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

export function SellerQuotes() {
  const { data: quotes, isLoading } = useReceivedQuotesQuery()

  const newCount = quotes?.filter((q) => q.status === 'sent').length ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Cotizaciones recibidas</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {isLoading
            ? '...'
            : `${quotes?.length ?? 0} cotizaciones${newCount > 0 ? ` · ${newCount} nueva${newCount !== 1 ? 's' : ''}` : ''}`}
        </p>
      </div>

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
            <p className="text-sm font-semibold text-gray-500">Sin cotizaciones aún</p>
            <p className="text-xs text-gray-400 max-w-xs">
              Cuando alguien solicite una cotización de tus publicaciones aparecerá aquí.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">#</TableHead>
                <TableHead>Publicación</TableHead>
                <TableHead>Mensaje</TableHead>
                <TableHead>Precio ofrecido</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Recibida</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id} className={quote.status === 'sent' ? 'bg-agrobot-50/40' : ''}>
                  <TableCell>
                    <span className="text-xs font-mono text-gray-500">#{quote.id}</span>
                  </TableCell>
                  <TableCell>
                    {quote.listingId ? (
                      <span className="text-xs text-gray-600">Anuncio #{quote.listingId}</span>
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
