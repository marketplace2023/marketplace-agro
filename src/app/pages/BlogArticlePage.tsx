import { Link, useParams, useNavigate } from 'react-router'
import {
  ChevronRight, Clock, Share2, Bookmark, CheckCircle2,
  Bell, Megaphone, Search, AlignLeft, Loader2, AlertCircle,
} from 'lucide-react'
import { useBlogPostQuery } from '@/modules/blog/queries/blog-queries'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFullDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' })
}

function authorInitials(name: string | null): string {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function BlogArticlePage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: article, isLoading, isError } = useBlogPostQuery(slug)

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-agrobot-400" />
      </div>
    )
  }

  if (isError || !article) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle className="h-10 w-10 text-gray-300" />
        <p className="text-lg font-bold text-gray-700">Artículo no encontrado</p>
        <p className="text-sm text-gray-400">El artículo que buscas no existe o fue eliminado.</p>
        <Link to="/blog" className="mt-2 rounded-xl bg-agrobot-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-agrobot-800">
          Volver al Blog
        </Link>
      </div>
    )
  }

  // Extract headings for table of contents
  const tocMatches = [...article.content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)]
  const toc = tocMatches.map((m) => m[1].replace(/<[^>]+>/g, ''))
  const tags = article.tags ? article.tags.split(',').map((t) => t.trim()).filter(Boolean) : []

  return (
    <div className="bg-white min-h-screen pb-14">

      {/* Breadcrumb */}
      <div className="mx-auto max-w-5xl px-4 pt-4 pb-2">
        <nav className="flex items-center gap-1 text-xs text-gray-400">
          <Link to="/" className="hover:text-agrobot-700 transition-colors">Inicio</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/blog" className="hover:text-agrobot-700 transition-colors">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-agrobot-700 font-medium">{article.category}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate max-w-50 text-gray-400">{article.title}</span>
        </nav>
      </div>

      {/* Article header */}
      <div className="mx-auto max-w-5xl px-4 pt-3 pb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="rounded-full bg-agrobot-700 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
            {article.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />Lectura de {article.readTimeMinutes} min
          </span>
        </div>

        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 leading-snug max-w-3xl mb-5">
          {article.title}
        </h1>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-agrobot-700 text-sm font-bold text-white">
              {authorInitials(article.authorName)}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{article.authorName ?? 'TierraMarket'}</p>
              <p className="text-xs text-gray-500">Equipo editorial TierraMarket</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            {article.publishedAt && (
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400">Publicado</span>
                <span className="text-gray-600 font-medium">{formatFullDate(article.publishedAt)}</span>
              </div>
            )}
            <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-agrobot-400 hover:text-agrobot-700">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-agrobot-400 hover:text-agrobot-700">
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero image */}
      {article.imageUrl && (
        <div className="mx-auto max-w-5xl px-4 mb-8">
          <div className="overflow-hidden rounded-2xl" style={{ height: 380 }}>
            <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" />
          </div>
        </div>
      )}

      {/* Main content + sidebar */}
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">

          {/* Article body — rendered HTML from DB */}
          <article className="prose prose-sm max-w-none prose-headings:font-display prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-blockquote:border-agrobot-500 prose-blockquote:bg-agrobot-50 prose-blockquote:rounded-r-xl prose-blockquote:px-5 prose-blockquote:py-3 prose-a:text-agrobot-700">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />

            {/* CTA box */}
            <div className="not-prose mt-8 rounded-2xl bg-gray-50 border border-gray-200 p-5">
              <h3 className="font-display text-base font-bold text-gray-900 mb-4">
                ¿Listo para optimizar tu producción?
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/app/productor')}
                  className="flex items-center gap-2 rounded-xl bg-agrobot-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-agrobot-800"
                >
                  <Megaphone className="h-4 w-4" />
                  Panel Productor
                </button>
                <button
                  onClick={() => navigate('/catalogo')}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-agrobot-400 hover:text-agrobot-700"
                >
                  <Search className="h-4 w-4" />
                  Buscar Productos
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">

            {/* Table of contents */}
            {toc.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <AlignLeft className="h-4 w-4 text-gray-400" />
                  <h3 className="text-sm font-bold text-gray-900">En este artículo</h3>
                </div>
                <ul className="space-y-2">
                  {toc.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="h-1 w-1 rounded-full bg-gray-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Temas</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Radar promo */}
            <div className="rounded-xl bg-agrobot-50 border border-agrobot-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-agrobot-100">
                  <Bell className="h-4 w-4 text-agrobot-700" />
                </div>
                <h3 className="text-sm font-bold text-agrobot-800">Radar TierraMarket</h3>
              </div>
              <p className="text-xs text-agrobot-700 leading-relaxed mb-3">
                Recibí alertas personalizadas sobre precios y oportunidades en tu región.
              </p>
              <button className="w-full rounded-lg bg-agrobot-700 py-2 text-xs font-bold text-white transition-colors hover:bg-agrobot-800">
                Activar Alertas
              </button>
            </div>

            {/* Excerpt highlight */}
            {article.excerpt && (
              <div className="rounded-xl border border-agrobot-200 bg-agrobot-50 p-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-agrobot-600" />
                  <p className="text-xs text-agrobot-800 italic leading-relaxed">{article.excerpt}</p>
                </div>
              </div>
            )}

          </aside>
        </div>

        {/* Related articles */}
        {article.related && article.related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-5">Más temas que podrían interesarte</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {article.related.map((art) => (
                <Link
                  key={art.id}
                  to={`/blog/${art.slug}`}
                  className="group block rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="overflow-hidden" style={{ height: 140 }}>
                    {art.imageUrl ? (
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-agrobot-100" />
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-agrobot-700">
                      {art.category}
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-gray-900 leading-snug">{art.title}</h3>
                    {art.publishedAt && (
                      <p className="mt-2 flex items-center gap-1 text-[11px] text-gray-400">
                        <Clock className="h-3 w-3" />
                        {art.readTimeMinutes} min · {new Date(art.publishedAt).toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
