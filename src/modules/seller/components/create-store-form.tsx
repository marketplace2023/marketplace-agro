import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router'
import { Building2, MapPin, FileText, Link2 } from 'lucide-react'
import { useCreateStoreMutation } from '../queries/seller-queries'
import type { StoreRoleType } from '../api/seller-api'
import { toast } from 'sonner'

// ─── Role options ─────────────────────────────────────────────────────────────

const ROLE_OPTIONS: { value: StoreRoleType; label: string; description: string }[] = [
  { value: 'seller', label: 'Tienda / Vendedor', description: 'Vendo productos agrícolas varios' },
  { value: 'producer', label: 'Productor agrícola', description: 'Cosechas y producción propia' },
  { value: 'farm_owner', label: 'Dueño de finca', description: 'Arriendo o vendo predios' },
  { value: 'input_supplier', label: 'Proveedor de insumos', description: 'Semillas, fertilizantes, agroquímicos' },
  { value: 'machinery_supplier', label: 'Maquinaria agrícola', description: 'Venta o alquiler de maquinaria' },
  { value: 'agronomist', label: 'Agrónomo / Técnico', description: 'Servicios agronómicos y asesorías' },
  { value: 'transporter', label: 'Transportista', description: 'Fletes y logística agrícola' },
  { value: 'cooperative', label: 'Cooperativa', description: 'Organización cooperativa agrícola' },
  { value: 'laboratory', label: 'Laboratorio', description: 'Análisis de suelos y muestras' },
  { value: 'certifier', label: 'Certificador', description: 'Certificaciones agrícolas y orgánicas' },
  { value: 'quality_inspector', label: 'Inspector de calidad', description: 'Inspección y control de calidad' },
]

// ─── Venezuela states ─────────────────────────────────────────────────────────

const VE_STATES = [
  'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar', 'Carabobo',
  'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón', 'Guárico', 'Lara',
  'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre',
  'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia',
]

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  roleType: z.enum([
    'seller', 'producer', 'farm_owner', 'input_supplier', 'machinery_supplier',
    'agronomist', 'transporter', 'cooperative', 'laboratory', 'certifier', 'quality_inspector',
  ] as const),
  name: z.string().min(2, 'Mínimo 2 caracteres').max(150),
  slug: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(170)
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  description: z.string().max(2000).optional(),
  department: z.string().optional(),
  municipality: z.string().max(100).optional(),
})

type FormValues = z.infer<typeof schema>

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 170)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateStoreForm() {
  const createStore = useCreateStoreMutation()
  const [slugEdited, setSlugEdited] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { roleType: 'seller' },
  })

  const selectedRole = watch('roleType')
  const slugValue = watch('slug') ?? ''

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setValue('name', name)
    if (!slugEdited) {
      setValue('slug', slugify(name), { shouldValidate: true })
    }
  }

  function onSubmit(data: FormValues) {
    createStore.mutate(data, {
      onError: (err: unknown) => {
        const apiErr = err as { response?: { data?: { errors?: Record<string, string[]> } } }
        const fieldErrors = apiErr?.response?.data?.errors
        if (fieldErrors) {
          Object.entries(fieldErrors).forEach(([field, messages]) => {
            setError(field as keyof FormValues, { message: messages[0] })
          })
        } else {
          toast.error('No se pudo registrar el perfil. Intenta de nuevo.')
        }
      },
    })
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">Configura tu perfil de negocio</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Para acceder al panel debes registrar los datos de tu negocio.
          </p>
        </div>

        <div className="grid gap-5 px-6 py-5 md:grid-cols-2">

          {/* Role type — full width */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-semibold text-gray-700">
              Tipo de negocio <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ROLE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 transition-colors ${
                    selectedRole === opt.value
                      ? 'border-agrobot-600 bg-agrobot-50'
                      : 'border-gray-200 hover:border-agrobot-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    value={opt.value}
                    {...register('roleType')}
                    className="mt-0.5 accent-agrobot-700"
                  />
                  <div>
                    <p className={`text-xs font-semibold leading-tight ${selectedRole === opt.value ? 'text-agrobot-800' : 'text-gray-800'}`}>
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{opt.description}</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.roleType && <p className="mt-1 text-xs text-red-500">{errors.roleType.message}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Nombre del negocio <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                {...register('name')}
                onChange={handleNameChange}
                className="pl-9"
                placeholder="Ej: Agro Portuguesa C.A."
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              URL de tu tienda <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                {...register('slug')}
                onChange={(e) => {
                  setSlugEdited(true)
                  setValue('slug', e.target.value, { shouldValidate: true })
                }}
                className="pl-9 font-mono text-sm"
                placeholder="mi-tienda"
              />
            </div>
            <p className="mt-0.5 text-[10px] text-gray-400">
              agromarket.com/tiendas/<span className="font-medium text-gray-600">{slugValue || 'mi-tienda'}</span>
            </p>
            {errors.slug && <p className="mt-0.5 text-xs text-red-500">{errors.slug.message}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Estado
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                {...register('department')}
                className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecciona un estado</option>
                {VE_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Municipality */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Municipio
            </label>
            <Input
              {...register('municipality')}
              placeholder="Ej: Guanare"
            />
          </div>

          {/* Description — full width */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Descripción
            </label>
            <div className="relative">
              <FileText className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Cuéntanos qué ofreces, tu experiencia, zona de cobertura..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <Link
            to="/"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={createStore.isPending}
            className="rounded-xl bg-agrobot-700 px-5 py-2 text-sm font-bold text-white hover:bg-agrobot-800 disabled:opacity-60 transition-colors"
          >
            {createStore.isPending ? 'Registrando...' : 'Guardar y continuar →'}
          </button>
        </div>
      </form>
    </div>
  )
}
