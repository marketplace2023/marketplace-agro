import { useState, useRef, useEffect } from 'react'
import {
  MapPin, Phone, Globe, FileText, Save, Store, ShieldCheck,
  Camera, Loader2, CheckCircle2, AlertCircle, X,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyStoreQuery, useUpdateMyStoreMutation } from '../queries/seller-queries'
import { uploadStoreFile } from '../api/seller-api'
import type { StoreRoleType } from '../api/seller-api'

const ROLE_LABEL: Record<StoreRoleType, string> = {
  seller: 'Vendedor / Tienda', producer: 'Productor agrícola', farm_owner: 'Dueño de finca',
  input_supplier: 'Proveedor de insumos', machinery_supplier: 'Maquinaria agrícola',
  agronomist: 'Agrónomo / Técnico', transporter: 'Transportista', cooperative: 'Cooperativa',
  laboratory: 'Laboratorio', certifier: 'Certificador', quality_inspector: 'Inspector de calidad',
}

interface FormState {
  name: string
  description: string
  department: string
  municipality: string
  logoUrl: string
}

type Toast = { type: 'success' | 'error'; msg: string } | null

export function SellerPerfil() {
  const { data: store, isLoading } = useMyStoreQuery()
  const updateMut = useUpdateMyStoreMutation()
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormState>({
    name: '', description: '', department: '', municipality: '', logoUrl: '',
  })
  const [logoUploading, setLogoUploading] = useState(false)
  const [toast, setToast] = useState<Toast>(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (store) {
      setForm({
        name: store.name ?? '',
        description: store.description ?? '',
        department: store.department ?? '',
        municipality: store.municipality ?? '',
        logoUrl: store.logoUrl ?? '',
      })
    }
  }, [store])

  function set(key: keyof FormState, val: string) {
    setForm(f => ({ ...f, [key]: val }))
    setDirty(true)
  }

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    setLogoUploading(true)
    try {
      const { url } = await uploadStoreFile(file)
      set('logoUrl', url)
      showToast('success', 'Foto cargada. Guarda los cambios para confirmar.')
    } catch {
      showToast('error', 'No se pudo subir la imagen. Intenta con otra.')
    } finally {
      setLogoUploading(false)
    }
  }

  function handleSave() {
    if (!store) return
    updateMut.mutate(
      {
        name: form.name.trim() || undefined,
        description: form.description.trim() || undefined,
        department: form.department.trim() || undefined,
        municipality: form.municipality.trim() || undefined,
        logoUrl: form.logoUrl || undefined,
      },
      {
        onSuccess: () => {
          setDirty(false)
          showToast('success', 'Perfil actualizado correctamente.')
        },
        onError: () => showToast('error', 'Error al guardar. Verifica los datos.'),
      },
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-sm text-gray-400 mt-0.5">Información pública de tu negocio en AgroMarket</p>
        </div>
        <button
          onClick={handleSave}
          disabled={updateMut.isPending || !dirty}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-agrobot-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {updateMut.isPending
            ? <><Loader2 className="h-4 w-4 animate-spin" />Guardando…</>
            : <><Save className="h-4 w-4" />Guardar cambios</>}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-sm border ${
          toast.type === 'success'
            ? 'bg-agrobot-50 border-agrobot-200 text-agrobot-800'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle2 className="h-4 w-4 shrink-0 text-agrobot-600" />
            : <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />}
          {toast.msg}
          <button onClick={() => setToast(null)} className="ml-auto text-current opacity-60 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">

          {/* Left column */}
          <div className="flex flex-col gap-4">

            {/* Logo upload */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Logo / Foto</p>
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  {form.logoUrl ? (
                    <img
                      src={form.logoUrl}
                      alt="Logo"
                      className="h-28 w-28 rounded-2xl object-cover border-2 border-gray-100 shadow-sm"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-agrobot-50 border-2 border-dashed border-agrobot-200">
                      <Store className="h-10 w-10 text-agrobot-400" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={logoUploading}
                    className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/0 group-hover:bg-black/40 transition-all duration-200 cursor-pointer"
                  >
                    {logoUploading
                      ? <Loader2 className="h-7 w-7 animate-spin text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      : <Camera className="h-7 w-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={logoUploading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-agrobot-300 bg-agrobot-50/50 py-2.5 text-xs font-semibold text-agrobot-700 hover:bg-agrobot-50 hover:border-agrobot-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {logoUploading
                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Subiendo…</>
                    : <><Camera className="h-3.5 w-3.5" />Subir imagen</>}
                </button>

                <p className="text-[10px] text-gray-400 text-center">
                  JPG, PNG o WebP · Máx. 5 MB<br />Recomendado: 400×400 px
                </p>
              </div>
            </div>

            {/* Role / verification */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Tipo de negocio</p>
              {store?.roleType && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-agrobot-50 px-3 py-1.5 text-xs font-semibold text-agrobot-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {ROLE_LABEL[store.roleType]}
                </span>
              )}
              {store?.isVerified ? (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-agrobot-50 border border-agrobot-100 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-agrobot-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-agrobot-700">Cuenta verificada</p>
                    <p className="text-[10px] text-agrobot-500">Tu perfil aparece como verificado en el marketplace</p>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-[11px] text-gray-400">
                  Verificación pendiente. Contacta soporte para más información.
                </p>
              )}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[10px] text-gray-400">
                  URL de tu tienda:
                </p>
                <p className="mt-0.5 text-xs font-semibold text-agrobot-700">
                  /tiendas/{store?.slug}
                </p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Información básica</p>
              <div className="grid gap-4">
                <Field label="Nombre del negocio *">
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Ej: Agro Don Pedro"
                    maxLength={150}
                    className="input-base"
                  />
                </Field>
                <Field label="Descripción">
                  <textarea
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder="Describe tu negocio, productos y servicios que ofreces..."
                    rows={4}
                    maxLength={2000}
                    className="input-base resize-none"
                  />
                  <span className="text-[10px] text-gray-400 self-end">{form.description.length}/2000</span>
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Estado / Departamento">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" />
                      <input
                        type="text"
                        value={form.department}
                        onChange={e => set('department', e.target.value)}
                        placeholder="Ej: Aragua"
                        maxLength={100}
                        className="input-base pl-9"
                      />
                    </div>
                  </Field>
                  <Field label="Municipio / Ciudad">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" />
                      <input
                        type="text"
                        value={form.municipality}
                        onChange={e => set('municipality', e.target.value)}
                        placeholder="Ej: Girardot"
                        maxLength={100}
                        className="input-base pl-9"
                      />
                    </div>
                  </Field>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Contacto y presencia digital</p>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Próximamente</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 opacity-50 pointer-events-none">
                <Field label="WhatsApp">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" />
                    <input type="text" disabled placeholder="+58 412 000 0000" className="input-base pl-9 cursor-not-allowed" />
                  </div>
                </Field>
                <Field label="Sitio web">
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" />
                    <input type="text" disabled placeholder="https://tu-sitio.com" className="input-base pl-9 cursor-not-allowed" />
                  </div>
                </Field>
              </div>
            </div>

            {dirty && (
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={updateMut.isPending}
                  className="flex items-center gap-2 rounded-xl bg-agrobot-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-agrobot-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {updateMut.isPending
                    ? <><Loader2 className="h-4 w-4 animate-spin" />Guardando…</>
                    : <><Save className="h-4 w-4" />Guardar cambios</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleLogoChange}
      />
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      {children}
    </div>
  )
}
