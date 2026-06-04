import { Link } from 'react-router'
import { Package, FileText, Eye, TrendingUp, Store, PlusCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyListingsQuery } from '../queries/seller-queries'
import { useMyStoreQuery } from '../queries/seller-queries'
import { useReceivedQuotesQuery } from '../queries/seller-queries'
import type { ListingStatus } from '../api/seller-api'

const STATUS_LABEL: Record<ListingStatus, string> = {
  draft: 'Borrador',
  pending_review: 'En revisión',
  published: 'Publicado',
  paused: 'Pausado',
  rejected: 'Rechazado',
  expired: 'Expirado',
  deleted: 'Eliminado',
}

const STATUS_VARIANT: Record<ListingStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'outline',
  pending_review: 'secondary',
  published: 'default',
  paused: 'secondary',
  rejected: 'destructive',
  expired: 'outline',
  deleted: 'destructive',
}

export function SellerDashboard() {
  const { data: listings, isLoading: loadingListings } = useMyListingsQuery()
  const { data: store, isLoading: loadingStore } = useMyStoreQuery()
  const { data: quotes, isLoading: loadingQuotes } = useReceivedQuotesQuery()

  const published = listings?.filter((l) => l.status === 'published').length ?? 0
  const pendingReview = listings?.filter((l) => l.status === 'pending_review').length ?? 0
  const totalViews = listings?.reduce((sum, l) => sum + (l.viewCount ?? 0), 0) ?? 0
  const newQuotes = quotes?.filter((q) => q.status === 'sent' || q.status === 'viewed').length ?? 0

  const recentListings = listings?.slice(0, 5) ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Resumen de tu actividad en AgroMarket</p>
      </div>

      {/* Store status banner */}
      {!loadingStore && !store && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">No tienes una tienda registrada</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Crea tu tienda para gestionar publicaciones y recibir cotizaciones.
            </p>
          </div>
          <Link
            to="/app/seller/tienda"
            className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition-colors"
          >
            Crear tienda
          </Link>
        </div>
      )}

      {store && !loadingStore && (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {store.logoUrl ? (
            <img src={store.logoUrl} alt={store.name} className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-agrobot-100">
              <Store className="h-5 w-5 text-agrobot-700" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">{store.name}</p>
            <p className="text-xs text-gray-400">
              {store.isVerified ? 'Tienda verificada · ' : ''}{store.department ?? 'Sin ubicación'}
            </p>
          </div>
          {store.isVerified && (
            <Badge variant="default" className="bg-agrobot-700 text-white text-[10px]">Verificado</Badge>
          )}
          <Link
            to={`/tiendas/${store.slug}`}
            target="_blank"
            className="text-xs font-semibold text-agrobot-700 hover:underline"
          >
            Ver perfil público →
          </Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Publicaciones activas"
          value={loadingListings ? null : published}
          icon={Package}
          color="text-agrobot-700"
          bg="bg-agrobot-50"
        />
        <StatCard
          title="En revisión"
          value={loadingListings ? null : pendingReview}
          icon={TrendingUp}
          color="text-amber-600"
          bg="bg-amber-50"
        />
        <StatCard
          title="Vistas totales"
          value={loadingListings ? null : totalViews}
          icon={Eye}
          color="text-sky-600"
          bg="bg-sky-50"
        />
        <StatCard
          title="Cotizaciones nuevas"
          value={loadingQuotes ? null : newQuotes}
          icon={FileText}
          color="text-violet-600"
          bg="bg-violet-50"
        />
      </div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/app/seller/publicaciones"
          className="flex items-center gap-3 rounded-xl border border-dashed border-agrobot-300 bg-agrobot-50/50 p-4 hover:bg-agrobot-50 transition-colors"
        >
          <PlusCircle className="h-5 w-5 text-agrobot-700" />
          <div>
            <p className="text-sm font-bold text-agrobot-700">Nueva publicación</p>
            <p className="text-xs text-gray-400">Publicar producto, servicio o finca</p>
          </div>
        </Link>
        <Link
          to="/app/seller/cotizaciones"
          className="flex items-center gap-3 rounded-xl border border-dashed border-violet-300 bg-violet-50/50 p-4 hover:bg-violet-50 transition-colors"
        >
          <FileText className="h-5 w-5 text-violet-600" />
          <div>
            <p className="text-sm font-bold text-violet-700">Ver cotizaciones</p>
            <p className="text-xs text-gray-400">
              {loadingQuotes ? '...' : `${newQuotes} cotización${newQuotes !== 1 ? 'es' : ''} pendiente${newQuotes !== 1 ? 's' : ''}`}
            </p>
          </div>
        </Link>
      </div>

      {/* Recent listings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-bold text-gray-900">
            Publicaciones recientes
          </CardTitle>
          <Link to="/app/seller/publicaciones" className="text-xs font-semibold text-agrobot-700 hover:underline">
            Ver todas →
          </Link>
        </CardHeader>
        <CardContent>
          {loadingListings ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : recentListings.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              No tienes publicaciones aún.{' '}
              <Link to="/app/seller/publicaciones" className="text-agrobot-700 hover:underline font-semibold">
                Crear una
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentListings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="text-sm font-medium text-gray-900 truncate">{listing.title}</p>
                    <p className="text-xs text-gray-400">
                      {listing.price ? `$${listing.price}${listing.priceUnit ? ' / ' + listing.priceUnit : ''}` : 'Precio a consultar'}
                      {listing.department ? ` · ${listing.department}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-0.5 text-xs text-gray-400">
                      <Eye className="h-3 w-3" />
                      {listing.viewCount}
                    </span>
                    <Badge variant={STATUS_VARIANT[listing.status]} className="text-[10px]">
                      {STATUS_LABEL[listing.status]}
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
