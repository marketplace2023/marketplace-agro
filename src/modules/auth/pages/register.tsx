import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Tractor } from 'lucide-react'
import { registerSchema, type RegisterFormSchema } from '../zod-schema/auth-schemas'
import { useRegisterMutation, ME_QUERY_KEY } from '../queries/auth-queries'
import { handleFormError } from '../../shared/util/handle-form-error'

export function RegisterPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutate: registerUser, isPending } = useRegisterMutation()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      passwordConfirmation: '',
      acceptTermsOfService: false,
      acceptAdvertising: false,
    },
  })

  const watchedPassword = form.watch('password')
  useEffect(() => {
    form.setValue('passwordConfirmation', watchedPassword, { shouldValidate: false })
  }, [watchedPassword, form])

  const onSubmit = (data: RegisterFormSchema) => {
    registerUser(data, {
      onSuccess: (authInfo) => {
        queryClient.setQueryData(ME_QUERY_KEY, authInfo.user)
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
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(5,46,22,0.65) 60%, rgba(4,46,39,0.88) 100%), url('/farm-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Top logo */}
        <div className="flex items-center gap-2.5 z-10">
          <Tractor className="h-6 w-6 text-agrobot-400" />
          <span className="font-display font-bold text-white text-lg tracking-tight">TierraMarket</span>
        </div>

        {/* Bottom text */}
        <div className="z-10">
          <h2 className="font-display text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Cultivando el futuro<br />digital del agro.
          </h2>
          <p className="text-white/75 text-base leading-relaxed max-w-sm">
            Accede a herramientas avanzadas, mercados regionales y la comunidad más grande de productores en Latinoamérica.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white overflow-y-auto">
        <div className="w-full max-w-105">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Tractor className="h-5 w-5 text-agrobot-600" />
            <span className="font-display font-bold text-lg text-agrobot-800">TierraMarket</span>
          </div>

          {/* Desktop logo */}
          <div className="hidden lg:flex items-center gap-2 mb-6">
            <Tractor className="h-5 w-5 text-agrobot-600" />
            <span className="font-display font-bold text-lg text-agrobot-800">TierraMarket</span>
          </div>

          <div className="mb-7">
            <h1 className="font-display text-[1.6rem] font-bold text-gray-900 leading-snug mb-1.5">
              Crea tu cuenta en TierraMarket
            </h1>
            <p className="text-sm text-gray-500">
              Únete a la mayor red de comercio agrícola de Latinoamérica.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Name */}
            <div>
              <label className={labelClass} htmlFor="name">Nombre completo</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Ej. Juan Pérez"
                  className={`${inputClass} pl-11`}
                  {...form.register('name')}
                />
              </div>
              {form.formState.errors.name && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className={labelClass} htmlFor="email">Correo electrónico</label>
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

            {/* Phone */}
            <div>
              <label className={labelClass} htmlFor="phone">Teléfono / WhatsApp</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+54 9 11 1234 5678"
                  className={`${inputClass} pl-11`}
                  {...form.register('phone')}
                />
              </div>
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
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
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

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-agrobot-600"
                  {...form.register('acceptTermsOfService')}
                />
                <span className="text-sm text-gray-600 leading-snug">
                  Acepto los{' '}
                  <a href="/conditions" className="font-semibold text-agrobot-700 hover:underline">
                    Términos y Condiciones
                  </a>
                  {' '}y la{' '}
                  <a href="/privacy" className="font-semibold text-agrobot-700 hover:underline">
                    Política de Privacidad
                  </a>
                  .
                </span>
              </label>
              {form.formState.errors.acceptTermsOfService && (
                <p className="mt-1 text-xs text-red-500">
                  {form.formState.errors.acceptTermsOfService.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-agrobot-800 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-agrobot-900 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isPending ? (
                'Creando cuenta...'
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase whitespace-nowrap">
              O regístrate con
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
            Google
          </button>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-semibold text-agrobot-700 hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
