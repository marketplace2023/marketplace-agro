import { Plus, Tag, Calendar, Edit2, Trash2, Pause } from 'lucide-react'

type PromoStatus = 'activa' | 'programada' | 'expirada' | 'pausada'
type PromoType = 'destacado' | 'descuento_porcentaje' | 'descuento_monto' | 'paquete'

interface Promo {
  id: number; titulo: string; tipo: PromoType; status: PromoStatus
  valor: string; publicacion: string; inicio: string; fin: string; vistas: number
}

const MOCK_PROMOS: Promo[] = [
  { id: 1, titulo: 'Maíz amarillo — Oferta de temporada', tipo: 'descuento_porcentaje', status: 'activa',     valor: '15%',      publicacion: 'Maíz amarillo duro',    inicio: '2026-06-01', fin: '2026-06-30', vistas: 210 },
  { id: 2, titulo: 'Cacao exportación — Pack 5 ton',      tipo: 'paquete',              status: 'activa',     valor: '$5,500',   publicacion: 'Cacao fermentado',      inicio: '2026-06-01', fin: '2026-07-15', vistas: 88  },
  { id: 3, titulo: 'Tomate verano — Descuento especial',  tipo: 'descuento_monto',      status: 'programada', valor: '$50/ton',   publicacion: 'Tomate larga vida',     inicio: '2026-07-01', fin: '2026-07-31', vistas: 0   },
  { id: 4, titulo: 'Plátano publicación destacada',       tipo: 'destacado',            status: 'expirada',   valor: 'Destacado', publicacion: 'Plátano hartón',       inicio: '2026-04-01', fin: '2026-05-01', vistas: 340 },
]

const STATUS_META: Record<PromoStatus, { label: string; color: string }> = {
  activa:    { label: 'Activa',     color: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  programada:{ label: 'Programada', color: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
  expirada:  { label: 'Expirada',   color: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200' },
  pausada:   { label: 'Pausada',    color: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
}

const TYPE_LABELS: Record<PromoType, string> = {
  destacado:             'Publicación destacada',
  descuento_porcentaje:  'Descuento %',
  descuento_monto:       'Descuento fijo',
  paquete:               'Paquete / Bundle',
}

export function ProducerPromociones() {
  const activas    = MOCK_PROMOS.filter(p => p.status === 'activa').length
  const programadas= MOCK_PROMOS.filter(p => p.status === 'programada').length
  const expiradas  = MOCK_PROMOS.filter(p => p.status === 'expirada').length

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Promociones</h1>
          <p className="text-sm text-gray-400 mt-0.5">Publicaciones destacadas y ofertas para tus cosechas</p>
        </div>
        <button disabled className="flex shrink-0 items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white opacity-50 cursor-not-allowed">
          <Plus className="h-4 w-4" /> Crear promoción
        </button>
      </div>

      {/* Stat tiles */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
          <p className="text-2xl font-black text-emerald-700">{activas}</p>
          <p className="mt-1 text-xs text-emerald-600">Activas</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
          <p className="text-2xl font-black text-blue-700">{programadas}</p>
          <p className="mt-1 text-xs text-blue-600">Programadas</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
          <p className="text-2xl font-black text-gray-600">{expiradas}</p>
          <p className="mt-1 text-xs text-gray-500">Expiradas</p>
        </div>
      </div>

      {/* Promo cards */}
      <div className="flex flex-col gap-3">
        {MOCK_PROMOS.map((p) => {
          const meta = STATUS_META[p.status]
          return (
            <div
              key={p.id}
              className={`rounded-xl border bg-white p-5 ${p.status === 'activa' ? 'border-agrobot-200' : 'border-gray-200'}`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                    <Tag className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{p.titulo}</p>
                    <p className="text-xs text-gray-500">{p.publicacion}</p>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${meta.color}`}>
                  {meta.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-lg bg-gray-50 p-3 mb-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Tipo</p>
                  <p className="text-xs font-semibold text-gray-700">{TYPE_LABELS[p.tipo]}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Valor</p>
                  <p className="text-sm font-black text-agrobot-700">{p.valor}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Vistas</p>
                  <p className="text-sm font-bold text-gray-700">{p.vistas}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar className="h-3.5 w-3.5" />
                  {p.inicio} → {p.fin}
                </div>
                <div className="flex items-center gap-1">
                  <button disabled className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 cursor-not-allowed" title="Editar">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button disabled className="rounded-md p-1.5 text-gray-400 hover:bg-amber-50 cursor-not-allowed" title="Pausar">
                    <Pause className="h-3.5 w-3.5" />
                  </button>
                  <button disabled className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-400 cursor-not-allowed" title="Eliminar">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-center text-xs text-gray-400">Gestión de promociones disponible próximamente. Datos de muestra.</p>
    </div>
  )
}
