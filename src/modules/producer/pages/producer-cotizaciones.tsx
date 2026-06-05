import { MessageSquare, Download, Clock, CheckCircle, XCircle, Send } from 'lucide-react'

type QuoteStatus = 'nueva' | 'respondida' | 'aceptada' | 'rechazada' | 'expirada'

interface Quote {
  id: number; buyer: string; producto: string; cantidad: string
  status: QuoteStatus; fecha: string; mensaje: string; monto?: string
}

const MOCK_QUOTES: Quote[] = [
  { id: 1, buyer: 'María González',   producto: 'Maíz amarillo duro', cantidad: '20 ton', status: 'nueva',      fecha: '2026-06-04', mensaje: 'Buenos días, ¿tienen disponibilidad de 20 toneladas para esta semana? ¿Cuál es el precio por tonelada incluyendo flete a Caracas?' },
  { id: 2, buyer: 'Expo Granos C.A.', producto: 'Cacao fermentado',   cantidad: '5 ton',  status: 'respondida', fecha: '2026-06-01', mensaje: 'Estamos interesados en cacao criollo para exportación. Necesitamos certificados fitosanitarios.',  monto: '$6,000' },
  { id: 3, buyer: 'Luis Castillo',    producto: 'Sorgo granífero',    cantidad: '50 ton', status: 'aceptada',   fecha: '2026-05-28', mensaje: 'Compra corporativa para alimento animal. Requiero factura y guía de movilización.',              monto: '$4,500' },
  { id: 4, buyer: 'Distribuidora XL', producto: 'Plátano hartón',     cantidad: '3 ton',  status: 'rechazada',  fecha: '2026-05-20', mensaje: 'Precio por encima del presupuesto. No aceptamos el flete mínimo propuesto.' },
  { id: 5, buyer: 'Carmen Ortega',    producto: 'Tomate larga vida',  cantidad: '1 ton',  status: 'nueva',      fecha: '2026-06-05', mensaje: '¿Hacen entregas en Maracay? Necesito cotización semanal recurrente.' },
]

const STATUS_META: Record<QuoteStatus, { label: string; color: string; icon: React.ElementType }> = {
  nueva:      { label: 'Nueva',       color: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',   icon: Clock },
  respondida: { label: 'Respondida',  color: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', icon: Send },
  aceptada:   { label: 'Aceptada',    color: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', icon: CheckCircle },
  rechazada:  { label: 'Rechazada',   color: 'bg-red-50 text-red-600 ring-1 ring-red-200',      icon: XCircle },
  expirada:   { label: 'Expirada',    color: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',  icon: Clock },
}

const FILTER_TABS: QuoteStatus[] = ['nueva', 'respondida', 'aceptada', 'rechazada']

export function ProducerCotizaciones() {
  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Cotizaciones recibidas</h1>
          <p className="text-sm text-gray-400 mt-0.5">Responde solicitudes de compra y negociación</p>
        </div>
        <button disabled className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-400 opacity-50 cursor-not-allowed">
          <Download className="h-4 w-4" /> Exportar
        </button>
      </div>

      {/* Summary row */}
      <div className="grid gap-3 sm:grid-cols-4">
        {FILTER_TABS.map((key) => {
          const meta = STATUS_META[key]
          const count = MOCK_QUOTES.filter(q => q.status === key).length
          return (
            <div key={key} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <p className="text-2xl font-black text-gray-900">{count}</p>
              <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.color}`}>
                {meta.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2">
        <button className="rounded-full bg-agrobot-600 px-3 py-1 text-xs font-semibold text-white">Todas</button>
        {FILTER_TABS.map((key) => (
          <button key={key} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200 capitalize transition-colors">
            {STATUS_META[key].label}
          </button>
        ))}
      </div>

      {/* Quote cards */}
      <div className="flex flex-col gap-3">
        {MOCK_QUOTES.map((q) => {
          const meta = STATUS_META[q.status]
          const StatusIcon = meta.icon
          return (
            <div
              key={q.id}
              className={`rounded-xl border bg-white p-5 ${
                q.status === 'nueva' ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-700">
                    {q.buyer.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">{q.buyer}</p>
                      {q.status === 'nueva' && (
                        <span className="rounded-full bg-blue-600 px-1.5 py-px text-[9px] font-bold text-white uppercase">Nueva</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{q.fecha}</p>
                  </div>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${meta.color}`}>
                  <StatusIcon className="h-3 w-3" />
                  {meta.label}
                </span>
              </div>

              <div className="mb-3 flex items-center gap-3">
                <span className="rounded-full bg-agrobot-50 px-2.5 py-0.5 text-[11px] font-semibold text-agrobot-700">
                  {q.producto}
                </span>
                <span className="text-xs text-gray-500">· {q.cantidad}</span>
                {q.monto && (
                  <span className="ml-auto text-sm font-bold text-gray-800">{q.monto}</span>
                )}
              </div>

              <div className="rounded-lg bg-gray-50 px-3 py-2 mb-3">
                <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> Mensaje del comprador
                </p>
                <p className="text-sm text-gray-700 leading-snug">{q.mensaje}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button disabled className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 cursor-not-allowed opacity-60">
                  Ver detalle
                </button>
                {q.status === 'nueva' && (
                  <button disabled className="flex items-center gap-1.5 rounded-lg bg-agrobot-600 px-3 py-1.5 text-xs font-bold text-white cursor-not-allowed opacity-60">
                    <Send className="h-3 w-3" /> Responder
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-center text-xs text-gray-400">Respuestas en tiempo real disponibles próximamente. Datos de muestra.</p>
    </div>
  )
}
