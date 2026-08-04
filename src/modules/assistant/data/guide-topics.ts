export type GuideTopic = {
  id: string
  label: string
  keywords: string[]
  response: string
  href?: string
  hrefLabel?: string
}

const commonTopics: GuideTopic[] = [
  {
    id: 'ayuda',
    label: 'Centro de ayuda',
    keywords: ['ayuda', 'duda', 'problema', 'soporte', 'no funciona', 'error'],
    response: 'Tenemos un Centro de Ayuda con artículos que resuelven las dudas más frecuentes de la plataforma.',
    href: '/ayuda',
    hrefLabel: 'Ir al Centro de ayuda',
  },
]

export const publicTopics: GuideTopic[] = [
  {
    id: 'que-es',
    label: '¿Qué es TierraMarket?',
    keywords: ['que es', 'como funciona', 'marketplace', 'plataforma'],
    response: 'TierraMarket conecta compradores y vendedores del sector agrícola: productores, proveedores, laboratorios y certificadores en un mismo lugar.',
    href: '/categorias',
    hrefLabel: 'Explorar categorías',
  },
  {
    id: 'como-comprar',
    label: '¿Cómo compro o cotizo?',
    keywords: ['comprar', 'cotizar', 'cotizacion', 'contactar vendedor'],
    response: 'Busca el producto o servicio en el catálogo y solicita una cotización directamente al vendedor. Necesitas una cuenta de comprador.',
    href: '/catalogo',
    hrefLabel: 'Ver catálogo',
  },
  {
    id: 'como-vender',
    label: '¿Cómo publico y vendo?',
    keywords: ['vender', 'publicar', 'publicacion', 'ofrecer producto', 'ser vendedor', 'ser productor'],
    response: 'Crea una cuenta de vendedor o productor, arma tu tienda y publica tus productos o servicios para recibir cotizaciones.',
    href: '/register',
    hrefLabel: 'Crear cuenta',
  },
  {
    id: 'radar',
    label: 'Radar de precios',
    keywords: ['radar', 'precio', 'alerta'],
    response: 'El Radar te avisa cuando aparecen productos que cumplen los criterios de precio y zona que definas.',
    href: '/radar',
    hrefLabel: 'Ver Radar',
  },
  {
    id: 'ofertas',
    label: 'Ofertas destacadas',
    keywords: ['oferta', 'promocion', 'descuento'],
    response: 'Revisa las ofertas destacadas de la semana en toda la plataforma.',
    href: '/ofertas',
    hrefLabel: 'Ver ofertas',
  },
]

export const buyerTopics: GuideTopic[] = [
  {
    id: 'buscar-proveedores',
    label: 'Buscar proveedores',
    keywords: ['buscar', 'proveedor', 'producto', 'catalogo'],
    response: 'Usa Mis búsquedas para guardar filtros y encontrar rápido proveedores que cumplan lo que necesitas.',
    href: '/app/comprador/busquedas',
    hrefLabel: 'Ir a Mis búsquedas',
  },
  {
    id: 'enviar-cotizacion',
    label: 'Enviar una cotización',
    keywords: ['cotizar', 'cotizacion', 'solicitar precio'],
    response: 'Desde la ficha de un producto puedes solicitar cotización; el seguimiento queda disponible en Mis cotizaciones.',
    href: '/app/comprador/cotizaciones',
    hrefLabel: 'Ir a Mis cotizaciones',
  },
  {
    id: 'favoritos',
    label: 'Mis favoritos',
    keywords: ['favorito', 'guardado'],
    response: 'Guarda productos y tiendas en Favoritos para encontrarlos rápido después.',
    href: '/app/comprador/favoritos',
    hrefLabel: 'Ver favoritos',
  },
  {
    id: 'radar-comprador',
    label: 'Configurar el Radar',
    keywords: ['radar', 'alerta', 'precio'],
    response: 'Crea una alerta de Radar con el producto, precio y zona que te interesan y te avisamos cuando aparezca.',
    href: '/app/comprador/radar/nuevo',
    hrefLabel: 'Crear alerta de Radar',
  },
  {
    id: 'comparador',
    label: 'Comparar productos',
    keywords: ['comparar', 'comparador'],
    response: 'El Comparador te permite poner lado a lado varios productos o proveedores antes de decidir.',
    href: '/app/comprador/comparador',
    hrefLabel: 'Ir al Comparador',
  },
]

export const sellerTopics: GuideTopic[] = [
  {
    id: 'publicar-seller',
    label: 'Publicar un producto',
    keywords: ['publicar', 'producto', 'anuncio', 'catalogo'],
    response: 'Desde Publicaciones puedes crear, editar y gestionar el estado de tus anuncios.',
    href: '/app/seller/publicaciones',
    hrefLabel: 'Ir a Publicaciones',
  },
  {
    id: 'cotizaciones-seller',
    label: 'Responder cotizaciones',
    keywords: ['cotizacion', 'responder', 'presupuesto'],
    response: 'Revisa y responde las solicitudes de cotización de tus compradores desde este panel.',
    href: '/app/seller/cotizaciones',
    hrefLabel: 'Ver cotizaciones',
  },
  {
    id: 'leads-seller',
    label: 'Gestionar leads',
    keywords: ['lead', 'contacto', 'cliente potencial'],
    response: 'Todos los contactos interesados en tus productos quedan registrados como leads para que les hagas seguimiento.',
    href: '/app/seller/leads',
    hrefLabel: 'Ver leads',
  },
  {
    id: 'tienda-seller',
    label: 'Configurar mi tienda',
    keywords: ['tienda', 'perfil de tienda', 'gbp'],
    response: 'Completa el perfil de tu tienda (horarios, contacto, medios) para generar más confianza a los compradores.',
    href: '/app/seller/tienda',
    hrefLabel: 'Ir a Mi tienda',
  },
  {
    id: 'reputacion-seller',
    label: 'Mejorar mi reputación',
    keywords: ['reputacion', 'calificacion', 'verificacion', 'confianza'],
    response: 'Las verificaciones y buenas calificaciones suben tu reputación y visibilidad en las búsquedas.',
    href: '/app/seller/reputacion',
    hrefLabel: 'Ver mi reputación',
  },
]

export const producerTopics: GuideTopic[] = [
  {
    id: 'publicar-producer',
    label: 'Publicar un producto',
    keywords: ['publicar', 'producto', 'anuncio', 'inventario'],
    response: 'Desde Publicaciones puedes crear y administrar tus anuncios; el stock se controla en Inventario.',
    href: '/app/productor/publicaciones',
    hrefLabel: 'Ir a Publicaciones',
  },
  {
    id: 'inventario-producer',
    label: 'Gestionar inventario',
    keywords: ['inventario', 'stock', 'lote', 'cosecha'],
    response: 'Registra tus lotes y cantidades disponibles en Inventario para mantener tus publicaciones actualizadas.',
    href: '/app/productor/inventario',
    hrefLabel: 'Ir a Inventario',
  },
  {
    id: 'cotizaciones-producer',
    label: 'Responder cotizaciones',
    keywords: ['cotizacion', 'responder', 'presupuesto'],
    response: 'Revisa y responde las solicitudes de cotización de tus compradores desde este panel.',
    href: '/app/productor/cotizaciones',
    hrefLabel: 'Ver cotizaciones',
  },
  {
    id: 'documentos-producer',
    label: 'Certificaciones y documentos',
    keywords: ['certificacion', 'documento', 'calidad'],
    response: 'Sube tus certificaciones y documentos de calidad para que los compradores confíen más en tu producto.',
    href: '/app/productor/documentos',
    hrefLabel: 'Ir a Documentos',
  },
  {
    id: 'reputacion-producer',
    label: 'Mejorar mi reputación',
    keywords: ['reputacion', 'calificacion', 'verificacion', 'confianza'],
    response: 'Las verificaciones y buenas calificaciones suben tu reputación y visibilidad en las búsquedas.',
    href: '/app/productor/reputacion',
    hrefLabel: 'Ver mi reputación',
  },
]

export function getTopicsForPath(pathname: string): GuideTopic[] {
  if (pathname.startsWith('/app/comprador')) return [...buyerTopics, ...commonTopics]
  if (pathname.startsWith('/app/seller')) return [...sellerTopics, ...commonTopics]
  if (pathname.startsWith('/app/productor')) return [...producerTopics, ...commonTopics]
  return [...publicTopics, ...commonTopics]
}

export function getGreetingForPath(pathname: string): string {
  if (pathname.startsWith('/app/comprador')) return '¡Hola! Soy Hormi 🐜 ¿Buscas proveedores, quieres cotizar o prefieres configurar una alerta del Radar?'
  if (pathname.startsWith('/app/seller') || pathname.startsWith('/app/productor')) return '¡Hola! Soy Hormi 🐜 ¿Te ayudo a publicar, responder cotizaciones o mejorar tu tienda?'
  return '¡Hola! Soy Hormi 🐜 tu guía en TierraMarket. ¿En qué te puedo ayudar hoy?'
}
