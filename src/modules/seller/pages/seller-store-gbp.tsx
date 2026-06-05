import { Link } from 'react-router'
import { MapPin, Clock, Globe, Image, Star, ExternalLink, CheckCircle2 } from 'lucide-react'
import { useMyStoreQuery } from '../queries/seller-queries'

const HOURS = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']

export function SellerStoreGbp() {
  const { data: store } = useMyStoreQuery()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Tienda & Presencia Local</h1>
        <p className="text-sm text-gray-400 mt-0.5">Configura tu perfil público, horarios, fotos y SEO local</p>
      </div>

      {/* Completion progress */}
      <div className="rounded-xl border border-agrobot-200 bg-agrobot-50/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-agrobot-800">Perfil completado</p>
          <span className="text-sm font-bold text-agrobot-700">35%</span>
        </div>
        <div className="h-2 rounded-full bg-agrobot-100 overflow-hidden">
          <div className="h-full w-[35%] rounded-full bg-agrobot-600 transition-all" />
        </div>
        <p className="mt-2 text-xs text-agrobot-600">Completa tu perfil para aparecer mejor en los resultados de búsqueda.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">

        {/* Business info */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-agrobot-600" />
              <p className="text-sm font-bold text-gray-900">Información del negocio</p>
            </div>
            {store?.name && <CheckCircle2 className="h-4 w-4 text-agrobot-500" />}
          </div>
          <div className="space-y-3">
            <InfoRow label="Nombre" value={store?.name ?? '—'} />
            <InfoRow label="Descripción" value={store?.description ?? 'No configurada'} />
            <InfoRow label="Ubicación" value={[store?.municipality, store?.department].filter(Boolean).join(', ') || 'No configurada'} />
            <InfoRow label="URL pública" value={store?.slug ? `/tiendas/${store.slug}` : '—'} mono />
          </div>
          {store?.slug && (
            <Link to={`/tiendas/${store.slug}`} target="_blank" className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-agrobot-600 hover:underline">
              <ExternalLink className="h-3 w-3" /> Ver perfil público
            </Link>
          )}
        </div>

        {/* Business hours */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-agrobot-600" />
            <p className="text-sm font-bold text-gray-900">Horario de atención</p>
          </div>
          <div className="space-y-2">
            {HOURS.map((day) => (
              <div key={day} className="flex items-center justify-between">
                <span className="w-10 text-xs font-semibold text-gray-500">{day}</span>
                <span className="flex-1 text-xs text-gray-400 text-right">No configurado</span>
              </div>
            ))}
          </div>
          <button disabled className="mt-4 w-full rounded-lg border border-dashed border-gray-200 py-2 text-xs font-medium text-gray-400 cursor-not-allowed">
            Configurar horarios (próximamente)
          </button>
        </div>

        {/* Photos */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <Image className="h-4 w-4 text-agrobot-600" />
            <p className="text-sm font-bold text-gray-900">Galería de fotos</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                <Image className="h-5 w-5 text-gray-300" />
              </div>
            ))}
          </div>
          <button disabled className="mt-4 w-full rounded-lg border border-dashed border-gray-200 py-2 text-xs font-medium text-gray-400 cursor-not-allowed">
            Subir fotos (próximamente)
          </button>
        </div>

        {/* SEO & Social */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-agrobot-600" />
            <p className="text-sm font-bold text-gray-900">SEO y redes sociales</p>
          </div>
          <div className="space-y-3">
            <SeoField label="Meta descripción" placeholder="Describe tu negocio en 160 caracteres..." />
            <SeoField label="Palabras clave" placeholder="maíz, insumos, agricultor..." />
            <SeoField label="Instagram" placeholder="@tu_perfil" />
            <SeoField label="Facebook" placeholder="facebook.com/tu-pagina" />
            <SeoField label="WhatsApp" placeholder="+58 412 000 0000" />
          </div>
          <button disabled className="mt-4 w-full rounded-lg bg-agrobot-600 py-2 text-xs font-bold text-white opacity-50 cursor-not-allowed">
            Guardar SEO (próximamente)
          </button>
        </div>

      </div>

      {/* Rating preview */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-4 w-4 text-amber-500" />
          <p className="text-sm font-bold text-gray-900">Vista previa de perfil en búsquedas</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-agrobot-100">
              <span className="text-sm font-bold text-agrobot-700">{store?.name?.slice(0,2).toUpperCase() ?? 'AG'}</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{store?.name ?? 'Tu tienda'}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                ))}
                <span className="text-[11px] text-gray-400 ml-1">4.0 · 0 reseñas</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{[store?.municipality, store?.department].filter(Boolean).join(', ') || 'Venezuela'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-gray-400 shrink-0">{label}</span>
      <span className={`text-xs font-medium text-gray-700 text-right truncate ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}

function SeoField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</label>
      <input disabled type="text" placeholder={placeholder} className="mt-1 h-8 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-600 placeholder:text-gray-300 cursor-not-allowed opacity-70" />
    </div>
  )
}
