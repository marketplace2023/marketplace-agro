import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { loginSchema, type LoginFormSchema } from '../zod-schema/auth-schemas'
import { useLoginMutation, ME_QUERY_KEY } from '../queries/auth-queries'
import { handleFormError } from '../../shared/util/handle-form-error'
import { Button } from '../../../components/ui/button'

export function LoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutate: loginUser, isPending } = useLoginMutation()

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (data: LoginFormSchema) => {
    loginUser(data, {
      onSuccess: (authInfo) => {
        queryClient.setQueryData(ME_QUERY_KEY, authInfo.user)
        void navigate('/')
      },
      onError: (error) => {
        handleFormError(error, form.setError)
      },
    })
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-hero-gradient px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-white p-8 shadow-card">
        <div>
          <p className="font-display text-2xl font-bold text-agrobot-900">Iniciar sesión</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresá tu email y contraseña para continuar
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#334155]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-xl border border-input bg-white px-3.5 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-agrobot-500 focus:ring-4 focus:ring-agrobot-500/14"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#334155]" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-input bg-white px-3.5 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-agrobot-500 focus:ring-4 focus:ring-agrobot-500/14"
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-xs font-semibold text-agrobot-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Iniciando sesión...' : 'Ingresar'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="font-semibold text-agrobot-600 hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  )
}
