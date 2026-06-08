import { Link } from 'react-router'
import {
  Eye, FileText, Warehouse, Plus, TrendingUp,
  ArrowUpRight, ShieldCheck, AlertCircle,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyListingsQuery, useMyStoreQuery, useReceivedQuotesQuery } from '@/modules/seller/queries/seller-queries'
import { useAuth } from '@/modules/auth/context/auth-context'
import type { ListingStatus, QuoteStatus } from '@/modules/seller/api/seller-api'

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

function StatCard({
  title, value, icon: Icon, trend, trendNeutral = false,
  iconBg = 'bg-agrobot-50', iconColor = 'text-agrobot-600',
}: {
  title: string
  value: number | null
  icon: React.ElementType
  trend: string
  trendNeutral?: boolean
  iconBg?: string
  iconColor?: string
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-agrobot-500 to-agrobot-300 rounded-t-2xl" />
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      {value === null ? (
        <Skeleton className="h-8 w-16 mb-1" />
      ) : (
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      )}
      <p className="mt-0.5 text-[11px] font-semibold text-gray-500">{title}</p>
      <p className={`mt-0.5 text-[10px] font-medium ${trendNeutral ? 'text-gray-400' : 'text-agrobot-600'}`}>
        {trend}
      </p>
    </div>
  )
}

export function ProducerDashboard() {
  const { data: listings, isLoading: loadingL } = useMyListingsQuery()
  const { data: store,    isLoading: loadingS } = useMyStoreQuery()
  const { data: quotes,   isLoading: loadingQ } = useReceivedQuotesQuery()
  const auth = useAuth()
  const userName = auth.isAuthenticated ? auth.user.name.split(' ')[0] : ''

  const published  = listings?.filter((l) => l.status === 'published').length ?? 0
  const inReview   = listings?.filter((l) => l.status === 'pending_review').length ?? 0
  const totalViews = listings?.reduce((s, l) => s + (l.viewCount ?? 0), 0) ?? 0
  const newQuotes  = quotes?.filter((q) => q.status === 'sent' || q.status === 'viewed').length ?? 0

  const recentListings = listings?.slice(0, 5) ?? []
  const recentQuotes   = quotes?.slice(0, 4) ?? []

  return (
    <div className="flex flex-col gap-6">

      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-800 to-agrobot-700 p-6 text-white">
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -right-12 top-8 h-20 w-20 rounded-full bg-white/5 blur-lg" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-300">Panel del Productor</p>
            <h1 className="font-display mt-1 text-2xl font-bold text-white">Hola, {userName} 👋</h1>
            <p className="mt-1 text-sm text-emerald-200">Gestiona tus publicaciones y cosechas.</p>
          </div>
          <Link
            to="/app/productor/publicaciones"
            className="hidden sm:flex shrink-0 items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <Plus className="h-4 w-4" />
            Nueva publicación
          </Link>
        </div>
      </div>

      {/* Store banner */}
      {!loadingS && !store && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-amber-800">No tienes un perfil registrado</p>
            <p className="text-xs text-amber-600 mt-0.5">Configura tu perfil de productor para gestionar publicaciones.</p>
          </div>
          <Link to="/app/productor/perfil" className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition-colors">
            Configurar
          </Link>
        </div>
      )}
      {!loadingS && store && (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          {store.logoUrl ? (
            <img src={store.logoUrl} alt={store.name} className="h-9 w-9 rounded-lg object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-agrobot-50">
              <Warehouse className="h-4 w-4 text-agrobot-600" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-gray-900">{store.name}</p>
              {store.isVerified && <ShieldCheck className="h-3.5 w-3.5 text-agrobot-600" />}
            </div>
            <p className="text-xs text-gray-400">{store.department ?? 'Sin ubicación'}</p>
          </div>
          <Link to={`/productores/${store.slug}`} target="_blank" className="shrink-0 text-xs font-semibold text-agrobot-600 hover:underline flex items-center gap-0.5">
            Ver perfil <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Publicaciones activas" value={loadingL ? null : published}  icon={Warehouse}  trend="en el marketplace" iconBg="bg-agrobot-50" iconColor="text-agrobot-600" />
        <StatCard title="En revisión"           value={loadingL ? null : inReview}   icon={TrendingUp} trend={inReview > 0 ? 'pendientes' : 'Al día'} trendNeutral iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard title="Vistas totales"        value={loadingL ? null : totalViews} icon={Eye}        trend="en tus publicaciones" trendNeutral iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="Cotizaciones nuevas"   value={loadingQ ? null : newQuotes}  icon={FileText}   trend={newQuotes > 0 ? 'esperan respuesta' : 'Al día'} trendNeutral={newQuotes === 0} iconBg="bg-violet-50" iconColor="text-violet-600" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">

        {/* Recent listings */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Publicaciones recientes</h2>
            <Link to="/app/productor/publicaciones" className="text-xs font-semibold text-agrobot-600 hover:underline flex items-center gap-0.5">
              Ver todas <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {loadingL ? (
            <div className="flex flex-col gap-3">
              {[1,2,3].map((i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
            </div>
          ) : recentListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Warehouse className="h-8 w-8 text-gray-200 mb-2" />
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

        {/* Recent quotes */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Cotizaciones</h2>
            <Link to="/app/productor/cotizaciones" className="text-xs font-semibold text-agrobot-600 hover:underline flex items-center gap-0.5">
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
                  <p className="text-[12px] text-gray-700 line-clamp-1">{q.message ?? 'Sin mensaje'}</p>
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
