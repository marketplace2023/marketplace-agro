import { useState, useEffect } from 'react'
import { Eye, TrendingUp, Users, FileText, Download, Package } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyListingsQuery, useReceivedQuotesQuery } from '../queries/seller-queries'
import { axiosInstance } from '../../shared/lib/axios'

interface LeadsSummary {
  total: number
  converted: number
  conversionRate: number
}

interface LeadTrend {
  month: string
  total: number
  converted: number
}

const MONTH_LABELS: Record<string, string> = {
  '01':'Ene','02':'Feb','03':'Mar','04':'Abr','05':'May','06':'Jun',
  '07':'Jul','08':'Ago','09':'Sep','10':'Oct','11':'Nov','12':'Dic',
}

function monthLabel(ym: string) {
  return MONTH_LABELS[ym.split('-')[1]] ?? ym
}

function StatCard({ title, value, icon: Icon, sub }: {
  title: string; value: string | null; icon: React.ElementType; sub: string
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <Icon className="h-4 w-4 text-gray-300" />
      </div>
      {value === null
        ? <Skeleton className="mt-3 h-8 w-16" />
        : <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      }
      <p className="mt-1 text-xs font-medium text-agrobot-600">{sub}</p>
    </div>
  )
}

export function SellerAnalytics() {
  const { data: listings, isLoading: loadingL } = useMyListingsQuery()
  const { data: quotes,   isLoading: loadingQ } = useReceivedQuotesQuery()

  const [summary,      setSummary]      = useState<LeadsSummary | null>(null)
  const [trend,        setTrend]        = useState<LeadTrend[]>([])
  const [loadingLeads, setLoadingLeads] = useState(true)

  useEffect(() => {
    Promise.all([
      axiosInstance.get<LeadsSummary>('/leads/analytics/summary'),
      axiosInstance.get<LeadTrend[]>('/leads/analytics/trend'),
    ])
      .then(([s, t]) => { setSummary(s.data); setTrend(t.data) })
      .catch(() => {})
      .finally(() => setLoadingLeads(false))
  }, [])

  const totalViews  = listings?.reduce((s, l) => s + (l.viewCount ?? 0), 0) ?? 0
  const topListings = [...(listings ?? [])].sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0)).slice(0, 5)
  const maxView     = topListings[0]?.viewCount ?? 1
  const maxTrend    = trend.length > 0 ? Math.max(...trend.map(d => d.total), 1) : 1

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
        <StatCard title="Vistas totales"    value={loadingL     ? null : String(totalViews)}                        icon={Eye}       sub="en todas tus publicaciones" />
        <StatCard title="Leads generados"   value={loadingLeads ? null : String(summary?.total ?? 0)}               icon={Users}     sub="total acumulado" />
        <StatCard title="Cotizaciones"      value={loadingQ     ? null : String(quotes?.length ?? 0)}               icon={FileText}  sub="recibidas" />
        <StatCard title="Tasa conversión"   value={loadingLeads ? null : `${summary?.conversionRate ?? 0}%`}        icon={TrendingUp} sub="leads → convertidos" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">

        {/* Leads trend chart */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-5">Leads por mes (últimos 6 meses)</h2>
          {loadingLeads ? (
            <Skeleton className="h-40 w-full rounded-lg" />
          ) : trend.length === 0 ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-xs text-gray-400">Sin datos de leads aún</p>
            </div>
          ) : (
            <div className="flex items-end gap-3 h-40">
              {trend.map((d) => (
                <div key={d.month} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[10px] font-medium text-gray-500">{d.total}</span>
                  <div
                    className="w-full rounded-t-lg bg-agrobot-500 transition-all"
                    style={{ height: `${(d.total / maxTrend) * 100}%`, minHeight: 4 }}
                  />
                  <span className="text-[10px] text-gray-400">{monthLabel(d.month)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top listings by views */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Top publicaciones</h2>
          {loadingL ? (
            <div className="flex flex-col gap-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-8 w-full rounded-lg" />)}
            </div>
          ) : topListings.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center gap-1">
              <Package className="h-6 w-6 text-gray-200" />
              <p className="text-xs text-gray-400">Sin publicaciones aún</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {topListings.map((l, i) => (
                <div key={l.id}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-gray-700 line-clamp-1 flex-1 pr-2">{l.title}</p>
                    <span className="shrink-0 text-[10px] font-bold text-gray-400">#{i + 1}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-agrobot-500" style={{ width: `${((l.viewCount ?? 0) / maxView) * 100}%` }} />
                    </div>
                    <span className="text-[11px] text-gray-400 shrink-0">{l.viewCount ?? 0} vistas</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
