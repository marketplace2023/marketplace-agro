import { useState } from 'react'
import { Clock, MapPin, HandshakeIcon, AlertCircle, BadgeCheck, Lightbulb } from 'lucide-react'
import { HeroPerfil, StarRating, ReviewsSection, MapaUbicacion, AccionesRow } from '../../../modules/empresa/components/perfil-shared'

const tabs = ['Cosechas Disponibles', 'Certificaciones', 'Reseñas', 'Ubicación', 'Galería']

const cosechas = [
  { id: 1, name: 'Maíz Amarillo Tradicional', price: '$210', unit: '/ Ton', stock: '450 Ton', description: 'Cosecha de temporada, secado natural al sol, ideal para forraje o molienda industrial.', image: '/farm-bg.png' },
  { id: 2, name: 'Soja Sustentable Certificada', price: '$340', unit: '/ Ton', stock: '120 Ton', description: 'Producción bajo normas RTRS, alta proteína. Entrega inmediata en zona núcleo.', image: '/bg-cafe.png' },
]

const certificaciones = [
  { label: 'GlobalG.A.P', sub: 'Buenas Prácticas Agrícolas', icon: '🌿' },
  { label: 'Orgánico', sub: 'Certificación USDA', icon: '🌱' },
]

export function ProductorPerfilPage() {
  const [activeTab, setActiveTab] = useState('Cosechas Disponibles')

  return (
    <div className="bg-gray-50 min-h-screen pb-12">

      <HeroPerfil bg="/bg-cafe.png" height={260} />

      <div className="mx-auto max-w-5xl px-4">
        {/* Company card */}
        <div className="relative -mt-20 overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-lg mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
                <img src="/bg-cafe.png" alt="productor" className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-xl font-bold text-gray-900">Establecimiento San Isidro</h1>
                  <span className="rounded-full bg-agrobot-100 px-2.5 py-0.5 text-[10px] font-bold text-agrobot-800">Verificado</span>
                </div>
                <StarRating rating={4.9} reviews={128} />
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="h-3 w-3" />Guanare, Portuguesa, Venezuela
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button className="flex items-center gap-2 rounded-xl bg-agrobot-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">
                WhatsApp
              </button>
              <button className="flex items-center gap-2 rounded-xl border border-agrobot-700 px-5 py-2.5 text-sm font-bold text-agrobot-700 hover:bg-agrobot-50 transition-colors">
                Solicitar Cotización
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 bg-white rounded-t-xl px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${activeTab === tab ? 'border-agrobot-600 text-agrobot-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">

          {/* Main */}
          <div>
            {activeTab === 'Cosechas Disponibles' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {cosechas.map(c => (
                  <div key={c.id} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <div className="relative h-44 overflow-hidden">
                      <img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-linear-to-t from-black/35 to-transparent" />
                      <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                        Stock: {c.stock}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-bold text-gray-900 text-sm">{c.name}</h3>
                      <p className="mt-1.5 text-xl font-bold text-agrobot-700">
                        {c.price} <span className="text-xs font-normal text-gray-500">{c.unit}</span>
                      </p>
                      <p className="mt-2 text-xs text-gray-500 leading-relaxed line-clamp-2">{c.description}</p>
                      <button className="mt-3 w-full rounded-xl bg-agrobot-700 py-2.5 text-xs font-bold text-white hover:bg-agrobot-800 transition-colors">
                        Ver Cosecha
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Certificaciones' && (
              <div>
                <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Certificaciones</h2>
                <div className="grid grid-cols-2 gap-3">
                  {certificaciones.map(cert => (
                    <div key={cert.label} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
                      <span className="text-2xl">{cert.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{cert.label}</p>
                        <p className="text-xs text-gray-500">{cert.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Reseñas' && <ReviewsSection title="Reseñas Recientes" />}
            {activeTab === 'Ubicación' && <MapaUbicacion lat={9.0437} lng={-69.7489} label="Establecimiento San Isidro" note="Por seguridad, solo se muestra la zona general del establecimiento." />}

            {activeTab === 'Galería' && (
              <div className="grid grid-cols-3 gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-xl">
                    <img src={i % 2 === 0 ? '/farm-bg.png' : '/bg-cafe.png'} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Información del Productor</p>
              {[
                { Icon: Clock, label: 'Tiempo de respuesta', value: 'Menos de 2 horas' },
                { Icon: BadgeCheck, label: 'Miembro desde', value: 'Agosto, 2021' },
                { Icon: HandshakeIcon, label: 'Tratos exitosos', value: '84 operaciones' },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2.5 mb-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-agrobot-50">
                    <Icon className="h-3.5 w-3.5 text-agrobot-700" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">{label}</p>
                    <p className="text-xs font-semibold text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
                <button className="w-full rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-600 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors">
                  Guardar Productor
                </button>
                <button className="flex items-center justify-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-600 transition-colors">
                  <AlertCircle className="h-3.5 w-3.5" />Reportar Perfil
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                <p className="text-xs font-bold text-amber-800">Tip TierraMarket</p>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">Utiliza nuestro sistema de depósitos en garantía para asegurar tus transacciones de gran volumen.</p>
            </div>

            <AccionesRow />
          </aside>
        </div>
      </div>
    </div>
  )
}
