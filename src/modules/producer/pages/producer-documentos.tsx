import { Upload, Download, Eye, Trash2, ShieldCheck, Clock, AlertTriangle, BookOpen } from 'lucide-react'

type DocStatus = 'verificado' | 'pendiente' | 'expirado' | 'rechazado'
type DocType = 'identidad' | 'registro' | 'fitosanitario' | 'propiedad' | 'certificacion' | 'otro'

interface Document {
  id: number; nombre: string; tipo: DocType; status: DocStatus
  size: string; fecha: string; expira?: string; emisor?: string
}

const MOCK_DOCS: Document[] = [
  { id: 1, nombre: 'Cédula de identidad.pdf',        tipo: 'identidad',     status: 'verificado', size: '340 KB', fecha: '2026-01-10', emisor: 'SAIME' },
  { id: 2, nombre: 'Registro SADA productor.pdf',    tipo: 'registro',      status: 'verificado', size: '1.2 MB', fecha: '2026-02-15', emisor: 'SADA Venezuela' },
  { id: 3, nombre: 'Certificado fitosanitario.pdf',  tipo: 'fitosanitario', status: 'pendiente',  size: '890 KB', fecha: '2026-05-20', expira: '2026-12-31' },
  { id: 4, nombre: 'Título de propiedad finca.pdf',  tipo: 'propiedad',     status: 'verificado', size: '3.4 MB', fecha: '2025-08-05', emisor: 'Registro Subalterno' },
  { id: 5, nombre: 'GlobalG.A.P. certificado',       tipo: 'certificacion', status: 'expirado',   size: '560 KB', fecha: '2024-06-01', expira: '2025-06-01' },
  { id: 6, nombre: 'Análisis de suelo 2026.pdf',     tipo: 'otro',          status: 'verificado', size: '1.8 MB', fecha: '2026-03-10', emisor: 'Lab. AgroSuelos' },
]

const STATUS_META: Record<DocStatus, { label: string; color: string; icon: React.ElementType }> = {
  verificado: { label: 'Verificado', color: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', icon: ShieldCheck },
  pendiente:  { label: 'Pendiente',  color: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',       icon: Clock },
  expirado:   { label: 'Expirado',   color: 'bg-red-50 text-red-600 ring-1 ring-red-200',             icon: AlertTriangle },
  rechazado:  { label: 'Rechazado',  color: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',         icon: AlertTriangle },
}

const TYPE_LABELS: Record<DocType, string> = {
  identidad:     'Identidad',
  registro:      'Registro',
  fitosanitario: 'Fitosanitario',
  propiedad:     'Propiedad',
  certificacion: 'Certificación',
  otro:          'Otro',
}

const TYPE_COLORS: Record<DocType, string> = {
  identidad:     'bg-blue-50 text-blue-700',
  registro:      'bg-violet-50 text-violet-700',
  fitosanitario: 'bg-green-50 text-green-700',
  propiedad:     'bg-amber-50 text-amber-700',
  certificacion: 'bg-emerald-50 text-emerald-700',
  otro:          'bg-gray-100 text-gray-600',
}

export function ProducerDocumentos() {
  const verificados = MOCK_DOCS.filter(d => d.status === 'verificado').length
  const pendientes  = MOCK_DOCS.filter(d => d.status === 'pendiente').length
  const expirados   = MOCK_DOCS.filter(d => d.status === 'expirado').length

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Documentos y certificaciones</h1>
          <p className="text-sm text-gray-400 mt-0.5">Certificados, documentos de finca y soportes oficiales</p>
        </div>
        <button disabled className="flex shrink-0 items-center gap-2 rounded-xl bg-agrobot-600 px-4 py-2 text-sm font-bold text-white opacity-50 cursor-not-allowed">
          <Upload className="h-4 w-4" /> Subir documento
        </button>
      </div>

      {/* Alert: expired */}
      {expirados > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
          <p className="text-sm text-red-800">
            Tienes <strong>{expirados} documento{expirados > 1 ? 's' : ''} expirado{expirados > 1 ? 's' : ''}</strong>. Renuévalos para mantener tu perfil verificado.
          </p>
        </div>
      )}

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
          <p className="text-2xl font-black text-emerald-700">{verificados}</p>
          <p className="mt-1 text-xs text-emerald-600">Verificados</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-2xl font-black text-amber-700">{pendientes}</p>
          <p className="mt-1 text-xs text-amber-600">En revisión</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-2xl font-black text-red-600">{expirados}</p>
          <p className="mt-1 text-xs text-red-500">Expirados</p>
        </div>
      </div>

      {/* Document list */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
          <BookOpen className="h-4 w-4 text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900">Mis documentos</h2>
          <span className="ml-auto text-xs text-gray-400">{MOCK_DOCS.length} archivos</span>
        </div>
        <div className="divide-y divide-gray-50">
          {MOCK_DOCS.map((doc) => {
            const meta = STATUS_META[doc.status]
            const StatusIcon = meta.icon
            return (
              <div key={doc.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors ${doc.status === 'expirado' ? 'bg-red-50/30' : ''}`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">{doc.nombre}</p>
                  <div className="mt-0.5 flex items-center gap-2 flex-wrap">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_COLORS[doc.tipo]}`}>
                      {TYPE_LABELS[doc.tipo]}
                    </span>
                    <span className="text-[11px] text-gray-400">{doc.size} · {doc.fecha}</span>
                    {doc.expira && (
                      <span className="text-[11px] text-amber-600">Expira: {doc.expira}</span>
                    )}
                    {doc.emisor && (
                      <span className="text-[11px] text-gray-400">{doc.emisor}</span>
                    )}
                  </div>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${meta.color}`}>
                  <StatusIcon className="h-3 w-3" />
                  {meta.label}
                </span>
                <div className="flex items-center gap-1">
                  <button disabled className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 cursor-not-allowed" title="Ver">
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button disabled className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 cursor-not-allowed" title="Descargar">
                    <Download className="h-3.5 w-3.5" />
                  </button>
                  <button disabled className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-400 cursor-not-allowed" title="Eliminar">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">Carga y verificación de documentos disponibles próximamente. Datos de muestra.</p>
    </div>
  )
}
