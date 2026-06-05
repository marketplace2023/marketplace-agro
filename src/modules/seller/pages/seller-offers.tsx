import { Tag, PlusCircle, Percent, Calendar, ToggleLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

type OfferStatus = 'active' | 'scheduled' | 'expired'

const STATUS_COLOR: Record<OfferStatus, string> = {
  active:    'bg-agrobot-50 text-agrobot-700',
  scheduled: 'bg-amber-50 text-amber-700',
  expired:   'bg-gray-100 text-gray-400',
}
const STATUS_LABEL: Record<OfferStatus, string> = {
  active: 'Activa', scheduled: 'Programada', expired: 'Expirada',
}

const MOCK_OFFERS = [
  { id: 1, title: '15% off en maíz blanco', discount: '15%', type: 'Porcentaje', product: 'Maíz blanco', validFrom: '2026-06-01', validTo: '2026-06-30', status: 'active' as OfferStatus },
  { id: 2, title: '$50 desc. fertilizantes', discount: '$50', type: 'Monto fijo', product: 'Fertilizantes', validFrom: '2026-07-01', validTo: '2026-07-15', status: 'scheduled' as OfferStatus },
  { id: 3, title: '10% descuento semillas', discount: '10%', type: 'Porcentaje', product: 'Semillas', validFrom: '2026-05-01', validTo: '2026-05-31', status: 'expired' as OfferStatus },
]

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short' })
}

export function SellerOffers() {
  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Ofertas y promociones</h1>
          <p className="text-sm text-gray-400 mt-0.5">Descuentos y campañas para tus publicaciones</p>
        </div>
        <button disabled title="Próximamente" className="flex shrink-0 items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white opacity-50 cursor-not-allowed">
          <PlusCircle className="h-4 w-4" />
          Nueva oferta
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {(['active','scheduled','expired'] as OfferStatus[]).map((s) => {
          const count = MOCK_OFFERS.filter(o => o.status === s).length
          return (
            <div key={s} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-gray-500">{STATUS_LABEL[s]}</p>
                <Tag className="h-4 w-4 text-gray-300" />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">{count}</p>
            </div>
          )
        })}
      </div>

      {/* Offers list */}
      <div className="flex flex-col gap-3">
        {MOCK_OFFERS.map((offer) => (
          <div key={offer.id} className={cn(
            'rounded-xl border bg-white p-4 hover:shadow-sm transition-shadow',
            offer.status === 'active' ? 'border-agrobot-200' : 'border-gray-200'
          )}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
                  offer.status === 'active' ? 'bg-agrobot-50 text-agrobot-700' : 'bg-gray-100 text-gray-500'
                )}>
                  <Percent className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{offer.title}</p>
                  <p className="text-xs text-gray-400">{offer.product} · {offer.type}</p>
                </div>
              </div>
              <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold', STATUS_COLOR[offer.status])}>
                {STATUS_LABEL[offer.status]}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-4 border-t border-gray-100 pt-2.5">
              <span className="flex items-center gap-1 text-xs text-gray-500 font-semibold">
                <Tag className="h-3 w-3" />{offer.discount}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="h-3 w-3" />{fmtDate(offer.validFrom)} → {fmtDate(offer.validTo)}
              </span>
              <button disabled className="ml-auto flex items-center gap-1 text-xs text-gray-400 cursor-not-allowed">
                <ToggleLeft className="h-4 w-4" /> Gestionar
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400">Gestión de ofertas disponible próximamente. Datos de muestra.</p>
    </div>
  )
}
