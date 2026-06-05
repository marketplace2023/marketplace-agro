import { useState } from 'react'
import { Link } from 'react-router'
import { Search, Radar, Trash2, Play, Edit2, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

interface SavedSearch {
  id: number
  name: string
  query: string
  categoryId: number | null
  department: string | null
  maxPrice: number | null
  lastRun: string
  newResults: number
  createdAt: string
}

const MOCK: SavedSearch[] = [
  { id: 1, name: 'Maíz blanco Portuguesa', query: 'maíz blanco', categoryId: 1, department: 'Portuguesa', maxPrice: 50, lastRun: new Date(Date.now() - 86400000).toISOString(), newResults: 3, createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 2, name: 'Tractores usados Lara', query: 'tractor', categoryId: null, department: 'Lara', maxPrice: null, lastRun: new Date(Date.now() - 3 * 86400000).toISOString(), newResults: 0, createdAt: new Date(Date.now() - 14 * 86400000).toISOString() },
]

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short' })
}

export function CompradorBusquedas() {
  const [searches, setSearches] = useState<SavedSearch[]>(MOCK)

  function remove(id: number) {
    setSearches((s) => s.filter((x) => x.id !== id))
  }

  function buildUrl(s: SavedSearch) {
    const p = new URLSearchParams()
    if (s.query) p.set('q', s.query)
    if (s.categoryId) p.set('categoryId', String(s.categoryId))
    if (s.department) p.set('department', s.department)
    if (s.maxPrice) p.set('maxPrice', String(s.maxPrice))
    return `/catalogo?${p.toString()}`
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Búsquedas guardadas</h1>
        <p className="text-sm text-gray-500 mt-0.5">Repite o convierte en alerta Radar tus búsquedas frecuentes</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {searches.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Search className="h-10 w-10 text-gray-300" />
            <p className="text-sm font-semibold text-gray-500">No tienes búsquedas guardadas</p>
            <p className="text-xs text-gray-400 max-w-xs">
              Al buscar en el catálogo, podrás guardar las búsquedas para repetirlas rápido.
            </p>
            <Link to="/catalogo" className="mt-1 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white hover:bg-agrobot-700 transition-colors">
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Filtros</TableHead>
                <TableHead>Última ejecución</TableHead>
                <TableHead className="text-center">Nuevos</TableHead>
                <TableHead className="w-[140px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searches.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-400 font-mono">"{s.query}"</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {s.department && <Badge variant="outline" className="text-[10px]">{s.department}</Badge>}
                      {s.maxPrice && <Badge variant="outline" className="text-[10px]">Máx. ${s.maxPrice}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {formatDate(s.lastRun)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {s.newResults > 0 ? (
                      <Badge className="bg-agrobot-600 text-white text-[10px]">{s.newResults} nuevos</Badge>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Link
                        to={buildUrl(s)}
                        title="Ejecutar"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-agrobot-500 hover:text-agrobot-600 transition-colors"
                      >
                        <Play className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        to={`/app/comprador/radar/nuevo?from=${s.id}`}
                        title="Convertir en Radar"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-violet-400 hover:text-violet-600 transition-colors"
                      >
                        <Radar className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        title="Eliminar"
                        onClick={() => remove(s.id)}
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
