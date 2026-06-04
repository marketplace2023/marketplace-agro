import { Link } from 'react-router'
import { PhoneCall, MessageCircle, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

type ContactChannel = 'whatsapp' | 'form'

interface ContactRecord {
  id: number; listingId: number; listingTitle: string; listingSlug: string
  storeName: string; storeSlug: string; channel: ContactChannel; date: string
}

const MOCK: ContactRecord[] = [
  { id: 1, listingId: 1, listingTitle: 'Maíz blanco seco primera calidad', listingSlug: 'maiz-blanco-seco-primera-calidad', storeName: 'Agro Portuguesa C.A.', storeSlug: 'agro-portuguesa', channel: 'whatsapp', date: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 2, listingId: 2, listingTitle: 'Tractor John Deere 5075E', listingSlug: 'tractor-john-deere-5075e', storeName: 'Maquinaria Lara', storeSlug: 'maquinaria-lara', channel: 'form', date: new Date(Date.now() - 5 * 86400000).toISOString() },
]

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function CompradorContactos() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Contactos realizados</h1>
        <p className="text-sm text-gray-500 mt-0.5">Historial de contactos con proveedores</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {MOCK.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <PhoneCall className="h-10 w-10 text-gray-300" />
            <p className="text-sm font-semibold text-gray-500">No has contactado proveedores aún</p>
            <Link to="/catalogo" className="mt-1 rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700 transition-colors">
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Publicación</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">{c.listingTitle}</p>
                  </TableCell>
                  <TableCell>
                    <Link to={`/tiendas/${c.storeSlug}`} className="text-sm text-sky-600 hover:underline">
                      {c.storeName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.channel === 'whatsapp' ? 'default' : 'secondary'} className="text-[10px] flex items-center gap-1 w-fit">
                      <MessageCircle className="h-3 w-3" />
                      {c.channel === 'whatsapp' ? 'WhatsApp' : 'Formulario'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-400">{formatDate(c.date)}</span>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/anuncios/${c.listingSlug}`}
                      target="_blank"
                      className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Ver anuncio
                    </Link>
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
