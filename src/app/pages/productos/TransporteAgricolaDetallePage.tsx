import { useState } from 'react'
import { Link } from 'react-router'
import { ChevronRight, Heart, CheckCircle2, Star, Truck, Thermometer, FileText, ArrowRight, MessageCircle, MapPin } from 'lucide-react'
import { ReviewsSection, MapaUbicacion } from '../../../modules/empresa/components/perfil-shared'

const rutas = [
  { origen: 'Portuguesa', destino: 'Caracas', precio: '$280', tiempo: '6 hs', distancia: '540 km' },
  { origen: 'Portuguesa', destino: 'Valencia', precio: '$190', tiempo: '4 hs', distancia: '380 km' },
  { origen: 'Portuguesa', destino: 'Maracaibo', precio: '$350', tiempo: '8 hs', distancia: '680 km' },
  { origen: 'Portuguesa', destino: 'Barquisimeto', precio: '$140', tiempo: '2.5 hs', distancia: '220 km' },
]

const documentos = [
  { nombre: 'Permiso INTT', estado: 'Vigente', vence: 'Dic 2026', icon: '📋' },
  { nombre: 'Seguro de carga', estado: 'Vigente', vence: 'Mar 2027', icon: '🛡️' },
  { nombre: 'Certificado sanitario', estado: 'Vigente', vence: 'Jun 2026', icon: '✅' },
]

const tipoCarga = ['Frutas', 'Hortalizas', 'Carne', 'Lácteos', 'Flores', 'Pescado']

const similares = [
  { name: 'TransCampo VE · Carga seca 25T', price: '$160 / día', image: '/farm-bg.png' },
  { name: 'LogiAgro · Cisterna 15,000L', price: '$220 / día', image: '/bg-cafe.png' },
  { name: 'VenTrans · Tolva granelero 20T', price: '$195 / día', image: '/farm-bg.png' },
]

export function TransporteAgricolaDetallePage() {
  const [saved, setSaved] = useState(false)

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="mx-auto max-w-5xl px-4 pt-4">

        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <Link to="/" className="hover:text-agrobot-700">Inicio</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/catalogo" className="hover:text-agrobot-700">Servicios</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600">Transporte Refrigerado AgroLogística</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1fr_288px]">
          <div className="flex flex-col gap-5">

            {/* Vehicle image */}
            <div className="rounded-2xl overflow-hidden">
              <img src="/farm-bg.png" alt="Camión refrigerado" className="h-56 w-full object-cover" />
            </div>

            {/* Header */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-bold text-sky-800">REFRIGERADO</span>
                    <span className="rounded-full bg-agrobot-100 px-2.5 py-0.5 text-[10px] font-bold text-agrobot-800">VERIFICADO</span>
                  </div>
                  <h1 className="font-display text-xl font-bold text-gray-900">AgroLogística S.A. · Camión Refrigerado</h1>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /><span className="font-semibold text-gray-700">4.9</span> (78 viajes)</div>
                    <span>·</span>
                    <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />Sede: Acarigua, Portuguesa</div>
                  </div>
                </div>
                <button onClick={() => setSaved(v => !v)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors">
                  <Heart className={`h-4 w-4 ${saved ? 'fill-red-400 text-red-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Ficha vehículo */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Ficha del Vehículo</h2>
              <div className="divide-y divide-gray-100">
                {[
                  { label: 'Tipo', value: 'Camión Refrigerado' },
                  { label: 'Capacidad', value: '20 Toneladas' },
                  { label: 'Largo útil', value: '8 metros' },
                  { label: 'Temperatura', value: '-5°C a +15°C' },
                  { label: 'Año', value: '2022' },
                  { label: 'Placa', value: 'Verificada · INTT' },
                  { label: 'Combustible', value: 'Diésel' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2.5">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-semibold text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tipo de carga */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Tipo de Carga Aceptada</h2>
              <div className="flex flex-wrap gap-2">
                {tipoCarga.map(t => (
                  <span key={t} className="flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800">
                    <Thermometer className="h-3 w-3" />{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Rutas */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-4">Rutas Disponibles</h2>
              <div className="flex flex-col gap-3">
                {rutas.map(r => (
                  <div key={r.destino} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3.5">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 shrink-0 text-agrobot-600" />
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                          <span>{r.origen}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                          <span>{r.destino}</span>
                        </div>
                        <p className="text-[10px] text-gray-400">{r.distancia} · {r.tiempo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-agrobot-700">{r.precio}</p>
                      <button className="text-[10px] font-semibold text-agrobot-600 hover:underline">Cotizar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mapa ruta */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <MapaUbicacion lat={9.0} lng={-68.0} label="Zona de operación" note="Zona de cobertura principal. Rutas extendidas con costo adicional." />
            </div>

            {/* Documentos */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Documentos del Transporte</h2>
              <div className="flex flex-col gap-2">
                {documentos.map(d => (
                  <div key={d.nombre} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{d.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{d.nombre}</p>
                        <p className="text-[10px] text-gray-400">Vence: {d.vence}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-agrobot-100 px-2 py-0.5 text-[10px] font-bold text-agrobot-800">
                      <CheckCircle2 className="h-3 w-3" />{d.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <ReviewsSection title="Reseñas de Cargadores" />

            {/* Similares */}
            <div>
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Otros Transportistas</h2>
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
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Tarifa base</p>
              <p className="text-2xl font-bold text-gray-900">$180 <span className="text-sm font-normal text-gray-500">/ día</span></p>
              <p className="text-xs text-gray-400 mb-4">+ costo por ruta. Precio final según distancia.</p>
              <div className="flex flex-col gap-2">
                <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-agrobot-700 py-3 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">
                  <Truck className="h-4 w-4" />Cotizar ruta
                </button>
                <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:border-agrobot-400 transition-colors">
                  <MessageCircle className="h-4 w-4" />Contactar
                </button>
              </div>
              <button className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-agrobot-700 transition-colors">
                <Heart className="h-3.5 w-3.5" />Guardar transportista
              </button>
            </div>

            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-sky-700" />
                <p className="text-xs font-bold text-sky-800">Documentación al día</p>
              </div>
              <p className="text-xs text-sky-700 leading-relaxed">Todos los permisos y seguros vigentes verificados por TierraMarket.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
