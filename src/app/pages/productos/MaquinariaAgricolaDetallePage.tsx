import { useState } from 'react'
import { Link } from 'react-router'
import { ChevronRight, Heart, BarChart2, CheckCircle2, Star, Wrench, Shield, CreditCard, ExternalLink, LayoutGrid } from 'lucide-react'

const fichaTecnica = [
  { label: 'Marca', value: 'John Deere' },
  { label: 'Modelo', value: '5075E 4WD' },
  { label: 'Año', value: '2021' },
  { label: 'Estado', value: 'Seminuevo' },
  { label: 'Horas de uso', value: '1,240 hs' },
  { label: 'Potencia', value: '75 HP' },
  { label: 'Transmisión', value: 'Sincronizada 12F / 12R' },
  { label: 'Tracción', value: '4WD' },
  { label: 'Peso', value: '3,850 kg' },
  { label: 'Cabina', value: 'Climatizada con A/C' },
]

const similares = [
  { name: 'New Holland T5.90 4WD 2020', price: '$28,500', image: '/farm-bg.png' },
  { name: 'Massey Ferguson 4710 2022', price: '$41,000', image: '/bg-cafe.png' },
  { name: 'Kubota M7060 Seminuevo', price: '$24,000', image: '/farm-bg.png' },
]

export function MaquinariaAgricolaDetallePage() {
  const [saved, setSaved] = useState(false)

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="mx-auto max-w-5xl px-4 pt-4">

        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <Link to="/" className="hover:text-agrobot-700">Inicio</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/catalogo" className="hover:text-agrobot-700">Maquinaria</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600">John Deere 5075E 4WD</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1fr_288px]">
          <div className="flex flex-col gap-5">

            {/* Gallery */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
              <div className="grid grid-cols-[1fr_176px] gap-0.5 bg-gray-200">
                <div className="relative h-72">
                  <img src="/farm-bg.png" alt="" className="h-full w-full object-cover" />
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-orange-600/90 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">Seminuevo · 20% OFF</span>
                  </div>
                  <button className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-700 backdrop-blur-sm shadow-sm">
                    <LayoutGrid className="h-3.5 w-3.5" />Ver 6 fotos
                  </button>
                </div>
                <div className="flex h-72 flex-col gap-0.5">
                  <div className="flex-1 overflow-hidden">
                    <img src="/bg-cafe.png" alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 items-center justify-center bg-linear-to-br from-orange-50 to-amber-50">
                    <div className="text-center">
                      <p className="text-xl font-bold text-amber-400">+4</p>
                      <p className="text-[11px] text-amber-300">fotos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-orange-800">SEMINUEVO</span>
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-800">20% OFF</span>
                  </div>
                  <h1 className="font-display text-xl font-bold text-gray-900">Tractor John Deere 5075E 4WD</h1>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /><span className="font-semibold text-gray-700">4.8</span> (12 ventas)</div>
                    <span>·</span>
                    <span>Barinas, Venezuela</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSaved(v => !v)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors">
                    <Heart className={`h-4 w-4 ${saved ? 'fill-red-400 text-red-400' : ''}`} />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-agrobot-400 hover:text-agrobot-600 transition-colors">
                    <BarChart2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Estado visual */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-600">Condición del equipo</span>
                  <span className="text-xs font-bold text-agrobot-700">Excelente</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100">
                  <div className="h-2.5 rounded-full bg-agrobot-600" style={{ width: '88%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Deficiente</span><span>Regular</span><span>Bueno</span><span>Excelente</span>
                </div>
              </div>
            </div>

            {/* Ficha técnica */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Ficha Técnica</h2>
              <div className="divide-y divide-gray-100">
                {fichaTecnica.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2.5">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-semibold text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspección técnica */}
            <div className="rounded-xl border border-agrobot-200 bg-agrobot-50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-agrobot-100">
                  <Shield className="h-5 w-5 text-agrobot-700" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-agrobot-800">Solicitar Inspección Técnica</h2>
                  <p className="text-xs text-agrobot-600">Inspectores certificados disponibles en tu zona</p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 mb-4">
                {['Revisión de motor y transmisión', 'Estado de hidráulica y dirección', 'Verificación de horas reales', 'Informe técnico digital en 48hs'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-xs text-agrobot-700">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />{item}
                  </div>
                ))}
              </div>
              <Link to="/inspectores/agrocontrol" className="flex items-center justify-center gap-2 rounded-xl border border-agrobot-400 py-2.5 text-sm font-bold text-agrobot-700 hover:bg-agrobot-100 transition-colors">
                <ExternalLink className="h-4 w-4" />Ver inspectores disponibles
              </Link>
            </div>

            {/* Proveedor */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Proveedor</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">AM</div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-bold text-gray-900">AgroMaquinarias del Sur</p>
                      <CheckCircle2 className="h-3.5 w-3.5 text-agrobot-600" />
                    </div>
                    <p className="text-xs text-gray-400">12 años · Documentos verificados</p>
                  </div>
                </div>
                <Link to="/proveedores/agromaquinarias" className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors">
                  Ver perfil
                </Link>
              </div>
            </div>

            {/* Similares */}
            <div>
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Maquinaria Similar</h2>
              <div className="grid grid-cols-3 gap-3">
                {similares.map(s => (
                  <div key={s.name} className="group rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
                    <div className="relative h-28 overflow-hidden">
                      <img src={s.image} alt={s.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                    </div>
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
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="bg-linear-to-r from-gray-800 to-gray-700 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 line-through">$45,000</p>
                <p className="font-display text-3xl font-bold text-white mt-0.5">$36,000</p>
                <span className="mt-1 inline-block rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-bold text-white">20% DESCUENTO</span>
              </div>
              <div className="p-5">
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                  <CreditCard className="h-4 w-4 text-green-700 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-green-800">FINANCIAMIENTO DISPONIBLE</p>
                    <p className="text-[10px] text-green-600">Hasta 36 cuotas · desde $1,200/mes</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="w-full rounded-xl bg-agrobot-700 py-3 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">Cotizar</button>
                  <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:border-agrobot-400 transition-colors">
                    <Wrench className="h-4 w-4" />Solicitar inspección
                  </button>
                  <button className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:border-agrobot-400 transition-colors">Contactar proveedor</button>
                </div>
                <div className="mt-4 flex justify-center gap-4">
                  <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"><Heart className="h-3.5 w-3.5" />Guardar</button>
                  <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"><BarChart2 className="h-3.5 w-3.5" />Comparar</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
