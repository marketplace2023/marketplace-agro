import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  Search, ArrowRight, MessageCircle, ChevronRight, Loader2, AlertCircle,
  FileText, BookOpen, HelpCircle, Megaphone, Scale,
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useHelpCategoriesQuery, useHelpArticlesQuery } from '@/modules/help/queries/help-queries'
import type { HelpArticle, HelpCategory } from '@/modules/help/api/help'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_ICONS: Record<string, LucideIcon> = {
  faq: HelpCircle,
  guide: BookOpen,
  tutorial: FileText,
  policy: Scale,
  announcement: Megaphone,
}

const TYPE_LABELS: Record<string, string> = {
  faq: 'FAQ',
  guide: 'Guía',
  tutorial: 'Tutorial',
  policy: 'Política',
  announcement: 'Anuncio',
}

const TYPE_COLORS: Record<string, string> = {
  faq: 'bg-sky-50 text-sky-700',
  guide: 'bg-agrobot-50 text-agrobot-700',
  tutorial: 'bg-lime-50 text-lime-700',
  policy: 'bg-gray-100 text-gray-600',
  announcement: 'bg-orange-50 text-orange-700',
}

function toPascalCase(s: string): string {
  return s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
}

function resolveIcon(name: string | null): LucideIcon {
  if (!name) return LucideIcons.Package as LucideIcon
  const key = toPascalCase(name)
  return ((LucideIcons as Record<string, unknown>)[key] as LucideIcon | undefined)
    ?? LucideIcons.Package as LucideIcon
}

// ─── Category card ─────────────────────────────────────────────────────────────

function CategoryCard({ cat, isActive, onClick }: { cat: HelpCategory; isActive: boolean; onClick: () => void }) {
  const Icon = resolveIcon(cat.icon)
  const [imgError, setImgError] = useState(false)

  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center gap-2.5 overflow-hidden rounded-xl border text-center transition-all hover:-translate-y-0.5 hover:shadow-md ${
        isActive
          ? 'border-agrobot-400 bg-agrobot-50 shadow-sm ring-1 ring-agrobot-300'
          : 'border-gray-200 bg-white shadow-sm hover:border-agrobot-200'
      }`}
    >
      {/* Image or gradient */}
      <div className="relative w-full overflow-hidden" style={{ height: 80 }}>
        {cat.imageUrl && !imgError ? (
          <img
            src={cat.imageUrl}
            alt={cat.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-agrobot-600 to-agrobot-900">
            <Icon className="h-8 w-8 text-white/40" />
          </div>
        )}
        {/* Article count badge */}
        {cat.articleCount > 0 && (
          <span className="absolute top-1.5 right-1.5 rounded-full bg-black/40 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {cat.articleCount}
          </span>
        )}
      </div>
      <div className="px-3 pb-3">
        <div className={`mb-1 flex items-center justify-center gap-1.5 ${isActive ? 'text-agrobot-700' : 'text-gray-700'}`}>
          <Icon className="h-3.5 w-3.5 shrink-0" />
          <span className="text-xs font-bold">{cat.name}</span>
        </div>
        {cat.description && (
          <p className="text-[10px] text-gray-500 leading-tight line-clamp-2">{cat.description}</p>
        )}
      </div>
    </button>
  )
}

// ─── Category skeleton ─────────────────────────────────────────────────────────

function CategorySkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white animate-pulse">
      <div className="h-20 bg-gray-100" />
      <div className="p-3 space-y-1.5">
        <div className="h-3 w-2/3 mx-auto rounded bg-gray-100" />
        <div className="h-2.5 w-full rounded bg-gray-100" />
        <div className="h-2.5 w-4/5 rounded bg-gray-100" />
      </div>
    </div>
  )
}

// ─── Article row ───────────────────────────────────────────────────────────────

function ArticleRow({ article }: { article: HelpArticle }) {
  const TypeIcon = TYPE_ICONS[article.type] ?? HelpCircle
  return (
    <Link
      to={`/ayuda/${article.slug}`}
      className="flex items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50 group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className={`shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${TYPE_COLORS[article.type] ?? 'bg-gray-100 text-gray-600'}`}>
          <TypeIcon className="h-2.5 w-2.5" />
          {TYPE_LABELS[article.type] ?? article.type}
        </span>
        <span className="text-sm text-gray-700 group-hover:text-agrobot-700 transition-colors truncate">
          {article.title}
        </span>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-agrobot-600 transition-colors" />
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AyudaPage() {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(undefined)

  const { data: categories, isLoading: catsLoading } = useHelpCategoriesQuery()
  const { data: articles, isLoading: artsLoading } = useHelpArticlesQuery({
    categoryId: activeCategoryId,
    search: searchQuery || undefined,
  })

  const { data: featuredArticles } = useHelpArticlesQuery({ featured: true })

  function handleSearch() {
    setSearchQuery(searchInput)
    setActiveCategoryId(undefined)
  }

  function handleCategoryClick(id: number) {
    setActiveCategoryId(activeCategoryId === id ? undefined : id)
    setSearchQuery('')
    setSearchInput('')
  }

  const filteredFeatured = featuredArticles?.slice(0, 5) ?? []
  const activeCategory = categories?.find((c) => c.id === activeCategoryId)

  return (
    <div className="bg-white flex flex-col">

      {/* Hero */}
      <section className="bg-gray-50 py-12 text-center border-b border-gray-100">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="font-display text-4xl font-bold text-agrobot-800 mb-5">
            ¿En qué podemos ayudarte?
          </h1>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Busca guías, tutoriales o problemas técnicos..."
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
            {searchInput && (
              <button
                onClick={handleSearch}
                className="rounded-lg bg-agrobot-700 px-3 py-1 text-xs font-bold text-white"
              >
                Buscar
              </button>
            )}
          </div>
          {!searchQuery && (
            <p className="mt-3 text-xs text-gray-400">
              Por ejemplo:{' '}
              <button
                onClick={() => { setSearchInput('contraseña'); setSearchQuery('contraseña') }}
                className="text-agrobot-700 underline underline-offset-2"
              >
                Seguridad de cuenta
              </button>
              {', '}
              <button
                onClick={() => { setSearchInput('publicar'); setSearchQuery('publicar') }}
                className="text-agrobot-700 underline underline-offset-2"
              >
                Cómo vender
              </button>
              {' o '}
              <button
                onClick={() => { setSearchInput('radar'); setSearchQuery('radar') }}
                className="text-agrobot-700 underline underline-offset-2"
              >
                Radar Premium
              </button>
            </p>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-5xl px-4 py-8">
        <h2 className="font-display text-xs font-bold text-gray-700 mb-4 uppercase tracking-wider">
          Categorías de ayuda
        </h2>

        {catsLoading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)}
          </div>
        )}

        {categories && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                isActive={activeCategoryId === cat.id}
                onClick={() => handleCategoryClick(cat.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Articles + Sidebar */}
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <div className="grid gap-8 md:grid-cols-[1fr_300px]">

          {/* Main: article list */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-gray-900">
                {searchQuery
                  ? `Resultados para "${searchQuery}"`
                  : activeCategory
                    ? activeCategory.name
                    : 'Artículos destacados'}
              </h2>
              {activeCategoryId && (
                <button
                  onClick={() => setActiveCategoryId(undefined)}
                  className="text-xs text-gray-400 hover:text-agrobot-700 transition-colors"
                >
                  Ver todos ×
                </button>
              )}
            </div>

            {artsLoading && (
              <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100 animate-pulse">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="px-5 py-4 flex items-center gap-3">
                    <div className="h-4 w-12 rounded-full bg-gray-100" />
                    <div className="h-3 flex-1 rounded bg-gray-100" />
                  </div>
                ))}
              </div>
            )}

            {!artsLoading && articles && articles.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 py-12 text-center">
                <AlertCircle className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm font-semibold text-gray-500">No hay artículos para esta búsqueda</p>
                {(searchQuery || activeCategoryId) && (
                  <button
                    onClick={() => { setSearchQuery(''); setSearchInput(''); setActiveCategoryId(undefined) }}
                    className="mt-2 text-xs text-agrobot-700 hover:underline"
                  >
                    Ver todos los artículos
                  </button>
                )}
              </div>
            )}

            {!artsLoading && articles && articles.length > 0 && (
              <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                {(searchQuery || activeCategoryId ? articles : articles.slice(0, 8)).map((art) => (
                  <ArticleRow key={art.id} article={art} />
                ))}
              </div>
            )}

            {!artsLoading && articles && !searchQuery && !activeCategoryId && articles.length > 8 && (
              <button
                onClick={() => navigate('/ayuda')}
                className="mt-4 w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition-colors hover:border-agrobot-400 hover:text-agrobot-700"
              >
                Ver todos los artículos →
              </button>
            )}
          </div>

          {/* Sidebar: by category guides */}
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-gray-900 mb-3">Guías por categoría</h2>
              <div className="flex flex-col gap-3">
                {catsLoading && [0, 1, 2].map((i) => (
                  <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 animate-pulse">
                    <div className="h-4 w-2/3 rounded bg-gray-100 mb-2" />
                    <div className="h-3 w-full rounded bg-gray-100" />
                    <div className="h-3 w-4/5 mt-1 rounded bg-gray-100" />
                  </div>
                ))}
                {categories?.slice(0, 4).map((cat) => {
                  const Icon = resolveIcon(cat.icon)
                  const catArticles = articles?.filter((a) => a.categoryId === cat.id).slice(0, 2) ?? []
                  return (
                    <div key={cat.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-agrobot-50">
                          <Icon className="h-4 w-4 text-agrobot-700" />
                        </div>
                        <button
                          onClick={() => handleCategoryClick(cat.id)}
                          className="font-semibold text-sm text-agrobot-700 hover:underline"
                        >
                          {cat.name}
                        </button>
                      </div>
                      <ul className="space-y-1.5">
                        {catArticles.map((art) => (
                          <li key={art.id}>
                            <Link
                              to={`/ayuda/${art.slug}`}
                              className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-agrobot-700 transition-colors"
                            >
                              <ChevronRight className="h-3 w-3 shrink-0" />
                              <span className="truncate">{art.title}</span>
                            </Link>
                          </li>
                        ))}
                        <li>
                          <button
                            onClick={() => handleCategoryClick(cat.id)}
                            className="flex items-center gap-1.5 text-xs text-agrobot-600 hover:text-agrobot-800 font-medium transition-colors"
                          >
                            <ChevronRight className="h-3 w-3 shrink-0" />
                            Ver todo en {cat.name} ({cat.articleCount})
                          </button>
                        </li>
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Aún necesitas ayuda? */}
      <section className="bg-gray-50 border-t border-gray-100 py-14 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">¿Aún necesitas ayuda?</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            Nuestro equipo de soporte técnico está disponible para asistirte en cada paso
            <br className="hidden sm:block" /> de tu producción.
          </p>
          <div className="flex justify-center">
            <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-xl bg-agrobot-700 p-7 shadow-sm transition-shadow hover:shadow-md">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <MessageCircle className="h-6 w-6 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-ping absolute" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              </div>
              <h3 className="font-bold text-white">Contactar por WhatsApp</h3>
              <p className="text-xs text-white/75 text-center leading-relaxed">
                Soporte técnico directo y rápido para urgencias en el campo.
              </p>
              <button className="mt-1 rounded-lg bg-white px-5 py-2 text-xs font-semibold text-agrobot-800 transition-colors hover:bg-agrobot-50">
                Abrir WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Banner image */}
      <section
        className="relative flex flex-1 items-end overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.20) 60%, rgba(0,0,0,0.05) 100%), url('/farm-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: 220,
        }}
      >
        <div className="relative z-10 p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">
            TierraMarket te acompaña
          </p>
          <p className="text-base font-semibold text-white max-w-sm leading-relaxed">
            Estamos construyendo el futuro del campo en Latinoamérica junto a miles de productores.
          </p>
        </div>
      </section>

    </div>
  )
}
