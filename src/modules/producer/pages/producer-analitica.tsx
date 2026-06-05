import { Eye, Heart, Users, TrendingUp, Download } from 'lucide-react'

const MOCK_VIEWS = [
  { mes: 'Ene', vistas: 18 }, { mes: 'Feb', vistas: 35 }, { mes: 'Mar', vistas: 27 },
  { mes: 'Abr', vistas: 52 }, { mes: 'May', vistas: 44 }, { mes: 'Jun', vistas: 71 },
]
const MAX_VIEWS = Math.max(...MOCK_VIEWS.map(d => d.vistas))

const TOP_PUBS = [
  { titulo: 'Maíz amarillo duro x tonelada', vistas: 210, favoritos: 18, leads: 12 },
  { titulo: 'Cacao fermentado exportación',  vistas: 142, favoritos: 11, leads: 7  },
  { titulo: 'Finca Los Almendros – Aragua',  vistas: 98,  favoritos: 6,  leads: 4  },
  { titulo: 'Servicio asesoría técnica cacao',vistas: 67,  favoritos: 3,  leads: 2  },
]

export function ProducerAnalitica() {
  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Analítica</h1>
          <p className="text-sm text-gray-400 mt-0.5">Visitas, favoritos, leads y conversión de tus publicaciones</p>
        </div>
        <button disabled className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-400 opacity-50 cursor-not-allowed">
          <Download className="h-4 w-4" /> Exportar
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { title: 'Vistas totales',    value: '517',  icon: Eye,       trend: '+23% vs mes anterior' },
          { title: 'Favoritos',         value: '38',   icon: Heart,     trend: '+5 esta semana' },
          { title: 'Leads generados',   value: '25',   icon: Users,     trend: '+8 nuevos este mes' },
          { title: 'Tasa conversión',   value: '4.8%', icon: TrendingUp,trend: 'vistas → leads' },
        ].map((kpi) => (
          <div key={kpi.title} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
              <kpi.icon className="h-4 w-4 text-gray-300" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{kpi.value}</p>
            <p className="mt-1 text-xs font-medium text-agrobot-600">{kpi.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">

        {/* Bar chart */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-5">Vistas por mes</h2>
          <div className="flex items-end gap-3 h-40">
            {MOCK_VIEWS.map((d) => (
              <div key={d.mes} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[10px] font-medium text-gray-500">{d.vistas}</span>
                <div
                  className="w-full rounded-t-lg bg-agrobot-500 transition-all"
                  style={{ height: `${(d.vistas / MAX_VIEWS) * 100}%`, minHeight: '4px' }}
                />
                <span className="text-[10px] text-gray-400">{d.mes}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Favorites / leads mini chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Leads vs Favoritos</h2>
          <div className="space-y-4">
            {[
              { label: 'Favoritos', value: 38, max: 50, color: 'bg-rose-400' },
              { label: 'Leads',     value: 25, max: 50, color: 'bg-agrobot-500' },
              { label: 'Cotizaciones', value: 14, max: 50, color: 'bg-blue-400' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-600">{item.label}</p>
                  <p className="text-xs font-bold text-gray-800">{item.value}</p>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all`}
                    style={{ width: `${(item.value / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top publications table */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-bold text-gray-900">Top publicaciones</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3">#</th>
              <th className="px-3 py-3">Publicación</th>
              <th className="px-3 py-3">Vistas</th>
              <th className="px-3 py-3">Favoritos</th>
              <th className="px-3 py-3">Leads</th>
              <th className="px-3 py-3">Conversión</th>
            </tr>
          </thead>
          <tbody>
            {TOP_PUBS.map((p, i) => (
              <tr key={p.titulo} className="border-t border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 text-xs font-bold text-gray-400">#{i + 1}</td>
                <td className="px-3 py-3 font-medium text-gray-800">{p.titulo}</td>
                <td className="px-3 py-3 text-gray-600">{p.vistas}</td>
                <td className="px-3 py-3 text-gray-600">{p.favoritos}</td>
                <td className="px-3 py-3 text-gray-600">{p.leads}</td>
                <td className="px-3 py-3">
                  <span className="text-xs font-semibold text-agrobot-700">
                    {((p.leads / p.vistas) * 100).toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-xs text-gray-400">Analítica en tiempo real disponible próximamente. Datos de muestra.</p>
    </div>
  )
}
