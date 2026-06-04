import { Link } from 'react-router'
import { Store, ExternalLink, AlertCircle, MapPin, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyStoreQuery } from '../queries/seller-queries'

export function SellerStore() {
  const { data: store, isLoading, isError } = useMyStoreQuery()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Mi Tienda</h1>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col gap-4">
          <Skeleton className="h-20 w-20 rounded-xl" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Mi Tienda</h1>
        <p className="text-sm text-gray-500 mt-0.5">Datos públicos de tu tienda en AgroMarket</p>
      </div>

      {(isError || !store) ? (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">No tienes una tienda registrada</p>
            <p className="text-xs text-amber-600 mt-0.5">
              El registro de tiendas desde el panel está próximo. Contacta a soporte para crear la tuya.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            {store.logoUrl ? (
              <img src={store.logoUrl} alt={store.name} className="h-20 w-20 rounded-xl object-cover border border-gray-200" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-agrobot-100 border border-gray-200">
                <Store className="h-8 w-8 text-agrobot-700" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-xl font-bold text-gray-900">{store.name}</h2>
                {store.isVerified && (
                  <Badge className="bg-agrobot-700 text-white text-[10px]">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Verificado
                  </Badge>
                )}
              </div>
              {store.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{store.description}</p>
              )}
              {store.department && (
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="h-3 w-3" />
                  {[store.municipality, store.department, 'Venezuela'].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-400 mb-0.5">Slug / URL</p>
              <p className="font-mono text-gray-700 text-xs">/tiendas/{store.slug}</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-400 mb-0.5">Estado</p>
              <Badge variant={store.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">
                {store.status === 'active' ? 'Activa' : store.status}
              </Badge>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Link
              to={`/tiendas/${store.slug}`}
              target="_blank"
              className="flex items-center gap-2 rounded-xl border border-agrobot-700 px-4 py-2 text-sm font-bold text-agrobot-700 hover:bg-agrobot-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Ver perfil público
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            La edición completa de la tienda (fotos, horarios, contactos) estará disponible próximamente.
          </p>
        </div>
      )}
    </div>
  )
}
