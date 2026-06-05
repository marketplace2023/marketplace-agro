import { Link } from 'react-router'
import {
  Store, ExternalLink, AlertCircle, MapPin, ShieldCheck,
  Tag, Hash, CalendarDays, Pencil,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyStoreQuery } from '../queries/seller-queries'
import type { StoreRoleType } from '../api/seller-api'

const ROLE_LABEL: Record<StoreRoleType, string> = {
  seller:             'Vendedor / Tienda',
  producer:           'Productor agrícola',
  farm_owner:         'Dueño de finca',
  input_supplier:     'Proveedor de insumos',
  machinery_supplier: 'Maquinaria agrícola',
  agronomist:         'Agrónomo / Técnico',
  transporter:        'Transportista',
  cooperative:        'Cooperativa',
  laboratory:         'Laboratorio',
  certifier:          'Certificador',
  quality_inspector:  'Inspector de calidad',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'long', year: 'numeric' })
}

export function SellerStore() {
  const { data: store, isLoading, isError } = useMyStoreQuery()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Mi Tienda</h1>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <Skeleton className="h-20 w-20 rounded-2xl" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    )
  }

  if (isError || !store) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Mi Tienda</h1>
          <p className="text-sm text-gray-400 mt-0.5">Datos públicos de tu perfil en AgroMarket</p>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">No tienes una tienda registrada</p>
            <p className="text-xs text-amber-600 mt-0.5">
              El registro de tiendas desde el panel está próximo. Contacta a soporte para crear la tuya.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Mi Tienda</h1>
          <p className="text-sm text-gray-400 mt-0.5">Datos públicos de tu perfil en AgroMarket</p>
        </div>
        <button
          disabled
          title="Próximamente"
          className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-400 opacity-60 cursor-not-allowed"
        >
          <Pencil className="h-4 w-4" />
          Editar tienda
        </button>
      </div>

      {/* Profile card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

        {/* Banner */}
        <div className="h-24 bg-linear-to-r from-agrobot-800 via-agrobot-700 to-emerald-600" />

        {/* Avatar + name row */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name}
                className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-md"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-agrobot-50 shadow-md">
                <Store className="h-9 w-9 text-agrobot-600" />
              </div>
            )}
            <div className="pb-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-xl font-bold text-gray-900">{store.name}</h2>
                {store.isVerified && (
                  <span className="flex items-center gap-1 rounded-full bg-agrobot-50 px-2 py-0.5 text-[10px] font-bold text-agrobot-700">
                    <ShieldCheck className="h-3 w-3" /> Verificado
                  </span>
                )}
              </div>
              {store.roleType && (
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                  <Tag className="h-3 w-3" />
                  {ROLE_LABEL[store.roleType]}
                </span>
              )}
            </div>
            <Link
              to={`/tiendas/${store.slug}`}
              target="_blank"
              className="shrink-0 flex items-center gap-2 rounded-xl border border-agrobot-200 px-3 py-2 text-xs font-bold text-agrobot-700 hover:bg-agrobot-50 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Ver perfil público
            </Link>
          </div>

          {store.description && (
            <p className="text-sm text-gray-600 leading-relaxed mb-5 max-w-2xl">{store.description}</p>
          )}

          {/* Info grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoTile
              icon={MapPin}
              label="Ubicación"
              value={[store.municipality, store.department].filter(Boolean).join(', ') || 'Sin ubicación'}
            />
            <InfoTile
              icon={Hash}
              label="URL de la tienda"
              value={`/tiendas/${store.slug}`}
              mono
            />
            <InfoTile
              icon={Tag}
              label="Estado"
              value={store.status === 'active' ? 'Activa' : store.status === 'pending' ? 'En revisión' : store.status}
              highlight={store.status === 'active'}
            />
            <InfoTile
              icon={CalendarDays}
              label="Miembro desde"
              value={fmtDate(store.createdAt)}
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        La edición completa de la tienda (fotos, horarios, contactos) estará disponible próximamente.
      </p>
    </div>
  )
}

function InfoTile({
  icon: Icon, label, value, mono, highlight,
}: {
  icon: React.ElementType
  label: string
  value: string
  mono?: boolean
  highlight?: boolean
}) {
  return (
    <div className="rounded-lg bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3 w-3 text-gray-400" />
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      </div>
      <p className={`text-sm font-medium truncate ${mono ? 'font-mono text-xs text-gray-600' : ''} ${highlight ? 'text-agrobot-700' : 'text-gray-700'}`}>
        {value}
      </p>
    </div>
  )
}
