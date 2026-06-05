import { Bell, Lock, Trash2, Globe, Moon, Save } from 'lucide-react'

export function SellerConfig() {
  return (
    <div className="flex flex-col gap-6">

      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-400 mt-0.5">Preferencias de cuenta y seguridad</p>
      </div>

      {/* Notifications */}
      <Section icon={Bell} title="Notificaciones" description="Elige cuándo y cómo te notificamos">
        <div className="space-y-3">
          {[
            { label: 'Nueva cotización recibida', sub: 'Cuando alguien solicita precio de tus publicaciones', on: true },
            { label: 'Lead nuevo', sub: 'Cuando alguien muestra interés en tu negocio', on: true },
            { label: 'Nueva reseña', sub: 'Cuando un comprador deja una calificación', on: false },
            { label: 'Recordatorio de publicaciones', sub: 'Cuando una publicación está por expirar', on: true },
            { label: 'Novedades de la plataforma', sub: 'Actualizaciones y nuevas funciones', on: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
              <button
                disabled
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors cursor-not-allowed ${item.on ? 'bg-agrobot-500' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${item.on ? 'left-4' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Security */}
      <Section icon={Lock} title="Seguridad" description="Contraseña y acceso a la cuenta">
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Contraseña actual</label>
            <input disabled type="password" placeholder="••••••••" className="mt-1 h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 placeholder:text-gray-400 cursor-not-allowed opacity-70" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Nueva contraseña</label>
              <input disabled type="password" placeholder="••••••••" className="mt-1 h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm placeholder:text-gray-400 cursor-not-allowed opacity-70" />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Confirmar contraseña</label>
              <input disabled type="password" placeholder="••••••••" className="mt-1 h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm placeholder:text-gray-400 cursor-not-allowed opacity-70" />
            </div>
          </div>
          <button disabled className="flex items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white opacity-50 cursor-not-allowed">
            <Save className="h-4 w-4" />
            Cambiar contraseña (próximamente)
          </button>
        </div>
      </Section>

      {/* Preferences */}
      <Section icon={Globe} title="Preferencias" description="Idioma, zona horaria y apariencia">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: 'Idioma', value: 'Español (Venezuela)' },
            { label: 'Zona horaria', value: 'America/Caracas (UTC-4)' },
          ].map((p) => (
            <div key={p.label}>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{p.label}</label>
              <div className="mt-1 flex h-9 items-center rounded-lg border border-gray-200 bg-gray-50 px-3">
                <span className="text-sm text-gray-600">{p.value}</span>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 sm:col-span-2">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Modo oscuro</span>
            </div>
            <button disabled className="relative h-5 w-9 rounded-full bg-gray-200 cursor-not-allowed">
              <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>
      </Section>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Trash2 className="h-4 w-4 text-red-500" />
          <p className="text-sm font-bold text-red-700">Zona de peligro</p>
        </div>
        <p className="text-xs text-red-600 mb-4">Eliminar tu cuenta es permanente y no se puede deshacer.</p>
        <button disabled className="flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm font-bold text-red-500 opacity-50 cursor-not-allowed">
          <Trash2 className="h-4 w-4" />
          Eliminar cuenta (próximamente)
        </button>
      </div>

    </div>
  )
}

function Section({
  icon: Icon, title, description, children,
}: {
  icon: React.ElementType; title: string; description: string; children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-agrobot-600" />
        <p className="text-sm font-bold text-gray-900">{title}</p>
      </div>
      <p className="text-xs text-gray-400 mb-4">{description}</p>
      {children}
    </div>
  )
}
