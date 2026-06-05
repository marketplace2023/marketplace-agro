import { Link } from 'react-router'
import {
  Package, FileText, Eye, TrendingUp, Store,
  ArrowUpRight, AlertCircle, ShieldCheck,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyListingsQuery, useMyStoreQuery, useReceivedQuotesQuery } from '../queries/seller-queries'
import { useAuth } from '@/modules/auth/context/auth-context'
import type { ListingStatus, QuoteStatus } from '../api/seller-api'

const LISTING_STATUS_COLORS: Record<ListingStatus, string> = {
  draft:          'bg-gray-100 text-gray-500',
  pending_review: 'bg-amber-50 text-amber-700',
  published:      'bg-agrobot-50 text-agrobot-700',
  paused:         'bg-gray-100 text-gray-500',
  rejected:       'bg-red-50 text-red-600',
  expired:        'bg-gray-100 text-gray-400',
  deleted:        'bg-red-50 text-red-400',
}
const LISTING_STATUS_LABEL: Record<ListingStatus, string> = {
  draft: 'Borrador', pending_review: 'En revisión', published: 'Publicado',
  paused: 'Pausado', rejected: 'Rechazado', expired: 'Expirado', deleted: 'Eliminado',
}
const QUOTE_STATUS_COLORS: Record<QuoteStatus, string> = {
  sent:       'bg-blue-50 text-blue-600',
  viewed:     'bg-gray-100 text-gray-600',
  responded:  'bg-agrobot-50 text-agrobot-700',
  accepted:   'bg-agrobot-100 text-agrobot-800',
  rejected:   'bg-red-50 text-red-600',
  cancelled:  'bg-gray-100 text-gray-500',
  expired:    'bg-gray-100 text-gray-400',
}
const QUOTE_STATUS_LABEL: Record<QuoteStatus, string> = {
  sent: 'Recibida', viewed: 'Vista', responded: 'Respondida',
  accepted: 'Aceptada', rejected: 'Rechazada', cancelled: 'Cancelada', expired: 'Expirada',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short' })
}

export function SellerDashboard() {
  const { data: listings, isLoading: loadingL } = useMyListingsQuery()
  const { data: store,    isLoading: loadingS } = useMyStoreQuery()
  const { data: quotes,   isLoading: loadingQ } = useReceivedQuotesQuery()
  const auth = useAuth()
  const userName = auth.isAuthenticated ? auth.user.name.split(' ')[0] : ''

  const published    = listings?.filter((l) => l.status === 'published').length ?? 0
  const inReview     = listings?.filter((l) => l.status === 'pending_review').length ?? 0
  const totalViews   = listings?.reduce((s, l) => s + (l.viewCount ?? 0), 0) ?? 0
  const newQuotes    = quotes?.filter((q) => q.status === 'sent' || q.status === 'viewed').length ?? 0

  const recentListings = listings?.slice(0, 5) ?? []
  const recentQuotes   = quotes?.slice(0, 4) ?? []

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Bienvenido, {userName} 👋</p>
      </div>

      {/* Store banner */}
      {!loadingS && !store && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-amber-800">No tienes una tienda registrada</p>
            <p className="text-xs text-amber-600 mt-0.5">Crea tu tienda para gestionar publicaciones y recibir cotizaciones.</p>
          </div>
          <Link to="/app/seller/tienda" className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition-colors">
            Crear tienda
          </Link>
        </div>
      )}
      {!loadingS && store && (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          {store.logoUrl ? (
            <img src={store.logoUrl} alt={store.name} className="h-9 w-9 rounded-lg object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-agrobot-50">
              <Store className="h-4 w-4 text-agrobot-600" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-gray-900">{store.name}</p>
              {store.isVerified && (
                <ShieldCheck className="h-3.5 w-3.5 text-agrobot-600" />
              )}
            </div>
            <p className="text-xs text-gray-400">{store.department ?? 'Sin ubicación'}</p>
          </div>
          <Link to={`/tiendas/${store.slug}`} target="_blank" className="shrink-0 text-xs font-semibold text-agrobot-600 hover:underline flex items-center gap-0.5">
            Ver perfil <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Publicaciones activas" value={loadingL ? null : published}  icon={Package}   trend="en el marketplace" />
        <StatCard title="En revisión"           value={loadingL ? null : inReview}   icon={TrendingUp} trend={inReview > 0 ? 'pendientes de aprobación' : 'Al día'} trendNeutral />
        <StatCard title="Vistas totales"        value={loadingL ? null : totalViews} icon={Eye}        trend="en todas tus publicaciones" trendNeutral />
        <StatCard title="Cotizaciones nuevas"   value={loadingQ ? null : newQuotes}  icon={FileText}   trend={newQuotes > 0 ? 'esperan respuesta' : 'Al día'} trendNeutral={newQuotes === 0} />
      </div>

      {/* Recent listings + recent quotes */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Recent listings — 2/3 */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Publicaciones recientes</h2>
            <Link to="/app/seller/publicaciones" className="text-xs font-semibold text-agrobot-600 hover:underline flex items-center gap-0.5">
              Ver todas <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {loadingL ? (
            <div className="flex flex-col gap-3">
              {[1,2,3].map((i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
            </div>
          ) : recentListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Package className="h-8 w-8 text-gray-200 mb-2" />
              <p className="text-xs text-gray-400">Sin publicaciones aún</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100">
              {recentListings.map((l) => (
                <div key={l.id} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-gray-800 truncate">{l.title}</p>
                    <p className="text-[11px] text-gray-400">
                      {l.price ? `$${l.price}${l.priceUnit ? ' / ' + l.priceUnit : ''}` : 'A consultar'}
                      {l.department ? ` · ${l.department}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-0.5 text-[11px] text-gray-400">
                      <Eye className="h-3 w-3" />{l.viewCount}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${LISTING_STATUS_COLORS[l.status]}`}>
                      {LISTING_STATUS_LABEL[l.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent quotes — 1/3 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Cotizaciones</h2>
            <Link to="/app/seller/cotizaciones" className="text-xs font-semibold text-agrobot-600 hover:underline flex items-center gap-0.5">
              Ver todas <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {loadingQ ? (
            <div className="flex flex-col gap-3">
              {[1,2,3].map((i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
            </div>
          ) : recentQuotes.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
              <FileText className="h-8 w-8 text-gray-200 mb-2" />
              <p className="text-xs text-gray-400">Sin cotizaciones aún</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100">
              {recentQuotes.map((q) => (
                <div key={q.id} className="py-2.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-[11px] font-mono text-gray-400">#{q.id}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${QUOTE_STATUS_COLORS[q.status]}`}>
                      {QUOTE_STATUS_LABEL[q.status]}
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-700 line-clamp-1">
                    {q.message ?? 'Sin mensaje'}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{fmtDate(q.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

function StatCard({
  title, value, icon: Icon, trend, trendNeutral = false,
}: {
  title: string
  value: number | null
  icon: React.ElementType
  trend: string
  trendNeutral?: boolean
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <Icon className="h-4 w-4 text-gray-300" />
      </div>
      {value === null ? (
        <Skeleton className="mt-3 h-8 w-16" />
      ) : (
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      )}
      <p className={`mt-1 text-xs font-medium ${trendNeutral ? 'text-gray-400' : 'text-agrobot-600'}`}>
        {trend}
      </p>
    </div>
  )
}
