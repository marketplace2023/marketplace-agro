import { useState, useEffect } from 'react'
import { Star, Heart, MapPin, CheckCircle2, Zap, ArrowRight, Tractor, Package, Wheat, Droplets, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type BadgeType = '20% OFF' | 'OFERTA' | 'LIQUIDACIÓN' | '15% OFF'
type SellerType = 'distribuidor' | 'tienda' | 'location'

interface OfertaProduct {
  id: number
  badge: BadgeType
  rating: number
  reviews: number
  title: string
  sellerType: SellerType
  sellerLabel: string
  originalPrice: string
  currentPrice: string
  unit?: string
  gradient: string
  Icon: LucideIcon
}

interface TiendaOficial {
  id: number
  name: string
  description: string
  avatarGradient: string
  initials: string
  Icon: LucideIcon
}

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = [
  { label: 'Todas las Ofertas', Icon: Zap, active: true },
  { label: 'Maquinaria', Icon: Tractor, active: false },
  { label: 'Insumos', Icon: Package, active: false },
  { label: 'Cosechas', Icon: Wheat, active: false },
  { label: 'Fincas', Icon: MapPin, active: false },
  { label: 'Riego', Icon: Droplets, active: false },
]

const badgeStyles: Record<BadgeType, string> = {
  '20% OFF':    'bg-orange-500 text-white',
  'OFERTA':     'bg-agrobot-600 text-white',
  'LIQUIDACIÓN':'bg-red-500 text-white',
  '15% OFF':    'bg-orange-500 text-white',
}

const products: OfertaProduct[] = [
  {
    id: 1,
    badge: '20% OFF',
    rating: 4.8,
    reviews: 12,
    title: 'John Deere 5075E 4WD',
    sellerType: 'distribuidor',
    sellerLabel: 'Distribuidor Oficial',
    originalPrice: 'USD $45,000',
    currentPrice: 'USD $36,000',
    gradient: 'from-green-700 to-green-900',
    Icon: Tractor,
  },
  {
    id: 2,
    badge: 'OFERTA',
    rating: 4.5,
    reviews: 45,
    title: 'Urea Granulada - Tonelada',
    sellerType: 'location',
    sellerLabel: 'Córdoba, AR',
    originalPrice: 'USD $850',
    currentPrice: 'USD $699',
    gradient: 'from-slate-500 to-slate-700',
    Icon: Package,
  },
  {
    id: 3,
    badge: 'LIQUIDACIÓN',
    rating: 4.9,
    reviews: 120,
    title: 'Maíz Híbrido Dekalb 72-10',
    sellerType: 'tienda',
    sellerLabel: 'Tienda Oficial',
    originalPrice: 'USD $210',
    currentPrice: 'USD $175',
    unit: '/ Bolsa',
    gradient: 'from-yellow-600 to-yellow-800',
    Icon: Wheat,
  },
  {
    id: 4,
    badge: '15% OFF',
    rating: 4.7,
    reviews: 8,
    title: 'Kit de Riego Goteo...',
    sellerType: 'location',
    sellerLabel: 'Sinaloa, MX',
    originalPrice: 'USD $1,200',
    currentPrice: 'USD $995',
    gradient: 'from-sky-600 to-sky-900',
    Icon: Droplets,
  },
]

const tiendas: TiendaOficial[] = [
  {
    id: 1,
    name: 'John Deere Store',
    description: 'Hasta 24 cuotas fijas en repuestos originales.',
    avatarGradient: 'from-green-600 to-green-800',
    initials: 'JD',
    Icon: Tractor,
  },
  {
    id: 2,
    name: 'Syngenta Direct',
    description: 'Pack Herbicidas con 30% de descuento por volumen.',
    avatarGradient: 'from-sky-600 to-sky-800',
    initials: 'SY',
    Icon: Wrench,
  },
  {
    id: 3,
    name: 'Bayer CropScience',
    description: 'Nuevos fungicidas con envío bonificado a campo.',
    avatarGradient: 'from-blue-700 to-blue-900',
    initials: 'BC',
    Icon: Package,
  },
]

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(targetDate: Date): CountdownTime {
  const getTimeLeft = (): CountdownTime => {
    const diff = Math.max(0, targetDate.getTime() - Date.now())
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }

  const [time, setTime] = useState<CountdownTime>(getTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  return time
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-2xl font-bold text-white leading-none">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[9px] font-semibold tracking-widest text-white/60 uppercase mt-0.5">
        {label}
      </span>
    </div>
  )
}

function OfertaCard({ product }: { product: OfertaProduct }) {
  const [wished, setWished] = useState(false)

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      {/* Image area */}
      <div className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${product.gradient}`}>
        <product.Icon className="h-16 w-16 text-white/20" />
        <span className={`absolute left-2.5 top-2.5 rounded px-2 py-0.5 text-[11px] font-bold ${badgeStyles[product.badge]}`}>
          {product.badge}
        </span>
        <button
          onClick={() => setWished((v) => !v)}
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow transition-colors hover:bg-white"
        >
          <Heart className={`h-3.5 w-3.5 transition-colors ${wished ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <div className="flex items-center gap-1 text-xs">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-gray-800">{product.rating}</span>
          <span className="text-gray-400">({product.reviews} reviews)</span>
        </div>

        <p className="mt-1.5 text-sm font-bold text-gray-900 leading-tight">{product.title}</p>

        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          {product.sellerType === 'location' ? (
            <>
              <MapPin className="h-3 w-3 shrink-0" />
              <span>{product.sellerLabel}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3 w-3 shrink-0 text-agrobot-600" />
              <span className="text-agrobot-700 font-medium">{product.sellerLabel}</span>
            </>
          )}
        </div>

        <div className="mt-2">
          <p className="text-xs text-gray-400 line-through">{product.originalPrice}</p>
          <p className="text-base font-bold text-gray-900">
            {product.currentPrice}
            {product.unit && <span className="text-xs font-normal text-gray-500 ml-1">{product.unit}</span>}
          </p>
        </div>

        <div className="mt-3 flex gap-2">
          <button className="flex-1 rounded-lg border border-gray-200 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-agrobot-300 hover:text-agrobot-800">
            Ver oferta
          </button>
          <button className="flex-1 rounded-lg bg-agrobot-700 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-agrobot-800">
            Cotizar
          </button>
        </div>
      </div>
    </div>
  )
}

function TiendaCard({ tienda }: { tienda: TiendaOficial }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col items-center text-center gap-3 transition-shadow hover:shadow-md">
      <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${tienda.avatarGradient} shadow`}>
        <tienda.Icon className="h-7 w-7 text-white" />
      </div>
      <div>
        <p className="font-bold text-gray-900 text-sm">{tienda.name}</p>
        <p className="mt-1 text-xs text-gray-500 leading-relaxed">{tienda.description}</p>
      </div>
      <button className="w-full rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-agrobot-300 hover:text-agrobot-700">
        Visitar Tienda
      </button>
    </div>
  )
}

// ─── Sections ────────────────────────────────────────────────────────────────

function HeroBanner() {
  const target = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 1000)
  const { days, hours, minutes } = useCountdown(target)

  return (
    <section
      className="relative overflow-hidden rounded-2xl mx-auto max-w-6xl mt-6 px-4"
      style={{ minHeight: 300 }}
    >
      <div
        className="relative overflow-hidden rounded-2xl w-full"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.30) 60%, rgba(0,0,0,0.10) 100%), url('/farm-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: 300,
        }}
      >
        <div className="relative z-10 flex flex-col justify-center p-8 md:p-12" style={{ minHeight: 300 }}>
          <span className="inline-block w-fit rounded-full bg-orange-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white mb-4">
            Campaña Estacional
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight max-w-lg mb-3">
            Gran Venta de Cosecha 2026
          </h1>
          <p className="text-white/80 text-sm max-w-sm mb-6 leading-relaxed">
            Equipate con lo mejor para esta temporada. Maquinaria, semillas y fertilizantes con descuentos de hasta el 40%.
          </p>

          {/* Countdown */}
          <div className="inline-flex flex-col gap-1.5 bg-black/30 backdrop-blur-sm rounded-xl px-5 py-3.5 w-fit mb-6">
            <span className="text-[10px] font-semibold tracking-widest text-white/60 uppercase">
              La oferta termina en:
            </span>
            <div className="flex items-end gap-3">
              <CountdownUnit value={days} label="Días" />
              <span className="text-white/60 font-bold text-xl mb-0.5">:</span>
              <CountdownUnit value={hours} label="Horas" />
              <span className="text-white/60 font-bold text-xl mb-0.5">:</span>
              <CountdownUnit value={minutes} label="Min" />
            </div>
          </div>

          <button className="flex w-fit items-center gap-2 rounded-xl bg-agrobot-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-agrobot-700">
            Ver Catálogo de Cosecha
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

function CategoryFilter() {
  const [active, setActive] = useState('Todas las Ofertas')

  return (
    <section className="mx-auto max-w-6xl px-4 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-gray-900">Filtrar por categoría</h2>
        <button className="text-sm font-semibold text-agrobot-700 hover:underline">Ver todas</button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {categories.map(({ label, Icon }) => {
          const isActive = active === label
          return (
            <button
              key={label}
              onClick={() => setActive(label)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-agrobot-700 text-white shadow-sm'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function OfertasDelDia() {
  return (
    <section className="mx-auto max-w-6xl px-4 mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
        <h2 className="font-display text-lg font-bold text-gray-900">Ofertas del Día</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((product) => (
          <OfertaCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

function TiendasOficiales() {
  return (
    <section className="mx-auto max-w-6xl px-4 mt-10 mb-10">
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-lg font-bold text-gray-900">Promociones de Tiendas Oficiales</h2>
          <button className="flex items-center gap-1 text-sm font-semibold text-agrobot-700 hover:underline">
            Ver todas las tiendas
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-5">Compra directo de las mejores marcas del sector con garantía oficial.</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {tiendas.map((tienda) => (
            <TiendaCard key={tienda.id} tienda={tienda} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function OfertasPage() {
  return (
    <div className="bg-white min-h-screen pb-10">
      <HeroBanner />
      <CategoryFilter />
      <OfertasDelDia />
      <TiendasOficiales />
    </div>
  )
}
