import { useState } from 'react'
import { Search, Clock, Share2, Bookmark, UserPlus, Tag } from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const blogCategories = ['Todos', 'Mercado', 'Maquinaria', 'Cultivos', 'Tecnología', 'Sostenibilidad', 'Ganadería']

const featuredArticle = {
  id: 1,
  category: 'TECNOLOGÍA',
  categoryColor: 'bg-agrobot-700',
  readTime: '12 min lectura',
  title: 'El impacto de la IA en la optimización del riego por goteo',
  description: 'Descubre cómo los nuevos algoritmos están ayudando a reducir el consumo de agua en un 35% sin afectar la calidad del cultivo.',
  image: '/farm-bg.png',
  author: { name: 'Ricardo Palma', role: 'Ing. Agrónomo', date: '15 Oct', initials: 'RP', color: 'bg-agrobot-600' },
}

const sidebarArticles = [
  {
    id: 2,
    category: 'MERCADO',
    categoryColor: 'bg-orange-500',
    title: 'Proyecciones del precio del maíz para el Q4 2026',
    image: '/bg-cafe.png',
  },
  {
    id: 3,
    category: 'SOSTENIBILIDAD',
    categoryColor: 'bg-emerald-600',
    title: 'Fertilizantes orgánicos: Guía para la transición exitosa',
    image: '/farm-bg.png',
  },
]

const articleList = [
  {
    id: 4,
    category: 'TECNOLOGÍA',
    categoryColor: 'text-sky-600',
    title: 'Rastreo Satelital: Cómo anticiparse a los cambios climáticos extremos',
    description: 'Análisis de las mejores herramientas digitales para el monitoreo en tiempo real de parcelas y predicción de granizadas o sequías.',
    image: '/bg-cafe.png',
    readTime: '5 min lectura',
    author: { name: 'María Mendoza', role: 'Experta en Tech-Agro', date: '12 Oct', initials: 'MM', color: 'bg-sky-600' },
  },
  {
    id: 5,
    category: 'CULTIVOS',
    categoryColor: 'text-lime-700',
    title: 'Selección de Semillas: Calidad sobre precio en la nueva zafra',
    description: 'Por qué invertir un 15% más en semillas certificadas puede resultar en un aumento del 40% en la rentabilidad final del lote.',
    image: '/farm-bg.png',
    readTime: '10 min lectura',
    author: { name: 'Andrés García', role: 'Consultor Senior', date: '10 Oct', initials: 'AG', color: 'bg-lime-700' },
  },
  {
    id: 6,
    category: 'MERCADO',
    categoryColor: 'text-orange-600',
    title: 'Exportaciones venezolanas: oportunidades en mercados regionales',
    description: 'Un repaso por los principales destinos de exportación y cómo aprovechar los acuerdos comerciales vigentes.',
    image: '/bg-cafe.png',
    readTime: '7 min lectura',
    author: { name: 'Luisa Ferrer', role: 'Economista Agraria', date: '8 Oct', initials: 'LF', color: 'bg-orange-500' },
  },
]

const popularTags = ['#BioTecnología', '#Fertilizantes', '#PrecioMaíz', '#IoT', '#Exportación', '#Cosecha2026', '#AgroFinanzas', '#Suelos']

const experts = [
  { name: 'Dr. Manuel Torres', role: 'Ganadería de Semillas', initials: 'MT', color: 'bg-agrobot-700' },
  { name: 'Elena Rivas', role: 'Economía Agraria', initials: 'ER', color: 'bg-emerald-600' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function ArticleListCard({ article }: { article: typeof articleList[0] }) {
  return (
    <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="h-24 w-32 shrink-0 overflow-hidden rounded-lg">
        <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${article.categoryColor}`}>
            {article.category}
          </span>
          <h3 className="mt-1 text-sm font-bold text-gray-900 leading-snug line-clamp-2">{article.title}</h3>
          <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">{article.description}</p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${article.author.color}`}>
              {article.author.initials}
            </div>
            <div className="text-[11px] text-gray-500">
              <span className="font-semibold text-gray-700">{article.author.name}</span>
              {' · '}{article.author.date}
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-gray-400">
            <span className="flex items-center gap-1 text-[11px]">
              <Clock className="h-3 w-3" />{article.readTime}
            </span>
            <button className="hover:text-agrobot-600 transition-colors"><Share2 className="h-3.5 w-3.5" /></button>
            <button className="hover:text-agrobot-600 transition-colors"><Bookmark className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [email, setEmail] = useState('')

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="¿Qué deseas aprender hoy?"
              className="flex-1 bg-transparent py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>
          <button className="bg-agrobot-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-agrobot-800">
            Buscar Artículos
          </button>
        </div>
      </section>

      {/* Category filter */}
      <div className="border-b border-gray-100 bg-white px-4 py-3">
        <div className="mx-auto max-w-6xl flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Categorías:</span>
          {blogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
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
              <h2 className="font-display text-xl font-bold text-gray-900">Artículos Destacados</h2>
              <div className="flex gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-agrobot-400 hover:text-agrobot-700">
                  ‹
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-agrobot-400 hover:text-agrobot-700">
                  ›
                </button>
              </div>
            </div>

            {/* Featured large card */}
            <div
              className="relative mb-4 overflow-hidden rounded-2xl cursor-pointer group"
              style={{ height: 360 }}
            >
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase text-white ${featuredArticle.categoryColor}`}>
                    {featuredArticle.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-white/70">
                    <Clock className="h-3 w-3" />{featuredArticle.readTime}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-white leading-snug mb-2 max-w-md">
                  {featuredArticle.title}
                </h3>
                <p className="text-xs text-white/75 leading-relaxed max-w-sm mb-3">{featuredArticle.description}</p>
                <div className="flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white ${featuredArticle.author.color}`}>
                    {featuredArticle.author.initials}
                  </div>
                  <span className="text-xs text-white/80">
                    <span className="font-semibold">{featuredArticle.author.name}</span>
                    {' · '}{featuredArticle.author.role}{' · '}{featuredArticle.author.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Article list */}
            <div className="flex flex-col gap-3">
              {articleList.map((article) => (
                <ArticleListCard key={article.id} article={article} />
              ))}
            </div>

            <button className="mt-6 w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition-colors hover:border-agrobot-400 hover:text-agrobot-700">
              Cargar más artículos
            </button>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4">

            {/* Sidebar featured articles */}
            {sidebarArticles.map((art) => (
              <div key={art.id} className="relative overflow-hidden rounded-xl cursor-pointer group" style={{ height: 160 }}>
                <img src={art.image} alt={art.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3">
                  <span className={`mb-1.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase text-white ${art.categoryColor}`}>
                    {art.category}
                  </span>
                  <h4 className="text-xs font-bold text-white leading-snug">{art.title}</h4>
                </div>
              </div>
            ))}

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

            {/* Popular tags */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-agrobot-600" />
                <h3 className="font-bold text-gray-900 text-sm">Temas Populares</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    className="rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-600 transition-colors hover:border-agrobot-400 hover:bg-agrobot-50 hover:text-agrobot-700"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Expertos */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Expertos Destacados</h3>
              <div className="flex flex-col gap-3">
                {experts.map((expert) => (
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
