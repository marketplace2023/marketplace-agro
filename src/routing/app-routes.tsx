import { Navigate, Route, Routes } from 'react-router'
import { Layout } from '../app/components/layout/Layout'
import { HomePage } from '../app/pages/HomePage'
import { OfertasPage } from '../app/pages/OfertasPage'
import { CategoriasPage } from '../app/pages/CategoriasPage'
import { AyudaPage } from '../app/pages/AyudaPage'
import { AyudaArticlePage } from '../app/pages/AyudaArticlePage'
import { BlogPage } from '../app/pages/BlogPage'
import { BlogArticlePage } from '../app/pages/BlogArticlePage'
import { RadarPage } from '../app/pages/RadarPage'
import { CatalogoPage } from '../app/pages/CatalogoPage'
import { TiendaPerfilPage } from '../app/pages/perfiles/TiendaPerfilPage'
import { ProductorPerfilPage } from '../app/pages/perfiles/ProductorPerfilPage'
import { ProveedorPerfilPage } from '../app/pages/perfiles/ProveedorPerfilPage'
import { LaboratorioPerfilPage } from '../app/pages/perfiles/LaboratorioPerfilPage'
import { CertificadorPerfilPage } from '../app/pages/perfiles/CertificadorPerfilPage'
import { InspectorPerfilPage } from '../app/pages/perfiles/InspectorPerfilPage'
import { AnuncioDetallePage } from '../app/pages/productos/AnuncioDetallePage'
import { ProductoAgricolaDetallePage } from '../app/pages/productos/ProductoAgricolaDetallePage'
import { FincaAgricolaDetallePage } from '../app/pages/productos/FincaAgricolaDetallePage'
import { InsumoAgricolaDetallePage } from '../app/pages/productos/InsumoAgricolaDetallePage'
import { MaquinariaAgricolaDetallePage } from '../app/pages/productos/MaquinariaAgricolaDetallePage'
import { ServicioAgronomicoDetallePage } from '../app/pages/productos/ServicioAgronomicoDetallePage'
import { TransporteAgricolaDetallePage } from '../app/pages/productos/TransporteAgricolaDetallePage'
import { GuestOnlyRoute } from './components/guest-only-route'
import { LoginPage } from '../modules/auth/pages/login'
import { RegisterPage } from '../modules/auth/pages/register'
// Seller
import { SellerLayout } from '../modules/seller/layout/seller-layout'
import { SellerDashboard } from '../modules/seller/pages/seller-dashboard'
import { SellerPerfil } from '../modules/seller/pages/seller-perfil'
import { SellerListings } from '../modules/seller/pages/seller-listings'
import { SellerQuotes } from '../modules/seller/pages/seller-quotes'
import { SellerStore } from '../modules/seller/pages/seller-store'
import { SellerLeads } from '../modules/seller/pages/seller-leads'
import { SellerOrders } from '../modules/seller/pages/seller-orders'
import { SellerOffers } from '../modules/seller/pages/seller-offers'
import { SellerStoreGbp } from '../modules/seller/pages/seller-store-gbp'
import { SellerAnalytics } from '../modules/seller/pages/seller-analytics'
import { SellerReputation } from '../modules/seller/pages/seller-reputation'
import { SellerConfig } from '../modules/seller/pages/seller-config'
import { SellerOferta } from '../modules/seller/pages/seller-oferta'
// Productor (P065–P075)
import { ProducerLayout } from '../modules/producer/layout/producer-layout'
import { ProducerDashboard } from '../modules/producer/pages/producer-dashboard'
import { ProducerPerfil } from '../modules/producer/pages/producer-perfil'
import { ProducerPublicaciones } from '../modules/producer/pages/producer-publicaciones'
import { ProducerInventario } from '../modules/producer/pages/producer-inventario'
import { ProducerLeads } from '../modules/producer/pages/producer-leads'
import { ProducerCotizaciones } from '../modules/producer/pages/producer-cotizaciones'
import { ProducerDocumentos } from '../modules/producer/pages/producer-documentos'
import { ProducerPromociones } from '../modules/producer/pages/producer-promociones'
import { ProducerAnalitica } from '../modules/producer/pages/producer-analitica'
import { ProducerReputacion } from '../modules/producer/pages/producer-reputacion'
import { ProducerConfiguracion } from '../modules/producer/pages/producer-configuracion'
// Comprador (P053–P064)
import { BuyerLayout } from '../modules/buyer/layout/buyer-layout'
import { BuyerDashboard } from '../modules/buyer/pages/buyer-dashboard'
import { BuyerQuotes } from '../modules/buyer/pages/buyer-quotes'
import { CompradorPerfil } from '../modules/buyer/pages/comprador-perfil'
import { CompradorBusquedas } from '../modules/buyer/pages/comprador-busquedas'
import { CompradorFavoritos } from '../modules/buyer/pages/comprador-favoritos'
import { CompradorCotizacionDetalle } from '../modules/buyer/pages/comprador-cotizacion-detalle'
import { CompradorRadar } from '../modules/buyer/pages/comprador-radar'
import { CompradorRadarNuevo } from '../modules/buyer/pages/comprador-radar-nuevo'
import { CompradorComparador } from '../modules/buyer/pages/comprador-comparador'
import { CompradorContactos } from '../modules/buyer/pages/comprador-contactos'
import { CompradorNotificaciones } from '../modules/buyer/pages/comprador-notificaciones'
import { CompradorConfiguracion } from '../modules/buyer/pages/comprador-configuracion'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="ofertas" element={<OfertasPage />} />
        <Route path="categorias" element={<CategoriasPage />} />
        <Route path="ayuda" element={<AyudaPage />} />
        <Route path="ayuda/:slug" element={<AyudaArticlePage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogArticlePage />} />
        <Route path="radar" element={<RadarPage />} />
        <Route path="catalogo" element={<CatalogoPage />} />
        {/* Perfiles públicos */}
        <Route path="tiendas/:slug" element={<TiendaPerfilPage />} />
        <Route path="productores/:slug" element={<ProductorPerfilPage />} />
        <Route path="proveedores/:slug" element={<ProveedorPerfilPage />} />
        <Route path="laboratorios/:slug" element={<LaboratorioPerfilPage />} />
        <Route path="certificadores/:slug" element={<CertificadorPerfilPage />} />
        <Route path="inspectores/:slug" element={<InspectorPerfilPage />} />
        {/* Detalle de productos */}
        <Route path="anuncios/:id" element={<AnuncioDetallePage />} />
        <Route path="productos-agricolas/:id" element={<ProductoAgricolaDetallePage />} />
        <Route path="fincas-agricolas/:id" element={<FincaAgricolaDetallePage />} />
        <Route path="insumos-agricolas/:id" element={<InsumoAgricolaDetallePage />} />
        <Route path="maquinaria-agricola/:id" element={<MaquinariaAgricolaDetallePage />} />
        <Route path="servicios-agronomicos/:id" element={<ServicioAgronomicoDetallePage />} />
        <Route path="transporte-agricola/:id" element={<TransporteAgricolaDetallePage />} />
      </Route>

      {/* Panel privado del vendedor (P076–P087) */}
      <Route path="app/seller" element={<SellerLayout />}>
        <Route index element={<Navigate to="/app/seller/dashboard" replace />} />
        <Route path="dashboard" element={<SellerDashboard />} />
        <Route path="perfil" element={<SellerPerfil />} />
        <Route path="oferta" element={<SellerOferta />} />
        <Route path="publicaciones" element={<SellerListings />} />
        <Route path="cotizaciones" element={<SellerQuotes />} />
        <Route path="leads" element={<SellerLeads />} />
        <Route path="ordenes" element={<SellerOrders />} />
        <Route path="ofertas" element={<SellerOffers />} />
        <Route path="tienda" element={<SellerStore />} />
        <Route path="tienda-gbp" element={<SellerStoreGbp />} />
        <Route path="analitica" element={<SellerAnalytics />} />
        <Route path="reputacion" element={<SellerReputation />} />
        <Route path="configuracion" element={<SellerConfig />} />
      </Route>

      {/* Panel privado del productor (P065–P075) */}
      <Route path="app/productor" element={<ProducerLayout />}>
        <Route index element={<Navigate to="/app/productor/dashboard" replace />} />
        <Route path="dashboard"      element={<ProducerDashboard />} />
        <Route path="perfil"         element={<ProducerPerfil />} />
        <Route path="publicaciones"  element={<ProducerPublicaciones />} />
        <Route path="inventario"     element={<ProducerInventario />} />
        <Route path="leads"          element={<ProducerLeads />} />
        <Route path="cotizaciones"   element={<ProducerCotizaciones />} />
        <Route path="documentos"     element={<ProducerDocumentos />} />
        <Route path="promociones"    element={<ProducerPromociones />} />
        <Route path="analitica"      element={<ProducerAnalitica />} />
        <Route path="reputacion"     element={<ProducerReputacion />} />
        <Route path="configuracion"  element={<ProducerConfiguracion />} />
      </Route>

      {/* Panel privado del comprador (P053–P064) */}
      <Route path="app/comprador" element={<BuyerLayout />}>
        <Route index element={<BuyerDashboard />} />
        <Route path="perfil" element={<CompradorPerfil />} />
        <Route path="cotizaciones" element={<BuyerQuotes />} />
        <Route path="cotizaciones/:id" element={<CompradorCotizacionDetalle />} />
        <Route path="busquedas" element={<CompradorBusquedas />} />
        <Route path="favoritos" element={<CompradorFavoritos />} />
        <Route path="radar" element={<CompradorRadar />} />
        <Route path="radar/nuevo" element={<CompradorRadarNuevo />} />
        <Route path="comparador" element={<CompradorComparador />} />
        <Route path="contactos" element={<CompradorContactos />} />
        <Route path="notificaciones" element={<CompradorNotificaciones />} />
        <Route path="configuracion" element={<CompradorConfiguracion />} />
      </Route>

      <Route path="login" element={<GuestOnlyRoute><LoginPage /></GuestOnlyRoute>} />
      <Route path="register" element={<GuestOnlyRoute><RegisterPage /></GuestOnlyRoute>} />
    </Routes>
  )
}
