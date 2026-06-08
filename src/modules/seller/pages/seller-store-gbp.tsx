import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import {
  MapPin, Clock, Globe, Image, Star, ExternalLink, CheckCircle2,
  Phone, MessageCircle, Mail, AtSign, Share2, Plus, Trash2, Loader2, Save,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyStoreQuery } from '../queries/seller-queries'
import { axiosInstance } from '../../shared/lib/axios'
import type { MyStore } from '../api/seller-api'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoreHour {
  dayOfWeek: number
  openTime?: string
  closeTime?: string
  isClosed: boolean
}

interface StoreContact {
  id: number
  contactType: 'phone' | 'whatsapp' | 'email' | 'website' | 'instagram' | 'facebook'
  value: string
  label: string | null
  isPrimary: boolean
}

interface StoreMedia {
  id: number
  url: string
  mediaType: string
  caption: string | null
  isPrimary: boolean
}

interface FullStore {
  hours: StoreHour[]
  contacts: StoreContact[]
  media: StoreMedia[]
  rating: { average: number; total: number }
}

// ─── Utils ────────────────────────────────────────────────────────────────────

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function calcCompletion(store: MyStore, full: FullStore | null): number {
  const checks: [boolean, number][] = [
    [!!store.name,               10],
    [!!store.description,        15],
    [!!store.logoUrl,            15],
    [!!store.bannerUrl,          10],
    [!!store.department,         10],
    [!!store.municipality,       10],
    [(full?.hours ?? []).length > 0,      10],
    [(full?.contacts ?? []).length > 0,   10],
    [(full?.media ?? []).length > 0,      10],
  ]
  return checks.reduce((sum, [ok, w]) => ok ? sum + w : sum, 0)
}

const CONTACT_ICON: Record<StoreContact['contactType'], React.ElementType> = {
  phone:     Phone,
  whatsapp:  MessageCircle,
  email:     Mail,
  website:   Globe,
  instagram: AtSign,
  facebook:  Share2,
}
const CONTACT_LABEL: Record<StoreContact['contactType'], string> = {
  phone: 'Teléfono', whatsapp: 'WhatsApp', email: 'Email',
  website: 'Sitio web', instagram: 'Instagram', facebook: 'Facebook',
}

// ─── Info section ─────────────────────────────────────────────────────────────

function InfoSection({ store }: { store: MyStore }) {
  const [form, setForm] = useState({
    name:         store.name,
    description:  store.description ?? '',
    department:   store.department ?? '',
    municipality: store.municipality ?? '',
  })
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    try {
      await axiosInstance.put('/stores/my/store', {
        name:         form.name || undefined,
        description:  form.description || undefined,
        department:   form.department || undefined,
        municipality: form.municipality || undefined,
      })
      toast.success('Información actualizada')
    } catch {
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const changed =
    form.name !== store.name ||
    form.description !== (store.description ?? '') ||
    form.department !== (store.department ?? '') ||
    form.municipality !== (store.municipality ?? '')

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-agrobot-600" />
          <p className="text-sm font-bold text-gray-900">Información del negocio</p>
        </div>
        {store.slug && (
          <Link to={`/tiendas/${store.slug}`} target="_blank" className="flex items-center gap-1 text-xs text-agrobot-600 hover:underline">
            <ExternalLink className="h-3 w-3" /> Ver perfil
          </Link>
        )}
      </div>
      <div className="space-y-3">
        <Field label="Nombre del negocio">
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="input-base"
            placeholder="Ej: Finca Los Alamos"
          />
        </Field>
        <Field label="Descripción">
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3}
            className="input-base resize-none"
            placeholder="Describe tu negocio en pocas palabras..."
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Estado / Departamento">
            <input
              value={form.department}
              onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              className="input-base"
              placeholder="Ej: Lara"
            />
          </Field>
          <Field label="Municipio / Ciudad">
            <input
              value={form.municipality}
              onChange={e => setForm(f => ({ ...f, municipality: e.target.value }))}
              className="input-base"
              placeholder="Ej: Barquisimeto"
            />
          </Field>
        </div>
      </div>
      <button
        onClick={save}
        disabled={!changed || saving}
        className="mt-4 flex items-center gap-2 rounded-lg bg-agrobot-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-agrobot-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
        Guardar cambios
      </button>
    </div>
  )
}

// ─── Hours section ────────────────────────────────────────────────────────────

function HoursSection({ initialHours }: { initialHours: StoreHour[] }) {
  const defaultHours = (): StoreHour[] =>
    Array.from({ length: 7 }, (_, i) => {
      const found = initialHours.find(h => h.dayOfWeek === i)
      return found ?? { dayOfWeek: i, openTime: '08:00', closeTime: '17:00', isClosed: false }
    })

  const [hours, setHours] = useState<StoreHour[]>(defaultHours)
  const [saving, setSaving] = useState(false)

  function toggle(i: number) {
    setHours(h => h.map((d, idx) => idx === i ? { ...d, isClosed: !d.isClosed } : d))
  }
  function setTime(i: number, field: 'openTime' | 'closeTime', val: string) {
    setHours(h => h.map((d, idx) => idx === i ? { ...d, [field]: val } : d))
  }

  async function save() {
    setSaving(true)
    try {
      const payload = hours.filter(h => !h.isClosed || initialHours.some(ih => ih.dayOfWeek === h.dayOfWeek))
      await axiosInstance.put('/stores/my/store/hours', payload)
      toast.success('Horarios actualizados')
    } catch {
      toast.error('Error al guardar horarios')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-agrobot-600" />
        <p className="text-sm font-bold text-gray-900">Horario de atención</p>
      </div>
      <div className="space-y-2.5">
        {hours.map((h, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-8 text-xs font-semibold text-gray-500 shrink-0">{DAY_NAMES[i]}</span>
            <button
              onClick={() => toggle(i)}
              className={`h-5 w-9 rounded-full transition-colors shrink-0 ${h.isClosed ? 'bg-gray-200' : 'bg-agrobot-500'}`}
            >
              <span className={`block h-4 w-4 rounded-full bg-white shadow transition-transform mx-0.5 ${h.isClosed ? '' : 'translate-x-4'}`} />
            </button>
            {h.isClosed ? (
              <span className="text-xs text-gray-400">Cerrado</span>
            ) : (
              <div className="flex items-center gap-1.5 flex-1">
                <input
                  type="time"
                  value={h.openTime ?? '08:00'}
                  onChange={e => setTime(i, 'openTime', e.target.value)}
                  className="h-7 flex-1 rounded border border-gray-200 px-2 text-xs text-gray-700 focus:border-agrobot-300 focus:outline-none"
                />
                <span className="text-xs text-gray-400">–</span>
                <input
                  type="time"
                  value={h.closeTime ?? '17:00'}
                  onChange={e => setTime(i, 'closeTime', e.target.value)}
                  className="h-7 flex-1 rounded border border-gray-200 px-2 text-xs text-gray-700 focus:border-agrobot-300 focus:outline-none"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="mt-4 flex items-center gap-2 rounded-lg bg-agrobot-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-agrobot-700 disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
        Guardar horarios
      </button>
    </div>
  )
}

// ─── Photos section ───────────────────────────────────────────────────────────

function PhotosSection({ initialMedia }: { initialMedia: StoreMedia[] }) {
  const [media,     setMedia]     = useState<StoreMedia[]>(initialMedia)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const qc = useQueryClient()

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const { data: up } = await axiosInstance.post<{ url: string }>('/stores/my/upload', fd)
      const fullUrl = up.url.startsWith('http') ? up.url : `${import.meta.env.VITE_API_URL}${up.url}`
      const isFirst = media.length === 0
      const { data: added } = await axiosInstance.post<{ id: number }>('/stores/my/store/media', {
        url: fullUrl,
        mediaType: 'image',
        isPrimary: isFirst,
        sortOrder: media.length,
      })
      // Si es la primera foto, usarla también como banner de la tienda
      if (isFirst) {
        await axiosInstance.put('/stores/my/store', { bannerUrl: fullUrl })
        await qc.invalidateQueries({ queryKey: ['myStore'] })
      }
      setMedia(m => [...m, { id: added.id, url: fullUrl, mediaType: 'image', caption: null, isPrimary: isFirst }])
      toast.success('Foto subida')
    } catch {
      toast.error('Error al subir foto')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function remove(id: number) {
    try {
      const wasPrimary = media.find(m => m.id === id)?.isPrimary
      await axiosInstance.delete(`/stores/my/store/media/${id}`)
      const remaining = media.filter(m => m.id !== id)
      setMedia(remaining)
      // Si se eliminó la principal, usar la siguiente como banner (o limpiar)
      if (wasPrimary) {
        const nextUrl = remaining[0]?.url ?? null
        await axiosInstance.put('/stores/my/store', { bannerUrl: nextUrl ?? undefined })
        await qc.invalidateQueries({ queryKey: ['myStore'] })
      }
      toast.success('Foto eliminada')
    } catch {
      toast.error('Error al eliminar foto')
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Image className="h-4 w-4 text-agrobot-600" />
          <p className="text-sm font-bold text-gray-900">Galería de fotos</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg bg-agrobot-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-agrobot-700 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
          Subir foto
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={upload} />
      </div>
      {media.length === 0 ? (
        <div
          onClick={() => fileRef.current?.click()}
          className="grid grid-cols-3 gap-2 cursor-pointer"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center hover:border-agrobot-300 transition-colors">
              <Image className="h-5 w-5 text-gray-300" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {media.map((m) => (
            <div key={m.id} className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200">
              <img src={m.url} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() => remove(m.id)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-5 w-5 text-white" />
              </button>
              {m.isPrimary && (
                <span className="absolute left-1 top-1 rounded bg-agrobot-600 px-1.5 py-0.5 text-[9px] font-bold text-white">Principal</span>
              )}
            </div>
          ))}
          {media.length < 9 && (
            <div
              onClick={() => fileRef.current?.click()}
              className="aspect-square rounded-lg border border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-agrobot-300 transition-colors"
            >
              <Plus className="h-5 w-5 text-gray-300" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Contacts section ─────────────────────────────────────────────────────────

function ContactsSection({ initialContacts }: { initialContacts: StoreContact[] }) {
  const [contacts,  setContacts]  = useState<StoreContact[]>(initialContacts)
  const [newType,   setNewType]   = useState<StoreContact['contactType']>('whatsapp')
  const [newValue,  setNewValue]  = useState('')
  const [adding,    setAdding]    = useState(false)
  const [removing,  setRemoving]  = useState<number | null>(null)

  async function add() {
    if (!newValue.trim()) return
    setAdding(true)
    try {
      const { data } = await axiosInstance.post<{ id: number }>('/stores/my/store/contacts', {
        contactType: newType,
        value: newValue.trim(),
        isPrimary: contacts.filter(c => c.contactType === newType).length === 0,
      })
      setContacts(c => [...c, { id: data.id, contactType: newType, value: newValue.trim(), label: null, isPrimary: false }])
      setNewValue('')
      toast.success('Contacto agregado')
    } catch {
      toast.error('Error al agregar contacto')
    } finally {
      setAdding(false)
    }
  }

  async function remove(id: number) {
    setRemoving(id)
    try {
      await axiosInstance.delete(`/stores/my/store/contacts/${id}`)
      setContacts(c => c.filter(x => x.id !== id))
      toast.success('Contacto eliminado')
    } catch {
      toast.error('Error al eliminar')
    } finally {
      setRemoving(null)
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-4 w-4 text-agrobot-600" />
        <p className="text-sm font-bold text-gray-900">Contactos y redes sociales</p>
      </div>

      {/* Existing contacts */}
      {contacts.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          {contacts.map((c) => {
            const Icon = CONTACT_ICON[c.contactType]
            return (
              <div key={c.id} className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                <Icon className="h-3.5 w-3.5 shrink-0 text-agrobot-600" />
                <span className="text-[10px] font-semibold text-gray-400 w-16 shrink-0">{CONTACT_LABEL[c.contactType]}</span>
                <span className="flex-1 text-xs text-gray-700 truncate">{c.value}</span>
                <button
                  onClick={() => remove(c.id)}
                  disabled={removing === c.id}
                  className="shrink-0 text-gray-300 hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  {removing === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Add new */}
      <div className="flex gap-2">
        <select
          value={newType}
          onChange={e => setNewType(e.target.value as StoreContact['contactType'])}
          className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-600 focus:border-agrobot-300 focus:outline-none shrink-0"
        >
          {(Object.keys(CONTACT_LABEL) as StoreContact['contactType'][]).map(t => (
            <option key={t} value={t}>{CONTACT_LABEL[t]}</option>
          ))}
        </select>
        <input
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Valor del contacto..."
          className="input-base flex-1"
        />
        <button
          onClick={add}
          disabled={!newValue.trim() || adding}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-agrobot-600 text-white hover:bg-agrobot-700 disabled:opacity-50"
        >
          {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  )
}

// ─── Location Section ────────────────────────────────────────────────────────

function LocationSection({ store }: { store: MyStore }) {
  const [address,  setAddress]  = useState('')
  const [lat,      setLat]      = useState('')
  const [lng,      setLng]      = useState('')
  const [geocoding, setGeocoding] = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [mapKey,   setMapKey]   = useState(0)

  async function geocode() {
    const q = address.trim() || [store.municipality, store.department, 'Venezuela'].filter(Boolean).join(', ')
    if (!q) return
    setGeocoding(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'es' } },
      )
      const data = await res.json()
      if (data[0]) {
        setLat(parseFloat(data[0].lat).toFixed(6))
        setLng(parseFloat(data[0].lon).toFixed(6))
        setMapKey(k => k + 1)
      } else {
        toast.error('No se encontró la dirección')
      }
    } catch {
      toast.error('Error al buscar la dirección')
    } finally {
      setGeocoding(false)
    }
  }

  async function save() {
    if (!lat || !lng) { toast.error('Busca la ubicación primero'); return }
    setSaving(true)
    try {
      await axiosInstance.put('/stores/my/store/gbp', {
        businessName: store.name,
        address: address.trim() || undefined,
        latitude: lat,
        longitude: lng,
        isLocationApproximate: true,
      })
      toast.success('Ubicación guardada')
    } catch {
      toast.error('Error al guardar la ubicación')
    } finally {
      setSaving(false)
    }
  }

  const hasCoords = lat && lng
  const mapSrc = hasCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${(parseFloat(lng)-0.05).toFixed(5)},${(parseFloat(lat)-0.05).toFixed(5)},${(parseFloat(lng)+0.05).toFixed(5)},${(parseFloat(lat)+0.05).toFixed(5)}&layer=mapnik&marker=${lat},${lng}`
    : null

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-4 w-4 text-agrobot-600" />
        <p className="text-sm font-bold text-gray-900">Ubicación en el mapa</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && geocode()}
            placeholder={`Ej: ${[store.municipality, store.department, 'Venezuela'].filter(Boolean).join(', ')}`}
            className="input-base flex-1 text-sm"
          />
          <button
            onClick={geocode}
            disabled={geocoding}
            className="flex items-center gap-1.5 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-semibold text-white hover:bg-agrobot-700 disabled:opacity-60 transition-colors whitespace-nowrap"
          >
            {geocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            Buscar
          </button>
        </div>

        {hasCoords && (
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Latitud</p>
              <input type="text" value={lat} onChange={e => setLat(e.target.value)} className="input-base text-sm font-mono" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Longitud</p>
              <input type="text" value={lng} onChange={e => setLng(e.target.value)} className="input-base text-sm font-mono" />
            </div>
          </div>
        )}

        {mapSrc && (
          <div className="rounded-xl overflow-hidden border border-gray-200 h-52">
            <iframe key={mapKey} src={mapSrc} title="Mapa" className="h-full w-full" loading="lazy" />
          </div>
        )}

        {!hasCoords && (
          <p className="text-xs text-gray-400">
            Escribe tu dirección o municipio y haz clic en "Buscar" para ubicarte en el mapa.
          </p>
        )}

        {hasCoords && (
          <button
            onClick={save}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-agrobot-600 py-2.5 text-sm font-bold text-white hover:bg-agrobot-700 disabled:opacity-60 transition-colors"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar ubicación
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SellerStoreGbp() {
  const { data: store } = useMyStoreQuery()
  const [full,    setFull]    = useState<FullStore | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!store?.slug) return
    axiosInstance.get<FullStore & { rating: { average: number; total: number } }>(`/stores/${store.slug}`)
      .then(res => setFull(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [store?.slug])

  if (!store) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Tienda & Presencia Local</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-gray-200">
          <MapPin className="h-10 w-10 text-gray-200 mb-3" />
          <p className="text-sm font-semibold text-gray-400">Crea tu tienda primero</p>
        </div>
      </div>
    )
  }

  const completion = calcCompletion(store, full)
  const rating = full?.rating ?? null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Tienda & Presencia Local</h1>
        <p className="text-sm text-gray-400 mt-0.5">Configura tu perfil público, horarios, fotos y contactos</p>
      </div>

      {/* Completion progress */}
      <div className="rounded-xl border border-agrobot-200 bg-agrobot-50/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-agrobot-800">Perfil completado</p>
          <span className="text-sm font-bold text-agrobot-700">{completion}%</span>
        </div>
        <div className="h-2 rounded-full bg-agrobot-100 overflow-hidden">
          <div className="h-full rounded-full bg-agrobot-600 transition-all" style={{ width: `${completion}%` }} />
        </div>
        <p className="mt-2 text-xs text-agrobot-600">Completa tu perfil para aparecer mejor en los resultados de búsqueda.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <InfoSection store={store} />

        {loading ? (
          <Skeleton className="h-64 rounded-xl" />
        ) : (
          <HoursSection initialHours={full?.hours ?? []} />
        )}

        {loading ? (
          <Skeleton className="h-52 rounded-xl" />
        ) : (
          <PhotosSection initialMedia={full?.media ?? []} />
        )}

        {loading ? (
          <Skeleton className="h-52 rounded-xl" />
        ) : (
          <ContactsSection initialContacts={full?.contacts ?? []} />
        )}
      </div>

      {/* Location on map */}
      <LocationSection store={store} />

      {/* Rating preview */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-4 w-4 text-amber-500" />
          <p className="text-sm font-bold text-gray-900">Vista previa en búsquedas</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-start gap-3">
            {store.logoUrl ? (
              <img src={store.logoUrl} alt={store.name} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-agrobot-100">
                <span className="text-sm font-bold text-agrobot-700">{store.name.slice(0, 2).toUpperCase()}</span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-gray-900 text-sm">{store.name}</p>
                {store.isVerified && <CheckCircle2 className="h-3.5 w-3.5 text-agrobot-600" />}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < Math.round(rating?.average ?? 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                ))}
                <span className="text-[11px] text-gray-400 ml-1">
                  {rating?.total ? `${rating.average.toFixed(1)} · ${rating.total} reseña${rating.total !== 1 ? 's' : ''}` : 'Sin reseñas aún'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {[store.municipality, store.department].filter(Boolean).join(', ') || 'Venezuela'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
