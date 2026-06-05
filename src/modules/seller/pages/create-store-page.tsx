import { CreateStoreForm } from '../components/create-store-form'

export function CreateStorePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 p-6">
      <img src="/logoagro.svg" alt="AgroMarket" className="h-10 w-auto" />
      <CreateStoreForm />
    </div>
  )
}
