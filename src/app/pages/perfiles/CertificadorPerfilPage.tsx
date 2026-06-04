import { ArrowRight, MapPin, Shield, MessageCircle, CheckCircle2 } from 'lucide-react'
import { HeroPerfil, StarRating, ReviewsSection, MapaUbicacion } from '../../../modules/empresa/components/perfil-shared'

const servicios = [
  { badge: 'GLOBAL G.A.P', badgeColor: 'bg-agrobot-100 text-agrobot-800', name: 'Buenas Prácticas Agrícolas', desc: 'Estándar mundial para asegurar la inocuidad alimentaria y la sostenibilidad en la producción primaria.' },
  { badge: 'ORGÁNICO', badgeColor: 'bg-green-100 text-green-800', name: 'Certificación Orgánica LATAM', desc: 'Cumplimiento con normativas nacionales e internacionales para productos libres de químicos sintéticos.' },
  { badge: 'RAINFOREST', badgeColor: 'bg-teal-100 text-teal-800', name: 'Rainforest Alliance', desc: 'Enfoque en la biodiversidad, conservación de recursos y bienestar de los trabajadores rurales.' },
  { badge: 'ISO 22000', badgeColor: 'bg-sky-100 text-sky-800', name: 'Inocuidad Alimentaria', desc: 'Gestión integral de riesgos en toda la cadena de suministro agroalimentaria global.' },
]

const legales = [
  { icon: '📋', name: 'Ley 20.089', desc: 'Sistema Nacional de Certificación Orgánica' },
  { icon: '📖', name: 'Codex Alimentarius', desc: 'Normas Internacionales de Alimentos' },
  { icon: '🇪🇺', name: 'EU 2018/848', desc: 'Reglamento de Producción Ecológica UE' },
]

const zonas = ['Valle de Ica, Perú', 'Región del Maule, Chile', 'Provincia de Mendoza, Argentina', 'Estado de Michoacán, México', 'Portuguesa, Venezuela', 'Barinas, Venezuela']

const agenda = [
  { periodo: 'AGO–SEP', estado: 'CERRADO', desc: 'Uva de Mesa', color: 'bg-red-100 text-red-700' },
  { periodo: 'OCT–NOV', estado: 'ÚLTIMOS CUPOS', desc: 'Arándanos', color: 'bg-amber-100 text-amber-700' },
  { periodo: 'DIC–ENE', estado: 'DISPONIBLE', desc: 'Cereales / Palts', color: 'bg-agrobot-100 text-agrobot-800' },
  { periodo: 'FEB–MAR', estado: 'DISPONIBLE', desc: 'Cítricos', color: 'bg-agrobot-100 text-agrobot-800' },
]

export function CertificadorPerfilPage() {
  return (
    <div className="bg-white min-h-screen pb-12">
      {/* Hero */}
      <div className="relative" style={{ height: 260 }}>
        <HeroPerfil bg="/farm-bg.png" height={260} />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-white shadow-md">
              <img src="/logoagro.svg" alt="logo" className="h-12 w-auto" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="rounded-full bg-agrobot-600 px-2.5 py-0.5 text-[10px] font-bold text-white">CERTIFICADOR OFICIAL</span>
                <span className="rounded-full bg-sky-500 px-2.5 py-0.5 text-[10px] font-bold text-white">✓ VERIFICADO</span>
              </div>
              <h1 className="font-display text-2xl font-bold text-white">AgroStandard Global S.A.</h1>
              <StarRating rating={4.8} reviews={142} light />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">

        {/* Main */}
        <div>
          {/* Servicios */}
          <div className="mb-8">
            <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Servicios de Certificación</h2>
            <div className="grid grid-cols-2 gap-3">
              {servicios.map(s => (
                <div key={s.name} className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold mb-2 ${s.badgeColor}`}>{s.badge}</span>
                  <h3 className="text-sm font-bold text-gray-900">{s.name}</h3>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                  <button className="mt-3 flex items-center gap-1 text-xs font-semibold text-agrobot-700 hover:underline">
                    Ver requerimientos <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Marco legal */}
          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-display text-base font-bold text-gray-900 mb-4">Marco Legal y Normativas</h2>
            <div className="grid grid-cols-3 gap-3">
              {legales.map(l => (
                <div key={l.name} className="flex items-start gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <span className="text-lg">{l.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{l.name}</p>
                    <p className="text-[10px] text-gray-500">{l.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cobertura */}
          <div className="mb-8">
            <h2 className="font-display text-lg font-bold text-gray-900 mb-2">Cobertura de Auditoría Física</h2>
            <p className="text-sm text-gray-500 mb-4">Contamos con auditores residentes en las principales zonas productoras para reducir costos de viáticos.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                {zonas.map(z => (
                  <div key={z} className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-agrobot-600" />{z}
                  </div>
                ))}
              </div>
              <MapaUbicacion lat={8.5} lng={-66.5} label="Cobertura Venezuela" />
            </div>
          </div>

          {/* Agenda */}
          <div className="mb-8">
            <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Agenda de Inspecciones Temporada</h2>
            <div className="grid grid-cols-4 gap-3">
              {agenda.map(a => (
                <div key={a.periodo} className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-3 text-center">
                  <p className="text-[10px] font-bold text-gray-400 mb-2">{a.periodo}</p>
                  <div className={`rounded-lg px-2 py-1 text-[9px] font-bold mb-1 ${a.color}`}>{a.estado}</div>
                  <p className="text-xs text-gray-600">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <ReviewsSection title="Reseñas de Productores" />
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Tarifa Referencial</p>
            <p className="font-display text-3xl font-bold text-gray-900">USD 1,200 <span className="text-sm font-normal text-gray-500">/ día auditor</span></p>
            <p className="text-[10px] text-gray-400 mb-4">*No incluye viáticos ni costos de emisión</p>
            <div className="flex items-center gap-2 rounded-lg bg-agrobot-50 px-3 py-2 mb-4">
              <span className="text-agrobot-700 text-lg">⚡</span>
              <div>
                <p className="text-xs font-bold text-agrobot-800">Respuesta en &lt; 24 hrs</p>
                <p className="text-[10px] text-agrobot-600">Alta disponibilidad para cotizaciones urgentes de pre-auditoría</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="w-full rounded-xl bg-agrobot-700 py-3 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">
                Solicitar Certificación
              </button>
              <button className="w-full rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-700 hover:border-agrobot-400 transition-colors">
                Cotizar Auditoría
              </button>
              <button className="flex items-center justify-center gap-2 text-sm font-semibold text-agrobot-700 hover:underline">
                <MessageCircle className="h-4 w-4" />Contactar vía WhatsApp
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-3 text-center">Más de 50 productores contactaron este mes.</p>
          </div>

          <div className="rounded-xl border border-agrobot-200 bg-agrobot-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-agrobot-700" />
              <p className="text-xs font-bold text-agrobot-800">Transacción Protegida</p>
            </div>
            <p className="text-xs text-agrobot-700 leading-relaxed">Libera el pago solo cuando el informe de auditoría esté cargado en la plataforma.</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-agrobot-600" />
              <p className="text-xs font-bold text-gray-700">142 Auditorías Realizadas</p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-agrobot-600" />
              <p className="text-xs text-gray-700">Validez internacional</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
