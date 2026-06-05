import { createContext, useContext, type PropsWithChildren } from 'react'
import { useMyStoreQuery } from '../queries/seller-queries'
import type { MyStore } from '../api/seller-api'
import { CreateStorePage } from '../pages/create-store-page'

type SelectedStoreContextValue = {
  store: MyStore
}

const SelectedStoreContext = createContext<SelectedStoreContextValue | null>(null)

export function SelectedStoreProvider({ children }: PropsWithChildren) {
  const { data: store, isLoading, isError } = useMyStoreQuery()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-agrobot-200 border-t-agrobot-700" />
          <p className="text-sm text-gray-500">Cargando tu perfil...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-sm font-semibold text-red-600">Error al cargar tu perfil</p>
          <p className="text-xs text-gray-400 mt-1">Recarga la página para intentar de nuevo</p>
        </div>
      </div>
    )
  }

  // null = no store registered → show creation wizard
  if (store === null) {
    return <CreateStorePage />
  }

  return (
    <SelectedStoreContext.Provider value={{ store }}>
      {children}
    </SelectedStoreContext.Provider>
  )
}

export function useSelectedStore() {
  const ctx = useContext(SelectedStoreContext)
  if (!ctx) throw new Error('[useSelectedStore] must be used within SelectedStoreProvider')
  return ctx
}
