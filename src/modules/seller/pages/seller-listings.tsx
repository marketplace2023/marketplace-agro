import { Link } from 'react-router'
import { Eye, PlusCircle, ExternalLink, Package } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyListingsQuery } from '../queries/seller-queries'
import type { ListingStatus, ListingType } from '../api/seller-api'
import { cn } from '@/lib/utils'

const STATUS_COLOR: Record<ListingStatus, string> = {
  draft:          'bg-gray-100 text-gray-500',
  pending_review: 'bg-amber-50 text-amber-700',
  published:      'bg-agrobot-50 text-agrobot-700',
  paused:         'bg-gray-100 text-gray-500',
  rejected:       'bg-red-50 text-red-600',
  expired:        'bg-gray-100 text-gray-400',
  deleted:        'bg-red-50 text-red-400',
}
const STATUS_LABEL: Record<ListingStatus, string> = {
  draft: 'Borrador', pending_review: 'En revisión', published: 'Publicado',
  paused: 'Pausado', rejected: 'Rechazado', expired: 'Expirado', deleted: 'Eliminado',
}
const TYPE_LABEL: Record<ListingType, string> = {
  sale: 'Venta', rent: 'Arriendo', service: 'Servicio', quote: 'Cotización', alliance: 'Alianza',
}
const TYPE_COLOR: Record<ListingType, string> = {
  sale:     'bg-blue-50 text-blue-600',
  rent:     'bg-violet-50 text-violet-600',
  service:  'bg-agrobot-50 text-agrobot-700',
  quote:    'bg-amber-50 text-amber-700',
  alliance: 'bg-pink-50 text-pink-600',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function SellerListings() {
  const { data: listings, isLoading } = useMyListingsQuery()

  const total     = listings?.length ?? 0
  const published = listings?.filter((l) => l.status === 'published').length ?? 0
  const inReview  = listings?.filter((l) => l.status === 'pending_review').length ?? 0
  const drafts    = listings?.filter((l) => l.status === 'draft').length ?? 0

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Mis Publicaciones</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {isLoading ? '...' : `${total} publicación${total !== 1 ? 'es' : ''} en total`}
          </p>
        </div>
        <button
          disabled
          title="Próximamente"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white opacity-50 cursor-not-allowed"
        >
          <PlusCircle className="h-4 w-4" />
          Nueva publicación
        </button>
      </div>

      {/* Status chips */}
      {!isLoading && total > 0 && (
        <div className="flex flex-wrap gap-2">
          <Chip label="Todas" count={total} active />
          <Chip label="Publicadas" count={published} />
          <Chip label="En revisión" count={inReview} amber />
          <Chip label="Borradores" count={drafts} />
        </div>
      )}

      {/* Table card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-5 flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : !listings || listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
              <Package className="h-7 w-7 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">No tienes publicaciones aún</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Crea tu primera publicación para empezar a vender en AgroMarket.
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 w-[40%]">Publicación</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Tipo</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Precio</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Estado</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-400">Vistas</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Fecha</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {listings.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-gray-900 line-clamp-1">{l.title}</p>
                    {l.department && (
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {[l.municipality, l.department].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', TYPE_COLOR[l.listingType])}>
                      {TYPE_LABEL[l.listingType]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {l.price ? (
                      <span className="font-semibold text-gray-800">
                        ${l.price}{l.priceUnit ? <span className="font-normal text-gray-400"> / {l.priceUnit}</span> : ''}
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400">A consultar</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', STATUS_COLOR[l.status])}>
                      {STATUS_LABEL[l.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="flex items-center justify-center gap-1 text-[11px] text-gray-400">
                      <Eye className="h-3 w-3" />{l.viewCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-gray-400">{fmtDate(l.createdAt)}</td>
                  <td className="px-4 py-3">
                    {l.status === 'published' && (
                      <Link to={`/anuncios/${l.slug}`} target="_blank" className="text-gray-300 hover:text-agrobot-600 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function Chip({ label, count, active, amber }: { label: string; count: number; active?: boolean; amber?: boolean }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
      active
        ? 'border-agrobot-200 bg-agrobot-50 text-agrobot-700'
        : amber
          ? 'border-amber-200 bg-amber-50 text-amber-700'
          : 'border-gray-200 bg-white text-gray-500',
    )}>
      {label}
      <span className={cn(
        'rounded-full px-1.5 py-0 text-[10px] font-bold',
        active ? 'bg-agrobot-100' : amber ? 'bg-amber-100' : 'bg-gray-100',
      )}>{count}</span>
    </span>
  )
}
