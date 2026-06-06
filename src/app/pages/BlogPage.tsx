import { useState } from 'react'
import { Link } from 'react-router'
import { Search, Clock, Share2, Bookmark, UserPlus, Tag, Loader2, AlertCircle } from 'lucide-react'
import { useBlogPostsQuery, useBlogCategoriesQuery } from '@/modules/blog/queries/blog-queries'
import type { BlogPost } from '@/modules/blog/api/blog'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })
}

function authorInitials(name: string | null): string {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

const AUTHOR_COLORS = [
  'bg-agrobot-700', 'bg-emerald-600', 'bg-sky-600',
  'bg-orange-500', 'bg-lime-700', 'bg-violet-600',
]

function authorColor(name: string | null): string {
  if (!name) return 'bg-gray-400'
  return AUTHOR_COLORS[name.charCodeAt(0) % AUTHOR_COLORS.length]
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function FeaturedSkeleton() {
  return <div className="mb-4 overflow-hidden rounded-2xl bg-gray-100 animate-pulse" style={{ height: 360 }} />
}

function CardSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 animate-pulse">
      <div className="h-24 w-32 shrink-0 rounded-lg bg-gray-100" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 w-16 rounded bg-gray-100" />
        <div className="h-4 w-full rounded bg-gray-100" />
        <div className="h-3 w-5/6 rounded bg-gray-100" />
        <div className="h-3 w-2/3 rounded bg-gray-100" />
      </div>
    </div>
  )
}

// ─── Article list card ─────────────────────────────────────────────────────────

function ArticleListCard({ article }: { article: BlogPost }) {
  const color = authorColor(article.authorName)
  return (
    <Link
      to={`/blog/${article.slug}`}
      className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {article.imageUrl && (
          <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-agrobot-700">
            {article.category}
          </span>
          <h3 className="mt-1 text-sm font-bold text-gray-900 leading-snug line-clamp-2">{article.title}</h3>
          {article.excerpt && (
            <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">{article.excerpt}</p>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${color}`}>
              {authorInitials(article.authorName)}
            </div>
            <div className="text-[11px] text-gray-500">
              <span className="font-semibold text-gray-700">{article.authorName ?? 'TierraMarket'}</span>
              {article.publishedAt && <> · {formatDate(article.publishedAt)}</>}
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-gray-400">
            <span className="flex items-center gap-1 text-[11px]">
              <Clock className="h-3 w-3" />{article.readTimeMinutes} min
            </span>
            <button onClick={(e) => e.preventDefault()} className="hover:text-agrobot-600 transition-colors">
              <Share2 className="h-3.5 w-3.5" />
            </button>
            <button onClick={(e) => e.preventDefault()} className="hover:text-agrobot-600 transition-colors">
              <Bookmark className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Static sidebar data ───────────────────────────────────────────────────────

const STATIC_EXPERTS = [
  { name: 'Dr. Manuel Torres', role: 'Ganadería de Semillas', initials: 'MT', color: 'bg-agrobot-700' },
  { name: 'Elena Rivas', role: 'Economía Agraria', initials: 'ER', color: 'bg-emerald-600' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [email, setEmail] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useBlogPostsQuery({
    category: activeCategory !== 'Todos' ? activeCategory : undefined,
    search: searchQuery || undefined,
    page,
    limit: 6,
  })

  const { data: apiCategories } = useBlogCategoriesQuery()
  const categories = ['Todos', ...(apiCategories ?? [])]

  const posts = data?.posts ?? []
  const total = data?.total ?? 0
  const featured = posts[0]
  const listPosts = posts.slice(1)
  const hasMore = page * 6 < total

  function handleSearch() {
    setSearchQuery(searchInput)
    setPage(1)
  }

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat)
    setPage(1)
  }

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 py-20"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(5,46,22,0.72) 0%, rgba(5,46,22,0.55) 60%, rgba(5,46,22,0.78) 100%), url('/farm-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: 320,
        }}
      >
        <span className="mb-4 inline-block rounded-full bg-orange-500 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
          Educación Agro
        </span>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight max-w-2xl mb-3">
          Conocimiento que cultiva el futuro
        </h1>
        <p className="text-white/75 text-sm max-w-lg leading-relaxed mb-7">
          Explora nuestra biblioteca de recursos técnicos, análisis de mercado y guías prácticas diseñadas para potenciar la productividad de los productores latinoamericanos.
        </p>
        <div className="flex w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="flex flex-1 items-center gap-2 px-4">
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="¿Qué deseas aprender hoy?"
              className="flex-1 bg-transparent py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-agrobot-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-agrobot-800"
          >
            Buscar
          </button>
        </div>
      </section>

      {/* Category filter */}
      <div className="border-b border-gray-100 bg-white px-4 py-3">
        <div className="mx-auto max-w-6xl flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Categorías:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-agrobot-700 text-white'
                  : 'border border-gray-200 text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

          {/* Left column */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-gray-900">
                {searchQuery ? `Resultados para "${searchQuery}"` : 'Artículos Destacados'}
              </h2>
              {total > 0 && <span className="text-xs text-gray-400">{total} artículos</span>}
            </div>

            {/* Error */}
            {isError && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 py-12 text-center">
                <AlertCircle className="h-8 w-8 text-red-400 mb-2" />
                <p className="text-sm font-semibold text-red-600">Error al cargar los artículos</p>
              </div>
            )}

            {/* Skeleton */}
            {isLoading && (
              <>
                <FeaturedSkeleton />
                <div className="flex flex-col gap-3 mt-3">
                  {[0, 1, 2].map((i) => <CardSkeleton key={i} />)}
                </div>
              </>
            )}

            {/* Empty */}
            {!isLoading && !isError && posts.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 py-16 text-center">
                <Tag className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm font-semibold text-gray-500">No hay artículos disponibles</p>
                {(searchQuery || activeCategory !== 'Todos') && (
                  <button
                    onClick={() => { setSearchQuery(''); setSearchInput(''); handleCategoryChange('Todos') }}
                    className="mt-3 text-xs text-agrobot-700 hover:underline"
                  >
                    Ver todos los artículos
                  </button>
                )}
              </div>
            )}

            {/* Featured large card */}
            {!isLoading && featured && (
              <Link
                to={`/blog/${featured.slug}`}
                className="relative mb-4 block overflow-hidden rounded-2xl cursor-pointer group"
                style={{ height: 360 }}
              >
                {featured.imageUrl ? (
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-agrobot-900" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-agrobot-700 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
                      {featured.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-white/70">
                      <Clock className="h-3 w-3" />{featured.readTimeMinutes} min
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white leading-snug mb-2 max-w-md">
                    {featured.title}
                  </h3>
                  {featured.excerpt && (
                    <p className="text-xs text-white/75 leading-relaxed max-w-sm mb-3 line-clamp-2">
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white ${authorColor(featured.authorName)}`}>
                      {authorInitials(featured.authorName)}
                    </div>
                    <span className="text-xs text-white/80">
                      <span className="font-semibold">{featured.authorName ?? 'TierraMarket'}</span>
                      {featured.publishedAt && <> · {formatDate(featured.publishedAt)}</>}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Article list */}
            {!isLoading && listPosts.length > 0 && (
              <div className="flex flex-col gap-3">
                {listPosts.map((article) => (
                  <ArticleListCard key={article.id} article={article} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && (page > 1 || hasMore) && (
              <div className="mt-6 flex items-center gap-3 justify-center">
                {page > 1 && (
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:border-agrobot-400 hover:text-agrobot-700"
                  >
                    ← Anterior
                  </button>
                )}
                {hasMore && (
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:border-agrobot-400 hover:text-agrobot-700"
                  >
                    Más artículos →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4">

            {/* Newsletter */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Newsletter Agrícola</h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">Recibí análisis semanales directamente en tu correo.</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-agrobot-400 focus:ring-1 focus:ring-agrobot-400/20 mb-2"
              />
              <button className="w-full rounded-lg bg-agrobot-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-agrobot-700">
                Suscribirse
              </button>
              <p className="mt-1.5 text-center text-[10px] text-gray-400">Al suscribirte, aceptás nuestras políticas de privacidad.</p>
            </div>

            {/* Categories sidebar */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-agrobot-600" />
                <h3 className="font-bold text-gray-900 text-sm">Categorías</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.filter((c) => c !== 'Todos').map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { handleCategoryChange(cat); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      activeCategory === cat
                        ? 'border-agrobot-400 bg-agrobot-50 text-agrobot-700'
                        : 'border-gray-200 text-gray-600 hover:border-agrobot-400 hover:bg-agrobot-50 hover:text-agrobot-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Expertos */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Expertos Destacados</h3>
              <div className="flex flex-col gap-3">
                {STATIC_EXPERTS.map((expert) => (
                  <div key={expert.name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${expert.color}`}>
                        {expert.initials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{expert.name}</p>
                        <p className="text-[11px] text-gray-500">{expert.role}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-600 transition-colors hover:border-agrobot-400 hover:text-agrobot-700">
                      <UserPlus className="h-3 w-3" />
                      Seguir
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
