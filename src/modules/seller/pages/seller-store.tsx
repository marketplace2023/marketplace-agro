import { Link } from 'react-router'
import {
  Store, ExternalLink, AlertCircle, MapPin, ShieldCheck,
  Tag, Hash, CalendarDays, Pencil, Clock, CheckCircle2,
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
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full rounded-2xl" />
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
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">No tienes una tienda registrada</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Completa tu onboarding para crear tu perfil de vendedor en AgroMarket.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const isActive = store.status === 'active'
  const isPending = store.status === 'pending'

  return (
    <div className="flex flex-col gap-5">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Mi Tienda</h1>
          <p className="text-sm text-gray-400 mt-0.5">Vista de tu perfil público en AgroMarket</p>
        </div>
        <Link
          to="/app/seller/perfil"
          className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-agrobot-300 hover:text-agrobot-700 transition-colors shadow-sm"
        >
          <Pencil className="h-4 w-4" />
          Editar perfil
        </Link>
      </div>

      {/* Status banner */}
      {isPending && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <Clock className="h-5 w-5 shrink-0 text-amber-500" />
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800">Tu tienda está en revisión</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Nuestro equipo está verificando tu información. Una vez aprobada, tu perfil será visible públicamente. Este proceso puede tomar 1–2 días hábiles.
            </p>
          </div>
        </div>
      )}

      {isActive && !store.isVerified && (
        <div className="flex items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-sky-500" />
          <div>
            <p className="text-sm font-bold text-sky-800">Solicita la verificación de tu tienda</p>
            <p className="text-xs text-sky-600 mt-0.5">Las tiendas verificadas reciben más confianza y mejor posicionamiento en el marketplace.</p>
          </div>
        </div>
      )}

      {/* Profile card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

        {/* Banner */}
        <div className="relative h-28 bg-linear-to-r from-agrobot-900 via-agrobot-700 to-emerald-600">
          {store.bannerUrl && (
            <img src={store.bannerUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
        </div>

        {/* Avatar + name */}
        <div className="relative z-10 px-6 pb-6">
          <div className="flex items-end justify-between gap-4 -mt-12 mb-5">
            <div className="flex items-end gap-4">
              {store.logoUrl ? (
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-md shrink-0"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-agrobot-50 shadow-md">
                  <Store className="h-9 w-9 text-agrobot-500" />
                </div>
              )}
              <div className="pb-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display text-xl font-bold text-gray-900">{store.name}</h2>
                  {store.isVerified && (
                    <span className="flex items-center gap-1 rounded-full bg-agrobot-100 px-2 py-0.5 text-[10px] font-bold text-agrobot-700">
                      <ShieldCheck className="h-3 w-3" />VERIFICADO
                    </span>
                  )}
                </div>
                {store.roleType && (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500">
                    <Tag className="h-3 w-3" />
                    {ROLE_LABEL[store.roleType]}
                  </span>
                )}
              </div>
            </div>

            {/* Ver perfil público */}
            {isActive ? (
              <Link
                to={`/tiendas/${store.slug}`}
                target="_blank"
                className="shrink-0 flex items-center gap-2 rounded-xl bg-agrobot-700 px-4 py-2 text-xs font-bold text-white hover:bg-agrobot-800 transition-colors shadow-sm"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Ver perfil público
              </Link>
            ) : (
              <div className="shrink-0 flex items-center gap-2 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-600 cursor-default">
                <Clock className="h-3.5 w-3.5" />
                Pendiente de aprobación
              </div>
            )}
          </div>

          {store.description && (
            <p className="text-sm text-gray-600 leading-relaxed mb-5 max-w-2xl">{store.description}</p>
          )}

          {/* Info grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoTile
              icon={MapPin}
              label="Ubicación"
              value={[store.municipality, store.department].filter(Boolean).join(', ') || '—'}
            />
            <InfoTile
              icon={Hash}
              label="URL de la tienda"
              value={`/tiendas/${store.slug}`}
              mono
            />
            <InfoTile
              icon={isActive ? CheckCircle2 : Clock}
              label="Estado"
              value={store.status === 'active' ? 'Activa' : store.status === 'pending' ? 'En revisión' : store.status}
              highlight={isActive}
              warn={isPending}
            />
            <InfoTile
              icon={CalendarDays}
              label="Miembro desde"
              value={fmtDate(store.createdAt)}
            />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        <ActionCard
          to="/app/seller/perfil"
          icon={Pencil}
          title="Editar información"
          desc="Nombre, descripción, logo y ubicación"
          color="text-agrobot-700"
          bg="bg-agrobot-50"
        />
        <ActionCard
          to="/app/seller/publicaciones"
          icon={Tag}
          title="Mis publicaciones"
          desc="Gestiona tus anuncios y productos"
          color="text-sky-700"
          bg="bg-sky-50"
        />
        <ActionCard
          to="/app/seller/tienda-gbp"
          icon={MapPin}
          title="Ubicación GBP"
          desc="Configura tu ficha en el mapa"
          color="text-violet-700"
          bg="bg-violet-50"
        />
      </div>
    </div>
  )
}

function InfoTile({
  icon: Icon, label, value, mono, highlight, warn,
}: {
  icon: React.ElementType
  label: string
  value: string
  mono?: boolean
  highlight?: boolean
  warn?: boolean
}) {
  return (
    <div className="rounded-xl bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`h-3 w-3 ${highlight ? 'text-agrobot-500' : warn ? 'text-amber-500' : 'text-gray-400'}`} />
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      </div>
      <p className={`text-sm font-semibold truncate ${mono ? 'font-mono text-xs' : ''} ${highlight ? 'text-agrobot-700' : warn ? 'text-amber-700' : 'text-gray-700'}`}>
        {value}
      </p>
    </div>
  )
}

function ActionCard({
  to, icon: Icon, title, desc, color, bg,
}: {
  to: string; icon: React.ElementType
  title: string; desc: string; color: string; bg: string
}) {
  return (
    <Link
      to={to}
      className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300 hover:shadow-md transition-all"
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg}`}>
        <Icon className={`h-4.5 w-4.5 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-gray-900">{title}</p>
        <p className="mt-0.5 text-[11px] text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </Link>
  )
}
