import { useState } from 'react'
import { Link } from 'react-router'
import { Radar, PlusCircle, Pause, Play, RefreshCw, Eye, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

type AlertStatus = 'active' | 'paused' | 'expired'

interface RadarAlert {
  id: number; name: string; category: string; department: string | null
  maxPrice: number | null; matches: number; status: AlertStatus; createdAt: string
}

const MOCK: RadarAlert[] = [
  { id: 1, name: 'Maíz blanco Portuguesa', category: 'Granos', department: 'Portuguesa', maxPrice: 50, matches: 7, status: 'active', createdAt: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 2, name: 'Insumos Lara zona norte', category: 'Insumos', department: 'Lara', maxPrice: null, matches: 2, status: 'paused', createdAt: new Date(Date.now() - 20 * 86400000).toISOString() },
]

const STATUS_LABEL: Record<AlertStatus, string> = { active: 'Activa', paused: 'Pausada', expired: 'Expirada' }
const STATUS_VARIANT: Record<AlertStatus, 'default' | 'secondary' | 'outline'> = { active: 'default', paused: 'secondary', expired: 'outline' }

export function CompradorRadar() {
  const [alerts, setAlerts] = useState<RadarAlert[]>(MOCK)

  function toggleStatus(id: number) {
    setAlerts((prev) => prev.map((a) =>
      a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a
    ))
  }

  const activeCount = alerts.filter((a) => a.status === 'active').length
  const totalMatches = alerts.reduce((s, a) => s + a.matches, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Radar del Comprador</h1>
          <p className="text-sm text-gray-500 mt-0.5">Alertas inteligentes de oportunidades agrícolas</p>
        </div>
        <Link
          to="/app/comprador/radar/nuevo"
          className="flex items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white hover:bg-agrobot-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" /> Nueva alerta
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="pt-5 flex items-center gap-3">
          <Radar className="h-8 w-8 text-agrobot-600 shrink-0" />
          <div><p className="text-xs text-gray-500">Alertas activas</p><p className="text-2xl font-bold text-gray-900">{activeCount}</p></div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 flex items-center gap-3">
          <Eye className="h-8 w-8 text-agrobot-700 shrink-0" />
          <div><p className="text-xs text-gray-500">Coincidencias totales</p><p className="text-2xl font-bold text-gray-900">{totalMatches}</p></div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 flex items-center gap-3">
          <RefreshCw className="h-8 w-8 text-violet-600 shrink-0" />
          <div><p className="text-xs text-gray-500">Alertas pausadas</p><p className="text-2xl font-bold text-gray-900">{alerts.length - activeCount}</p></div>
        </CardContent></Card>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Radar className="h-10 w-10 text-gray-300" />
            <p className="text-sm font-semibold text-gray-500">No tienes alertas Radar</p>
            <Link to="/app/comprador/radar/nuevo" className="mt-1 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white hover:bg-agrobot-700 transition-colors">
              Crear primera alerta
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alerta</TableHead>
                <TableHead>Filtros</TableHead>
                <TableHead className="text-center">Coincidencias</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[120px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <p className="text-sm font-semibold text-gray-900">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.category}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {a.department && <Badge variant="outline" className="text-[10px]">{a.department}</Badge>}
                      {a.maxPrice && <Badge variant="outline" className="text-[10px]">Máx. ${a.maxPrice}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {a.matches > 0
                      ? <Badge className="bg-agrobot-600 text-white text-[10px]">{a.matches} nuevas</Badge>
                      : <span className="text-xs text-gray-400">—</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[a.status]} className="text-[10px]">
                      {STATUS_LABEL[a.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button
                        title={a.status === 'active' ? 'Pausar' : 'Activar'}
                        onClick={() => toggleStatus(a.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-agrobot-500 hover:text-agrobot-600 transition-colors"
                      >
                        {a.status === 'active' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        title="Eliminar"
                        onClick={() => setAlerts((p) => p.filter((x) => x.id !== a.id))}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
