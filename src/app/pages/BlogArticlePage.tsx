import { useState } from 'react'
import { Link } from 'react-router'
import { ChevronRight, Clock, Share2, Bookmark, CheckCircle2, Bell, Megaphone, Search, AlignLeft } from 'lucide-react'

// ─── Mock article data ────────────────────────────────────────────────────────

const article = {
  category: 'TECNOLOGÍA',
  categoryColor: 'bg-agrobot-700',
  readTime: 'Lectura de 8 min',
  title: 'Drones e IA: Transformando el Riego de Precisión en las Pampas Latinoamericanas',
  author: {
    name: 'Ing. Ricardo Méndez',
    role: 'Especialista en Agrotech & Big Data',
    initials: 'RM',
    color: 'bg-agrobot-700',
  },
  publishedDate: '14 de Mayo, 2026',
  image: '/farm-bg.png',
}

const toc = [
  'Impacto de la visión computacional',
  'Componentes del sistema',
  'Costo vs Beneficio',
  'Pasos para la transición',
]

const relatedArticles = [
  {
    id: 1,
    category: 'MERCADOS',
    categoryColor: 'text-orange-600',
    title: 'Tendencias de precios: Soja y Maíz para Q3',
    ago: 'Hace 2 días',
    image: '/bg-cafe.png',
  },
  {
    id: 2,
    category: 'MAQUINARIA',
    categoryColor: 'text-sky-600',
    title: 'Guía de mantenimiento para cosechadoras',
    ago: 'Hace 5 días',
    image: '/farm-bg.png',
  },
  {
    id: 3,
    category: 'SOSTENIBILIDAD',
    categoryColor: 'text-emerald-600',
    title: 'Bioestimulantes: ¿Vale la pena el cambio?',
    ago: 'Hace 1 semana',
    image: '/bg-cafe.png',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export function BlogArticlePage() {
  const [email, setEmail] = useState('')

  return (
    <div className="bg-white min-h-screen pb-14">

      {/* Breadcrumb */}
      <div className="mx-auto max-w-5xl px-4 pt-4 pb-2">
        <nav className="flex items-center gap-1 text-xs text-gray-400">
          <Link to="/" className="hover:text-agrobot-700 transition-colors">Inicio</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/blog" className="hover:text-agrobot-700 transition-colors">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-agrobot-700 font-medium">Tecnología</span>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate max-w-[200px] text-gray-400">Drones e IA: El Futuro del Riego de Precisión</span>
        </nav>
      </div>

      {/* Article header */}
      <div className="mx-auto max-w-5xl px-4 pt-3 pb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase text-white ${article.categoryColor}`}>
            {article.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />{article.readTime}
          </span>
        </div>

        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 leading-snug max-w-3xl mb-5">
          {article.title}
        </h1>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${article.author.color}`}>
              {article.author.initials}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{article.author.name}</p>
              <p className="text-xs text-gray-500">{article.author.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div>
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400">Publicado</span>
              <span className="text-gray-600 font-medium">{article.publishedDate}</span>
            </div>
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
      <div className="mx-auto max-w-5xl px-4 mb-8">
        <div className="overflow-hidden rounded-2xl" style={{ height: 380 }}>
          <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
        </div>
      </div>

      {/* Main content + sidebar */}
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">

          {/* Article body */}
          <article className="prose-sm max-w-none">
            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              La adopción de tecnologías de vanguardia en el campo no es solo una tendencia, es una necesidad imperativa para la sostenibilidad de la producción en el siglo XXI. El uso de drones equipados con cámaras multiespectrales, combinado con algoritmos de Inteligencia Artificial, está permitiendo a los productores reducir el desperdicio de agua en hasta un 30% en regiones críticas de Latinoamérica.
            </p>

            <h2 className="font-display text-lg font-bold text-gray-900 mb-3">
              El impacto de la visión computacional en el campo
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              A diferencia de los métodos de riego tradicionales, que a menudo se basan en calendarios fijos o mediciones de suelo dispersas, la IA analiza imágenes aéreas en tiempo real para identificar niveles de estrés hídrico planta por planta.
            </p>

            <ul className="mb-5 space-y-2.5">
              {[
                'Mapeo térmico de alta resolución para detectar fugas.',
                'Integración con estaciones meteorológicas locales.',
                'Automatización de válvulas de riego mediante IoT.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-agrobot-600" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Blockquote */}
            <blockquote className="border-l-4 border-agrobot-500 bg-agrobot-50 rounded-r-xl px-5 py-4 my-6">
              <p className="text-sm italic text-gray-700 leading-relaxed">
                "La tecnología no reemplaza la sabiduría del productor, la potencia. Un algoritmo puede detectar la falta de agua, pero el agrónomo decide la estrategia de largo plazo."
              </p>
            </blockquote>

            <h2 className="font-display text-lg font-bold text-gray-900 mb-3">
              ¿Cómo empezar la transición?
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Muchos productores temen que la inversión inicial sea prohibitiva. Sin embargo, en el mercado actual de TierraMarket, existen opciones de financiamiento y servicios compartidos que hacen que esta tecnología sea accesible incluso para medianos productores.
            </p>

            {/* CTA box */}
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-5">
              <h3 className="font-display text-base font-bold text-gray-900 mb-4">
                ¿Listo para optimizar tu producción?
              </h3>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-agrobot-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-agrobot-800">
                  <Megaphone className="h-4 w-4" />
                  Publicar Anuncio
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-agrobot-400 hover:text-agrobot-700">
                  <Search className="h-4 w-4" />
                  Buscar Productos
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">

            {/* Table of contents */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <AlignLeft className="h-4 w-4 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-900">En este artículo</h3>
              </div>
              <ul className="space-y-2">
                {toc.map((item) => (
                  <li key={item}>
                    <a href="#" className="flex items-center gap-2 text-xs text-gray-500 hover:text-agrobot-700 transition-colors">
                      <span className="h-1 w-1 rounded-full bg-gray-400 shrink-0" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Radar promo */}
            <div className="rounded-xl bg-agrobot-50 border border-agrobot-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-agrobot-100">
                  <Bell className="h-4 w-4 text-agrobot-700" />
                </div>
                <h3 className="text-sm font-bold text-agrobot-800">Radar TierraMarket</h3>
              </div>
              <p className="text-xs text-agrobot-700 leading-relaxed mb-3">
                Recibí alertas personalizadas cuando bajen los precios de drones en tu región.
              </p>
              <button className="w-full rounded-lg bg-agrobot-700 py-2 text-xs font-bold text-white transition-colors hover:bg-agrobot-800">
                Activar Alertas
              </button>
            </div>

            {/* Newsletter */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Newsletter Semanal</p>
              <p className="text-xs text-gray-500 mb-3">Únete a 15.000+ productores informados.</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-agrobot-400 focus:ring-1 focus:ring-agrobot-400/20 mb-2"
              />
              <button className="w-full rounded-lg bg-gray-900 py-2 text-xs font-bold text-white transition-colors hover:bg-gray-800">
                Suscribirme
              </button>
            </div>

          </aside>
        </div>

        {/* Related articles */}
        <div className="mt-12">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-5">Más temas que podrían interesarte</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {relatedArticles.map((art) => (
              <Link key={art.id} to="/blog/articulo" className="group block rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-shadow hover:shadow-md">
                <div className="overflow-hidden" style={{ height: 140 }}>
                  <img src={art.image} alt={art.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${art.categoryColor}`}>
                    {art.category}
                  </span>
                  <h3 className="mt-1 text-sm font-bold text-gray-900 leading-snug">{art.title}</h3>
                  <p className="mt-2 flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock className="h-3 w-3" />{art.ago}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
