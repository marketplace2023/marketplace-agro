import { Tag, PlusCircle, Calendar, Package, ShieldCheck } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useMyListingsQuery } from '../queries/seller-queries'

function fmtDate(d: string | Date | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtPrice(price: string | null, unit: string | null) {
  if (!price) return 'A consultar'
  const n = `$${Number(price).toLocaleString('es-VE')}`
  return unit ? `${n} / ${unit}` : n
}

export function SellerOffers() {
  const { data: listings, isLoading } = useMyListingsQuery()

  const featured = (listings ?? []).filter(l => l.isFeatured && l.status === 'published')
  const total    = (listings ?? []).filter(l => l.status === 'published').length

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Ofertas y promociones</h1>
          <p className="text-sm text-gray-400 mt-0.5">Publicaciones destacadas y campañas activas</p>
        </div>
        <button
          disabled
          title="Próximamente"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white opacity-50 cursor-not-allowed"
        >
          <PlusCircle className="h-4 w-4" />
          Nueva oferta
        </button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-gray-500">Destacadas activas</p>
              <Tag className="h-4 w-4 text-gray-300" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{featured.length}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-gray-500">Publicaciones activas</p>
              <Package className="h-4 w-4 text-gray-300" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{total}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-gray-500">Descuentos activos</p>
              <Tag className="h-4 w-4 text-gray-300" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
            <p className="mt-1 text-[10px] text-gray-400">Próximamente</p>
          </div>
        </div>
      )}

      {/* Featured listings */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 mb-3">Publicaciones destacadas</h2>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1,2].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        ) : featured.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-gray-200">
            <Tag className="h-10 w-10 text-gray-200 mb-3" />
            <p className="text-sm font-semibold text-gray-400">Sin publicaciones destacadas</p>
            <p className="text-xs text-gray-400 mt-1">Contacta al equipo para destacar tus publicaciones en el marketplace</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {featured.map((l) => (
              <div key={l.id} className={cn('rounded-xl border border-agrobot-200 bg-white p-4 hover:shadow-sm transition-shadow')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-agrobot-50">
                      <ShieldCheck className="h-5 w-5 text-agrobot-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{l.title}</p>
                      <p className="text-xs text-gray-400">{fmtPrice(l.price, l.priceUnit)}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-agrobot-50 text-agrobot-700">
                    Destacada
                  </span>
                </div>
                {l.featuredUntil && (
                  <div className="mt-3 flex items-center gap-1 border-t border-gray-100 pt-2.5 text-xs text-gray-400">
                    <Calendar className="h-3 w-3" />
                    Destacada hasta: {fmtDate(l.featuredUntil)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coming soon: discount campaigns */}
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
        <Tag className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm font-semibold text-gray-500">Descuentos y campañas</p>
        <p className="text-xs text-gray-400 mt-1">
          Crea cupones de descuento, campañas por porcentaje o monto fijo. Disponible próximamente.
        </p>
      </div>
    </div>
  )
}
