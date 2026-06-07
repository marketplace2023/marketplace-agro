import { Link, useParams } from 'react-router'
import {
  ChevronRight, Clock, Loader2, AlertCircle,
  HelpCircle, BookOpen, FileText, Megaphone, Scale,
  ThumbsUp, ThumbsDown, MessageCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useHelpArticleQuery } from '@/modules/help/queries/help-queries'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_ICONS: Record<string, LucideIcon> = {
  faq: HelpCircle,
  guide: BookOpen,
  tutorial: FileText,
  policy: Scale,
  announcement: Megaphone,
}

const TYPE_LABELS: Record<string, string> = {
  faq: 'Pregunta Frecuente',
  guide: 'Guía',
  tutorial: 'Tutorial',
  policy: 'Política',
  announcement: 'Anuncio',
}

const TYPE_COLORS: Record<string, string> = {
  faq: 'bg-sky-100 text-sky-700',
  guide: 'bg-agrobot-100 text-agrobot-700',
  tutorial: 'bg-lime-100 text-lime-700',
  policy: 'bg-gray-100 text-gray-600',
  announcement: 'bg-orange-100 text-orange-700',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AyudaArticlePage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { data: article, isLoading, isError } = useHelpArticleQuery(slug)

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
        <p className="text-sm text-gray-400">El contenido que buscas no existe o fue eliminado.</p>
        <Link to="/ayuda" className="mt-2 rounded-xl bg-agrobot-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-agrobot-800">
          Volver a Ayuda
        </Link>
      </div>
    )
  }

  const TypeIcon = TYPE_ICONS[article.type] ?? HelpCircle
  const tocMatches = [...article.content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)]
  const toc = tocMatches.map((m) => m[1].replace(/<[^>]+>/g, ''))

  return (
    <div className="bg-white min-h-screen pb-14">

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <nav className="flex items-center gap-1 text-xs text-gray-400 flex-wrap">
            <Link to="/" className="hover:text-agrobot-700 transition-colors">Inicio</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link to="/ayuda" className="hover:text-agrobot-700 transition-colors">Ayuda</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link to="/ayuda" className="hover:text-agrobot-700 transition-colors text-agrobot-700">
              {article.categoryName}
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="text-gray-400 truncate max-w-50">{article.title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pt-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_240px]">

          {/* Main article */}
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${TYPE_COLORS[article.type] ?? 'bg-gray-100 text-gray-600'}`}>
                  <TypeIcon className="h-3.5 w-3.5" />
                  {TYPE_LABELS[article.type] ?? article.type}
                </span>
                {article.isFeatured && (
                  <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-orange-700">
                    Destacado
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-3">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-sm text-gray-500 leading-relaxed border-l-4 border-agrobot-400 pl-4 py-1">
                  {article.excerpt}
                </p>
              )}

              <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Actualizado el {formatDate(article.updatedAt)}
                </span>
              </div>
            </div>

            {/* Content */}
            <article className="prose prose-sm max-w-none prose-headings:font-display prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-blockquote:border-agrobot-400 prose-blockquote:bg-agrobot-50 prose-blockquote:rounded-r-xl prose-blockquote:px-5 prose-blockquote:py-3 prose-ol:text-gray-600 prose-a:text-agrobot-700">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </article>

            {/* Was this helpful? */}
            <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
              <p className="text-sm font-semibold text-gray-700 mb-3">¿Fue útil este artículo?</p>
              <div className="flex items-center justify-center gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-agrobot-400 hover:bg-agrobot-50 hover:text-agrobot-700">
                  <ThumbsUp className="h-4 w-4" />
                  Sí, me ayudó
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600">
                  <ThumbsDown className="h-4 w-4" />
                  No del todo
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">¿Necesitas más ayuda?</p>
                <Link
                  to="/ayuda"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-agrobot-700 hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Contactar soporte
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">

            {/* Table of contents */}
            {toc.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  En este artículo
                </h3>
                <ul className="space-y-2">
                  {toc.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-500 hover:text-agrobot-700 cursor-pointer transition-colors">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-gray-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related articles */}
            {article.related && article.related.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Artículos relacionados
                </h3>
                <ul className="space-y-2.5">
                  {article.related.map((rel) => {
                    const RelIcon = TYPE_ICONS[rel.type] ?? HelpCircle
                    return (
                      <li key={rel.id}>
                        <Link
                          to={`/ayuda/${rel.slug}`}
                          className="flex items-start gap-2 text-xs text-gray-600 hover:text-agrobot-700 transition-colors group"
                        >
                          <RelIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400 group-hover:text-agrobot-600" />
                          <span className="leading-snug">{rel.title}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Back to category */}
            <div className="rounded-xl bg-agrobot-50 border border-agrobot-200 p-4">
              <p className="text-xs text-agrobot-700 font-semibold mb-2">Categoría</p>
              <p className="text-sm font-bold text-agrobot-900 mb-3">{article.categoryName}</p>
              <Link
                to="/ayuda"
                className="flex items-center gap-1 text-xs font-semibold text-agrobot-700 hover:text-agrobot-900 transition-colors"
              >
                <ChevronRight className="h-3 w-3" />
                Ver todos los artículos
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </div>
  )
}
