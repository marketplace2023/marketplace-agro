import { useState } from 'react'
import { Link } from 'react-router'
import { ChevronRight, Heart, BarChart2, MapPin, CheckCircle2, Star, Truck, Package, Calendar, Leaf } from 'lucide-react'
import { MapaUbicacion } from '../../../modules/empresa/components/perfil-shared'

const transporte = [
  { empresa: 'AgroLogística S.A.', tipo: 'Refrigerado 20 Ton', precio: '$280', tiempo: '6hs', rating: 4.9 },
  { empresa: 'TransCampo VE', tipo: 'Carga seca 15 Ton', precio: '$190', tiempo: '8hs', rating: 4.6 },
]

const similares = [
  { name: 'Maíz Amarillo Tradicional', price: '$210 / Ton', image: '/bg-cafe.png' },
  { name: 'Sorgo Granífero Rojo', price: '$185 / Ton', image: '/farm-bg.png' },
  { name: 'Arroz Paddy Largo Fino', price: '$390 / Ton', image: '/bg-cafe.png' },
]

export function ProductoAgricolaDetallePage() {
  const [saved, setSaved] = useState(false)

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="mx-auto max-w-5xl px-4 pt-4">

        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <Link to="/" className="hover:text-agrobot-700">Inicio</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/catalogo" className="hover:text-agrobot-700">Cosechas</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600">Maíz Blanco Híbrido DK-7088</span>
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
                    <span className="rounded-full bg-agrobot-100 px-2.5 py-0.5 text-[10px] font-bold text-agrobot-800">COSECHA FRESCA</span>
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold text-green-800">CERTIFICADO</span>
                    <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-orange-800">MAYORISTA</span>
                  </div>
                  <h1 className="font-display text-xl font-bold text-gray-900">Maíz Blanco Híbrido DK-7088</h1>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /><span className="font-semibold text-gray-700">4.9</span> (120 transacciones)</div>
                    <span>·</span>
                    <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />Turén, Portuguesa</div>
                  </div>
                </div>
                <button onClick={() => setSaved(v => !v)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors">
                  <Heart className={`h-4 w-4 ${saved ? 'fill-red-400 text-red-400' : ''}`} />
                </button>
              </div>

              {/* Key specs */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { Icon: Package, label: 'Volumen', value: '450 Ton' },
                  { Icon: Leaf, label: 'Calidad', value: 'Grado A · 14% hum.' },
                  { Icon: Calendar, label: 'Cosecha', value: 'Marzo 2026' },
                  { Icon: Package, label: 'Empaque', value: 'Bolsas 50kg / Granel' },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="h-3.5 w-3.5 text-agrobot-600" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
                    </div>
                    <p className="text-xs font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificaciones */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Certificaciones</h2>
              <div className="flex gap-3">
                {[{ label: 'GlobalG.A.P', sub: 'Buenas Prácticas', icon: '🌿' }, { label: 'Orgánico', sub: 'USDA Certified', icon: '🌱' }].map(c => (
                  <div key={c.label} className="flex items-center gap-2 rounded-xl border border-agrobot-200 bg-agrobot-50 px-4 py-3">
                    <span className="text-lg">{c.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-agrobot-800">{c.label}</p>
                      <p className="text-[10px] text-agrobot-600">{c.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Productor */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Productor</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-agrobot-700 text-sm font-bold text-white">SI</div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-bold text-gray-900">Establecimiento San Isidro</p>
                      <CheckCircle2 className="h-3.5 w-3.5 text-agrobot-600" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />4.9 · Guanare, Portuguesa
                    </div>
                  </div>
                </div>
                <Link to="/productores/san-isidro" className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors">
                  Ver perfil
                </Link>
              </div>
            </div>

            {/* Mapa */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <MapaUbicacion lat={9.3310} lng={-69.1149} label="Turén, Portuguesa" note="Ubicación aproximada del establecimiento." />
            </div>

            {/* Transporte sugerido */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Transporte Sugerido</h2>
              <div className="flex flex-col gap-3">
                {transporte.map(t => (
                  <div key={t.empresa} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100">
                        <Truck className="h-4 w-4 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{t.empresa}</p>
                        <p className="text-[10px] text-gray-500">{t.tipo} · {t.tiempo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-agrobot-700">{t.precio}</p>
                      <div className="flex items-center gap-0.5 text-[10px] text-gray-400"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{t.rating}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Similares */}
            <div>
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Cosechas Similares</h2>
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
              <p className="text-xs text-gray-400 line-through">$380 / Ton</p>
              <p className="text-2xl font-bold text-gray-900">$320 <span className="text-sm font-normal text-gray-500">/ Ton</span></p>
              <div className="mt-2 mb-4 rounded-lg bg-agrobot-50 px-3 py-2 flex items-center justify-between">
                <span className="text-xs text-agrobot-700 font-semibold">Stock disponible</span>
                <span className="text-xs font-bold text-agrobot-800">450 Ton</span>
              </div>
              <div className="flex flex-col gap-2">
                <button className="w-full rounded-xl bg-agrobot-700 py-3 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">Solicitar cotización</button>
                <button className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:border-agrobot-400 transition-colors">Contactar productor</button>
                <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-sky-300 py-3 text-sm font-semibold text-sky-700 hover:bg-sky-50 transition-colors">
                  <Truck className="h-4 w-4" />Solicitar transporte
                </button>
              </div>
              <div className="mt-4 flex justify-center gap-4">
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"><Heart className="h-3.5 w-3.5" />Guardar</button>
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"><BarChart2 className="h-3.5 w-3.5" />Comparar</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
