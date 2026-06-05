import { Eye, FileText, Users, Warehouse, Plus, AlertTriangle, TrendingUp } from 'lucide-react'
import { NavLink } from 'react-router'

const KPIS = [
  { title: 'Publicaciones activas', value: '8',    icon: Eye,       trend: '+2 este mes' },
  { title: 'Cotizaciones recibidas',value: '14',   icon: FileText,  trend: '3 sin responder' },
  { title: 'Leads generados',       value: '23',   icon: Users,     trend: '+7 esta semana' },
  { title: 'Inventario (tons.)',    value: '124',  icon: Warehouse, trend: '4 cultivos registrados' },
]

const MOCK_RECENT = [
  { id: 1, tipo: 'Cosecha', titulo: 'Maíz amarillo duro', estado: 'activo',    fecha: '2026-05-30', tons: '40 ton' },
  { id: 2, tipo: 'Producto', titulo: 'Cacao fermentado',  estado: 'pausado',   fecha: '2026-05-22', tons: '12 ton' },
  { id: 3, tipo: 'Finca',   titulo: 'Finca Los Almendros',estado: 'activo',    fecha: '2026-05-18', tons: '200 ha' },
  { id: 4, tipo: 'Cosecha', titulo: 'Plátano hartón',     estado: 'agotado',   fecha: '2026-05-10', tons: '0 ton' },
]

const ESTADO_COLOR: Record<string, string> = {
  activo:  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  pausado: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  agotado: 'bg-red-50 text-red-600 ring-1 ring-red-200',
}

const QUICK_LINKS = [
  { label: 'Nueva publicación',   to: '/app/productor/publicaciones', icon: Plus },
  { label: 'Agregar cosecha',     to: '/app/productor/inventario',    icon: Warehouse },
  { label: 'Ver leads',           to: '/app/productor/leads',         icon: Users },
  { label: 'Cotizaciones',        to: '/app/productor/cotizaciones',  icon: FileText },
]

export function ProducerDashboard() {
  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard Productor</h1>
          <p className="text-sm text-gray-400 mt-0.5">Resumen de tu operación agrícola</p>
        </div>
        <NavLink
          to="/app/productor/publicaciones"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white hover:bg-agrobot-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nueva publicación
        </NavLink>
      </div>

      {/* Alert: inventory low */}
      <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
        <p className="text-sm text-amber-800">
          Tienes <strong>1 cosecha agotada</strong> en inventario. Actualiza el volumen disponible para seguir recibiendo solicitudes.
        </p>
        <NavLink to="/app/productor/inventario" className="ml-auto shrink-0 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors">
          Ir al inventario →
        </NavLink>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <div key={kpi.title} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
              <kpi.icon className="h-4 w-4 text-gray-300" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{kpi.value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-agrobot-600">
              <TrendingUp className="h-3 w-3" />
              {kpi.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">

        {/* Recent listings */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">Publicaciones recientes</h2>
            <NavLink to="/app/productor/publicaciones" className="text-xs text-agrobot-600 font-semibold hover:text-agrobot-800">
              Ver todas →
            </NavLink>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                <th className="px-5 py-3">Título</th>
                <th className="px-3 py-3">Tipo</th>
                <th className="px-3 py-3">Volumen</th>
                <th className="px-3 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_RECENT.map((r) => (
                <tr key={r.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-800">{r.titulo}</td>
                  <td className="px-3 py-3 text-gray-500 text-xs">{r.tipo}</td>
                  <td className="px-3 py-3 text-gray-500 text-xs font-mono">{r.tons}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${ESTADO_COLOR[r.estado]}`}>
                      {r.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick links */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Accesos rápidos</h2>
          <div className="flex flex-col gap-2">
            {QUICK_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 hover:border-agrobot-200 hover:bg-agrobot-50 hover:text-agrobot-700 transition-all"
              >
                <link.icon className="h-4 w-4 text-gray-400" />
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-agrobot-50 border border-agrobot-100 p-3">
            <p className="text-xs font-semibold text-agrobot-800 mb-1">¿Necesitas ayuda?</p>
            <p className="text-[11px] text-agrobot-700">
              Consulta nuestras guías para productores o contacta soporte desde el menú de configuración.
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">Datos en tiempo real disponibles próximamente. Valores de muestra.</p>
    </div>
  )
}
