import { Plus, Download, Search, Edit2, Pause, Trash2 } from 'lucide-react'

type PubType = 'cosecha' | 'producto' | 'finca' | 'servicio'
type PubStatus = 'activo' | 'pausado' | 'borrador' | 'expirado'

interface Publication {
  id: number; title: string; type: PubType; status: PubStatus
  price: string; volume: string; views: number; date: string
}

const MOCK_PUBS: Publication[] = [
  { id: 1, title: 'Maíz amarillo duro x tonelada',    type: 'cosecha',  status: 'activo',   price: '$280/ton', volume: '40 ton',  views: 142, date: '2026-05-30' },
  { id: 2, title: 'Cacao fermentado exportación',     type: 'cosecha',  status: 'activo',   price: '$1,200/ton',volume: '12 ton', views: 98,  date: '2026-05-22' },
  { id: 3, title: 'Finca Los Almendros – Aragua',     type: 'finca',    status: 'activo',   price: 'Consultar', volume: '200 ha', views: 67,  date: '2026-05-18' },
  { id: 4, title: 'Plátano hartón de primera',        type: 'cosecha',  status: 'pausado',  price: '$90/ton',  volume: '0 ton',   views: 31,  date: '2026-05-10' },
  { id: 5, title: 'Semillas de sorgo certificadas',   type: 'producto', status: 'borrador', price: '$45/kg',   volume: '500 kg',  views: 0,   date: '2026-06-01' },
  { id: 6, title: 'Asesoría técnica fincas cacao',    type: 'servicio', status: 'activo',   price: '$80/día',  volume: '—',       views: 44,  date: '2026-04-20' },
]

const TYPE_COLOR: Record<PubType, string> = {
  cosecha:  'bg-green-50 text-green-700 ring-1 ring-green-200',
  producto: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  finca:    'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  servicio: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
}

const STATUS_COLOR: Record<PubStatus, string> = {
  activo:   'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  pausado:  'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  borrador: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  expirado: 'bg-red-50 text-red-600 ring-1 ring-red-200',
}

const FILTER_TABS: { label: string; key: string }[] = [
  { label: 'Todas', key: 'all' },
  { label: 'Cosecha', key: 'cosecha' },
  { label: 'Producto', key: 'producto' },
  { label: 'Finca', key: 'finca' },
  { label: 'Servicio', key: 'servicio' },
]

function countByType(type: string) {
  if (type === 'all') return MOCK_PUBS.length
  return MOCK_PUBS.filter(p => p.type === type).length
}

export function ProducerPublicaciones() {
  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Publicaciones</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestiona tus cosechas, fincas y servicios publicados</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button disabled className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-400 opacity-50 cursor-not-allowed">
            <Download className="h-4 w-4" /> Exportar
          </button>
          <button disabled className="flex items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white opacity-50 cursor-not-allowed">
            <Plus className="h-4 w-4" /> Crear publicación
          </button>
        </div>
      </div>

      {/* Filter chips + search */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_TABS.map((t) => (
          <button
            key={t.key}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              t.key === 'all'
                ? 'bg-agrobot-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.label}
            <span className={`rounded-full px-1.5 py-px text-[10px] font-bold ${
              t.key === 'all' ? 'bg-white/20 text-white' : 'bg-white text-gray-500'
            }`}>
              {countByType(t.key)}
            </span>
          </button>
        ))}
        <div className="ml-auto relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            placeholder="Buscar publicaciones..."
            className="h-8 w-52 rounded-lg border border-gray-200 bg-gray-50 pl-8 pr-3 text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-agrobot-300 focus:border-agrobot-300"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3">Publicación</th>
              <th className="px-3 py-3">Tipo</th>
              <th className="px-3 py-3">Precio</th>
              <th className="px-3 py-3">Volumen</th>
              <th className="px-3 py-3">Vistas</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-3 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PUBS.map((p) => (
              <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3">
                  <p className="font-medium text-gray-800 leading-snug">{p.title}</p>
                  <p className="text-[11px] text-gray-400">{p.date}</p>
                </td>
                <td className="px-3 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${TYPE_COLOR[p.type]}`}>
                    {p.type}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs font-mono text-gray-700">{p.price}</td>
                <td className="px-3 py-3 text-xs text-gray-500">{p.volume}</td>
                <td className="px-3 py-3 text-xs text-gray-500">{p.views}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${STATUS_COLOR[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button disabled className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-not-allowed" title="Editar">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button disabled className="rounded-md p-1 text-gray-400 hover:bg-amber-50 hover:text-amber-600 cursor-not-allowed" title="Pausar">
                      <Pause className="h-3.5 w-3.5" />
                    </button>
                    <button disabled className="rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 cursor-not-allowed" title="Eliminar">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
          <p className="text-xs text-gray-400">Mostrando {MOCK_PUBS.length} de {MOCK_PUBS.length} publicaciones</p>
          <div className="flex items-center gap-1">
            <button disabled className="rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-400 cursor-not-allowed">Anterior</button>
            <button className="rounded-md bg-agrobot-600 px-2.5 py-1 text-xs font-bold text-white">1</button>
            <button disabled className="rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-400 cursor-not-allowed">Siguiente</button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">CRUD completo disponible próximamente. Datos de muestra.</p>
    </div>
  )
}
