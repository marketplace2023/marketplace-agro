import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { loginSchema, type LoginFormSchema } from '../zod-schema/auth-schemas'
import { useLoginMutation, ME_QUERY_KEY } from '../queries/auth-queries'
import { handleFormError } from '../../shared/util/handle-form-error'

export function LoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutate: loginUser, isPending } = useLoginMutation()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (data: LoginFormSchema) => {
    loginUser(data, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
        void navigate('/')
      },
      onError: (error) => {
        handleFormError(error, form.setError)
      },
    })
  }

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-white py-3.5 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-agrobot-500 focus:ring-2 focus:ring-agrobot-500/20'

  const labelClass = 'block text-[11px] font-semibold tracking-widest text-gray-500 uppercase mb-1.5'

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-10 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(5,46,22,0.65) 60%, rgba(4,46,39,0.88) 100%), url('/bg-cafe.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Top logo */}
        <div className="flex items-center z-10">
          <img src="/logoagro.svg" alt="TierraMarket" className="h-12 w-auto brightness-0 invert" />
        </div>

        {/* Bottom text */}
        <div className="z-10">
          <h2 className="font-display text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Impulsando el futuro<br />del campo.
          </h2>
          <p className="text-white/75 text-base leading-relaxed max-w-sm">
            La plataforma líder para conectar productores con la mejor tecnología y suministros del mercado.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white overflow-y-auto">
        <div className="w-full max-w-105">

          {/* Logo */}
          <div className="flex justify-center items-center mb-8 lg:mb-6">
            <img src="/logoagro.svg" alt="TierraMarket" className="h-12 w-auto" />
          </div>

          <div className="mb-7">
            <h1 className="font-display text-[1.6rem] font-bold text-gray-900 leading-snug mb-1.5">
              Bienvenido de vuelta
            </h1>
            <p className="text-sm text-gray-500">
              Iniciá sesión para gestionar tus operaciones agrícolas.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <div>
              <label className={labelClass} htmlFor="email">Email o Teléfono</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@ejemplo.com"
                  className={`${inputClass} pl-11`}
                  {...form.register('email')}
                />
              </div>
              {form.formState.errors.email && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className={labelClass} htmlFor="password">Contraseña</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="········"
                  className={`${inputClass} pl-11 pr-12`}
                  {...form.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>

            {/* Remember me + forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 accent-agrobot-600"
                />
                <span className="text-sm text-gray-600">Recordarme</span>
              </label>
              <button type="button" className="text-xs font-semibold text-agrobot-700 hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-agrobot-800 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-agrobot-900 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isPending ? (
                'Iniciando sesión...'
              ) : (
                <>
                  Ingresar
                  <LogIn className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase whitespace-nowrap">
              O ingresar con
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuar con Google
          </button>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="font-semibold text-agrobot-700 hover:underline">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
