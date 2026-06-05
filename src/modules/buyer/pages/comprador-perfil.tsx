import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/modules/auth/context/auth-context'
import { Save, User, MapPin, MessageCircle, Wheat } from 'lucide-react'

const CATEGORIAS = ['Granos', 'Hortalizas', 'Frutas', 'Insumos', 'Maquinaria', 'Servicios', 'Ganadería']
const ESTADOS_VE = ['Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar', 'Carabobo', 'Cojedes', 'Delta Amacuro', 'Falcón', 'Guárico', 'Lara', 'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia', 'Distrito Capital']

export function CompradorPerfil() {
  const { user } = useAuth() as { isAuthenticated: true; user: { name: string; email: string } }
  const [saved, setSaved] = useState(false)
  const [preferencias, setPreferencias] = useState<string[]>([])

  function toggleCategoria(cat: string) {
    setPreferencias((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-sm text-gray-500 mt-0.5">Datos personales y preferencias de compra</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {/* Datos personales */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-agrobot-600" /> Datos personales
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Nombre completo</label>
                <Input defaultValue={user.name} placeholder="Tu nombre" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Correo electrónico</label>
                <Input defaultValue={user.email} type="email" placeholder="correo@ejemplo.com" disabled className="bg-gray-50" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Empresa / Razón social (opcional)</label>
              <Input placeholder="Nombre de tu empresa o explotación agrícola" />
            </div>
          </CardContent>
        </Card>

        {/* Ubicación */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4 text-agrobot-600" /> Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Estado</label>
              <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-agrobot-500">
                <option value="">Selecciona estado</option>
                {ESTADOS_VE.map((e) => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Municipio</label>
              <Input placeholder="Tu municipio" />
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageCircle className="h-4 w-4 text-agrobot-600" /> WhatsApp de contacto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">+58</span>
              <Input type="tel" placeholder="4XX XXX XXXX" className="flex-1" />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">Los proveedores podrán contactarte por este número.</p>
          </CardContent>
        </Card>

        {/* Preferencias de compra */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wheat className="h-4 w-4 text-agrobot-600" /> Preferencias de compra
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500 mb-3">Categorías que más te interesan (selecciona varias)</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategoria(cat)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                    preferencias.includes(cat)
                      ? 'border-agrobot-500 bg-agrobot-50 text-agrobot-700'
                      : 'border-gray-200 text-gray-500 hover:border-agrobot-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-agrobot-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-agrobot-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            Guardar cambios
          </button>
          {saved && (
            <Badge variant="default" className="bg-agrobot-700 text-white animate-pulse">
              ¡Guardado!
            </Badge>
          )}
        </div>
      </form>
    </div>
  )
}
