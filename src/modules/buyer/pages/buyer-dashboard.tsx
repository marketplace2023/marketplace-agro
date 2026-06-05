import { Link } from 'react-router'
import { FileText, Clock, CheckCircle2, XCircle, Search, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useSentQuotesQuery } from '../queries/buyer-queries'
import type { QuoteStatus } from '../../seller/api/seller-api'

const STATUS_LABEL: Record<QuoteStatus, string> = {
  sent: 'Enviada',
  viewed: 'Vista',
  responded: 'Respondida',
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

export function BuyerDashboard() {
  const { data: quotes, isLoading } = useSentQuotesQuery()

  const total = quotes?.length ?? 0
  const pending = quotes?.filter((q) => q.status === 'sent' || q.status === 'viewed').length ?? 0
  const responded = quotes?.filter((q) => q.status === 'responded').length ?? 0
  const accepted = quotes?.filter((q) => q.status === 'accepted').length ?? 0

  const recentQuotes = quotes?.slice(0, 5) ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Resumen de tus solicitudes de cotización</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total enviadas" value={isLoading ? null : total} icon={FileText} color="text-agrobot-600" bg="bg-agrobot-50" />
        <StatCard title="En espera de respuesta" value={isLoading ? null : pending} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
        <StatCard title="Con respuesta" value={isLoading ? null : responded} icon={CheckCircle2} color="text-agrobot-700" bg="bg-agrobot-50" />
        <StatCard title="Aceptadas" value={isLoading ? null : accepted} icon={XCircle} color="text-violet-600" bg="bg-violet-50" />
      </div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/catalogo"
          className="flex items-center gap-3 rounded-xl border border-dashed border-agrobot-100 bg-agrobot-50/50 p-4 hover:bg-agrobot-50 transition-colors"
        >
          <Search className="h-5 w-5 text-agrobot-600" />
          <div>
            <p className="text-sm font-bold text-agrobot-700">Buscar productos</p>
            <p className="text-xs text-gray-400">Explora el catálogo de proveedores</p>
          </div>
        </Link>
        <Link
          to="/app/comprador/cotizaciones"
          className="flex items-center gap-3 rounded-xl border border-dashed border-agrobot-300 bg-agrobot-50/50 p-4 hover:bg-agrobot-50 transition-colors"
        >
          <Heart className="h-5 w-5 text-agrobot-700" />
          <div>
            <p className="text-sm font-bold text-agrobot-700">Mis cotizaciones</p>
            <p className="text-xs text-gray-400">
              {isLoading ? '...' : `${pending} pendiente${pending !== 1 ? 's' : ''} de respuesta`}
            </p>
          </div>
        </Link>
      </div>

      {/* Recent quotes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-bold text-gray-900">
            Cotizaciones recientes
          </CardTitle>
          <Link to="/app/comprador/cotizaciones" className="text-xs font-semibold text-agrobot-600 hover:underline">
            Ver todas →
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : recentQuotes.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              No has enviado cotizaciones aún.{' '}
              <Link to="/catalogo" className="text-agrobot-600 hover:underline font-semibold">
                Buscar proveedores
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentQuotes.map((q) => (
                <div key={q.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="text-sm font-medium text-gray-900">
                      Cotización #{q.id}
                      {q.listingId ? <span className="text-gray-400 font-normal"> · Anuncio #{q.listingId}</span> : ''}
                    </p>
                    <p className="text-xs text-gray-400">
                      {q.message ? q.message.slice(0, 60) + (q.message.length > 60 ? '…' : '') : 'Sin mensaje'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400">{formatDate(q.createdAt)}</span>
                    <Badge variant={STATUS_VARIANT[q.status]} className="text-[10px]">
                      {STATUS_LABEL[q.status]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bg,
}: {
  title: string
  value: number | null
  icon: React.ElementType
  color: string
  bg: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">{title}</p>
          {value === null ? (
            <Skeleton className="mt-1 h-7 w-12" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
