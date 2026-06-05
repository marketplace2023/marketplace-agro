import { MapPin, Phone, Globe, FileText, Save, Store, ShieldCheck } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyStoreQuery } from '../queries/seller-queries'
import type { StoreRoleType } from '../api/seller-api'

const ROLE_LABEL: Record<StoreRoleType, string> = {
  seller: 'Vendedor / Tienda', producer: 'Productor agrícola', farm_owner: 'Dueño de finca',
  input_supplier: 'Proveedor de insumos', machinery_supplier: 'Maquinaria agrícola',
  agronomist: 'Agrónomo / Técnico', transporter: 'Transportista', cooperative: 'Cooperativa',
  laboratory: 'Laboratorio', certifier: 'Certificador', quality_inspector: 'Inspector de calidad',
}

export function SellerPerfil() {
  const { data: store, isLoading } = useMyStoreQuery()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-sm text-gray-400 mt-0.5">Información pública de tu negocio en AgroMarket</p>
        </div>
        <button
          disabled
          title="Próximamente"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white opacity-50 cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          Guardar cambios
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">

          {/* Left: avatar + role */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Logo / Foto</p>
              <div className="flex flex-col items-center gap-3">
                {store?.logoUrl ? (
                  <img src={store.logoUrl} alt="" className="h-24 w-24 rounded-2xl object-cover border border-gray-200" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-agrobot-50">
                    <Store className="h-10 w-10 text-agrobot-500" />
                  </div>
                )}
                <button disabled className="w-full rounded-lg border border-dashed border-gray-200 py-2 text-xs font-medium text-gray-400 cursor-not-allowed">
                  Subir imagen (próximamente)
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Tipo de negocio</p>
              {store?.roleType && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-agrobot-50 px-3 py-1 text-xs font-semibold text-agrobot-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {ROLE_LABEL[store.roleType]}
                </span>
              )}
              {store?.isVerified && (
                <p className="mt-2 flex items-center gap-1 text-[11px] text-agrobot-600 font-medium">
                  <ShieldCheck className="h-3 w-3" /> Cuenta verificada
                </p>
              )}
            </div>
          </div>

          {/* Right: form fields */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">Información básica</p>
              <div className="grid gap-4">
                <Field label="Nombre del negocio" value={store?.name} placeholder="Ej: Agro Don Pedro" />
                <Field label="Descripción" value={store?.description ?? ''} placeholder="Describe tu negocio, productos y servicios" textarea />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Estado / Departamento" value={store?.department ?? ''} placeholder="Ej: Aragua" icon={MapPin} />
                  <Field label="Municipio" value={store?.municipality ?? ''} placeholder="Ej: Girardot" icon={MapPin} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">Contacto y presencia digital</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="WhatsApp" value="" placeholder="+58 412 000 0000" icon={Phone} disabled />
                <Field label="Sitio web" value="" placeholder="https://tu-sitio.com" icon={Globe} disabled />
                <Field label="URL de tu tienda" value={store?.slug ? `/tiendas/${store.slug}` : ''} placeholder="/tiendas/mi-tienda" icon={FileText} />
              </div>
            </div>

          </div>
        </div>
      )}

      <p className="text-center text-xs text-gray-400">La edición completa del perfil estará disponible próximamente.</p>
    </div>
  )
}

function Field({
  label, value, placeholder, icon: Icon, textarea, disabled,
}: {
  label: string; value?: string; placeholder?: string
  icon?: React.ElementType; textarea?: boolean; disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      {textarea ? (
        <textarea
          defaultValue={value}
          placeholder={placeholder}
          rows={3}
          disabled
          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-300 resize-none cursor-not-allowed opacity-70"
        />
      ) : (
        <div className="relative">
          {Icon && <Icon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" />}
          <input
            type="text"
            defaultValue={value}
            placeholder={placeholder}
            disabled
            className={`h-9 w-full rounded-lg border border-gray-200 bg-gray-50 ${Icon ? 'pl-9' : 'pl-3'} pr-3 text-sm text-gray-700 placeholder:text-gray-300 cursor-not-allowed opacity-70`}
          />
        </div>
      )}
    </div>
  )
}
