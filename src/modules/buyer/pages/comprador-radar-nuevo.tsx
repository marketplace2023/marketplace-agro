import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, ArrowRight, Save, Radar } from 'lucide-react'
import { Input } from '@/components/ui/input'

const CATEGORIAS = ['Granos', 'Hortalizas', 'Frutas', 'Insumos', 'Maquinaria', 'Servicios', 'Ganadería', 'Fincas']
const ESTADOS_VE = ['Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar', 'Carabobo', 'Cojedes', 'Falcón', 'Guárico', 'Lara', 'Mérida', 'Miranda', 'Monagas', 'Portuguesa', 'Sucre', 'Táchira', 'Trujillo', 'Yaracuy', 'Zulia', 'Distrito Capital']
const CANALES = ['Email', 'Notificación en plataforma']

const STEPS = ['Categoría', 'Producto', 'Ubicación', 'Precio', 'Notificación']

export function CompradorRadarNuevo() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '',
    categoria: '',
    keyword: '',
    department: '',
    minPrice: '',
    maxPrice: '',
    canal: 'Notificación en plataforma',
  })

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    navigate('/app/comprador/radar')
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/app/comprador/radar')}
          className="text-sm text-gray-400 hover:text-sky-600 flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Radar
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-semibold text-gray-700">Nueva alerta</span>
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Crear alerta Radar</h1>
        <p className="text-sm text-gray-500 mt-0.5">Te notificaremos cuando aparezcan nuevas oportunidades</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              i === step ? 'bg-sky-600 text-white' : i < step ? 'bg-agrobot-700 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {i + 1}
            </div>
            {i < STEPS.length - 1 && <div className={`h-0.5 w-8 ${i < step ? 'bg-agrobot-700' : 'bg-gray-200'}`} />}
          </div>
        ))}
        <span className="ml-2 text-xs text-gray-500 font-semibold">{STEPS[step]}</span>
      </div>

      <form onSubmit={handleSave} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Nombre de la alerta</label>
              <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ej: Maíz blanco Portuguesa" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Categoría</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS.map((c) => (
                  <button key={c} type="button" onClick={() => set('categoria', c)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      form.categoria === c ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-500 hover:border-sky-300'
                    }`}>{c}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Palabra clave / Cultivo / Producto</label>
              <Input value={form.keyword} onChange={(e) => set('keyword', e.target.value)} placeholder="Ej: maíz blanco, fertilizante NPK, tractor" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Estado (opcional)</label>
              <select value={form.department} onChange={(e) => set('department', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-400">
                <option value="">Cualquier estado</option>
                {ESTADOS_VE.map((e) => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Precio mínimo ($)</label>
                <Input type="number" value={form.minPrice} onChange={(e) => set('minPrice', e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Precio máximo ($)</label>
                <Input type="number" value={form.maxPrice} onChange={(e) => set('maxPrice', e.target.value)} placeholder="Sin límite" />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Canal de notificación</label>
              <div className="flex flex-col gap-2">
                {CANALES.map((c) => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="canal" value={c} checked={form.canal === c} onChange={() => set('canal', c)}
                      className="accent-sky-600" />
                    <span className="text-sm text-gray-700">{c}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
              <p className="font-semibold flex items-center gap-1.5"><Radar className="h-4 w-4" /> Resumen de la alerta</p>
              <ul className="mt-1.5 text-xs text-sky-700 list-disc list-inside space-y-0.5">
                {form.name && <li>Nombre: <strong>{form.name}</strong></li>}
                {form.categoria && <li>Categoría: <strong>{form.categoria}</strong></li>}
                {form.keyword && <li>Palabra clave: <strong>{form.keyword}</strong></li>}
                {form.department && <li>Estado: <strong>{form.department}</strong></li>}
                {form.maxPrice && <li>Precio máximo: <strong>${form.maxPrice}</strong></li>}
              </ul>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <ArrowLeft className="h-4 w-4" /> Anterior
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700 transition-colors">
              Siguiente <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="submit"
              className="flex items-center gap-2 rounded-xl bg-agrobot-700 px-5 py-2 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">
              <Save className="h-4 w-4" /> Guardar alerta
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
