import { Link } from 'react-router'
import { Eye, PlusCircle, ExternalLink } from 'lucide-react'
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
import { useMyListingsQuery } from '../queries/seller-queries'
import type { ListingStatus, ListingType } from '../api/seller-api'

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

const TYPE_LABEL: Record<ListingType, string> = {
  sale: 'Venta',
  rent: 'Arriendo',
  service: 'Servicio',
  quote: 'Cotización',
  alliance: 'Alianza',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-VE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function SellerListings() {
  const { data: listings, isLoading } = useMyListingsQuery()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Mis Publicaciones</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLoading ? '...' : `${listings?.length ?? 0} publicaciones en total`}
          </p>
        </div>
        <button
          disabled
          title="Próximamente"
          className="flex items-center gap-2 rounded-xl bg-agrobot-700 px-4 py-2 text-sm font-bold text-white opacity-60 cursor-not-allowed"
        >
          <PlusCircle className="h-4 w-4" />
          Nueva publicación
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !listings || listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <PlusCircle className="h-10 w-10 text-gray-300" />
            <p className="text-sm font-semibold text-gray-500">No tienes publicaciones aún</p>
            <p className="text-xs text-gray-400 max-w-xs">
              Crea tu primera publicación para empezar a vender en AgroMarket.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Publicación</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Vistas</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{listing.title}</p>
                      {listing.department && (
                        <p className="text-xs text-gray-400">
                          {[listing.municipality, listing.department].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-600">{TYPE_LABEL[listing.listingType]}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-gray-800">
                      {listing.price
                        ? `$${listing.price}${listing.priceUnit ? ' / ' + listing.priceUnit : ''}`
                        : <span className="text-gray-400 text-xs">A consultar</span>
                      }
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[listing.status]} className="text-[10px]">
                      {STATUS_LABEL[listing.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="flex items-center justify-center gap-1 text-xs text-gray-500">
                      <Eye className="h-3 w-3" />
                      {listing.viewCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-400">{formatDate(listing.createdAt)}</span>
                  </TableCell>
                  <TableCell>
                    {listing.status === 'published' && (
                      <Link
                        to={`/anuncios/${listing.slug}`}
                        target="_blank"
                        className="text-gray-400 hover:text-agrobot-700 transition-colors"
                        title="Ver publicación"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
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
