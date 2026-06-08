import { useState, useEffect } from 'react'
import { Star, MessageSquare } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyStoreQuery } from '../queries/seller-queries'
import { axiosInstance } from '../../shared/lib/axios'

interface Review {
  id: number
  userId: number
  rating: number
  comment: string | null
  ownerReply: string | null
  isVerified: boolean
  createdAt: string
}

interface StoreRating {
  average: number
  total: number
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
}

function Stars({ value, size = 'sm' }: { value: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5'
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${cls} ${i < Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  )
}

export function SellerReputation() {
  const { data: store } = useMyStoreQuery()

  const [reviews, setReviews]   = useState<Review[]>([])
  const [rating,  setRating]    = useState<StoreRating | null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!store?.slug) return
    setLoading(true)
    Promise.all([
      axiosInstance.get<Review[]>(`/stores/${store.slug}/reviews`),
      axiosInstance.get<{ rating: StoreRating }>(`/stores/${store.slug}`),
    ])
      .then(([revRes, storeRes]) => {
        setReviews(revRes.data)
        setRating(storeRes.data.rating)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [store?.slug])

  const avg = rating?.average ?? 0
  const total = rating?.total ?? 0

  const dist = [5, 4, 3, 2, 1].map(n => ({
    stars: n,
    count: reviews.filter(r => r.rating === n).length,
    pct:   total > 0 ? Math.round((reviews.filter(r => r.rating === n).length / total) * 100) : 0,
  }))

  if (!store) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Reputación</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-gray-200">
          <Star className="h-10 w-10 text-gray-200 mb-3" />
          <p className="text-sm font-semibold text-gray-400">Crea tu tienda para ver tu reputación</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">

      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Reputación</h1>
        <p className="text-sm text-gray-400 mt-0.5">Reseñas y calificación de tus compradores</p>
      </div>

      {/* Overview */}
      {loading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="lg:col-span-2 h-40 rounded-xl" />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">

          {/* Score */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col items-center justify-center text-center">
            <p className="text-6xl font-black text-gray-900">{avg > 0 ? avg.toFixed(1) : '—'}</p>
            <Stars value={avg} size="lg" />
            <p className="mt-2 text-xs text-gray-400">{total} reseña{total !== 1 ? 's' : ''}</p>
          </div>

          {/* Distribution */}
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Distribución de calificaciones</h2>
            {total === 0 ? (
              <div className="flex h-24 items-center justify-center">
                <p className="text-xs text-gray-400">Sin calificaciones aún</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {dist.map((d) => (
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
            )}
          </div>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1,2].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-gray-200">
          <MessageSquare className="h-10 w-10 text-gray-200 mb-3" />
          <p className="text-sm font-semibold text-gray-400">Sin reseñas aún</p>
          <p className="text-xs text-gray-400 mt-1">Las reseñas aparecen cuando compradores califican tu tienda</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600">
                    U
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Usuario #{r.userId}</p>
                    {r.isVerified && (
                      <p className="text-[10px] text-agrobot-600 font-semibold">Compra verificada</p>
                    )}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <Stars value={r.rating} />
                  <p className="mt-0.5 text-[10px] text-gray-400">{fmtDate(r.createdAt)}</p>
                </div>
              </div>
              {r.comment && (
                <p className="flex items-start gap-1.5 text-sm text-gray-700">
                  <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gray-300" />
                  {r.comment}
                </p>
              )}
              {r.ownerReply && (
                <div className="mt-3 rounded-lg bg-agrobot-50 border border-agrobot-100 px-3 py-2">
                  <p className="text-[11px] font-semibold text-agrobot-700 mb-0.5">Tu respuesta</p>
                  <p className="text-xs text-agrobot-800">{r.ownerReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
