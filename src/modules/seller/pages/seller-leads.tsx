import { useState, useEffect } from 'react'
import { Users, Phone, Mail, Calendar, Zap, MessageSquare, Heart, Radio } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { axiosInstance } from '../../shared/lib/axios'

type LeadStatus = 'new' | 'contacted' | 'converted' | 'lost'
type LeadType   = 'whatsapp' | 'quote' | 'favorite' | 'contact_form' | 'radar'

interface Lead {
  id: number
  leadType: LeadType
  status: LeadStatus
  contactName: string | null
  contactEmail: string | null
  contactPhone: string | null
  listingId: number | null
  notes: string | null
  createdAt: string
}

const STATUS_COLOR: Record<LeadStatus, string> = {
  new:       'bg-blue-50 text-blue-700 border-blue-100',
  contacted: 'bg-agrobot-50 text-agrobot-700 border-agrobot-100',
  converted: 'bg-agrobot-100 text-agrobot-800 border-agrobot-200',
  lost:      'bg-gray-100 text-gray-500 border-gray-200',
}
const STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'Nuevo', contacted: 'Contactado', converted: 'Convertido', lost: 'Perdido',
}
const TYPE_ICON: Record<LeadType, React.ElementType> = {
  whatsapp:     Zap,
  quote:        MessageSquare,
  favorite:     Heart,
  contact_form: Mail,
  radar:        Radio,
}
const TYPE_LABEL: Record<LeadType, string> = {
  whatsapp:     'WhatsApp',
  quote:        'Cotización',
  favorite:     'Favorito',
  contact_form: 'Formulario',
  radar:        'Radar',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function SellerLeads() {
  const [leads,   setLeads]   = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosInstance.get<Lead[]>('/my/leads', { params: { limit: 50 } })
      .then(res => setLeads(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const newCount = leads.filter(l => l.status === 'new').length

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-400 mt-0.5">Oportunidades comerciales recibidas</p>
        </div>
        {newCount > 0 && (
          <span className="shrink-0 rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white">
            {newCount} nuevo{newCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-4">
          {(['new','contacted','converted','lost'] as LeadStatus[]).map((s) => (
            <div key={s} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium text-gray-500">{STATUS_LABEL[s]}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{leads.filter(l => l.status === s).length}</p>
            </div>
          ))}
        </div>
      )}

      {/* Leads list */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-gray-200">
          <Users className="h-10 w-10 text-gray-200 mb-3" />
          <p className="text-sm font-semibold text-gray-400">Sin leads aún</p>
          <p className="text-xs text-gray-400 mt-1">Los leads aparecen cuando alguien contacta o guarda tus publicaciones</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {leads.map((lead) => {
            const TypeIcon = TYPE_ICON[lead.leadType]
            const name = lead.contactName || `Lead #${lead.id}`
            const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

            return (
              <div key={lead.id} className={cn(
                'rounded-xl border bg-white p-4 hover:shadow-sm transition-shadow',
                lead.status === 'new' ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-200'
              )}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 font-bold text-gray-600 text-sm">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <TypeIcon className="h-3 w-3 text-agrobot-500" />
                        <span className="text-xs text-agrobot-700 font-medium">{TYPE_LABEL[lead.leadType]}</span>
                        {lead.listingId && (
                          <span className="text-xs text-gray-400">· pub. #{lead.listingId}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={cn('shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold', STATUS_COLOR[lead.status])}>
                    {STATUS_LABEL[lead.status]}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-2.5">
                  {lead.contactEmail && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Mail className="h-3 w-3" />{lead.contactEmail}
                    </span>
                  )}
                  {lead.contactPhone && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Phone className="h-3 w-3" />{lead.contactPhone}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
                    <Calendar className="h-3 w-3" />{fmtDate(lead.createdAt)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
