import { useState } from 'react'
import { Clock, MapPin, ShieldCheck, Heart, Share2, AlertCircle, Image } from 'lucide-react'
import { HeroPerfil, StarRating, CTAButtons, ReviewsSection, MapaUbicacion } from '../../../modules/empresa/components/perfil-shared'

const tabs = ['Publicaciones', 'Ofertas', 'Reseñas', 'Preguntas', 'Ubicación', 'Documentos']

const products = [
  { id: 1, category: 'REPUESTOS MAQUINARIA', name: 'Neumático Michelin MachXBib...', price: 'US$ 2.450', image: '/farm-bg.png', badge: 'VERIFICADO' },
  { id: 2, category: 'FERTILIZANTES', name: 'Fertilizante NPK Nitrofosca 50kg', price: 'Us$ 85.00', image: '/bg-cafe.png', badge: null },
  { id: 3, category: 'TECNOLOGÍA AGRO', name: 'Drone DJI Agras T40 - Kit Completo', price: 'US$ 14.200', image: '/farm-bg.png', badge: 'PROMO' },
  { id: 4, category: 'SEMILLAS', name: 'Semillas Maíz Dekalb DK 72-10 VT3P', price: 'US$ 180.00', image: '/bg-cafe.png', badge: null },
]

const badgeColor: Record<string, string> = {
  VERIFICADO: 'bg-agrobot-100 text-agrobot-800',
  PROMO: 'bg-orange-100 text-orange-700',
}

export function TiendaPerfilPage() {
  const [activeTab, setActiveTab] = useState('Publicaciones')
  const [saved, setSaved] = useState(false)

  return (
    <div className="bg-white min-h-screen pb-12">

      {/* Hero banner */}
      <HeroPerfil height={240} />

      {/* Company card */}
      <div className="mx-auto max-w-5xl px-4">
        <div className="relative -mt-16 rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-agrobot-50 shadow-sm">
                <img src="/logoagro.svg" alt="logo" className="h-12 w-auto" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-xl font-bold text-gray-900">AgroServicios del Valle S.A.</h1>
                  <span className="rounded-full bg-agrobot-700 px-2.5 py-0.5 text-[10px] font-bold text-white">SELLO AGROMARKET</span>
                </div>
                <StarRating rating={4.8} reviews={1240} />
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="h-3 w-3" />Acarigua, Portuguesa, Venezuela
                </div>
              </div>
            </div>
            <CTAButtons cotizarLabel="Cotizar" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-4 mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Información del Vendedor</h3>
            <div className="flex flex-col gap-3">
              {[
                { Icon: Clock, label: 'Tiempo de respuesta', value: 'Menos de 2 horas' },
                { Icon: MapPin, label: 'Ubicación', value: 'Acarigua, Portuguesa' },
                { Icon: ShieldCheck, label: 'Experiencia', value: '12 años en TierraMarket' },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-agrobot-50">
                    <Icon className="h-3.5 w-3.5 text-agrobot-700" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">{label}</p>
                    <p className="text-xs font-semibold text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col gap-2">
            <button onClick={() => setSaved(v => !v)} className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-agrobot-700 transition-colors">
              <Heart className={`h-4 w-4 ${saved ? 'fill-red-400 text-red-400' : ''}`} />
              {saved ? 'Tienda guardada' : 'Guardar esta tienda'}
            </button>
            <button className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-agrobot-700 transition-colors">
              <Share2 className="h-4 w-4" />Compartir perfil
            </button>
            <button className="flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-600 transition-colors">
              <AlertCircle className="h-4 w-4" />Reportar vendedor
            </button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Galería del Establecimiento</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img src={i % 2 === 0 ? '/farm-bg.png' : '/bg-cafe.png'} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <button className="mt-2 flex items-center gap-1 text-xs font-semibold text-agrobot-700 hover:underline">
              <Image className="h-3.5 w-3.5" />Ver galería completa (+12)
            </button>
          </div>
        </aside>

        {/* Main */}
        <div>
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-5">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`shrink-0 px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-agrobot-600 text-agrobot-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'Publicaciones' && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {products.map(p => (
                <div key={p.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="relative h-36 overflow-hidden">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    {p.badge && <span className={`absolute top-2 left-2 rounded px-2 py-0.5 text-[10px] font-bold ${badgeColor[p.badge] ?? 'bg-gray-100 text-gray-700'}`}>{p.badge}</span>}
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-agrobot-700 mb-0.5">{p.category}</p>
                    <p className="text-xs font-bold text-gray-900 line-clamp-2">{p.name}</p>
                    <p className="mt-1.5 text-base font-bold text-agrobot-700">{p.price}</p>
                    <button className="mt-2 w-full rounded-lg border border-gray-200 py-1.5 text-xs font-semibold text-gray-700 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Reseñas' && <ReviewsSection />}
          {activeTab === 'Ubicación' && <MapaUbicacion lat={9.5545} lng={-69.1956} label="AgroServicios del Valle S.A." note="Por seguridad, se muestra la zona general." />}
          {['Ofertas', 'Preguntas', 'Documentos'].includes(activeTab) && (
            <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-sm text-gray-400">
              Sección <strong>{activeTab}</strong> — próximamente disponible.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
