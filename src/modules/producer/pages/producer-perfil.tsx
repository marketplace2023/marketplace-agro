import { MapPin, Phone, Globe, Camera, ShieldCheck, Upload, ExternalLink } from 'lucide-react'

function Field({
  label, value, icon: Icon, textarea = false,
}: { label: string; value: string; icon?: React.ElementType; textarea?: boolean }) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      <div className="mt-1 relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" />
        )}
        {textarea ? (
          <textarea
            disabled
            defaultValue={value}
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 cursor-not-allowed opacity-70"
          />
        ) : (
          <input
            disabled
            defaultValue={value}
            className={`h-9 w-full rounded-lg border border-gray-200 bg-gray-50 ${Icon ? 'pl-8' : 'px-3'} pr-3 text-sm text-gray-700 cursor-not-allowed opacity-70`}
          />
        )}
      </div>
    </div>
  )
}

const COVERAGE_ZONES = ['Aragua', 'Carabobo', 'Miranda', 'Vargas']

export function ProducerPerfil() {
  return (
    <div className="flex flex-col gap-6">

      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-sm text-gray-400 mt-0.5">Datos públicos de tu perfil como productor agrícola</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Left: avatar + role */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col items-center gap-3">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-agrobot-100 text-2xl font-bold text-agrobot-700">
                JP
              </div>
              <button disabled className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-400 cursor-not-allowed">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-900">Juan Pablo Morales</p>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-agrobot-50 px-2.5 py-0.5 text-[11px] font-semibold text-agrobot-700 ring-1 ring-agrobot-200">
                Productor Agrícola
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              Perfil verificado
            </div>
          </div>

          {/* Zones of coverage */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-bold text-gray-900 mb-3">Zonas de cobertura</p>
            <div className="flex flex-wrap gap-1.5">
              {COVERAGE_ZONES.map((z) => (
                <span key={z} className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  {z}
                </span>
              ))}
            </div>
            <button disabled className="mt-3 w-full rounded-lg border border-dashed border-gray-200 py-1.5 text-xs font-medium text-gray-400 cursor-not-allowed">
              + Agregar zona (próximamente)
            </button>
          </div>

          {/* Public profile preview */}
          <button disabled className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-not-allowed opacity-60">
            <ExternalLink className="h-3.5 w-3.5" />
            Ver perfil público
          </button>
        </div>

        {/* Right: form */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-bold text-gray-900 mb-4">Información básica</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nombre completo"    value="Juan Pablo Morales" />
              <Field label="Tipo de productor"  value="Agricultor independiente" />
              <div className="sm:col-span-2">
                <Field label="Descripción"       value="Productor de granos y hortalizas con 15 años de experiencia en la región central del país. Especializado en maíz, sorgo y cacao." textarea />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-bold text-gray-900 mb-4">Ubicación y contacto</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Estado / Provincia" value="Aragua, Venezuela"       icon={MapPin} />
              <Field label="Municipio"          value="Girardot" />
              <Field label="WhatsApp"           value="+58 412 123 4567"        icon={Phone} />
              <Field label="Sitio web"          value="www.fincamorales.ve"     icon={Globe} />
              <Field label="Slug / URL pública" value="juan-pablo-morales" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-900">Documentos adjuntos</p>
              <button disabled className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 cursor-not-allowed opacity-60">
                <Upload className="h-3 w-3" />
                Subir documento
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Cédula de identidad.pdf', size: '340 KB', date: '2026-01-10' },
                { name: 'Registro SADA.pdf',       size: '1.2 MB', date: '2026-02-15' },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{doc.name}</p>
                    <p className="text-[10px] text-gray-400">{doc.size} · {doc.date}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Verificado</span>
                </div>
              ))}
            </div>
          </div>

          <button disabled className="flex items-center justify-center gap-2 rounded-xl bg-agrobot-600 py-2.5 text-sm font-bold text-white opacity-50 cursor-not-allowed">
            Guardar cambios (próximamente)
          </button>
        </div>
      </div>
    </div>
  )
}
