import { PlusCircle, Wheat, Home, FlaskConical, Tractor, Briefcase, Truck, Users2, TestTube2, BadgeCheck, ClipboardCheck, Grid3x3, Package, Clock, ArrowRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyStoreQuery, useMyListingsQuery } from '../queries/seller-queries'
import type { StoreRoleType } from '../api/seller-api'

// ─── Coming-soon card ──────────────────────────────────────────────────────

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-10 text-center">
      <Clock className="h-8 w-8 text-gray-300 mb-2" />
      <p className="text-sm font-semibold text-gray-400">{label}</p>
      <p className="text-xs text-gray-300 mt-1">Disponible próximamente</p>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-[10px] text-gray-400">{sub}</p>}
    </div>
  )
}

// ─── Module: seller → Catálogo ──────────────────────────────────────────────

function CatalogoModule() {
  const { data: listings, isLoading } = useMyListingsQuery()
  const published = (listings ?? []).filter(l => l.status === 'published').length
  const total = (listings ?? []).length

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        icon={Grid3x3}
        title="Mi Catálogo"
        description="Gestiona tu catálogo comercial: productos, precios e inventario disponible para la venta."
        ctaLabel="Nueva publicación"
        ctaTo="/app/seller/publicaciones"
      />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3"><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Publicaciones activas" value={published} />
          <StatCard label="Total en catálogo" value={total} />
          <StatCard label="Inventario avanzado" value="Pronto" sub="Variantes, stock, alertas" />
        </div>
      )}
      <ComingSoon label="Catálogo con variantes, precios por volumen y gestión de inventario" />
    </div>
  )
}

// ─── Module: producer → Cosechas ───────────────────────────────────────────

function CosechasModule() {
  const { data: listings, isLoading } = useMyListingsQuery()
  const active = (listings ?? []).filter(l => l.status === 'published').length

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        icon={Wheat}
        title="Mis Cosechas"
        description="Registra y publica tus cosechas con volumen disponible, calidad, calibre, precio y fecha de disponibilidad."
        ctaLabel="Publicar cosecha"
        ctaTo="/app/seller/publicaciones"
      />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3"><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Cosechas publicadas" value={active} />
          <StatCard label="Inventario total" value="Próximo" sub="Kg / toneladas disponibles" />
          <StatCard label="Certificaciones" value="Próximo" sub="BPA, orgánico, trazabilidad" />
        </div>
      )}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Qué podrás hacer</h3>
        <ul className="flex flex-col gap-2">
          {[
            'Registrar cosechas con cultivo, variedad, volumen y unidad',
            'Definir calidad y calibre del producto',
            'Establecer fecha de disponibilidad y ventana de entrega',
            'Cargar certificaciones BPA, orgánico o fitosanitarias',
            'Gestionar inventario y marcar cosechas como vendidas',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-gray-500">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-agrobot-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <ComingSoon label="Módulo de cosechas con inventario, trazabilidad y certificaciones" />
    </div>
  )
}

// ─── Module: farm_owner → Fincas ───────────────────────────────────────────

function FincasModule() {
  const { data: listings, isLoading } = useMyListingsQuery()
  const active = (listings ?? []).filter(l => l.status === 'published').length

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        icon={Home}
        title="Mis Fincas y Predios"
        description="Publica fincas, lotes y predios agrícolas para venta, arriendo o alianzas productivas."
        ctaLabel="Publicar predio"
        ctaTo="/app/seller/publicaciones"
      />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3"><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Predios publicados" value={active} />
          <StatCard label="Visitas solicitadas" value="Próximo" sub="Agenda y confirmaciones" />
          <StatCard label="Documentos cargados" value="Próximo" sub="Escrituras, titulación" />
        </div>
      )}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Qué podrás publicar</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Finca en venta', 'Lote en arriendo', 'Predio agroindustrial', 'Alianza productiva'].map((t) => (
            <span key={t} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600">{t}</span>
          ))}
        </div>
      </div>
      <ComingSoon label="Módulo de predios con mapa, documentos y solicitudes de visita" />
    </div>
  )
}

// ─── Module: input_supplier → Insumos ─────────────────────────────────────

function InsumosModule() {
  const { data: listings, isLoading } = useMyListingsQuery()
  const active = (listings ?? []).filter(l => l.status === 'published').length

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        icon={FlaskConical}
        title="Mis Insumos"
        description="Gestiona tu catálogo de insumos agrícolas con fichas técnicas, hojas de seguridad y precios por volumen."
        ctaLabel="Agregar insumo"
        ctaTo="/app/seller/publicaciones"
      />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3"><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Insumos publicados" value={active} />
          <StatCard label="Fichas técnicas" value="Próximo" sub="PDF, documentación oficial" />
          <StatCard label="Precios por volumen" value="Próximo" sub="Mayorista y minorista" />
        </div>
      )}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Tipos de insumos</h3>
        <div className="grid grid-cols-3 gap-2">
          {['Semillas', 'Fertilizantes', 'Agroquímicos', 'Bioinsumos', 'Sustratos', 'Herramientas'].map((t) => (
            <span key={t} className="rounded-lg border border-gray-100 bg-gray-50 px-2 py-1.5 text-[11px] font-medium text-gray-600 text-center">{t}</span>
          ))}
        </div>
      </div>
      <ComingSoon label="Módulo con fichas técnicas, MSDS y precios por escala de volumen" />
    </div>
  )
}

// ─── Module: machinery_supplier → Maquinaria ──────────────────────────────

function MaquinariaModule() {
  const { data: listings, isLoading } = useMyListingsQuery()
  const active = (listings ?? []).filter(l => l.status === 'published').length

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        icon={Tractor}
        title="Mi Maquinaria"
        description="Publica maquinaria nueva, usada, en alquiler y repuestos con fichas técnicas y estado físico."
        ctaLabel="Publicar equipo"
        ctaTo="/app/seller/publicaciones"
      />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-4"><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-4">
          <StatCard label="Equipos publicados" value={active} />
          <StatCard label="Nueva" value="Próximo" />
          <StatCard label="Usada" value="Próximo" />
          <StatCard label="En alquiler" value="Próximo" />
        </div>
      )}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Qué podrás gestionar</h3>
        <ul className="flex flex-col gap-2">
          {[
            'Maquinaria agrícola nueva y usada con estado físico detallado',
            'Equipos en alquiler con disponibilidad y precio por día/hora',
            'Repuestos y accesorios con código de referencia',
            'Fichas técnicas: potencia, año, marca, modelo, horas de uso',
            'Solicitudes de inspección previa a la venta',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-gray-500">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-agrobot-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <ComingSoon label="Módulo con fichas técnicas, estado físico y gestión de alquiler" />
    </div>
  )
}

// ─── Module: agronomist → Servicios ────────────────────────────────────────

function ServiciosModule() {
  const { data: listings, isLoading } = useMyListingsQuery()
  const active = (listings ?? []).filter(l => l.status === 'published').length

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        icon={Briefcase}
        title="Mis Servicios"
        description="Publica tus servicios agronómicos, define especialidades, área de cobertura y disponibilidad de agenda."
        ctaLabel="Publicar servicio"
        ctaTo="/app/seller/publicaciones"
      />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3"><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Servicios publicados" value={active} />
          <StatCard label="Agenda" value="Próximo" sub="Citas y disponibilidad" />
          <StatCard label="Diagnósticos" value="Próximo" sub="Informes técnicos" />
        </div>
      )}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Especialidades</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Manejo de plagas', 'Análisis de suelo', 'Asesoría en riego', 'Fertilización', 'Producción orgánica', 'Trazabilidad'].map((t) => (
            <span key={t} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-[11px] font-medium text-gray-600">{t}</span>
          ))}
        </div>
      </div>
      <ComingSoon label="Módulo con agenda, diagnósticos y documentos técnicos" />
    </div>
  )
}

// ─── Module: transporter → Rutas ───────────────────────────────────────────

function RutasModule() {
  const { data: listings, isLoading } = useMyListingsQuery()
  const active = (listings ?? []).filter(l => l.status === 'published').length

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        icon={Truck}
        title="Mis Rutas y Vehículos"
        description="Registra tu flota, define rutas disponibles, capacidad de carga y gestiona solicitudes de transporte."
        ctaLabel="Publicar ruta"
        ctaTo="/app/seller/publicaciones"
      />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-4"><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-4">
          <StatCard label="Rutas publicadas" value={active} />
          <StatCard label="Vehículos" value="Próximo" sub="Flota registrada" />
          <StatCard label="Capacidad total" value="Próximo" sub="Toneladas disponibles" />
          <StatCard label="Viajes realizados" value="Próximo" />
        </div>
      )}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Qué podrás gestionar</h3>
        <ul className="flex flex-col gap-2">
          {[
            'Flota de vehículos con tipo, capacidad, placa y documentos',
            'Rutas regulares con origen, destino y frecuencia',
            'Disponibilidad por fecha y tramo',
            'Tipos de carga: productos agrícolas, insumos, maquinaria',
            'Cotizaciones de flete por tonelada / viaje',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-gray-500">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-agrobot-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <ComingSoon label="Módulo de flota, rutas, disponibilidad y cotización logística" />
    </div>
  )
}

// ─── Module: cooperative → Cooperativa ─────────────────────────────────────

function CooperativaModule() {
  const { data: listings, isLoading } = useMyListingsQuery()
  const active = (listings ?? []).filter(l => l.status === 'published').length

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        icon={Users2}
        title="Mi Cooperativa"
        description="Gestiona asociados, consolida la oferta colectiva y negocia compras grupales en nombre de tu cooperativa."
        ctaLabel="Publicar oferta colectiva"
        ctaTo="/app/seller/publicaciones"
      />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3"><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Publicaciones activas" value={active} />
          <StatCard label="Asociados" value="Próximo" sub="Miembros activos" />
          <StatCard label="Volumen consolidado" value="Próximo" sub="Oferta colectiva" />
        </div>
      )}
      <ComingSoon label="Módulo de asociados, oferta colectiva y compras agrupadas" />
    </div>
  )
}

// ─── Module: laboratory → Laboratorio ─────────────────────────────────────

function LaboratorioModule() {
  const { data: listings, isLoading } = useMyListingsQuery()
  const active = (listings ?? []).filter(l => l.status === 'published').length

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        icon={TestTube2}
        title="Mi Laboratorio"
        description="Publica los servicios de análisis disponibles y gestiona muestras, resultados e informes técnicos."
        ctaLabel="Publicar servicio"
        ctaTo="/app/seller/publicaciones"
      />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3"><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Servicios publicados" value={active} />
          <StatCard label="Muestras activas" value="Próximo" sub="En análisis" />
          <StatCard label="Informes emitidos" value="Próximo" />
        </div>
      )}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Tipos de análisis</h3>
        <div className="grid grid-cols-3 gap-2">
          {['Suelo', 'Agua', 'Foliar', 'Residuos', 'Calidad', 'Inocuidad'].map((t) => (
            <span key={t} className="rounded-lg border border-gray-100 bg-gray-50 px-2 py-1.5 text-[11px] font-medium text-gray-600 text-center">{t}</span>
          ))}
        </div>
      </div>
      <ComingSoon label="Módulo de muestras, resultados e informes técnicos digitales" />
    </div>
  )
}

// ─── Module: certifier → Certificaciones ──────────────────────────────────

function CertificacionesModule() {
  const { data: listings, isLoading } = useMyListingsQuery()
  const active = (listings ?? []).filter(l => l.status === 'published').length

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        icon={BadgeCheck}
        title="Mis Certificaciones"
        description="Ofrece servicios de certificación agrícola, gestiona auditorías, emite certificados y valida trazabilidad."
        ctaLabel="Publicar certificación"
        ctaTo="/app/seller/publicaciones"
      />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3"><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Servicios publicados" value={active} />
          <StatCard label="Auditorías activas" value="Próximo" />
          <StatCard label="Certificados emitidos" value="Próximo" />
        </div>
      )}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Tipos de certificación</h3>
        <div className="grid grid-cols-2 gap-2">
          {['BPA / Buenas Prácticas', 'Producción Orgánica', 'GlobalG.A.P.', 'Trazabilidad', 'Inocuidad alimentaria', 'Exportación'].map((t) => (
            <span key={t} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-[11px] font-medium text-gray-600">{t}</span>
          ))}
        </div>
      </div>
      <ComingSoon label="Módulo de auditorías, certificados digitales y trazabilidad" />
    </div>
  )
}

// ─── Module: quality_inspector → Inspecciones ─────────────────────────────

function InspeccionesModule() {
  const { data: listings, isLoading } = useMyListingsQuery()
  const active = (listings ?? []).filter(l => l.status === 'published').length

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        icon={ClipboardCheck}
        title="Mis Inspecciones"
        description="Ofrece servicios de inspección de calidad: calibre, empaque, estado del producto y condiciones de entrega."
        ctaLabel="Publicar servicio"
        ctaTo="/app/seller/publicaciones"
      />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3"><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Servicios publicados" value={active} />
          <StatCard label="Inspecciones activas" value="Próximo" />
          <StatCard label="Informes emitidos" value="Próximo" />
        </div>
      )}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Qué inspeccionas</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Calidad y calibre', 'Empaque y etiquetado', 'Estado fitosanitario', 'Condiciones de entrega', 'Documentación', 'Cadena de frío'].map((t) => (
            <span key={t} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-[11px] font-medium text-gray-600">{t}</span>
          ))}
        </div>
      </div>
      <ComingSoon label="Módulo de órdenes de inspección, formularios y evidencias fotográficas" />
    </div>
  )
}

// ─── Module header shared component ────────────────────────────────────────

function ModuleHeader({
  icon: Icon, title, description, ctaLabel, ctaTo,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  ctaLabel: string
  ctaTo: string
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-agrobot-50 border border-agrobot-100">
          <Icon className="h-6 w-6 text-agrobot-600" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-400 mt-0.5 max-w-lg">{description}</p>
        </div>
      </div>
      <a
        href={ctaTo}
        className="flex shrink-0 items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white hover:bg-agrobot-700 transition-colors"
      >
        <PlusCircle className="h-4 w-4" />
        {ctaLabel}
      </a>
    </div>
  )
}

// ─── Unknown role fallback ─────────────────────────────────────────────────

function SinRolModule() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
        <Package className="h-7 w-7 text-gray-300" />
      </div>
      <p className="text-sm font-semibold text-gray-600">Sin módulo especializado</p>
      <p className="text-xs text-gray-400 max-w-xs">
        Tu rol no tiene un módulo de oferta configurado todavía. Puedes usar "Publicaciones" para crear anuncios.
      </p>
      <a
        href="/app/seller/publicaciones"
        className="mt-2 flex items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white hover:bg-agrobot-700 transition-colors"
      >
        <ArrowRight className="h-4 w-4" />
        Ir a Publicaciones
      </a>
    </div>
  )
}

// ─── Dispatch map ──────────────────────────────────────────────────────────

const MODULE_BY_ROLE: Record<StoreRoleType, React.ComponentType> = {
  seller:             CatalogoModule,
  producer:           CosechasModule,
  farm_owner:         FincasModule,
  input_supplier:     InsumosModule,
  machinery_supplier: MaquinariaModule,
  agronomist:         ServiciosModule,
  transporter:        RutasModule,
  cooperative:        CooperativaModule,
  laboratory:         LaboratorioModule,
  certifier:          CertificacionesModule,
  quality_inspector:  InspeccionesModule,
}

// ─── Main export ───────────────────────────────────────────────────────────

export function SellerOferta() {
  const { data: store, isLoading } = useMyStoreQuery()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-7 w-48 rounded-lg" />
            <Skeleton className="h-4 w-96 rounded-lg" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </div>
    )
  }

  const roleType = store?.roleType as StoreRoleType | undefined
  const Module = roleType ? (MODULE_BY_ROLE[roleType] ?? SinRolModule) : SinRolModule

  return <Module />
}
