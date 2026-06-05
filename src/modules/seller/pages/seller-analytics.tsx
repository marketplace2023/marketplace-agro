import { Eye, TrendingUp, Users, FileText, Download } from 'lucide-react'

const MOCK_VIEWS = [
  { mes: 'Ene', vistas: 12 }, { mes: 'Feb', vistas: 28 }, { mes: 'Mar', vistas: 19 },
  { mes: 'Abr', vistas: 45 }, { mes: 'May', vistas: 38 }, { mes: 'Jun', vistas: 61 },
]
const MAX_VIEWS = Math.max(...MOCK_VIEWS.map(d => d.vistas))

const TOP_LISTINGS = [
  { title: 'Maíz blanco x tonelada', views: 142, quotes: 8 },
  { title: 'Fertilizante NPK 20-20-20', views: 98, quotes: 5 },
  { title: 'Servicio de asesoría técnica', views: 67, quotes: 3 },
]

export function SellerAnalytics() {
  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Analítica</h1>
          <p className="text-sm text-gray-400 mt-0.5">Métricas de visitas, leads y cotizaciones</p>
        </div>
        <button disabled className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-400 opacity-50 cursor-not-allowed">
          <Download className="h-4 w-4" />
          Exportar
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { title: 'Vistas totales',    value: '265',  icon: Eye,       trend: '+18% vs mes anterior' },
          { title: 'Leads generados',   value: '12',   icon: Users,     trend: '+4 nuevos este mes' },
          { title: 'Cotizaciones',      value: '8',    icon: FileText,  trend: '+2 esta semana' },
          { title: 'Tasa conversión',   value: '3.0%', icon: TrendingUp,trend: 'vistas → leads' },
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

        {/* Bar chart: views per month */}
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

        {/* Top listings */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Top publicaciones</h2>
          <div className="flex flex-col gap-4">
            {TOP_LISTINGS.map((l, i) => (
              <div key={l.title}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-700 line-clamp-1 flex-1 pr-2">{l.title}</p>
                  <span className="shrink-0 text-[10px] font-bold text-gray-400">#{i + 1}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-agrobot-500" style={{ width: `${(l.views / 142) * 100}%` }} />
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0">{l.views} vistas · {l.quotes} cot.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">Analítica en tiempo real disponible próximamente. Datos de muestra.</p>
    </div>
  )
}
