import { Plus, Download, Search, Edit2, Trash2, AlertTriangle, Warehouse } from 'lucide-react'

type HarvestStatus = 'disponible' | 'agotado' | 'reservado' | 'en_cosecha'

interface Harvest {
  id: number; cultivo: string; variedad: string; status: HarvestStatus
  volumen: string; unidad: string; precio: string; fecha_cosecha: string; ubicacion: string
}

const MOCK_HARVESTS: Harvest[] = [
  { id: 1, cultivo: 'Maíz',     variedad: 'Amarillo duro',  status: 'disponible',  volumen: '40',   unidad: 'ton',  precio: '$280/ton',   fecha_cosecha: '2026-06-15', ubicacion: 'Aragua' },
  { id: 2, cultivo: 'Cacao',    variedad: 'Criollo',        status: 'disponible',  volumen: '12',   unidad: 'ton',  precio: '$1,200/ton', fecha_cosecha: '2026-07-01', ubicacion: 'Miranda' },
  { id: 3, cultivo: 'Plátano',  variedad: 'Hartón',         status: 'agotado',     volumen: '0',    unidad: 'ton',  precio: '$90/ton',    fecha_cosecha: '2026-05-01', ubicacion: 'Aragua' },
  { id: 4, cultivo: 'Sorgo',    variedad: 'Granífero',      status: 'en_cosecha',  volumen: '—',    unidad: 'ton',  precio: 'Por definir',fecha_cosecha: '2026-06-30', ubicacion: 'Carabobo' },
  { id: 5, cultivo: 'Caraotas', variedad: 'Negras',         status: 'reservado',   volumen: '8',    unidad: 'ton',  precio: '$520/ton',   fecha_cosecha: '2026-06-10', ubicacion: 'Aragua' },
  { id: 6, cultivo: 'Tomate',   variedad: 'Larga vida',     status: 'disponible',  volumen: '5',    unidad: 'ton',  precio: '$300/ton',   fecha_cosecha: '2026-06-20', ubicacion: 'Carabobo' },
]

const STATUS_COLOR: Record<HarvestStatus, string> = {
  disponible: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  agotado:    'bg-red-50 text-red-600 ring-1 ring-red-200',
  reservado:  'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  en_cosecha: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
}

const STATUS_LABEL: Record<HarvestStatus, string> = {
  disponible: 'Disponible',
  agotado:    'Agotado',
  reservado:  'Reservado',
  en_cosecha: 'En cosecha',
}

const STAT_TILES = [
  { label: 'Cultivos registrados', value: String(MOCK_HARVESTS.length),                                     color: 'text-gray-900' },
  { label: 'Volumen disponible',   value: `${MOCK_HARVESTS.filter(h => h.status === 'disponible').reduce((a, h) => a + (parseFloat(h.volumen) || 0), 0)} ton`, color: 'text-emerald-700' },
  { label: 'Agotados',             value: String(MOCK_HARVESTS.filter(h => h.status === 'agotado').length),  color: 'text-red-600' },
  { label: 'En cosecha',           value: String(MOCK_HARVESTS.filter(h => h.status === 'en_cosecha').length),color: 'text-amber-700' },
]

export function ProducerInventario() {
  const hasAgotados = MOCK_HARVESTS.some(h => h.status === 'agotado')

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Inventario de cosechas</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestiona volúmenes, disponibilidad y fechas de cosecha</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button disabled className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-400 opacity-50 cursor-not-allowed">
            <Download className="h-4 w-4" /> Exportar
          </button>
          <button disabled className="flex items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white opacity-50 cursor-not-allowed">
            <Plus className="h-4 w-4" /> Agregar cosecha
          </button>
        </div>
      </div>

      {/* Alert */}
      {hasAgotados && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-sm text-amber-800">
            Tienes cosechas agotadas. Actualiza el volumen disponible para que tus publicaciones sigan activas.
          </p>
        </div>
      )}

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-4">
        {STAT_TILES.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            placeholder="Buscar cultivo..."
            className="h-8 w-56 rounded-lg border border-gray-200 bg-gray-50 pl-8 pr-3 text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-agrobot-300"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {(['Todos', 'Disponible', 'Reservado', 'En cosecha', 'Agotado'] as const).map((f) => (
            <button
              key={f}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                f === 'Todos' ? 'bg-agrobot-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_HARVESTS.map((h) => (
          <div
            key={h.id}
            className={`rounded-xl border bg-white p-5 ${
              h.status === 'agotado' ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-agrobot-50">
                <Warehouse className="h-4 w-4 text-agrobot-600" />
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_COLOR[h.status]}`}>
                {STATUS_LABEL[h.status]}
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900">{h.cultivo}</p>
            <p className="text-xs text-gray-500">{h.variedad}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Volumen</p>
                <p className="text-sm font-bold text-gray-800">{h.volumen} {h.unidad}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Precio ref.</p>
                <p className="text-sm font-bold text-gray-800">{h.precio}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Fecha cosecha</p>
                <p className="text-xs text-gray-700">{h.fecha_cosecha}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Ubicación</p>
                <p className="text-xs text-gray-700">{h.ubicacion}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-1 border-t border-gray-100 pt-3">
              <button disabled className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 cursor-not-allowed">
                <Edit2 className="h-3 w-3" /> Editar
              </button>
              <button disabled className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-50 cursor-not-allowed">
                <Trash2 className="h-3 w-3" /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400">CRUD completo disponible próximamente. Datos de muestra.</p>
    </div>
  )
}
