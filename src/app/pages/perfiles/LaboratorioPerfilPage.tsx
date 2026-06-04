import { FlaskConical, ShieldCheck, Clock, ArrowRight, MessageCircle, Bookmark, Share2 } from 'lucide-react'
import { HeroPerfil, StarRating, ReviewsSection } from '../../../modules/empresa/components/perfil-shared'

const servicios = [
  { Icon: FlaskConical, name: 'Análisis de Suelo', desc: 'Completo estudio de macronutrientes, micronutrientes y pH para optimización de cultivos.', price: '$120.00' },
  { Icon: FlaskConical, name: 'Calidad de Agua', desc: 'Determinación de potabilidad y aptitud para riego, metales pesados y salinidad.', price: '$85.00' },
  { Icon: FlaskConical, name: 'Foliar & Tejido', desc: 'Análisis de absorción de nutrientes directamente de la planta para fertilización foliar.', price: '$95.00' },
]

const certs = [
  { code: 'ISO', label: 'ISO 9001:2015' },
  { code: 'SAG', label: 'Ente Sanitario' },
  { code: 'GLP', label: 'Buenas Prácticas' },
]

const pasos = [
  { n: 1, step: 'Extracción:', detail: 'Toma 15-20 submuestras en forma de zigzag en el lote.' },
  { n: 2, step: 'Envasado:', detail: 'Mezcla en un balde limpio y coloca aprox. 500g en bolsa hermética.' },
  { n: 3, step: 'Envío:', detail: 'Rotula con nombre, lote y cultivo. Envía por correo o retiro en sede.' },
]

const tiempos = [
  { tipo: 'Análisis Suelo Básico', tiempo: '3 Días Hábiles', color: 'text-agrobot-700' },
  { tipo: 'Análisis NPK Completo', tiempo: '5 Días Hábiles', color: 'text-agrobot-700' },
  { tipo: 'Calidad de Agua', tiempo: '4 Días Hábiles', color: 'text-sky-600' },
  { tipo: 'Análisis Foliar', tiempo: '6 Días Hábiles', color: 'text-orange-600' },
]

export function LaboratorioPerfilPage() {
  return (
    <div className="bg-white min-h-screen pb-12">
      {/* Hero */}
      <div className="relative" style={{ height: 260 }}>
        <HeroPerfil bg="/bg-cafe.png" height={260} />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-white shadow-md">
              <img src="/logoagro.svg" alt="logo" className="h-12 w-auto" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-2xl font-bold text-white">BioTech AgroLabs S.A.</h1>
                <ShieldCheck className="h-5 w-5 text-agrobot-300" />
              </div>
              <StarRating rating={4.8} reviews={124} light />
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
              <h2 className="font-display text-lg font-bold text-agrobot-700">Servicios de Análisis</h2>
              <span className="text-xs text-gray-400">Resultados Certificados</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {servicios.map(s => (
                <div key={s.name} className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-agrobot-50 mb-3">
                    <s.Icon className="h-4 w-4 text-agrobot-700" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{s.name}</h3>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-agrobot-700">{s.price}</span>
                    <button className="text-agrobot-600 hover:text-agrobot-800 transition-colors">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificaciones */}
          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-agrobot-600" />
              <h2 className="font-display text-base font-bold text-gray-900">Certificaciones y Acreditaciones</h2>
            </div>
            <div className="flex gap-4">
              {certs.map(c => (
                <div key={c.code} className="flex flex-col items-center gap-1">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-50">
                    <span className="text-sm font-bold text-gray-700">{c.code}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 text-center">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cómo enviar */}
          <div className="grid gap-4 sm:grid-cols-2 mb-8">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical className="h-5 w-5 text-agrobot-600" />
                <h2 className="text-base font-bold text-gray-900">Cómo enviar tu muestra</h2>
              </div>
              <div className="flex flex-col gap-3">
                {pasos.map(p => (
                  <div key={p.n} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-agrobot-700 text-xs font-bold text-white">{p.n}</div>
                    <p className="text-xs text-gray-600 leading-relaxed"><strong>{p.step}</strong> {p.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-agrobot-600" />
                <h2 className="text-base font-bold text-gray-900">Tiempos de Entrega</h2>
              </div>
              <div className="flex flex-col gap-2">
                {tiempos.map(t => (
                  <div key={t.tipo} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                    <span className="text-xs text-gray-700">{t.tipo}</span>
                    <span className={`text-xs font-bold ${t.color}`}>{t.tiempo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ReviewsSection />
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Desde</p>
            <p className="font-display text-3xl font-bold text-gray-900">$45.00 <span className="text-sm font-normal text-gray-500">/ análisis base</span></p>
            <div className="mt-4 flex flex-col gap-2">
              <button className="flex items-center justify-center gap-2 w-full rounded-xl bg-agrobot-700 py-3 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">
                <FlaskConical className="h-4 w-4" />Solicitar Análisis
              </button>
              <button className="flex items-center justify-center gap-2 w-full rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-700 hover:border-agrobot-400 transition-colors">
                Cotizar Proyecto
              </button>
            </div>
            <div className="mt-4 border-t border-gray-100 pt-4 flex flex-col gap-2">
              {[{ Icon: MessageCircle, label: 'Contactar por WhatsApp' }, { Icon: Bookmark, label: 'Guardar en Favoritos' }, { Icon: Share2, label: 'Compartir Perfil' }].map(({ Icon, label }) => (
                <button key={label} className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-agrobot-700 transition-colors">
                  <Icon className="h-4 w-4" />{label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-agrobot-700 p-4 text-white">
            <p className="text-xs font-bold uppercase tracking-widest mb-1">Promo Temporada</p>
            <p className="text-sm leading-relaxed">15% de descuento en Análisis de Suelo Completo para lotes mayores a 50 hectáreas.</p>
            <div className="mt-3 rounded-lg bg-white/20 px-3 py-1.5 text-center">
              <span className="text-sm font-bold">Código: AGROLAB15</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
