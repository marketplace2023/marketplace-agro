import { useState } from 'react'
import { ArrowRight, Wheat, TreePine, Package, Wrench, Briefcase, FlaskConical, BadgeCheck, ClipboardCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Categoria {
  id: string
  label: string
  count: string
  subcategories: string[]
  image: string
  gradient: string
  Icon: LucideIcon
}

interface Oportunidad {
  badge: string
  badgeColor: string
  title: string
  description: string
  cta: string
  bg: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const categorias: Categoria[] = [
  {
    id: 'cosechas',
    label: 'Cosechas',
    count: '1,240',
    subcategories: ['Granos y Cereales', 'Frutas de Temporada', 'Hortalizas Frescas'],
    image: '/cat-cosechas.jpg',
    gradient: 'from-agrobot-600 to-agrobot-900',
    Icon: Wheat,
  },
  {
    id: 'fincas',
    label: 'Fincas',
    count: '452',
    subcategories: ['Venta de Tierras', 'Alquiler Productivo', 'Invernaderos'],
    image: '/cat-fincas.jpg',
    gradient: 'from-emerald-600 to-emerald-900',
    Icon: TreePine,
  },
  {
    id: 'insumos',
    label: 'Insumos',
    count: '3,120',
    subcategories: ['Fertilizantes', 'Semillas Certificadas', 'Agroquímicos'],
    image: '/cat-insumos.jpg',
    gradient: 'from-lime-600 to-lime-900',
    Icon: Package,
  },
  {
    id: 'maquinaria',
    label: 'Maquinaria',
    count: '890',
    subcategories: ['Tractores y Cosecha', 'Implementos', 'Repuestos'],
    image: '/cat-maquinaria.jpg',
    gradient: 'from-orange-600 to-orange-900',
    Icon: Wrench,
  },
  {
    id: 'servicios',
    label: 'Servicios',
    count: '645',
    subcategories: ['Asesoría Técnica', 'Logística y Transporte', 'Mantenimiento'],
    image: '/cat-servicios.jpg',
    gradient: 'from-sky-600 to-sky-900',
    Icon: Briefcase,
  },
  {
    id: 'laboratorios',
    label: 'Laboratorios',
    count: '124',
    subcategories: ['Análisis de Suelos', 'Calidad de Agua', 'Fitopatología'],
    image: '/cat-laboratorios.jpg',
    gradient: 'from-violet-600 to-violet-900',
    Icon: FlaskConical,
  },
  {
    id: 'certificadores',
    label: 'Certificadores',
    count: '86',
    subcategories: ['Orgánico / Global GAP', 'Sostenibilidad', 'Huella de Carbono'],
    image: '/cat-certificadores.jpg',
    gradient: 'from-teal-600 to-teal-900',
    Icon: BadgeCheck,
  },
  {
    id: 'inspectores',
    label: 'Inspectores',
    count: '215',
    subcategories: ['Control de Calidad', 'Auditoría de Carga', 'Peritajes Agrícolas'],
    image: '/cat-inspectores.jpg',
    gradient: 'from-rose-600 to-rose-900',
    Icon: ClipboardCheck,
  },
]

const oportunidades: Oportunidad[] = [
  {
    badge: 'EVENTO',
    badgeColor: 'bg-orange-500',
    title: 'Cosecha de Maíz 2026',
    description: 'Accede a precios preferenciales en logística para el transporte de grano.',
    cta: 'Explorar beneficios',
    bg: '/farm-bg.png',
  },
  {
    badge: 'OFERTA',
    badgeColor: 'bg-agrobot-600',
    title: 'Fertilizantes Orgánicos',
    description: 'Descuentos de hasta el 15% en compras por volumen para esta siembra.',
    cta: 'Ver distribuidores',
    bg: '/bg-cafe.png',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoriaCard({ cat }: { cat: Categoria }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
      {/* Image area */}
      <div className="relative overflow-hidden" style={{ height: 140 }}>
        {!imgError ? (
          <img
            src={cat.image}
            alt={cat.label}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${cat.gradient}`}>
            <cat.Icon className="h-14 w-14 text-white/30" />
          </div>
        )}
        {/* Count badge */}
        <span className="absolute top-2.5 right-2.5 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-semibold text-white">
          {cat.count} anuncios
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-base font-bold text-gray-900 mb-2">{cat.label}</h3>
        <ul className="space-y-1 mb-4">
          {cat.subcategories.map((sub) => (
            <li key={sub} className="text-xs text-gray-500 hover:text-agrobot-700 cursor-pointer transition-colors">
              {sub}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1 text-xs font-semibold text-agrobot-700 hover:underline">
          Ver todo
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  )
}

function OportunidadCard({ op }: { op: Oportunidad }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl flex-1 min-h-[220px] flex flex-col justify-end p-6 cursor-pointer group"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.30) 60%, rgba(0,0,0,0.10) 100%), url('${op.bg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10">
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white mb-2 ${op.badgeColor}`}>
          {op.badge}
        </span>
        <h3 className="font-display text-lg font-bold text-white leading-tight">{op.title}</h3>
        <p className="mt-1 text-xs text-white/75 leading-relaxed max-w-xs">{op.description}</p>
        <button className="mt-3 flex items-center gap-1 text-sm font-bold text-white hover:gap-2 transition-all">
          {op.cta}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function CategoriasPage() {
  return (
    <div className="bg-white min-h-screen pb-10">
      <div className="mx-auto max-w-6xl px-4">

        {/* Header */}
        <div className="pt-8 pb-6">
          <h1 className="font-display text-4xl font-bold text-gray-900 leading-tight">
            Explora el Mercado Agrícola
          </h1>
          <p className="mt-2 text-sm text-gray-500 max-w-lg leading-relaxed">
            Encuentra todo lo que necesitas para tu producción desde un solo lugar. Conectamos productores con proveedores certificados en toda Latinoamérica.
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categorias.map((cat) => (
            <CategoriaCard key={cat.id} cat={cat} />
          ))}
        </div>

        {/* Oportunidades de Temporada */}
        <div className="mt-12">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
            Oportunidades de Temporada
          </h2>
          <div className="flex gap-4">
            {oportunidades.map((op) => (
              <OportunidadCard key={op.title} op={op} />
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-8 rounded-2xl bg-agrobot-700 px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">¿Tienes algo que ofrecer?</h2>
            <p className="mt-1.5 text-sm text-white/75 max-w-sm leading-relaxed">
              Llega a miles de productores calificados publicando tus productos o servicios en la categoría correcta.
            </p>
          </div>
          <button className="shrink-0 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-agrobot-800 transition-colors hover:bg-agrobot-50 shadow">
            Publicar ahora
          </button>
        </div>

      </div>
    </div>
  )
}
