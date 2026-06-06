import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCategoriesQuery } from '@/modules/categories/queries/category-queries'
import type { Category } from '@/modules/categories/api/categories'

// ─── Icon resolver ──────────────────────────────────────────────────────────
// Maps the string icon name stored in the DB (e.g. "leaf") to a Lucide component.
// Lucide exports icons in PascalCase; handle common kebab → PascalCase aliases.
const ICON_ALIASES: Record<string, string> = {
  'flask-conical':  'FlaskConical',
  'flask':          'FlaskConical',
  'check-square':   'SquareCheck',
  'map-pin':        'MapPin',
  'building':       'Building2',
  'leaf':           'Leaf',
  'tractor':        'Tractor',
  'clipboard':      'ClipboardList',
  'truck':          'Truck',
  'award':          'Award',
}

function toPascalCase(str: string): string {
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
}

function resolveIcon(name: string | null): LucideIcon {
  if (!name) return Icons.Package as LucideIcon
  const key = ICON_ALIASES[name] ?? toPascalCase(name)
  return ((Icons as Record<string, unknown>)[key] as LucideIcon | undefined) ?? Icons.Package as LucideIcon
}

// ─── Gradient palette (cycled by sortOrder) ─────────────────────────────────
const GRADIENTS = [
  'from-agrobot-600 to-agrobot-900',
  'from-lime-600 to-lime-900',
  'from-orange-600 to-orange-900',
  'from-emerald-600 to-emerald-900',
  'from-sky-600 to-sky-900',
  'from-cyan-600 to-cyan-900',
  'from-violet-600 to-violet-900',
  'from-teal-600 to-teal-900',
  'from-rose-600 to-rose-900',
  'from-indigo-600 to-indigo-900',
]

// ─── Category card ──────────────────────────────────────────────────────────
function CategoriaCard({ cat, index }: { cat: Category; index: number }) {
  const [imgError, setImgError] = useState(false)
  const Icon = resolveIcon(cat.icon)
  const gradient = GRADIENTS[index % GRADIENTS.length]
  const visibleSubs = cat.subcategories.slice(0, 3)

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
      {/* Image / gradient fallback */}
      <div className="relative overflow-hidden" style={{ height: 140 }}>
        {cat.imageUrl && !imgError ? (
          <img
            src={cat.imageUrl}
            alt={cat.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-linear-to-br ${gradient}`}>
            <Icon className="h-14 w-14 text-white/30" />
          </div>
        )}
        {cat.subcategories.length > 0 && (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-semibold text-white">
            {cat.subcategories.length} subcategorías
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-base font-bold text-gray-900 mb-2">{cat.name}</h3>
        {visibleSubs.length > 0 ? (
          <ul className="space-y-1 mb-4">
            {visibleSubs.map((sub) => (
              <li key={sub.id} className="text-xs text-gray-500 hover:text-agrobot-700 cursor-pointer transition-colors">
                {sub.name}
              </li>
            ))}
          </ul>
        ) : cat.description ? (
          <p className="text-xs text-gray-500 mb-4 line-clamp-2">{cat.description}</p>
        ) : (
          <div className="mb-4 h-12" />
        )}
        <div className="flex items-center gap-1 text-xs font-semibold text-agrobot-700 hover:underline">
          Ver todo
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  )
}

// ─── Skeleton ───────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm animate-pulse">
      <div className="h-36 bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-2/3 rounded bg-gray-100" />
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-3 w-5/6 rounded bg-gray-100" />
        <div className="h-3 w-4/6 rounded bg-gray-100" />
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export function CategoriasPage() {
  const { data: categorias, isLoading, isError } = useCategoriesQuery()

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

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="h-8 w-8 text-gray-300 mb-3" />
            <p className="text-sm font-semibold text-gray-500">No se pudieron cargar las categorías.</p>
            <p className="text-xs text-gray-400 mt-1">Verifica tu conexión o intenta más tarde.</p>
          </div>
        )}

        {/* Category grid */}
        {categorias && categorias.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categorias.map((cat, i) => (
              <CategoriaCard key={cat.id} cat={cat} index={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {categorias && categorias.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-gray-400">No hay categorías configuradas aún.</p>
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-12 rounded-2xl bg-agrobot-700 px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
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
