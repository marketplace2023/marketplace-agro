import { useState } from 'react'
import { Bell, CheckCheck, Trash2, Radar, FileText, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type NotifType = 'quote_response' | 'radar_match' | 'price_change' | 'system'

interface Notif {
  id: number; type: NotifType; title: string; body: string; read: boolean; createdAt: string
}

const TYPE_ICON: Record<NotifType, React.ElementType> = {
  quote_response: FileText,
  radar_match: Radar,
  price_change: Tag,
  system: Bell,
}
const TYPE_COLOR: Record<NotifType, string> = {
  quote_response: 'bg-agrobot-50 text-agrobot-700',
  radar_match: 'bg-sky-50 text-sky-700',
  price_change: 'bg-amber-50 text-amber-600',
  system: 'bg-gray-100 text-gray-500',
}

const MOCK: Notif[] = [
  { id: 1, type: 'quote_response', title: 'Respuesta a tu cotización', body: 'Agro Portuguesa C.A. respondió tu cotización #3 con una oferta de $45/ton.', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, type: 'radar_match', title: 'Nueva coincidencia en Radar', body: '3 nuevas publicaciones de maíz blanco en Portuguesa coinciden con tu alerta.', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, type: 'price_change', title: 'Cambio de precio detectado', body: 'El anuncio "Tractor JD 5075E" bajó su precio un 5%.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 4, type: 'system', title: 'Bienvenido a AgroMarket', body: 'Completa tu perfil para recibir mejores recomendaciones.', read: true, createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
]

function formatAgo(d: string) {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (mins < 60) return `hace ${mins} min`
  if (mins < 1440) return `hace ${Math.floor(mins / 60)}h`
  return `hace ${Math.floor(mins / 1440)}d`
}

export function CompradorNotificaciones() {
  const [notifs, setNotifs] = useState<Notif[]>(MOCK)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifs.filter((n) => !n.read).length
  const visible = filter === 'unread' ? notifs.filter((n) => !n.read) : notifs

  function markAllRead() {
    setNotifs((n) => n.map((x) => ({ ...x, read: true })))
  }

  function markRead(id: number) {
    setNotifs((n) => n.map((x) => x.id === id ? { ...x, read: true } : x))
  }

  function remove(id: number) {
    setNotifs((n) => n.filter((x) => x.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo leído'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:underline">
            <CheckCheck className="h-4 w-4" /> Marcar todo como leído
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {(['all', 'unread'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              filter === f ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-500'
            }`}>
            {f === 'all' ? 'Todas' : `Sin leer (${unreadCount})`}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 rounded-xl border border-dashed border-gray-200 text-center">
            <Bell className="h-10 w-10 text-gray-300" />
            <p className="text-sm font-semibold text-gray-500">Sin notificaciones</p>
          </div>
        ) : visible.map((n) => {
          const Icon = TYPE_ICON[n.type]
          return (
            <div key={n.id}
              className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${
                n.read ? 'border-gray-200 bg-white' : 'border-sky-200 bg-sky-50/60'
              }`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${TYPE_COLOR[n.type]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-sm font-semibold ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                  {!n.read && <Badge className="bg-sky-600 text-white text-[10px]">Nueva</Badge>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                <p className="text-[10px] text-gray-400 mt-1">{formatAgo(n.createdAt)}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!n.read && (
                  <button title="Marcar como leída" onClick={() => markRead(n.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-sky-400 hover:text-sky-600 transition-colors">
                    <CheckCheck className="h-3.5 w-3.5" />
                  </button>
                )}
                <button title="Eliminar" onClick={() => remove(n.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
