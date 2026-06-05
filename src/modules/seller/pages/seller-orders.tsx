import { ShoppingBag, DollarSign, Clock, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled'

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending:   'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  delivered: 'bg-agrobot-50 text-agrobot-700',
  cancelled: 'bg-gray-100 text-gray-500',
}
const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pendiente', confirmed: 'Confirmado', delivered: 'Entregado', cancelled: 'Cancelado',
}

const MOCK_ORDERS = [
  { id: 'ORD-001', buyer: 'Carlos Mendoza', product: 'Maíz blanco x 500 kg', amount: '1.250,00', currency: '$', status: 'delivered' as OrderStatus, date: '2026-05-20' },
  { id: 'ORD-002', buyer: 'Ana Torres', product: 'Fertilizante NPK x 50 sacos', amount: '875,00', currency: '$', status: 'confirmed' as OrderStatus, date: '2026-06-01' },
  { id: 'ORD-003', buyer: 'Cooperativa Del Sur', product: 'Tomate industrial x 2 ton', amount: '3.400,00', currency: '$', status: 'pending' as OrderStatus, date: '2026-06-04' },
]

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function SellerOrders() {
  const totalAmount = MOCK_ORDERS.filter(o => o.status !== 'cancelled').reduce((s, o) => s + parseFloat(o.amount.replace(',', '.')), 0)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Órdenes</h1>
        <p className="text-sm text-gray-400 mt-0.5">Compras y servicios contratados</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-gray-500">Total órdenes</p>
            <ShoppingBag className="h-4 w-4 text-gray-300" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{MOCK_ORDERS.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-gray-500">Pendientes</p>
            <Clock className="h-4 w-4 text-gray-300" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{MOCK_ORDERS.filter(o => o.status === 'pending').length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-gray-500">Entregadas</p>
            <CheckCircle2 className="h-4 w-4 text-gray-300" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{MOCK_ORDERS.filter(o => o.status === 'delivered').length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-gray-500">Monto total</p>
            <DollarSign className="h-4 w-4 text-gray-300" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">${totalAmount.toLocaleString('es-VE')}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Orden</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Comprador</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Producto</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-400">Monto</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Estado</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MOCK_ORDERS.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-gray-500">{o.id}</td>
                <td className="px-4 py-3 font-semibold text-gray-800 text-sm">{o.buyer}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{o.product}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-800">{o.currency}{o.amount}</td>
                <td className="px-4 py-3">
                  <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', STATUS_COLOR[o.status])}>
                    {STATUS_LABEL[o.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">{fmtDate(o.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-xs text-gray-400">Módulo de órdenes y pagos disponible próximamente. Datos de muestra.</p>
    </div>
  )
}
