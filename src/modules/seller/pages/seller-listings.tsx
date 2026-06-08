import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router'
import {
  Eye, PlusCircle, ExternalLink, Package, Pencil, Trash2,
  PauseCircle, PlayCircle, SendHorizonal, X, ChevronDown,
  ImagePlus, Loader2, CheckCircle2, ArrowLeft, ChevronLeft,
  Wheat, Tractor, FlaskConical, GraduationCap, Truck, MapPinned,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useMyListingsQuery,
  useCreateListingMutation,
  useUpdateListingMutation,
  useChangeListingStatusMutation,
} from '../queries/seller-queries'
import { useCategoriesQuery } from '@/modules/categories/queries/category-queries'
import {
  uploadListingFile, addListingMedia, deleteListingMedia, getMyListingDetail,
} from '../api/seller-api'
import type { ListingStatus, ListingType, MyListing, CreateListingPayload, UpdateListingPayload, ListingMedia } from '../api/seller-api'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<ListingStatus, string> = {
  draft:          'bg-gray-100 text-gray-500',
  pending_review: 'bg-amber-50 text-amber-700',
  published:      'bg-agrobot-50 text-agrobot-700',
  paused:         'bg-gray-100 text-gray-500',
  rejected:       'bg-red-50 text-red-600',
  expired:        'bg-gray-100 text-gray-400',
  deleted:        'bg-red-50 text-red-400',
}
const STATUS_LABEL: Record<ListingStatus, string> = {
  draft: 'Borrador', pending_review: 'En revisión', published: 'Publicado',
  paused: 'Pausado', rejected: 'Rechazado', expired: 'Expirado', deleted: 'Eliminado',
}
const TYPE_LABEL: Record<ListingType, string> = {
  sale: 'Venta', rent: 'Arriendo', service: 'Servicio', quote: 'Cotización', alliance: 'Alianza',
}
const TYPE_COLOR: Record<ListingType, string> = {
  sale:     'bg-blue-50 text-blue-600',
  rent:     'bg-violet-50 text-violet-600',
  service:  'bg-agrobot-50 text-agrobot-700',
  quote:    'bg-amber-50 text-amber-700',
  alliance: 'bg-pink-50 text-pink-600',
}

type FilterTab = 'all' | ListingStatus

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'published', label: 'Publicadas' },
  { key: 'pending_review', label: 'En revisión' },
  { key: 'draft', label: 'Borradores' },
  { key: 'paused', label: 'Pausadas' },
  { key: 'rejected', label: 'Rechazadas' },
]

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── Listing Form ──────────────────────────────────────────────────────────────

interface FormState {
  title: string
  description: string
  listingType: ListingType
  categoryId: string
  subcategoryId: string
  price: string
  priceUnit: string
  department: string
  municipality: string
}

const EMPTY_FORM: FormState = {
  title: '', description: '', listingType: 'sale',
  categoryId: '', subcategoryId: '', price: '',
  priceUnit: 'USD', department: '', municipality: '',
}

function toFormState(l: MyListing): FormState {
  return {
    title: l.title,
    description: '',
    listingType: l.listingType,
    categoryId: l.categoryId ? String(l.categoryId) : '',
    subcategoryId: l.subcategoryId ? String(l.subcategoryId) : '',
    price: l.price ?? '',
    priceUnit: l.priceUnit ?? 'USD',
    department: l.department ?? '',
    municipality: l.municipality ?? '',
  }
}

interface ListingModalProps {
  mode: 'create' | 'edit'
  listing?: MyListing
  onClose: () => void
}

// ─── Step 2: Photo uploader ────────────────────────────────────────────────

interface PhotoItem {
  id?: number          // existing media id
  previewUrl: string   // local blob or remote url
  file?: File          // only for new uploads
  uploading?: boolean
  error?: boolean
}

function PhotosStep({ listingId, onDone }: { listingId: number; onDone: () => void }) {
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

  useEffect(() => {
    getMyListingDetail(listingId).then((detail) => {
      setPhotos(detail.media.map((m: ListingMedia) => ({
        id: m.id,
        previewUrl: m.url.startsWith('http') ? m.url : `${BASE}${m.url}`,
      })))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [listingId])

  function handleFiles(files: FileList | null) {
    if (!files) return
    const newItems: PhotoItem[] = Array.from(files).map((file) => ({
      previewUrl: URL.createObjectURL(file),
      file,
    }))
    setPhotos((p) => [...p, ...newItems])
  }

  async function handleSave() {
    setUploading(true)
    const newPhotos = photos.filter((p) => p.file)
    for (let i = 0; i < newPhotos.length; i++) {
      const photo = newPhotos[i]
      try {
        const { url } = await uploadListingFile(photo.file!)
        await addListingMedia(listingId, {
          url,
          isPrimary: photos.filter((p) => !p.file).length === 0 && i === 0,
          sortOrder: photos.findIndex((p) => p === photo),
        })
        setPhotos((prev) => prev.map((p) => p === photo ? { ...p, file: undefined } : p))
      } catch {
        setPhotos((prev) => prev.map((p) => p === photo ? { ...p, error: true } : p))
      }
    }
    setUploading(false)
    onDone()
  }

  async function handleDelete(photo: PhotoItem) {
    if (photo.id) {
      await deleteListingMedia(listingId, photo.id).catch(() => {})
    }
    if (photo.file) URL.revokeObjectURL(photo.previewUrl)
    setPhotos((p) => p.filter((x) => x !== photo))
  }

  const hasNew = photos.some((p) => p.file)

  return (
    <div className="flex flex-col gap-4 px-6 py-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <ImagePlus className="h-4 w-4 text-agrobot-600" />
        Fotos de la publicación
      </div>
      <p className="text-xs text-gray-400 -mt-2">
        Sube hasta 10 fotos. La primera foto será la imagen principal.
      </p>

      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map(i => <Skeleton key={i} className="aspect-square rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
              <img src={photo.previewUrl} alt="" className="h-full w-full object-cover" />
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 rounded-md bg-black/50 px-1.5 py-0.5 text-[9px] font-bold text-white">Principal</span>
              )}
              {photo.file && !photo.error && (
                <span className="absolute top-1 right-1 rounded-md bg-agrobot-500/80 px-1.5 py-0.5 text-[9px] font-bold text-white">Nueva</span>
              )}
              {photo.error && (
                <span className="absolute top-1 right-1 rounded-md bg-red-500/80 px-1.5 py-0.5 text-[9px] font-bold text-white">Error</span>
              )}
              <button
                onClick={() => handleDelete(photo)}
                className="absolute top-1 left-1 hidden group-hover:flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {photos.length < 10 && (
            <button
              onClick={() => fileRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-agrobot-300 hover:bg-agrobot-50 transition-colors flex flex-col items-center justify-center gap-1"
            >
              <ImagePlus className="h-5 w-5 text-gray-300" />
              <span className="text-[10px] font-medium text-gray-300">Agregar</span>
            </button>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="flex justify-between gap-3 pt-1 border-t border-gray-100">
        <button
          onClick={onDone}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Omitir fotos
        </button>
        <button
          onClick={handleSave}
          disabled={uploading || !hasNew}
          className="flex items-center gap-2 rounded-xl bg-agrobot-600 px-5 py-2 text-sm font-bold text-white hover:bg-agrobot-700 disabled:opacity-50 transition-colors"
        >
          {uploading ? <><Loader2 className="h-4 w-4 animate-spin" />Subiendo…</> : <><CheckCircle2 className="h-4 w-4" />Guardar fotos</>}
        </button>
      </div>
    </div>
  )
}

// ─── Publication type selector ─────────────────────────────────────────────

type PubType = 'producto' | 'finca' | 'insumo' | 'maquinaria' | 'servicio' | 'transporte'
type ModalStep = 'type' | 'form' | 'photos'

const PUB_TYPES: Array<{
  key: PubType; label: string; sub: string
  icon: React.ComponentType<{ className?: string }>
  color: string; bg: string; border: string; hoverBorder: string
  listingType: ListingType; priceUnit: string
}> = [
  { key: 'producto', icon: Wheat, label: 'Producto / Cosecha', sub: 'Maíz, soja, arroz, frutas, hortalizas y granos', color: 'text-agrobot-700', bg: 'bg-agrobot-50', border: 'border-agrobot-200', hoverBorder: 'hover:border-agrobot-500', listingType: 'sale', priceUnit: 'Ton' },
  { key: 'finca', icon: MapPinned, label: 'Finca / Predio', sub: 'Venta, arriendo o alianza de tierra agrícola', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', hoverBorder: 'hover:border-emerald-500', listingType: 'sale', priceUnit: 'ha' },
  { key: 'insumo', icon: FlaskConical, label: 'Insumo Agrícola', sub: 'Fertilizantes, semillas, agroquímicos, herramientas', color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200', hoverBorder: 'hover:border-sky-500', listingType: 'sale', priceUnit: 'kg' },
  { key: 'maquinaria', icon: Tractor, label: 'Maquinaria / Equipo', sub: 'Tractores, cosechadoras, sistemas de riego', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', hoverBorder: 'hover:border-amber-500', listingType: 'sale', priceUnit: 'unidad' },
  { key: 'servicio', icon: GraduationCap, label: 'Servicio Agronómico', sub: 'Asesoría técnica, análisis de suelos, aplicaciones', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200', hoverBorder: 'hover:border-violet-500', listingType: 'service', priceUnit: '/visita' },
  { key: 'transporte', icon: Truck, label: 'Transporte Agrícola', sub: 'Camiones, rutas y carga refrigerada o a granel', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', hoverBorder: 'hover:border-orange-500', listingType: 'service', priceUnit: '/viaje' },
]

function buildDescription(type: PubType, s: Record<string, string>): string {
  const lines: string[] = []
  if (type === 'producto') {
    if (s.variedad) lines.push(`Variedad: ${s.variedad}`)
    if (s.volumen) lines.push(`Volumen disponible: ${s.volumen} ${s.volumenUnidad || 'Ton'}`)
    if (s.calidad) lines.push(`Calidad: ${s.calidad}`)
    if (s.fechaCosecha) lines.push(`Fecha de cosecha: ${s.fechaCosecha}`)
    if (s.empaque) lines.push(`Empaque: ${s.empaque}`)
  } else if (type === 'finca') {
    if (s.area) lines.push(`Área total: ${s.area} hectáreas`)
    if (s.tipoSuelo) lines.push(`Tipo de suelo: ${s.tipoSuelo}`)
    if (s.fuenteAgua) lines.push(`Fuente de agua: ${s.fuenteAgua}`)
    if (s.riego) lines.push(`Sistema de riego: ${s.riego}`)
    if (s.infraestructura) lines.push(`Infraestructura: ${s.infraestructura}`)
  } else if (type === 'insumo') {
    if (s.marca) lines.push(`Marca: ${s.marca}`)
    if (s.presentacion) lines.push(`Presentación: ${s.presentacion}`)
    if (s.usoRecomendado) lines.push(`Uso: ${s.usoRecomendado}`)
    if (s.cultivos) lines.push(`Cultivos recomendados: ${s.cultivos}`)
    if (s.inventario) lines.push(`Inventario: ${s.inventario}`)
  } else if (type === 'maquinaria') {
    if (s.tipoEquipo) lines.push(`Tipo de equipo: ${s.tipoEquipo}`)
    if (s.marca) lines.push(`Marca: ${s.marca}`)
    if (s.modelo) lines.push(`Modelo: ${s.modelo}`)
    if (s.anio) lines.push(`Año: ${s.anio}`)
    if (s.estado) lines.push(`Estado: ${s.estado}`)
    if (s.horasUso && (s.estado ?? '').toLowerCase().includes('usado')) lines.push(`Horas de uso: ${s.horasUso} hrs`)
    if (s.potencia) lines.push(`Potencia: ${s.potencia}`)
  } else if (type === 'servicio') {
    if (s.especialidad) lines.push(`Especialidad: ${s.especialidad}`)
    if (s.cobertura) lines.push(`Cobertura geográfica: ${s.cobertura}`)
    if (s.disponibilidad) lines.push(`Disponibilidad: ${s.disponibilidad}`)
    if (s.documentos) lines.push(`Documentos: ${s.documentos}`)
  } else if (type === 'transporte') {
    if (s.tipoVehiculo) lines.push(`Tipo de vehículo: ${s.tipoVehiculo}`)
    if (s.capacidad) lines.push(`Capacidad: ${s.capacidad}`)
    if (s.tipoCarga) lines.push(`Tipo de carga: ${s.tipoCarga}`)
    if (s.rutas) lines.push(`Rutas: ${s.rutas}`)
    if (s.condiciones) lines.push(`Condiciones: ${s.condiciones}`)
    if (s.disponibilidad) lines.push(`Disponibilidad: ${s.disponibilidad}`)
  }
  return lines.join('\n')
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      {children}
    </div>
  )
}

function SpecFields({ pubType, spec, set }: {
  pubType: PubType
  spec: Record<string, string>
  set: (k: string, v: string) => void
}) {
  const s = spec

  if (pubType === 'producto') return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Cultivo y calidad</p>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Variedad / Cultivo">
          <div className="relative">
            <select value={s.variedad ?? ''} onChange={e => set('variedad', e.target.value)} className="input-base pr-8 appearance-none">
              <option value="">Selecciona cultivo</option>
              {['Maíz blanco','Maíz amarillo','Soja','Arroz','Trigo','Sorgo','Caña de azúcar','Café','Cacao','Plátano','Tomate','Pimentón','Lechuga','Papa','Yuca','Otro'].map(v => <option key={v}>{v}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          </div>
        </FormField>
        <FormField label="Calidad / Calibre">
          <input type="text" value={s.calidad ?? ''} onChange={e => set('calidad', e.target.value)} placeholder="Grado A, 14% humedad..." className="input-base" />
        </FormField>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <FormField label="Volumen disponible">
            <input type="text" value={s.volumen ?? ''} onChange={e => set('volumen', e.target.value)} placeholder="450" className="input-base" />
          </FormField>
        </div>
        <FormField label="Unidad">
          <div className="relative">
            <select value={s.volumenUnidad ?? 'Ton'} onChange={e => set('volumenUnidad', e.target.value)} className="input-base pr-8 appearance-none">
              {['Ton','kg','quintal','saco 50kg','caja','unidad'].map(u => <option key={u}>{u}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          </div>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Fecha de cosecha">
          <input type="date" value={s.fechaCosecha ?? ''} onChange={e => set('fechaCosecha', e.target.value)} className="input-base" />
        </FormField>
        <FormField label="Empaque">
          <div className="relative">
            <select value={s.empaque ?? ''} onChange={e => set('empaque', e.target.value)} className="input-base pr-8 appearance-none">
              <option value="">Sin especificar</option>
              {['Granel','Bolsas 50kg','Sacos','Cajas','Bins','A granel'].map(e => <option key={e}>{e}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          </div>
        </FormField>
      </div>
    </div>
  )

  if (pubType === 'finca') return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Datos del predio</p>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Área total (hectáreas)">
          <input type="number" value={s.area ?? ''} onChange={e => set('area', e.target.value)} placeholder="150" className="input-base" min="0" />
        </FormField>
        <FormField label="Tipo de suelo">
          <div className="relative">
            <select value={s.tipoSuelo ?? ''} onChange={e => set('tipoSuelo', e.target.value)} className="input-base pr-8 appearance-none">
              <option value="">Selecciona</option>
              {['Franco arcilloso','Arcilloso pesado','Franco arenoso','Arenoso','Limoso','Franco','Pedregoso','Otro'].map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          </div>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Fuente de agua">
          <div className="relative">
            <select value={s.fuenteAgua ?? ''} onChange={e => set('fuenteAgua', e.target.value)} className="input-base pr-8 appearance-none">
              <option value="">Selecciona</option>
              {['Pozo profundo','Río / Caño','Acueducto','Lluvia','Sin agua','Múltiples fuentes'].map(a => <option key={a}>{a}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          </div>
        </FormField>
        <FormField label="Sistema de riego">
          <div className="relative">
            <select value={s.riego ?? ''} onChange={e => set('riego', e.target.value)} className="input-base pr-8 appearance-none">
              <option value="">Selecciona</option>
              {['Sin riego','Por goteo','Aspersión','Inundación','Manual','Mixto'].map(r => <option key={r}>{r}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          </div>
        </FormField>
      </div>
      <FormField label="Infraestructura disponible">
        <input type="text" value={s.infraestructura ?? ''} onChange={e => set('infraestructura', e.target.value)} placeholder="Galpones, silos, casa administración, corrales..." className="input-base" />
      </FormField>
    </div>
  )

  if (pubType === 'insumo') return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Datos del producto</p>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Marca">
          <input type="text" value={s.marca ?? ''} onChange={e => set('marca', e.target.value)} placeholder="Bayer, Syngenta, Yara..." className="input-base" />
        </FormField>
        <FormField label="Presentación / Tamaño">
          <input type="text" value={s.presentacion ?? ''} onChange={e => set('presentacion', e.target.value)} placeholder="1kg, 5kg, 25kg..." className="input-base" />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Tipo de uso">
          <div className="relative">
            <select value={s.usoRecomendado ?? ''} onChange={e => set('usoRecomendado', e.target.value)} className="input-base pr-8 appearance-none">
              <option value="">Selecciona</option>
              {['Fertilizante','Herbicida','Fungicida','Insecticida','Semillas','Bioinsumo','Herramienta','Otro'].map(u => <option key={u}>{u}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          </div>
        </FormField>
        <FormField label="Inventario disponible">
          <input type="text" value={s.inventario ?? ''} onChange={e => set('inventario', e.target.value)} placeholder="500 unidades en stock" className="input-base" />
        </FormField>
      </div>
      <FormField label="Cultivos recomendados">
        <input type="text" value={s.cultivos ?? ''} onChange={e => set('cultivos', e.target.value)} placeholder="Maíz, Soja, Tomate, Papa..." className="input-base" />
      </FormField>
    </div>
  )

  if (pubType === 'maquinaria') return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Datos del equipo</p>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Tipo de equipo *">
          <div className="relative">
            <select value={s.tipoEquipo ?? ''} onChange={e => set('tipoEquipo', e.target.value)} className="input-base pr-8 appearance-none">
              <option value="">Selecciona</option>
              {['Tractor','Cosechadora','Pulverizador','Sembradora','Sistema de riego','Fumigadora','Desgranadora','Implemento agrícola','Repuesto','Otro'].map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          </div>
        </FormField>
        <FormField label="Estado">
          <div className="relative">
            <select value={s.estado ?? ''} onChange={e => set('estado', e.target.value)} className="input-base pr-8 appearance-none">
              <option value="">Selecciona</option>
              {['Nuevo','Usado – buen estado','Usado – regular','Reacondicionado'].map(e => <option key={e}>{e}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          </div>
        </FormField>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <FormField label="Marca">
          <input type="text" value={s.marca ?? ''} onChange={e => set('marca', e.target.value)} placeholder="John Deere..." className="input-base" />
        </FormField>
        <FormField label="Modelo">
          <input type="text" value={s.modelo ?? ''} onChange={e => set('modelo', e.target.value)} placeholder="5075E" className="input-base" />
        </FormField>
        <FormField label="Año">
          <input type="number" value={s.anio ?? ''} onChange={e => set('anio', e.target.value)} placeholder="2019" className="input-base" min="1950" max="2030" />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {(s.estado ?? '').toLowerCase().includes('usado') && (
          <FormField label="Horas de uso">
            <input type="number" value={s.horasUso ?? ''} onChange={e => set('horasUso', e.target.value)} placeholder="1500" className="input-base" min="0" />
          </FormField>
        )}
        <FormField label="Potencia (opcional)">
          <input type="text" value={s.potencia ?? ''} onChange={e => set('potencia', e.target.value)} placeholder="75 HP" className="input-base" />
        </FormField>
      </div>
    </div>
  )

  if (pubType === 'servicio') return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Datos del servicio</p>
      <FormField label="Especialidad">
        <div className="relative">
          <select value={s.especialidad ?? ''} onChange={e => set('especialidad', e.target.value)} className="input-base pr-8 appearance-none">
            <option value="">Selecciona especialidad</option>
            {['Agronomía general','Manejo de plagas y enfermedades','Análisis de suelos','Plan de fertilización','Diseño de sistema de riego','Fitosanidad','Postcosecha','Buenas Prácticas Agrícolas','Certificaciones agrícolas','Otro'].map(e => <option key={e}>{e}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        </div>
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Cobertura geográfica">
          <input type="text" value={s.cobertura ?? ''} onChange={e => set('cobertura', e.target.value)} placeholder="Aragua, Carabobo, Miranda..." className="input-base" />
        </FormField>
        <FormField label="Disponibilidad">
          <input type="text" value={s.disponibilidad ?? ''} onChange={e => set('disponibilidad', e.target.value)} placeholder="Lun–Vie, 8am–5pm" className="input-base" />
        </FormField>
      </div>
      <FormField label="Documentos profesionales (opcional)">
        <input type="text" value={s.documentos ?? ''} onChange={e => set('documentos', e.target.value)} placeholder="Título universitario, CIAEV, cert. técnicas..." className="input-base" />
      </FormField>
    </div>
  )

  if (pubType === 'transporte') return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Datos del vehículo</p>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Tipo de vehículo *">
          <div className="relative">
            <select value={s.tipoVehiculo ?? ''} onChange={e => set('tipoVehiculo', e.target.value)} className="input-base pr-8 appearance-none">
              <option value="">Selecciona</option>
              {['Camión seco','Camión refrigerado','Gandola seca','Gandola refrigerada','Camioneta pickup','Tractomula','Furgón','Otro'].map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          </div>
        </FormField>
        <FormField label="Tipo de carga">
          <input type="text" value={s.tipoCarga ?? ''} onChange={e => set('tipoCarga', e.target.value)} placeholder="Frutas, verduras, granos..." className="input-base" />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Capacidad de carga">
          <input type="text" value={s.capacidad ?? ''} onChange={e => set('capacidad', e.target.value)} placeholder="20 Ton" className="input-base" />
        </FormField>
        <FormField label="Disponibilidad">
          <input type="text" value={s.disponibilidad ?? ''} onChange={e => set('disponibilidad', e.target.value)} placeholder="Lun–Sáb, reservas..." className="input-base" />
        </FormField>
      </div>
      <FormField label="Rutas disponibles">
        <input type="text" value={s.rutas ?? ''} onChange={e => set('rutas', e.target.value)} placeholder="Caracas – Valencia – Maracay" className="input-base" />
      </FormField>
      <FormField label="Condiciones de conservación (opcional)">
        <input type="text" value={s.condiciones ?? ''} onChange={e => set('condiciones', e.target.value)} placeholder="Temperatura: 4°C – 8°C" className="input-base" />
      </FormField>
    </div>
  )

  return null
}

// ─── Main modal (3 steps) ──────────────────────────────────────────────────

function ListingModal({ mode, listing, onClose }: ListingModalProps) {
  const [step, setStep] = useState<ModalStep>(mode === 'create' ? 'type' : 'form')
  const [pubType, setPubType] = useState<PubType | null>(null)
  const [savedId, setSavedId] = useState<number | null>(listing?.id ?? null)
  const [form, setForm] = useState<FormState>(
    mode === 'edit' && listing ? toFormState(listing) : EMPTY_FORM,
  )
  const [spec, setSpec] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  const { data: categories = [] } = useCategoriesQuery()
  const createMut = useCreateListingMutation()
  const updateMut = useUpdateListingMutation()
  const statusMut = useChangeListingStatusMutation()

  const needsPause = mode === 'edit' && listing &&
    ['published', 'pending_review'].includes(listing.status)

  const isSaving = createMut.isPending || updateMut.isPending || statusMut.isPending
  const selectedCategory = categories.find((c) => c.id === Number(form.categoryId))
  const subcategories = selectedCategory?.subcategories ?? []

  const selectedMeta = pubType ? PUB_TYPES.find(t => t.key === pubType) : null

  function setBase(key: keyof FormState, val: string) {
    setForm((f) => {
      const next = { ...f, [key]: val }
      if (key === 'categoryId') next.subcategoryId = ''
      return next
    })
  }

  function setSpecField(k: string, v: string) {
    setSpec(s => ({ ...s, [k]: v }))
  }

  function handleTypeSelect(type: PubType) {
    const meta = PUB_TYPES.find(t => t.key === type)!
    setPubType(type)
    setForm(f => ({ ...f, listingType: meta.listingType, priceUnit: meta.priceUnit }))
    setStep('form')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!form.categoryId) { setError('Selecciona una categoría'); return }
    if (form.title.trim().length < 5) { setError('El título debe tener al menos 5 caracteres'); return }

    const description = pubType ? buildDescription(pubType, spec) : form.description ?? ''

    if (mode === 'create') {
      const payload: CreateListingPayload = {
        categoryId: Number(form.categoryId),
        title: form.title.trim(),
        listingType: form.listingType,
        ...(form.subcategoryId ? { subcategoryId: Number(form.subcategoryId) } : {}),
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(form.price ? { price: form.price } : {}),
        ...(form.priceUnit ? { priceUnit: form.priceUnit } : {}),
        ...(form.department.trim() ? { department: form.department.trim() } : {}),
        ...(form.municipality.trim() ? { municipality: form.municipality.trim() } : {}),
      }
      createMut.mutate(payload, {
        onSuccess: ({ id }) => { setSavedId(id); setStep('photos') },
        onError: () => setError('Error al crear la publicación. Verifica los datos.'),
      })
    } else if (listing) {
      const payload: UpdateListingPayload = {
        title: form.title.trim(),
        listingType: form.listingType,
        ...(form.subcategoryId ? { subcategoryId: Number(form.subcategoryId) } : {}),
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(form.price ? { price: form.price } : {}),
        ...(form.priceUnit ? { priceUnit: form.priceUnit } : {}),
        ...(form.department.trim() ? { department: form.department.trim() } : {}),
        ...(form.municipality.trim() ? { municipality: form.municipality.trim() } : {}),
      }
      const doUpdate = () => updateMut.mutate({ id: listing.id, payload }, {
        onSuccess: () => { setSavedId(listing.id); setStep('photos') },
        onError: () => setError('Error al actualizar la publicación.'),
      })
      if (needsPause) {
        statusMut.mutate({ id: listing.id, status: 'paused' }, {
          onSuccess: doUpdate,
          onError: () => setError('No se pudo pausar la publicación para editarla.'),
        })
      } else {
        doUpdate()
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={step === 'type' ? onClose : undefined}
    >
      <div
        className={cn(
          'relative w-full rounded-2xl bg-white shadow-xl overflow-hidden',
          step === 'type' ? 'max-w-2xl' : 'max-w-xl',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            {step === 'form' && mode === 'create' && (
              <button
                type="button"
                onClick={() => setStep('type')}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <h2 className="font-display text-base font-bold text-gray-900">
                {mode === 'edit'
                  ? 'Editar publicación'
                  : step === 'type'
                  ? 'Nueva publicación'
                  : `Publicar: ${selectedMeta?.label ?? ''}`}
              </h2>
            </div>
            {step !== 'type' && (
              <div className="flex items-center gap-1 ml-1">
                {(['form', 'photos'] as const).map((s, idx) => (
                  <span key={s} className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    step === s ? 'bg-agrobot-100 text-agrobot-700'
                      : idx === 0 && step === 'photos' ? 'bg-gray-100 text-gray-400 line-through'
                      : 'bg-gray-100 text-gray-400',
                  )}>
                    {idx === 0 ? '1. Información' : '2. Fotos'}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Step: Type selector ── */}
        {step === 'type' && (
          <div className="px-6 py-5">
            <p className="mb-4 text-sm text-gray-500">¿Qué tipo de publicación quieres crear?</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PUB_TYPES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => handleTypeSelect(t.key)}
                  className={cn(
                    'group flex flex-col items-start gap-2.5 rounded-xl border-2 p-4 text-left transition-all hover:shadow-sm',
                    t.border, t.hoverBorder,
                  )}
                >
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', t.bg)}>
                    <t.icon className={cn('h-5 w-5', t.color)} />
                  </div>
                  <div>
                    <p className={cn('text-sm font-bold leading-tight', t.color)}>{t.label}</p>
                    <p className="mt-0.5 text-[11px] text-gray-500 leading-relaxed">{t.sub}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-gray-400">Selecciona el tipo para ver el formulario especializado</p>
          </div>
        )}

        {/* ── Step: Specialized form ── */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto px-6 py-5 flex flex-col gap-4">

            {/* Type badge for create mode */}
            {mode === 'create' && selectedMeta && (
              <div className={cn('flex items-center gap-2 rounded-xl border px-3 py-2', selectedMeta.bg, selectedMeta.border)}>
                <selectedMeta.icon className={cn('h-4 w-4', selectedMeta.color)} />
                <span className={cn('text-xs font-bold', selectedMeta.color)}>{selectedMeta.label}</span>
              </div>
            )}

            {/* Category */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Categoría *">
                <div className="relative">
                  <select value={form.categoryId} onChange={(e) => setBase('categoryId', e.target.value)} className="input-base pr-8 appearance-none">
                    <option value="">Selecciona categoría</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                </div>
              </FormField>
              {subcategories.length > 0 && (
                <FormField label="Subcategoría">
                  <div className="relative">
                    <select value={form.subcategoryId} onChange={(e) => setBase('subcategoryId', e.target.value)} className="input-base pr-8 appearance-none">
                      <option value="">Sin subcategoría</option>
                      {subcategories.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  </div>
                </FormField>
              )}
            </div>

            {/* Title */}
            <FormField label="Título *">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setBase('title', e.target.value)}
                placeholder={
                  pubType === 'producto' ? 'Ej: Maíz Blanco Híbrido DK-7088 — 450 Ton'
                  : pubType === 'finca' ? 'Ej: Finca La Esperanza — 150 ha en Portuguesa'
                  : pubType === 'insumo' ? 'Ej: Fungicida Amistar Bayer 1 kg'
                  : pubType === 'maquinaria' ? 'Ej: Tractor John Deere 5075E 2019'
                  : pubType === 'servicio' ? 'Ej: Servicio de análisis de suelos y fertilización'
                  : pubType === 'transporte' ? 'Ej: Camión refrigerado 20 Ton – Rutas nacionales'
                  : 'Título de la publicación'
                }
                maxLength={255}
                className="input-base"
              />
              <span className="text-[10px] text-gray-400 self-end">{form.title.length}/255</span>
            </FormField>

            {/* Specialized fields for create mode */}
            {mode === 'create' && pubType && (
              <SpecFields pubType={pubType} spec={spec} set={setSpecField} />
            )}

            {/* Edit mode: description textarea */}
            {mode === 'edit' && (
              <FormField label="Descripción">
                <textarea
                  value={form.description}
                  onChange={(e) => setBase('description', e.target.value)}
                  placeholder="Describe el producto, calidad, condiciones, etc."
                  rows={3}
                  maxLength={5000}
                  className="input-base resize-none"
                />
              </FormField>
            )}

            {/* Listing type — only show when relevant */}
            {(pubType === 'finca' || pubType === 'maquinaria' || mode === 'edit') && (
              <FormField label={pubType === 'finca' ? 'Tipo de operación' : pubType === 'maquinaria' ? 'Tipo de transacción' : 'Tipo de publicación'}>
                <div className="flex gap-2">
                  {(pubType === 'finca'
                    ? [{ v: 'sale', l: 'Venta' }, { v: 'rent', l: 'Arriendo' }, { v: 'alliance', l: 'Alianza' }]
                    : pubType === 'maquinaria'
                    ? [{ v: 'sale', l: 'Venta' }, { v: 'rent', l: 'Alquiler' }]
                    : [{ v: 'sale', l: 'Venta' }, { v: 'rent', l: 'Arriendo' }, { v: 'service', l: 'Servicio' }, { v: 'quote', l: 'Cotización' }, { v: 'alliance', l: 'Alianza' }]
                  ).map(({ v, l }) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setBase('listingType', v)}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                        form.listingType === v
                          ? 'border-agrobot-400 bg-agrobot-50 text-agrobot-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300',
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </FormField>
            )}

            {/* Price + unit */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Precio">
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => { const v = e.target.value; if (v === '' || /^\d*\.?\d{0,2}$/.test(v)) setBase('price', v) }}
                  placeholder="0.00"
                  className="input-base"
                />
              </FormField>
              <FormField label="Unidad de precio">
                <input
                  type="text"
                  value={form.priceUnit}
                  onChange={(e) => setBase('priceUnit', e.target.value)}
                  placeholder="Ton, kg, ha, /visita…"
                  maxLength={20}
                  className="input-base"
                />
              </FormField>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ubicación</p>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Estado / Departamento">
                  <input type="text" value={form.department} onChange={(e) => setBase('department', e.target.value)} placeholder="Ej: Aragua" maxLength={100} className="input-base" />
                </FormField>
                <FormField label="Municipio / Ciudad">
                  <input type="text" value={form.municipality} onChange={(e) => setBase('municipality', e.target.value)} placeholder="Ej: Maracay" maxLength={100} className="input-base" />
                </FormField>
              </div>
            </div>

            {needsPause && (
              <p className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-xs font-medium text-amber-700">
                Esta publicación está <strong>publicada</strong>. Al guardar se pausará automáticamente y deberás enviarla a revisión nuevamente.
              </p>
            )}
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}

            <div className="flex justify-end gap-3 pt-1 border-t border-gray-100">
              <button type="button" onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={isSaving} className="flex items-center gap-2 rounded-xl bg-agrobot-600 px-5 py-2 text-sm font-bold text-white hover:bg-agrobot-700 disabled:opacity-50 transition-colors">
                {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" />Guardando…</> : 'Continuar → Fotos'}
              </button>
            </div>
          </form>
        )}

        {/* ── Step: Photos ── */}
        {step === 'photos' && savedId && <PhotosStep listingId={savedId} onDone={onClose} />}
      </div>
    </div>
  )
}

// ─── Confirm Delete Dialog ────────────────────────────────────────────────────

function ConfirmDeleteDialog({ listing, onClose }: { listing: MyListing; onClose: () => void }) {
  const changeMut = useChangeListingStatusMutation()

  function handleDelete() {
    changeMut.mutate({ id: listing.id, status: 'deleted' }, { onSuccess: onClose })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-base font-bold text-gray-900">Eliminar publicación</h3>
        <p className="mt-2 text-sm text-gray-500">
          ¿Eliminar <span className="font-semibold text-gray-700">"{listing.title}"</span>? Esta acción no se puede deshacer.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={changeMut.isPending}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {changeMut.isPending ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SellerListings() {
  const { data: listings, isLoading } = useMyListingsQuery()
  const changeMut = useChangeListingStatusMutation()

  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [editListing, setEditListing] = useState<MyListing | null>(null)
  const [deleteListing, setDeleteListing] = useState<MyListing | null>(null)

  const allListings = listings ?? []
  const filtered = activeFilter === 'all'
    ? allListings
    : allListings.filter((l) => l.status === activeFilter)

  function countFor(tab: FilterTab) {
    return tab === 'all' ? allListings.length : allListings.filter((l) => l.status === tab).length
  }

  const canEdit   = (l: MyListing) => !['expired', 'deleted'].includes(l.status)
  const canDelete = (l: MyListing) => ['draft', 'paused', 'rejected'].includes(l.status)
  const canPause  = (l: MyListing) => l.status === 'published'
  const canResume = (l: MyListing) => l.status === 'paused'
  const canSubmit = (l: MyListing) => l.status === 'draft'

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Mis Publicaciones</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {isLoading ? '…' : `${allListings.length} publicación${allListings.length !== 1 ? 'es' : ''} en total`}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white hover:bg-agrobot-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Nueva publicación
        </button>
      </div>

      {/* Filter tabs */}
      {!isLoading && (
        <div className="flex flex-wrap gap-2">
          {FILTER_TABS.map(({ key, label }) => {
            const count = countFor(key)
            if (key !== 'all' && count === 0) return null
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  activeFilter === key
                    ? 'border-agrobot-200 bg-agrobot-50 text-agrobot-700'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300',
                )}
              >
                {label}
                <span className={cn(
                  'rounded-full px-1.5 py-0 text-[10px] font-bold',
                  activeFilter === key ? 'bg-agrobot-100' : 'bg-gray-100',
                )}>{count}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-5 flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
              <Package className="h-7 w-7 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">
                {activeFilter === 'all'
                  ? 'No tienes publicaciones aún'
                  : `Sin publicaciones ${STATUS_LABEL[activeFilter as ListingStatus]?.toLowerCase()}`}
              </p>
              {activeFilter === 'all' && (
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Crea tu primera publicación para empezar a vender en AgroMarket.
                </p>
              )}
            </div>
            {activeFilter === 'all' && (
              <button
                onClick={() => setShowCreate(true)}
                className="mt-2 flex items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white hover:bg-agrobot-700 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Crear publicación
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 w-[36%]">Publicación</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Tipo</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Precio</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Estado</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-400">Vistas</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Fecha</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-900 line-clamp-1">{l.title}</p>
                      {l.department && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {[l.municipality, l.department].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', TYPE_COLOR[l.listingType])}>
                        {TYPE_LABEL[l.listingType]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {l.price ? (
                        <span className="font-semibold text-gray-800">
                          ${l.price}{l.priceUnit ? <span className="font-normal text-gray-400"> / {l.priceUnit}</span> : ''}
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400">A consultar</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', STATUS_COLOR[l.status])}>
                        {STATUS_LABEL[l.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="flex items-center justify-center gap-1 text-[11px] text-gray-400">
                        <Eye className="h-3 w-3" />{l.viewCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-gray-400">{fmtDate(l.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {canSubmit(l) && (
                          <button
                            onClick={() => changeMut.mutate({ id: l.id, status: 'published' })}
                            title="Publicar"
                            disabled={changeMut.isPending}
                            className="rounded-lg p-1.5 text-gray-300 hover:bg-agrobot-50 hover:text-agrobot-600 transition-colors disabled:opacity-40"
                          >
                            <SendHorizonal className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {canEdit(l) && (
                          <button
                            onClick={() => setEditListing(l)}
                            title="Editar"
                            className="rounded-lg p-1.5 text-gray-300 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {canPause(l) && (
                          <button
                            onClick={() => changeMut.mutate({ id: l.id, status: 'paused' })}
                            title="Pausar"
                            disabled={changeMut.isPending}
                            className="rounded-lg p-1.5 text-gray-300 hover:bg-amber-50 hover:text-amber-600 transition-colors disabled:opacity-40"
                          >
                            <PauseCircle className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {canResume(l) && (
                          <button
                            onClick={() => changeMut.mutate({ id: l.id, status: 'published' })}
                            title="Reactivar"
                            disabled={changeMut.isPending}
                            className="rounded-lg p-1.5 text-gray-300 hover:bg-agrobot-50 hover:text-agrobot-600 transition-colors disabled:opacity-40"
                          >
                            <PlayCircle className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {canDelete(l) && (
                          <button
                            onClick={() => setDeleteListing(l)}
                            title="Eliminar"
                            className="rounded-lg p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {l.status === 'published' && (
                          <Link
                            to={`/anuncios/${l.slug}`}
                            target="_blank"
                            title="Ver en marketplace"
                            className="rounded-lg p-1.5 text-gray-300 hover:text-agrobot-600 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <ListingModal mode="create" onClose={() => setShowCreate(false)} />
      )}
      {editListing && (
        <ListingModal mode="edit" listing={editListing} onClose={() => setEditListing(null)} />
      )}
      {deleteListing && (
        <ConfirmDeleteDialog listing={deleteListing} onClose={() => setDeleteListing(null)} />
      )}
    </div>
  )
}
