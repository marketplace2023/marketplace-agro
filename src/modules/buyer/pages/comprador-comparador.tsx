import { useState } from 'react'
import { Link } from 'react-router'
import { GitCompare, Trash2, FileText, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface SavedComparison {
  id: number
  name: string
  items: { id: number; title: string; price: string | null; slug: string }[]
  createdAt: string
}

const MOCK: SavedComparison[] = [
  {
    id: 1,
    name: 'Tractores Lara vs Portuguesa',
    items: [
      { id: 1, title: 'Tractor John Deere 5075E', price: '28000', slug: 'tractor-john-deere-5075e' },
      { id: 2, title: 'Tractor New Holland T5.100', price: '31000', slug: 'tractor-new-holland-t5' },
    ],
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
]

export function CompradorComparador() {
  const [comparisons, setComparisons] = useState<SavedComparison[]>(MOCK)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Comparador guardado</h1>
        <p className="text-sm text-gray-500 mt-0.5">Comparaciones de publicaciones que guardaste</p>
      </div>

      {comparisons.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 rounded-xl border border-dashed border-gray-200 text-center">
          <GitCompare className="h-10 w-10 text-gray-300" />
          <p className="text-sm font-semibold text-gray-500">No tienes comparaciones guardadas</p>
          <Link to="/catalogo" className="mt-1 rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700 transition-colors">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {comparisons.map((c) => (
            <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">{c.name}</h2>
                  <p className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString('es-VE')} · {c.items.length} ítems
                  </p>
                </div>
                <button
                  onClick={() => setComparisons((p) => p.filter((x) => x.id !== c.id))}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Eliminar
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-500 pb-2">Publicación</th>
                      <th className="text-right text-xs font-semibold text-gray-500 pb-2">Precio</th>
                      <th className="text-right text-xs font-semibold text-gray-500 pb-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {c.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 pr-4">
                          <p className="font-medium text-gray-900">{item.title}</p>
                        </td>
                        <td className="py-2.5 text-right">
                          {item.price
                            ? <span className="font-bold text-gray-900">${item.price}</span>
                            : <Badge variant="outline" className="text-[10px]">A consultar</Badge>}
                        </td>
                        <td className="py-2.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link to={`/anuncios/${item.slug}`} target="_blank"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-sky-400 hover:text-sky-600 transition-colors">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                            <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors">
                              <FileText className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
