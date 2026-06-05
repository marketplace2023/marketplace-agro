import { useState } from 'react'
import { Link } from 'react-router'
import { Heart, Trash2, GitCompare, FileText, Package, Store } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

interface FavListing {
  id: number; title: string; price: string | null; priceUnit: string | null
  department: string | null; categoryName: string; slug: string; storeIsVerified: boolean
}
interface FavStore {
  id: number; name: string; slug: string; roleType: string | null; department: string | null; isVerified: boolean
}

const MOCK_LISTINGS: FavListing[] = [
  { id: 1, title: 'Maíz blanco seco primera calidad', price: '45', priceUnit: 'ton', department: 'Portuguesa', categoryName: 'Granos', slug: 'maiz-blanco-seco-primera-calidad', storeIsVerified: true },
  { id: 2, title: 'Tractor John Deere 5075E 2022', price: '28000', priceUnit: null, department: 'Lara', categoryName: 'Maquinaria', slug: 'tractor-john-deere-5075e', storeIsVerified: false },
]
const MOCK_STORES: FavStore[] = [
  { id: 1, name: 'Agro Portuguesa C.A.', slug: 'agro-portuguesa', roleType: 'producer', department: 'Portuguesa', isVerified: true },
]

export function CompradorFavoritos() {
  const [listings, setListings] = useState<FavListing[]>(MOCK_LISTINGS)
  const [stores, setStores] = useState<FavStore[]>(MOCK_STORES)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Mis Favoritos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Publicaciones y tiendas que guardaste</p>
      </div>

      <Tabs defaultValue="publicaciones">
        <TabsList>
          <TabsTrigger value="publicaciones" className="flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" /> Publicaciones
            {listings.length > 0 && <span className="ml-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold">{listings.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="tiendas" className="flex items-center gap-1.5">
            <Store className="h-3.5 w-3.5" /> Tiendas
            {stores.length > 0 && <span className="ml-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold">{stores.length}</span>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="publicaciones" className="mt-4">
          {listings.length === 0 ? (
            <EmptyFavs label="publicaciones" to="/catalogo" />
          ) : (
            <div className="flex flex-col gap-3">
              {listings.map((l) => (
                <div key={l.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant="outline" className="text-[10px]">{l.categoryName}</Badge>
                      {l.storeIsVerified && <Badge className="bg-agrobot-700 text-white text-[10px]">Verificado</Badge>}
                    </div>
                    <p className="text-sm font-semibold text-gray-900 truncate">{l.title}</p>
                    <p className="text-xs text-gray-400">
                      {l.price ? `$${l.price}${l.priceUnit ? ' / ' + l.priceUnit : ''}` : 'A consultar'}
                      {l.department ? ` · ${l.department}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 ml-3 shrink-0">
                    <Link
                      to={`/anuncios/${l.slug}`}
                      className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5" /> Cotizar
                    </Link>
                    <button
                      title="Comparar"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-violet-400 hover:text-violet-600 transition-colors"
                    >
                      <GitCompare className="h-3.5 w-3.5" />
                    </button>
                    <button
                      title="Eliminar de favoritos"
                      onClick={() => setListings((p) => p.filter((x) => x.id !== l.id))}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tiendas" className="mt-4">
          {stores.length === 0 ? (
            <EmptyFavs label="tiendas" to="/catalogo" />
          ) : (
            <div className="flex flex-col gap-3">
              {stores.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-agrobot-100">
                      <span className="text-sm font-bold text-agrobot-700">{s.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                        {s.isVerified && <Badge className="bg-agrobot-700 text-white text-[10px]">Verificado</Badge>}
                      </div>
                      <p className="text-xs text-gray-400">{[s.roleType, s.department].filter(Boolean).join(' · ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-3 shrink-0">
                    <Link
                      to={`/tiendas/${s.slug}`}
                      className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors"
                    >
                      Ver tienda
                    </Link>
                    <button
                      onClick={() => setStores((p) => p.filter((x) => x.id !== s.id))}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyFavs({ label, to }: { label: string; to: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 rounded-xl border border-dashed border-gray-200 text-center">
      <Heart className="h-10 w-10 text-gray-300" />
      <p className="text-sm font-semibold text-gray-500">No tienes {label} guardadas</p>
      <Link to={to} className="mt-1 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white hover:bg-agrobot-700 transition-colors">
        Explorar catálogo
      </Link>
    </div>
  )
}
