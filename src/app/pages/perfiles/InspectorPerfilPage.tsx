import { Shield, Clock, FileText, MessageCircle, CheckCircle2, MapPin, Star } from 'lucide-react'
import { HeroPerfil, StarRating, MapaUbicacion } from '../../../modules/empresa/components/perfil-shared'

const servicios = [
  { badge: 'Más solicitado', badgeColor: 'bg-orange-100 text-orange-700', name: 'Inspección en Cosecha', desc: 'Monitoreo directo en campo para asegurar técnicas de recolección óptimas y madurez adecuada.', price: '$180/día' },
  { badge: null, name: 'Supervisión de Empaque', desc: 'Control de calidad en línea de proceso: selección, limpieza y estándares de embalaje internacional.', price: '$220/lote' },
  { badge: null, name: 'Grado Brix y Calibres', desc: 'Análisis técnico de laboratorio móvil para medición de azúcares y estandarización de tamaños.', price: '$150/visita' },
  { badge: null, name: 'Auditoría Contenedores', desc: 'Inspección pre-embarque: estado de contenedor, precintos de seguridad y temperatura inicial.', price: '$280/unidad' },
]

const especialidades = ['Aguacate Hass', 'Banano', 'Flores', 'Arándanos', 'Mango', 'Cacao', 'Maíz', 'Soja']

const regiones = ['Portuguesa (Oriente y Suroeste)', 'Barinas (Llanos)', 'Zulia (Lago y Perijá)', 'Lara (Valle y Sierra)', 'Desplazamiento a otras zonas sujeto a viáticos']

const reviews = [
  { initials: 'CM', name: 'Carlos Méndez', role: 'Finca La Esperanza · Arándanos', rating: 5, text: '"Excelente ojo técnico. Detectaron un problema de humedad en el empaque que nos habría costado una devolución en puerto. Muy recomendados por su puntualidad."', color: 'bg-orange-500' },
  { initials: 'LG', name: 'Lucía Gómez', role: 'Exportadora GreenFruit · Aguacate', rating: 5, text: '"Su reporte de pre-embarque es el más detallado que hemos recibido. Muy rigurosos con la trazabilidad de los contenedores."', color: 'bg-agrobot-600' },
]

const badges = [
  { label: 'CERTIFICADO', Icon: Shield },
  { label: 'TOP RATED', Icon: Star },
  { label: 'B2B GOLD', Icon: CheckCircle2 },
]

export function InspectorPerfilPage() {
  return (
    <div className="bg-white min-h-screen pb-12">
      {/* Hero */}
      <div className="relative" style={{ height: 220 }}>
        <HeroPerfil bg="/farm-bg.png" height={220} />
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-white shadow-md">
                <img src="/logoagro.svg" alt="logo" className="h-10 w-auto" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-display text-xl font-bold text-white">AgroControl Inspectores S.A.</h1>
                  <span className="rounded-full bg-agrobot-600 px-2 py-0.5 text-[9px] font-bold text-white">✓ VERIFICADO</span>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={4.9} reviews={124} light />
                  <span className="text-white/70 text-xs">·</span>
                  <div className="flex items-center gap-1 text-xs text-white/70">
                    <MapPin className="h-3 w-3" />Sede Central: Maracay, Venezuela
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">

        {/* Main */}
        <div>
          {/* Servicios */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-gray-900">Servicios de Inspección</h2>
              <button className="text-xs font-semibold text-agrobot-700 hover:underline flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />Ver catálogo PDF
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {servicios.map(s => (
                <div key={s.name} className="rounded-xl border border-gray-200 bg-white p-4">
                  {s.badge && <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold mb-2 ${s.badgeColor}`}>{s.badge}</span>}
                  <h3 className="text-sm font-bold text-gray-900">{s.name}</h3>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                  <p className="mt-3 text-xs text-gray-400">Tarifa referencial</p>
                  <p className="text-base font-bold text-gray-900">${s.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Especialidades */}
          <div className="mb-8">
            <h2 className="font-display text-base font-bold text-gray-900 mb-3">Especialidades</h2>
            <div className="flex flex-wrap gap-2">
              {especialidades.map(e => (
                <span key={e} className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                  🌿 {e}
                </span>
              ))}
            </div>
          </div>

          {/* Cobertura */}
          <div className="mb-8">
            <h2 className="font-display text-base font-bold text-gray-900 mb-4">Cobertura Geográfica</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Regiones atendidas</p>
                <div className="flex flex-col gap-2">
                  {regiones.map((r, i) => (
                    <div key={r} className={`flex items-center gap-2 text-xs ${i < 4 ? 'text-gray-700' : 'text-gray-400'}`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${i < 4 ? 'text-agrobot-600' : 'text-gray-300'}`} />
                      {r}
                    </div>
                  ))}
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-200" style={{ height: 180 }}>
                <MapaUbicacion lat={9.7} lng={-69.5} label="Cobertura Venezuela" />
              </div>
            </div>
          </div>

          {/* Agenda simple */}
          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-display text-base font-bold text-gray-900 mb-4">Agenda de Disponibilidad</h2>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
              {['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'].map(d => <div key={d} className="font-semibold text-gray-400 py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: 30 }, (_, i) => {
                const day = i + 1
                const reserved = day === 1
                const busy = day === 4
                const free = day === 5
                return (
                  <div key={day} className={`rounded py-2 text-xs font-medium ${reserved ? 'bg-red-100 text-red-700' : busy ? 'bg-orange-100 text-orange-700' : free ? 'bg-agrobot-100 text-agrobot-800' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {day}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Reportes */}
          <div className="mb-8">
            <h2 className="font-display text-base font-bold text-gray-900 mb-3">Reportes Técnicos de Ejemplo</h2>
            <div className="grid grid-cols-2 gap-3">
              {[{ name: 'Reporte_Calidad_Aguacate_V1.pdf', size: '2.4MB', tipo: 'Inspección de Lote' }, { name: 'Auditoria_Empaque_Bananos.pdf', size: '3.1MB', tipo: 'Control de Proceso' }].map(f => (
                <div key={f.name} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 hover:border-agrobot-300 transition-colors cursor-pointer">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
                    <FileText className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{f.name}</p>
                    <p className="text-[10px] text-gray-400">{f.size} · {f.tipo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reseñas */}
          <div>
            <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Reseñas de Productores</h2>
            <div className="flex flex-col gap-3">
              {reviews.map((r, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${r.color}`}>{r.initials}</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.role}</p>
                      </div>
                    </div>
                    <div className="flex">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />)}</div>
                  </div>
                  <p className="text-sm text-gray-600 italic">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Tarifa base desde</p>
            <p className="font-display text-3xl font-bold text-gray-900">$180 <span className="text-sm font-normal text-gray-500">USD / jornada</span></p>
            <div className="mt-4 flex flex-col gap-2 text-xs text-gray-600 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-agrobot-600" />Respuesta en menos de 2 horas</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-agrobot-600" />+1,200 inspecciones realizadas</div>
              <div className="flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-agrobot-600" />Reporte digital inmediato al finalizar</div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <button className="w-full rounded-xl bg-agrobot-700 py-3 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">Solicitar Inspección</button>
              <button className="w-full rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-700 hover:border-agrobot-400 transition-colors">Cotizar Servicio Especial</button>
              <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-bold text-white hover:bg-green-600 transition-colors">
                <MessageCircle className="h-4 w-4" />Contactar por WhatsApp
              </button>
            </div>
            <p className="mt-3 text-[10px] text-gray-400 text-center">Pago protegido por TierraMarket. El dinero se libera al recibir el reporte final satisfactoriamente.</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {badges.map(({ label, Icon }) => (
              <div key={label} className="flex flex-col items-center gap-1 rounded-xl border border-gray-200 bg-white p-3 text-center">
                <Icon className="h-5 w-5 text-agrobot-600" />
                <p className="text-[9px] font-bold text-gray-600">{label}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
