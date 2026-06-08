import { useState, useRef, useEffect } from 'react'
import {
  MapPin, Phone, Globe, Save, Store, ShieldCheck, AtSign,
  Camera, Loader2, CheckCircle2, AlertCircle, X, Plus,
  Trash2, MessageCircle, Share2, Image,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useMyStoreQuery,
  useUpdateMyStoreMutation,
  useUpdateMyStoreProfileMutation,
  useAddStoreContactMutation,
  useDeleteStoreContactMutation,
  useAddStoreMediaMutation,
  useDeleteStoreMediaMutation,
} from '../queries/seller-queries'
import { uploadStoreFile } from '../api/seller-api'
import type { StoreRoleType, StoreContact, StoreMedia, AddContactPayload } from '../api/seller-api'

const ROLE_LABEL: Record<StoreRoleType, string> = {
  seller: 'Vendedor / Tienda', producer: 'Productor agrícola', farm_owner: 'Dueño de finca',
  input_supplier: 'Proveedor de insumos', machinery_supplier: 'Maquinaria agrícola',
  agronomist: 'Agrónomo / Técnico', transporter: 'Transportista', cooperative: 'Cooperativa',
  laboratory: 'Laboratorio', certifier: 'Certificador', quality_inspector: 'Inspector de calidad',
}

const CONTACT_TYPES: { value: AddContactPayload['contactType']; label: string; icon: React.ElementType; placeholder: string }[] = [
  { value: 'phone',     label: 'Teléfono',  icon: Phone,          placeholder: '+58 412 000 0000' },
  { value: 'whatsapp',  label: 'WhatsApp',  icon: MessageCircle,  placeholder: '+58 412 000 0000' },
  { value: 'email',     label: 'Email',     icon: AtSign,         placeholder: 'correo@ejemplo.com' },
  { value: 'website',   label: 'Sitio web', icon: Globe,          placeholder: 'https://mi-sitio.com' },
  { value: 'instagram', label: 'Instagram', icon: AtSign,         placeholder: '@mi_cuenta' },
  { value: 'facebook',  label: 'Facebook',  icon: Share2,         placeholder: 'https://facebook.com/...' },
]

type Toast = { type: 'success' | 'error'; msg: string } | null

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{title}</p>
      {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
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

function SaveBtn({ loading, disabled, onClick }: { loading: boolean; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="flex items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-agrobot-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {loading
        ? <><Loader2 className="h-4 w-4 animate-spin" />Guardando…</>
        : <><Save className="h-4 w-4" />Guardar cambios</>}
    </button>
  )
}

function ToastBar({ toast, onClose }: { toast: NonNullable<Toast>; onClose: () => void }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-sm border ${
      toast.type === 'success'
        ? 'bg-agrobot-50 border-agrobot-200 text-agrobot-800'
        : 'bg-red-50 border-red-200 text-red-700'
    }`}>
      {toast.type === 'success'
        ? <CheckCircle2 className="h-4 w-4 shrink-0 text-agrobot-600" />
        : <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />}
      {toast.msg}
      <button onClick={onClose} className="ml-auto text-current opacity-60 hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

function ContactRow({ contact, onDelete, deleting }: { contact: StoreContact; onDelete: () => void; deleting: boolean }) {
  const info = CONTACT_TYPES.find(t => t.value === contact.contactType)
  const Icon = info?.icon ?? Phone
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
      <Icon className="h-4 w-4 shrink-0 text-gray-400" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{info?.label ?? contact.contactType}</p>
        <p className="text-sm font-semibold text-gray-700 truncate">
          {contact.label ? `${contact.label} — ` : ''}{contact.value}
        </p>
      </div>
      <button
        onClick={onDelete}
        disabled={deleting}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-400 transition-colors disabled:opacity-40"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function MediaThumb({ media, onDelete, deleting }: { media: StoreMedia; onDelete: () => void; deleting: boolean }) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
      <img src={media.url} alt={media.caption ?? ''} className="h-full w-full object-cover" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-200">
        <button
          onClick={onDelete}
          disabled={deleting}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function SellerPerfil() {
  const { data: store, isLoading } = useMyStoreQuery()
  const updateBasicMut   = useUpdateMyStoreMutation()
  const updateProfileMut = useUpdateMyStoreProfileMutation()
  const addContactMut    = useAddStoreContactMutation()
  const deleteContactMut = useDeleteStoreContactMutation()
  const addMediaMut      = useAddStoreMediaMutation()
  const deleteMediaMut   = useDeleteStoreMediaMutation()

  const logoRef    = useRef<HTMLInputElement>(null)
  const bannerRef  = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  // ── Basic form (name, description, location — images auto-save) ──
  const [basic, setBasic] = useState({ name: '', description: '', department: '', municipality: '' })
  const [images, setImages] = useState({ logoUrl: '', bannerUrl: '' })
  const [basicDirty, setBasicDirty] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const [bannerUploading, setBannerUploading] = useState(false)

  // ── Extended profile form ──
  const [profile, setProfile] = useState({ tagline: '', about: '', yearFounded: '', specialties: '' })
  const [profileDirty, setProfileDirty] = useState(false)
  const [yearError, setYearError] = useState<string | null>(null)

  // ── Contact add form ──
  const [newContact, setNewContact] = useState<{ type: AddContactPayload['contactType']; value: string; label: string }>({
    type: 'whatsapp', value: '', label: '',
  })

  // ── Gallery upload ──
  const [galleryUploading, setGalleryUploading] = useState(false)

  const [toast, setToast] = useState<Toast>(null)

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }

  // Initialize forms from store (only when not dirty to avoid overwriting in-progress edits)
  useEffect(() => {
    if (!store) return
    if (!basicDirty) {
      setBasic({
        name: store.name ?? '',
        description: store.description ?? '',
        department: store.department ?? '',
        municipality: store.municipality ?? '',
      })
      setImages({ logoUrl: store.logoUrl ?? '', bannerUrl: store.bannerUrl ?? '' })
    }
    if (!profileDirty) {
      setProfile({
        tagline: store.profile?.tagline ?? '',
        about: store.profile?.about ?? '',
        yearFounded: store.profile?.yearFounded ? String(store.profile.yearFounded) : '',
        specialties: store.profile?.specialties ?? '',
      })
    }
  }, [store]) // eslint-disable-line react-hooks/exhaustive-deps

  function setB(key: keyof typeof basic, val: string) {
    setBasic(f => ({ ...f, [key]: val }))
    setBasicDirty(true)
  }

  function setP(key: keyof typeof profile, val: string) {
    setProfile(f => ({ ...f, [key]: val }))
    setProfileDirty(true)
  }

  // Images auto-save immediately after upload
  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logoUrl' | 'bannerUrl',
    setUploading: (v: boolean) => void,
  ) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploading(true)
    try {
      const { url } = await uploadStoreFile(file)
      updateBasicMut.mutate(
        { [field]: url },
        {
          onSuccess: () => {
            setImages(f => ({ ...f, [field]: url }))
            showToast('success', field === 'logoUrl' ? 'Logo actualizado.' : 'Portada actualizada.')
          },
          onError: () => showToast('error', 'Error al guardar la imagen.'),
        },
      )
    } catch {
      showToast('error', 'No se pudo subir la imagen.')
    } finally {
      setUploading(false)
    }
  }

  function saveBasic() {
    updateBasicMut.mutate(
      {
        name:         basic.name.trim() || undefined,
        description:  basic.description.trim() || undefined,
        department:   basic.department.trim() || undefined,
        municipality: basic.municipality.trim() || undefined,
      },
      {
        onSuccess: () => { setBasicDirty(false); showToast('success', 'Información guardada.') },
        onError:   () => showToast('error', 'Error al guardar.'),
      },
    )
  }

  function saveProfile() {
    const rawYear = profile.yearFounded.trim()
    const currentYear = new Date().getFullYear()

    if (rawYear) {
      const y = parseInt(rawYear, 10)
      if (isNaN(y) || y < 1900 || y > currentYear) {
        setYearError(`Ingresa un año válido entre 1900 y ${currentYear}.`)
        return
      }
    }
    setYearError(null)

    updateProfileMut.mutate(
      {
        tagline:     profile.tagline.trim() || undefined,
        about:       profile.about.trim() || undefined,
        yearFounded: rawYear ? parseInt(rawYear, 10) : undefined,
        specialties: profile.specialties.trim() || undefined,
      },
      {
        onSuccess: () => { setProfileDirty(false); showToast('success', 'Perfil extendido guardado.') },
        onError:   () => showToast('error', 'Error al guardar el perfil.'),
      },
    )
  }

  function handleAddContact() {
    if (!newContact.value.trim()) return
    addContactMut.mutate(
      {
        contactType: newContact.type,
        value:       newContact.value.trim(),
        label:       newContact.label.trim() || undefined,
        isPrimary:   false,
        sortOrder:   store?.contacts.length ?? 0,
      },
      {
        onSuccess: () => {
          setNewContact({ type: 'whatsapp', value: '', label: '' })
          showToast('success', 'Contacto agregado.')
        },
        onError: () => showToast('error', 'Error al agregar el contacto.'),
      },
    )
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setGalleryUploading(true)
    try {
      const { url } = await uploadStoreFile(file)
      addMediaMut.mutate(
        { url, mediaType: 'image', isPrimary: false, sortOrder: store?.media.length ?? 0 },
        {
          onSuccess: () => showToast('success', 'Imagen agregada a la galería.'),
          onError:   () => showToast('error', 'Error al guardar la imagen.'),
        },
      )
    } catch {
      showToast('error', 'No se pudo subir la imagen.')
    } finally {
      setGalleryUploading(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    )
  }

  const contacts = store?.contacts ?? []
  const galleryMedia = (store?.media ?? []).filter(m => m.mediaType === 'image')
  const contactTypePlaceholder = CONTACT_TYPES.find(t => t.value === newContact.type)?.placeholder ?? ''

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-sm text-gray-400 mt-0.5">Información pública de tu negocio en AgroMarket</p>
      </div>

      {/* Toast */}
      {toast && <ToastBar toast={toast} onClose={() => setToast(null)} />}

      {/* ── Imágenes ── */}
      <SectionCard>
        <SectionTitle title="Imágenes" subtitle="Se guardan automáticamente al subir" />
        <div className="grid gap-6 sm:grid-cols-2">

          {/* Logo */}
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Logo / Foto</p>
            <div
              className="relative group cursor-pointer self-start"
              onClick={() => logoRef.current?.click()}
            >
              {images.logoUrl ? (
                <img src={images.logoUrl} alt="Logo" className="h-28 w-28 rounded-2xl object-cover border-2 border-gray-100 shadow-sm" />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-agrobot-50 border-2 border-dashed border-agrobot-200">
                  <Store className="h-10 w-10 text-agrobot-300" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/0 group-hover:bg-black/40 transition-all duration-200">
                {logoUploading
                  ? <Loader2 className="h-7 w-7 animate-spin text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  : <Camera className="h-7 w-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
              </div>
            </div>
            <p className="text-[10px] text-gray-400">400×400 px · JPG, PNG, WebP · Máx. 5 MB</p>
          </div>

          {/* Banner */}
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Portada / Banner</p>
            <div
              className="relative group cursor-pointer rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 h-28"
              onClick={() => bannerRef.current?.click()}
            >
              {images.bannerUrl ? (
                <img src={images.bannerUrl} alt="Banner" className="h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                  <Image className="h-8 w-8 text-gray-300" />
                  <p className="text-xs text-gray-400">Clic para subir portada</p>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-200">
                {bannerUploading
                  ? <Loader2 className="h-7 w-7 animate-spin text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  : <Camera className="h-7 w-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
              </div>
            </div>
            <p className="text-[10px] text-gray-400">1200×400 px recomendado · JPG, PNG, WebP · Máx. 5 MB</p>
          </div>
        </div>
      </SectionCard>

      {/* ── Información básica ── */}
      <SectionCard>
        <SectionTitle title="Información básica" />
        <div className="grid gap-4">
          <Field label="Nombre del negocio *">
            <input
              type="text" value={basic.name} maxLength={150}
              onChange={e => setB('name', e.target.value)}
              placeholder="Ej: Agro Don Pedro"
              className="input-base"
            />
          </Field>
          <Field label="Descripción">
            <textarea
              value={basic.description} rows={3} maxLength={2000}
              onChange={e => setB('description', e.target.value)}
              placeholder="Describe tu negocio, productos y servicios que ofreces..."
              className="input-base resize-none"
            />
            <span className="text-[10px] text-gray-400 self-end">{basic.description.length}/2000</span>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Estado / Departamento">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" />
                <input
                  type="text" value={basic.department} maxLength={100}
                  onChange={e => setB('department', e.target.value)}
                  placeholder="Ej: Aragua"
                  className="input-base pl-9"
                />
              </div>
            </Field>
            <Field label="Municipio / Ciudad">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" />
                <input
                  type="text" value={basic.municipality} maxLength={100}
                  onChange={e => setB('municipality', e.target.value)}
                  placeholder="Ej: Girardot"
                  className="input-base pl-9"
                />
              </div>
            </Field>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <SaveBtn loading={updateBasicMut.isPending} disabled={!basicDirty} onClick={saveBasic} />
        </div>
      </SectionCard>

      {/* ── Perfil extendido ── */}
      <SectionCard>
        <SectionTitle title="Perfil extendido" subtitle="Información adicional visible en tu perfil público" />
        <div className="grid gap-4">
          <Field label="Eslogan / Tagline">
            <input
              type="text" value={profile.tagline} maxLength={200}
              onChange={e => setP('tagline', e.target.value)}
              placeholder="Ej: La cosecha más fresca del Llano"
              className="input-base"
            />
          </Field>
          <Field label='Sobre nosotros ("About")'>
            <textarea
              value={profile.about} rows={4} maxLength={5000}
              onChange={e => setP('about', e.target.value)}
              placeholder="Historia, misión y valores de tu negocio..."
              className="input-base resize-none"
            />
            <span className="text-[10px] text-gray-400 self-end">{profile.about.length}/5000</span>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Año de fundación">
              <input
                type="number" value={profile.yearFounded}
                onChange={e => { setP('yearFounded', e.target.value); setYearError(null) }}
                placeholder={`Ej: ${new Date().getFullYear() - 5}`}
                min={1900} max={new Date().getFullYear()}
                className={`input-base ${yearError ? 'border-red-400 focus:ring-red-300' : ''}`}
              />
              {yearError && (
                <p className="text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />{yearError}
                </p>
              )}
            </Field>
            <Field label="Especialidades">
              <input
                type="text" value={profile.specialties} maxLength={1000}
                onChange={e => setP('specialties', e.target.value)}
                placeholder="Ej: Cacao, café, cítricos"
                className="input-base"
              />
            </Field>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <SaveBtn loading={updateProfileMut.isPending} disabled={!profileDirty} onClick={saveProfile} />
        </div>
      </SectionCard>

      {/* ── Contactos ── */}
      <SectionCard>
        <SectionTitle title="Contacto y presencia digital" subtitle="Cómo pueden encontrarte los compradores" />

        {/* Existing contacts */}
        {contacts.length > 0 && (
          <div className="mb-4 flex flex-col gap-2">
            {contacts.map(c => (
              <ContactRow
                key={c.id}
                contact={c}
                onDelete={() => deleteContactMut.mutate(c.id, { onError: () => showToast('error', 'Error al eliminar.') })}
                deleting={deleteContactMut.isPending}
              />
            ))}
          </div>
        )}

        {/* Add contact */}
        <div className="flex flex-wrap gap-2 items-end">
          <div className="w-36">
            <Field label="Tipo">
              <select
                value={newContact.type}
                onChange={e => setNewContact(f => ({ ...f, type: e.target.value as AddContactPayload['contactType'] }))}
                className="input-base"
              >
                {CONTACT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
          </div>
          <div className="flex-1 min-w-48">
            <Field label="Valor">
              <input
                type="text" value={newContact.value}
                onChange={e => setNewContact(f => ({ ...f, value: e.target.value }))}
                placeholder={contactTypePlaceholder}
                className="input-base"
              />
            </Field>
          </div>
          <div className="w-32">
            <Field label="Etiqueta">
              <input
                type="text" value={newContact.label}
                onChange={e => setNewContact(f => ({ ...f, label: e.target.value }))}
                placeholder="Opcional"
                className="input-base"
              />
            </Field>
          </div>
          <button
            onClick={handleAddContact}
            disabled={!newContact.value.trim() || addContactMut.isPending}
            className="flex items-center gap-1.5 rounded-xl bg-agrobot-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-agrobot-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {addContactMut.isPending
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Plus className="h-4 w-4" />}
            Agregar
          </button>
        </div>
      </SectionCard>

      {/* ── Galería ── */}
      <SectionCard>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Galería de imágenes</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Fotos de productos, instalaciones o procesos</p>
          </div>
          <button
            onClick={() => galleryRef.current?.click()}
            disabled={galleryUploading || addMediaMut.isPending}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-agrobot-200 bg-agrobot-50 px-3 py-2 text-xs font-bold text-agrobot-700 hover:bg-agrobot-100 disabled:opacity-50 transition-colors"
          >
            {(galleryUploading || addMediaMut.isPending)
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Plus className="h-3.5 w-3.5" />}
            Subir foto
          </button>
        </div>

        {galleryMedia.length === 0 ? (
          <button
            onClick={() => galleryRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-200 py-14 text-gray-400 hover:border-agrobot-300 hover:text-agrobot-600 transition-colors"
          >
            <Image className="h-8 w-8" />
            <p className="text-sm font-semibold">Subir primera imagen</p>
            <p className="text-[11px]">JPG, PNG o WebP · Máx. 5 MB</p>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {galleryMedia.map(m => (
              <MediaThumb
                key={m.id}
                media={m}
                onDelete={() => deleteMediaMut.mutate(m.id, { onError: () => showToast('error', 'Error al eliminar.') })}
                deleting={deleteMediaMut.isPending}
              />
            ))}
          </div>
        )}
      </SectionCard>

      {/* ── Tipo de negocio (read-only) ── */}
      <SectionCard>
        <SectionTitle title="Tipo de negocio" />
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
          <p className="text-[10px] text-gray-400">URL de tu tienda:</p>
          <p className="mt-0.5 text-xs font-semibold text-agrobot-700">/tiendas/{store?.slug}</p>
        </div>
      </SectionCard>

      {/* Hidden file inputs */}
      <input
        ref={logoRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={e => handleImageUpload(e, 'logoUrl', setLogoUploading)}
      />
      <input
        ref={bannerRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={e => handleImageUpload(e, 'bannerUrl', setBannerUploading)}
      />
      <input
        ref={galleryRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={handleGalleryUpload}
      />
    </div>
  )
}
