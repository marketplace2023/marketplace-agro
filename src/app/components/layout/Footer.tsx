const footerLinks = {
  Explorar: ['Sobre Nosotros', 'Vender', 'Radar'],
  Legal: ['Términos y Condiciones', 'Política de Privacidad'],
  Soporte: ['Contacto', 'Soporte'],
}

export function Footer() {
  return (
    <footer className="mt-16 bg-agrobot-900">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-lg font-bold italic text-white">TierraMarket</p>
            <p className="mt-2 text-sm leading-relaxed text-agrobot-100">
              Conectando la producción agrícola de Latinoamérica con tecnología y confianza.
            </p>
          </div>
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className="mb-3 text-sm font-semibold text-white">{section}</p>
              <ul className="space-y-2 text-sm text-agrobot-100">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="transition-colors hover:text-agro-lime-500"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="mt-8 border-t pt-6 text-center text-xs text-agrobot-100"
          style={{ borderColor: 'rgba(209, 250, 229, 0.18)' }}
        >
          © 2024 TierraMarket. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
