import { Route, Routes } from 'react-router'
import { Layout } from '../app/components/layout/Layout'
import { HomePage } from '../app/pages/HomePage'
import { OfertasPage } from '../app/pages/OfertasPage'
import { CategoriasPage } from '../app/pages/CategoriasPage'
import { AyudaPage } from '../app/pages/AyudaPage'
import { BlogPage } from '../app/pages/BlogPage'
import { BlogArticlePage } from '../app/pages/BlogArticlePage'
import { RadarPage } from '../app/pages/RadarPage'
import { CatalogoPage } from '../app/pages/CatalogoPage'
import { GuestOnlyRoute } from './components/guest-only-route'
import { LoginPage } from '../modules/auth/pages/login'
import { RegisterPage } from '../modules/auth/pages/register'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="ofertas" element={<OfertasPage />} />
        <Route path="categorias" element={<CategoriasPage />} />
        <Route path="ayuda" element={<AyudaPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/articulo" element={<BlogArticlePage />} />
        <Route path="radar" element={<RadarPage />} />
        <Route path="catalogo" element={<CatalogoPage />} />
      </Route>

      <Route
        path="login"
        element={<GuestOnlyRoute><LoginPage /></GuestOnlyRoute>}
      />
      <Route
        path="register"
        element={<GuestOnlyRoute><RegisterPage /></GuestOnlyRoute>}
      />
    </Routes>
  )
}
