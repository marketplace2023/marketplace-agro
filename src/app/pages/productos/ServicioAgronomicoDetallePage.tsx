import { useState } from 'react'
import { Link } from 'react-router'
import { ChevronRight, Heart, CheckCircle2, Star, MessageCircle, Calendar, MapPin, BookmarkPlus, Clock } from 'lucide-react'
import { ReviewsSection, MapaUbicacion } from '../../../modules/empresa/components/perfil-shared'

const servicioItems = [
  'Visita diagnóstico presencial en campo',
  'Plan de fertilización personalizado por lote',
  'Informe técnico digital con fotos',
  'Seguimiento y consultas durante 30 días',
  'Recomendación de insumos con proveedor sugerido',
]

const cobertura = ['Portuguesa', 'Barinas', 'Cojedes', 'Guárico', 'Lara', 'Yaracuy', 'Trujillo']

const similares = [
  { name: 'Asesoría en Riego Tecnificado', price: '$280 / visita', image: '/farm-bg.png' },
  { name: 'Diagnóstico Fitosanitario', price: '$220 / visita', image: '/bg-cafe.png' },
  { name: 'Plan de Siembra Anual', price: '$1,500 / temporada', image: '/farm-bg.png' },
]

export function ServicioAgronomicoDetallePage() {
  const [saved, setSaved] = useState(false)

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="mx-auto max-w-5xl px-4 pt-4">

        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <Link to="/" className="hover:text-agrobot-700">Inicio</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/catalogo" className="hover:text-agrobot-700">Servicios</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600">Asesoría en Manejo de Cultivos</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1fr_288px]">
          <div className="flex flex-col gap-5">

            {/* Hero image */}
            <div className="rounded-2xl overflow-hidden">
              <img src="/farm-bg.png" alt="" className="h-56 w-full object-cover" />
            </div>

            {/* Perfil del asesor */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-agrobot-700 text-lg font-bold text-white">RP</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="font-display text-xl font-bold text-gray-900">Ing. Ricardo Palma</h1>
                    <CheckCircle2 className="h-4 w-4 text-agrobot-600" />
                    <span className="rounded-full bg-agrobot-100 px-2.5 py-0.5 text-[10px] font-bold text-agrobot-800">ING. AGRÓNOMO</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Especialista en Cereales y Oleaginosas · 15 años de experiencia</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /><span className="font-semibold text-gray-700">4.9</span> (84 tratos exitosos)</div>
                    <span>·</span>
                    <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Responde en &lt; 2hs</div>
                  </div>
                </div>
                <button onClick={() => setSaved(v => !v)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors">
                  <Heart className={`h-4 w-4 ${saved ? 'fill-red-400 text-red-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Servicio */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-1">Asesoría Técnica en Manejo de Cultivos</h2>
              <p className="text-sm text-gray-500 mb-4">Servicio integral de diagnóstico y acompañamiento agronómico para productores de cereales y oleaginosas.</p>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Qué incluye</h3>
              <div className="flex flex-col gap-2">
                {servicioItems.map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-agrobot-600" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificaciones */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Certificaciones</h2>
              <div className="flex gap-3">
                {[{ label: 'CENIAP', sub: 'Agrónomo registrado', icon: '🎓' }, { label: 'INIA', sub: 'Especialista cereales', icon: '🌾' }].map(c => (
                  <div key={c.label} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <span className="text-lg">{c.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{c.label}</p>
                      <p className="text-[10px] text-gray-500">{c.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cobertura + Mapa */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Cobertura Geográfica</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Estados cubiertos</p>
                  <div className="flex flex-col gap-1.5">
                    {cobertura.map(z => (
                      <div key={z} className="flex items-center gap-2 text-xs text-gray-700">
                        <MapPin className="h-3 w-3 text-agrobot-600" />{z}
                      </div>
                    ))}
                  </div>
                </div>
                <MapaUbicacion lat={9.5} lng={-69.0} label="Zona de cobertura" />
              </div>
            </div>

            {/* Agenda */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-4">
                <Calendar className="inline h-4 w-4 mr-2 text-agrobot-600" />Disponibilidad
              </h2>
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                {['D','L','M','M','J','V','S'].map((d, i) => <div key={i} className="font-semibold text-gray-400 py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {Array.from({ length: 30 }, (_, i) => {
                  const day = i + 1
                  const busy = [1, 8, 15, 16, 22].includes(day)
                  const free = [5, 6, 12, 13, 19, 20, 26, 27].includes(day)
                  return (
                    <div key={day} className={`rounded py-2 cursor-pointer text-xs font-medium transition-colors ${busy ? 'bg-red-100 text-red-600 cursor-not-allowed' : free ? 'bg-gray-100 text-gray-400' : 'bg-agrobot-100 text-agrobot-800 hover:bg-agrobot-200'}`}>
                      {day}
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex gap-4 text-[10px] text-gray-500">
                <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-agrobot-100" />Disponible</div>
                <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-red-100" />Ocupado</div>
                <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-gray-100" />Fin de semana</div>
              </div>
            </div>

            <ReviewsSection />

            {/* Similares */}
            <div>
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Servicios Similares</h2>
              <div className="grid grid-cols-3 gap-3">
                {similares.map(s => (
                  <div key={s.name} className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <img src={s.image} alt={s.name} className="h-28 w-full object-cover" />
                    <div className="p-3">
                      <p className="text-xs font-bold text-gray-900">{s.name}</p>
                      <p className="mt-1 text-sm font-bold text-agrobot-700">{s.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="sticky top-20 flex flex-col gap-4 h-fit">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Tarifa desde</p>
              <p className="text-2xl font-bold text-gray-900">$350 <span className="text-sm font-normal text-gray-500">/ visita</span></p>
              <p className="text-sm text-gray-500 mb-4">$1,200 / mes (seguimiento completo)</p>
              <div className="flex flex-col gap-2">
                <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-agrobot-700 py-3 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">
                  <Calendar className="h-4 w-4" />Solicitar visita
                </button>
                <button className="w-full rounded-xl border border-agrobot-700 py-3 text-sm font-bold text-agrobot-700 hover:bg-agrobot-50 transition-colors">Cotizar proyecto</button>
                <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:border-agrobot-400 transition-colors">
                  <MessageCircle className="h-4 w-4" />Contactar WhatsApp
                </button>
              </div>
              <button className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-agrobot-700 transition-colors">
                <BookmarkPlus className="h-3.5 w-3.5" />Guardar asesor
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
