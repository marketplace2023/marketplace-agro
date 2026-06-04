import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Shield, Bell, Eye, Save } from 'lucide-react'
import { useUpdatePasswordMutation } from '@/modules/auth/queries/auth-queries'
import { toast } from 'sonner'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${
        checked ? 'bg-sky-600' : 'bg-gray-200'
      }`}
    >
      <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-4' : 'translate-x-0'
      }`} />
    </button>
  )
}

export function CompradorConfiguracion() {
  const [saved, setSaved] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const updatePassword = useUpdatePasswordMutation()

  const [notifs, setNotifs] = useState({
    quotesEmail: true,
    radarEmail: true,
    priceChanges: false,
    newsletter: false,
  })
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    allowContact: true,
  })

  function toggleNotif(key: keyof typeof notifs) {
    setNotifs((n) => ({ ...n, [key]: !n[key] }))
  }
  function togglePrivacy(key: keyof typeof privacy) {
    setPrivacy((p) => ({ ...p, [key]: !p[key] }))
  }

  function handleSavePrefs(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    updatePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        },
      }
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-500 mt-0.5">Seguridad, notificaciones y privacidad</p>
      </div>

      <Tabs defaultValue="seguridad">
        <TabsList>
          <TabsTrigger value="seguridad" className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" /> Seguridad
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="flex items-center gap-1.5">
            <Bell className="h-3.5 w-3.5" /> Notificaciones
          </TabsTrigger>
          <TabsTrigger value="privacidad" className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" /> Privacidad
          </TabsTrigger>
        </TabsList>

        {/* Seguridad */}
        <TabsContent value="seguridad" className="mt-5">
          <form onSubmit={handleChangePassword} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4">
            <h2 className="text-sm font-bold text-gray-900">Cambiar contraseña</h2>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Contraseña actual</label>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Nueva contraseña</label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 8 caracteres" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Confirmar nueva contraseña</label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repite la nueva contraseña" required />
            </div>
            <button type="submit"
              disabled={updatePassword.isPending}
              className="flex items-center gap-2 self-start rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700 disabled:opacity-60 transition-colors">
              <Save className="h-4 w-4" />
              {updatePassword.isPending ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </form>
        </TabsContent>

        {/* Notificaciones */}
        <TabsContent value="notificaciones" className="mt-5">
          <form onSubmit={handleSavePrefs} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4">
            {[
              { key: 'quotesEmail' as const, label: 'Respuestas a cotizaciones', desc: 'Recibe un email cuando un proveedor responda' },
              { key: 'radarEmail' as const, label: 'Coincidencias de Radar', desc: 'Alertas de nuevas publicaciones que coinciden' },
              { key: 'priceChanges' as const, label: 'Cambios de precio', desc: 'Notifica cuando baja el precio de un favorito' },
              { key: 'newsletter' as const, label: 'Novedades y ofertas', desc: 'Boletín semanal de AgroMarket' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <Toggle checked={notifs[key]} onChange={() => toggleNotif(key)} />
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2 border-t">
              <button type="submit" className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700 transition-colors">
                <Save className="h-4 w-4" /> Guardar preferencias
              </button>
              {saved && <Badge className="bg-agrobot-700 text-white animate-pulse">¡Guardado!</Badge>}
            </div>
          </form>
        </TabsContent>

        {/* Privacidad */}
        <TabsContent value="privacidad" className="mt-5">
          <form onSubmit={handleSavePrefs} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4">
            {[
              { key: 'showProfile' as const, label: 'Mostrar perfil a proveedores', desc: 'Los vendedores pueden ver tu nombre y ubicación' },
              { key: 'allowContact' as const, label: 'Permitir contacto directo', desc: 'Los proveedores verificados pueden escribirte' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <Toggle checked={privacy[key]} onChange={() => togglePrivacy(key)} />
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2 border-t">
              <button type="submit" className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700 transition-colors">
                <Save className="h-4 w-4" /> Guardar
              </button>
              {saved && <Badge className="bg-agrobot-700 text-white animate-pulse">¡Guardado!</Badge>}
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
