import { Star, ThumbsUp, MessageSquare } from 'lucide-react'

const MOCK_REVIEWS = [
  { id: 1, buyer: 'Carlos M.', rating: 5, comment: 'Excelente producto, muy buena calidad y entrega rápida. Recomendado 100%.', date: '2026-05-28', product: 'Maíz blanco' },
  { id: 2, buyer: 'Ana T.',    rating: 4, comment: 'Buen servicio, el producto llegó en buen estado. Un pequeño retraso en la entrega.', date: '2026-05-15', product: 'Fertilizante NPK' },
  { id: 3, buyer: 'José R.',   rating: 5, comment: 'Muy profesional, respondió todas las dudas antes de la compra. Volveré a comprar.', date: '2026-04-30', product: 'Asesoría técnica' },
]

const AVG = (MOCK_REVIEWS.reduce((s, r) => s + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1)

const DIST = [5, 4, 3, 2, 1].map(n => ({
  stars: n,
  count: MOCK_REVIEWS.filter(r => r.rating === n).length,
  pct: Math.round((MOCK_REVIEWS.filter(r => r.rating === n).length / MOCK_REVIEWS.length) * 100),
}))

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
}

function Stars({ value, size = 'sm' }: { value: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5'
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${cls} ${i < value ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  )
}

export function SellerReputation() {
  return (
    <div className="flex flex-col gap-6">

      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Reputación</h1>
        <p className="text-sm text-gray-400 mt-0.5">Reseñas y calificación de tus compradores</p>
      </div>

      {/* Overview */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Score */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col items-center justify-center text-center">
          <p className="text-6xl font-black text-gray-900">{AVG}</p>
          <Stars value={Math.round(parseFloat(AVG))} size="lg" />
          <p className="mt-2 text-xs text-gray-400">{MOCK_REVIEWS.length} reseña{MOCK_REVIEWS.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Distribution */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Distribución de calificaciones</h2>
          <div className="space-y-2.5">
            {DIST.map((d) => (
              <div key={d.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-0.5 shrink-0 w-16">
                  <span className="text-xs text-gray-500 font-medium">{d.stars}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 shrink-0 w-8 text-right">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="flex flex-col gap-3">
        {MOCK_REVIEWS.map((r) => (
          <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600">
                  {r.buyer.split(' ')[0][0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{r.buyer}</p>
                  <p className="text-xs text-gray-400">{r.product}</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <Stars value={r.rating} />
                <p className="mt-0.5 text-[10px] text-gray-400">{fmtDate(r.date)}</p>
              </div>
            </div>
            <p className="flex items-start gap-1.5 text-sm text-gray-700">
              <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gray-300" />
              {r.comment}
            </p>
            <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-2.5">
              <button disabled className="flex items-center gap-1 text-xs text-gray-400 cursor-not-allowed">
                <ThumbsUp className="h-3 w-3" /> Responder (próximamente)
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400">Las reseñas en tiempo real estarán disponibles próximamente. Datos de muestra.</p>
    </div>
  )
}
