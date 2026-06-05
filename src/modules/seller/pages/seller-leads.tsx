import { Users, Phone, Mail, Calendar, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'closed' | 'lost'

const STATUS_COLOR: Record<LeadStatus, string> = {
  new:         'bg-blue-50 text-blue-700 border-blue-100',
  contacted:   'bg-agrobot-50 text-agrobot-700 border-agrobot-100',
  negotiating: 'bg-amber-50 text-amber-700 border-amber-100',
  closed:      'bg-agrobot-100 text-agrobot-800 border-agrobot-200',
  lost:        'bg-gray-100 text-gray-500 border-gray-200',
}
const STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'Nuevo', contacted: 'Contactado', negotiating: 'En negociación', closed: 'Cerrado', lost: 'Perdido',
}

const MOCK_LEADS = [
  { id: 1, name: 'Carlos Mendoza', email: 'carlos@finca.com', phone: '+58 412 111 2233', interest: 'Maíz blanco x 500 kg', status: 'new' as LeadStatus, date: '2026-06-01' },
  { id: 2, name: 'Ana Torres',     email: 'ana.torres@gmail.com', phone: '+58 414 555 6677', interest: 'Fertilizante NPK 20-20-20', status: 'contacted' as LeadStatus, date: '2026-05-28' },
  { id: 3, name: 'José Ramírez',   email: 'jose@agro.ve', phone: '+58 416 222 3344', interest: 'Servicio de asesoría técnica', status: 'negotiating' as LeadStatus, date: '2026-05-22' },
  { id: 4, name: 'María Silva',    email: 'msilva@coop.com', phone: '+58 424 888 9900', interest: 'Tomate industrial x 2 ton', status: 'closed' as LeadStatus, date: '2026-05-15' },
]

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function SellerLeads() {
  const newLeads = MOCK_LEADS.filter(l => l.status === 'new').length

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-400 mt-0.5">Oportunidades comerciales recibidas</p>
        </div>
        {newLeads > 0 && (
          <span className="shrink-0 rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white">
            {newLeads} nuevo{newLeads !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        {(['new','contacted','negotiating','closed'] as LeadStatus[]).map((s) => (
          <div key={s} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium text-gray-500">{STATUS_LABEL[s]}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{MOCK_LEADS.filter(l => l.status === s).length}</p>
          </div>
        ))}
      </div>

      {/* Leads list */}
      <div className="flex flex-col gap-3">
        {MOCK_LEADS.map((lead) => (
          <div key={lead.id} className={cn(
            'rounded-xl border bg-white p-4 hover:shadow-sm transition-shadow',
            lead.status === 'new' ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-200'
          )}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 font-bold text-gray-600">
                  {lead.name.split(' ').map(w => w[0]).slice(0,2).join('')}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{lead.name}</p>
                  <p className="text-xs text-agrobot-700 font-medium truncate">{lead.interest}</p>
                </div>
              </div>
              <span className={cn('shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold', STATUS_COLOR[lead.status])}>
                {STATUS_LABEL[lead.status]}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-2.5">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Mail className="h-3 w-3" />{lead.email}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Phone className="h-3 w-3" />{lead.phone}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
                <Calendar className="h-3 w-3" />{fmtDate(lead.date)}
              </span>
              <button disabled className="flex items-center gap-1 text-xs font-semibold text-agrobot-600 opacity-50 cursor-not-allowed">
                Gestionar <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400">La gestión completa de leads estará disponible próximamente. Datos de muestra.</p>
    </div>
  )
}
