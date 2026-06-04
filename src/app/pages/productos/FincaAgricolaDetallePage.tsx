import { useState } from 'react'
import { Link } from 'react-router'
import { ChevronRight, Heart, Share2, MapPin, CheckCircle2, Star, Droplets, Zap, Home, FileText, Calendar, BarChart2 } from 'lucide-react'
import { MapaUbicacion } from '../../../modules/empresa/components/perfil-shared'

const infraestructura = [
  { Icon: Home, item: 'Galpón 800m²' },
  { Icon: Home, item: 'Casa de campo' },
  { Icon: Home, item: 'Silos x2 (500 Ton c/u)' },
  { Icon: Home, item: 'Corrales ganaderos' },
  { Icon: Zap, item: 'Red eléctrica + generador' },
  { Icon: Droplets, item: 'Pozos propios x3' },
]

const documentos = [
  { name: 'Título de propiedad', estado: 'Verificado', icon: '📋' },
  { name: 'Certificado catastral', estado: 'Verificado', icon: '🗺️' },
  { name: 'Plano topográfico', estado: 'Disponible', icon: '📐' },
]

const similares = [
  { name: 'Finca Ganadera 85 Ha · Barinas', price: '$195,000', image: '/farm-bg.png' },
  { name: 'Lote Agrícola 45 Ha · Cojedes', price: '$95,000', image: '/bg-cafe.png' },
  { name: 'Predio Arrocero 200 Ha · Guárico', price: '$420,000', image: '/farm-bg.png' },
]

export function FincaAgricolaDetallePage() {
  const [saved, setSaved] = useState(false)

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="mx-auto max-w-5xl px-4 pt-4">

        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <Link to="/" className="hover:text-agrobot-700">Inicio</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/catalogo" className="hover:text-agrobot-700">Fincas</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600">Finca El Maizal</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1fr_288px]">
          <div className="flex flex-col gap-5">

            {/* Gallery */}
            <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
              <img src="/farm-bg.png" alt="" className="h-64 w-full object-cover" />
              <img src="/bg-cafe.png" alt="" className="h-64 w-full object-cover" />
            </div>

            {/* Header */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="rounded-full bg-agrobot-100 px-2.5 py-0.5 text-[10px] font-bold text-agrobot-800">DISPONIBLE</span>
                    <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-bold text-sky-800">DOCUMENTADO</span>
                  </div>
                  <h1 className="font-display text-xl font-bold text-gray-900">Finca El Maizal — 120 Hectáreas</h1>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />Acarigua, Portuguesa, Venezuela
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSaved(v => !v)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors">
                    <Heart className={`h-4 w-4 ${saved ? 'fill-red-400 text-red-400' : ''}`} />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-agrobot-400 hover:text-agrobot-600 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Ficha técnica */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Características del Predio</h2>
              <div className="divide-y divide-gray-100">
                {[
                  { label: 'Área total', value: '120 hectáreas' },
                  { label: 'Uso actual', value: 'Maíz y Soja (rotación)' },
                  { label: 'Agua', value: 'Río propio + 3 pozos' },
                  { label: 'Riego', value: 'Goteo + aspersión (60 Ha)' },
                  { label: 'Drenaje', value: 'Natural + canales artificiales' },
                  { label: 'Acceso', value: 'Ruta asfaltada a 2km' },
                  { label: 'Electricidad', value: 'Red eléctrica + generador' },
                  { label: 'Tipo de suelo', value: 'Franco arcilloso, fértil' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2.5">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-semibold text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Infraestructura */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Infraestructura Disponible</h2>
              <div className="grid grid-cols-2 gap-2">
                {infraestructura.map(({ Icon, item }) => (
                  <div key={item} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-agrobot-600" />
                    <span className="text-xs text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documentos */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Documentos</h2>
              <div className="flex flex-col gap-2">
                {documentos.map(d => (
                  <div key={d.name} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{d.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{d.name}</p>
                        <p className="text-[10px] text-agrobot-700 font-medium">✓ {d.estado}</p>
                      </div>
                    </div>
                    <button className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors">
                      Solicitar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Mapa */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <MapaUbicacion lat={9.5545} lng={-69.1956} label="Finca El Maizal · Acarigua" note="Por seguridad, solo se muestra la zona general del predio." />
            </div>

            {/* Propietario */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Propietario</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">JM</div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-bold text-gray-900">Juan M. Rodríguez</p>
                      <CheckCircle2 className="h-3.5 w-3.5 text-agrobot-600" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />4.7 · 12 propiedades</div>
                  </div>
                </div>
                <Link to="/productores/rodriguezjm" className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors">
                  Ver perfil
                </Link>
              </div>
            </div>

            {/* Similares */}
            <div>
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Fincas Similares</h2>
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
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Precio venta</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">$280,000</p>
              <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-gray-50">
                <span className="text-xs text-gray-500">Arriendo:</span>
                <span className="text-sm font-bold text-agrobot-700">$1,200 / mes</span>
              </div>
              <div className="flex flex-col gap-2">
                <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-agrobot-700 py-3 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">
                  <Calendar className="h-4 w-4" />Agendar visita
                </button>
                <button className="w-full rounded-xl border border-agrobot-700 py-3 text-sm font-bold text-agrobot-700 hover:bg-agrobot-50 transition-colors">Cotizar</button>
                <button className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:border-agrobot-400 transition-colors">Contactar propietario</button>
              </div>
              <div className="mt-4 flex justify-center gap-4">
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"><Heart className="h-3.5 w-3.5" />Guardar</button>
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"><Share2 className="h-3.5 w-3.5" />Compartir</button>
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"><BarChart2 className="h-3.5 w-3.5" />Comparar</button>
              </div>
            </div>

            <div className="rounded-xl border border-agrobot-200 bg-agrobot-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-agrobot-700" />
                <p className="text-xs font-bold text-agrobot-800">Documentación completa</p>
              </div>
              <p className="text-xs text-agrobot-700 leading-relaxed">Título, catastro y planos disponibles para revisión previa a la visita.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
