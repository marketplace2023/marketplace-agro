import { Phone, MessageCircle, Download } from 'lucide-react'

type LeadStatus = 'nuevo' | 'contactado' | 'negociacion' | 'cerrado'

interface Lead {
  id: number; nombre: string; interes: string; cultivo: string
  status: LeadStatus; fecha: string; contacto: string; ubicacion: string
}

const MOCK_LEADS: Lead[] = [
  { id: 1, nombre: 'María González',  interes: 'Compra de maíz amarillo duro',       cultivo: 'Maíz',     status: 'nuevo',       fecha: '2026-06-04', contacto: '+58 414 555 1122', ubicacion: 'Caracas' },
  { id: 2, nombre: 'Pedro Ramírez',   interes: 'Cotización cacao exportación',        cultivo: 'Cacao',    status: 'negociacion', fecha: '2026-06-01', contacto: '+58 412 888 9977', ubicacion: 'Valencia' },
  { id: 3, nombre: 'Distribuidora X', interes: 'Compra mensual plátano hartón 5 ton', cultivo: 'Plátano',  status: 'contactado',  fecha: '2026-05-29', contacto: '+58 426 100 0203', ubicacion: 'Maracay' },
  { id: 4, nombre: 'Expo Granos C.A.', interes: 'Sorgo granífero para exportación',  cultivo: 'Sorgo',    status: 'cerrado',     fecha: '2026-05-15', contacto: '+58 424 300 4455', ubicacion: 'Puerto Ordaz' },
  { id: 5, nombre: 'Carlos Herrera',  interes: 'Tomate larga vida 2 ton/semana',      cultivo: 'Tomate',   status: 'nuevo',       fecha: '2026-06-05', contacto: '+58 412 200 3344', ubicacion: 'Barquisimeto' },
]

const STATUS_COLORS: Record<LeadStatus, string> = {
  nuevo:       'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  contactado:  'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  negociacion: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  cerrado:     'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  nuevo:       'Nuevo',
  contactado:  'Contactado',
  negociacion: 'En negociación',
  cerrado:     'Cerrado',
}

const STAT_TILES = [
  { label: 'Nuevos',          key: 'nuevo',       color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
  { label: 'Contactados',     key: 'contactado',  color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200' },
  { label: 'En negociación',  key: 'negociacion', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
  { label: 'Cerrados',        key: 'cerrado',     color: 'text-gray-600',   bg: 'bg-gray-50 border-gray-200' },
]

export function ProducerLeads() {
  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Leads recibidos</h1>
          <p className="text-sm text-gray-400 mt-0.5">Interesados generados por tus publicaciones y WhatsApp</p>
        </div>
        <button disabled className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-400 opacity-50 cursor-not-allowed">
          <Download className="h-4 w-4" /> Exportar
        </button>
      </div>

      {/* Stat tiles */}
      <div className="grid gap-3 sm:grid-cols-4">
        {STAT_TILES.map((s) => (
          <div key={s.key} className={`rounded-xl border p-4 text-center ${s.bg}`}>
            <p className={`text-2xl font-black ${s.color}`}>
              {MOCK_LEADS.filter(l => l.status === s.key).length}
            </p>
            <p className="mt-0.5 text-xs text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Lead cards */}
      <div className="flex flex-col gap-3">
        {MOCK_LEADS.map((lead) => (
          <div
            key={lead.id}
            className={`rounded-xl border bg-white p-5 ${
              lead.status === 'nuevo' ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-600">
                  {lead.nombre.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900">{lead.nombre}</p>
                    {lead.status === 'nuevo' && (
                      <span className="rounded-full bg-blue-600 px-1.5 py-px text-[9px] font-bold text-white uppercase tracking-wide">Nuevo</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{lead.ubicacion} · {lead.fecha}</p>
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_COLORS[lead.status]}`}>
                {STATUS_LABELS[lead.status]}
              </span>
            </div>

            <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2">
              <p className="text-xs font-semibold text-gray-500 mb-0.5">Interés</p>
              <p className="text-sm text-gray-700">{lead.interes}</p>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span className="rounded-full bg-agrobot-50 px-2 py-0.5 text-[11px] font-semibold text-agrobot-700">
                  {lead.cultivo}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button disabled className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 cursor-not-allowed opacity-60">
                  <Phone className="h-3 w-3" /> {lead.contacto}
                </button>
                <button disabled className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 cursor-not-allowed opacity-60">
                  <MessageCircle className="h-3 w-3" /> WhatsApp
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400">Gestión de leads en tiempo real disponible próximamente. Datos de muestra.</p>
    </div>
  )
}
