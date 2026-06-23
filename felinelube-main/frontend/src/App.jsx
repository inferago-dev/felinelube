import { useEffect, useLayoutEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Trust from './sections/Trust'
import Categories from './sections/Categories'
import FeaturedProducts from './sections/FeaturedProducts'
import WhyFeline from './sections/WhyFeline'
import About from './sections/About'
import WhatsAppWidget from './components/WhatsAppWidget'
import Contact from './sections/Contact'
import CTA from './sections/CTA'
import Footer from './components/Footer'
import ProductDetails from './sections/ProductDetails'
import Shop from './sections/Shop'
import ContactPage from './sections/ContactPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Checkout from './pages/Checkout'
import NotFound from './pages/NotFound'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

/* Admin Components */
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import ProtectedRoute from './components/ProtectedRoute'
import AdminCustomers from './pages/AdminCustomers'
import AdminHomepage from './pages/AdminHomepage'
import AdminSettings from './pages/AdminSettings'
import AdminNotifications from './pages/AdminNotifications'
import AdminProfile from './pages/AdminProfile'
import AdminPlaceholder from './pages/AdminPlaceholder'

// Scroll To Top on Route Navigation
function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 10)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}

function PublicLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname

  // Backward compatible navigation helper
  const setView = (viewName) => {
    if (viewName === 'home') navigate('/')
    else if (viewName === 'details') navigate('/product/feline-f45')
    else navigate(`/${viewName}`)
  }

  // Hide CTA, Contact, and Footer in clean layouts
  const isShopOrAuth = path === '/shop' || path === '/login' || path === '/signup' || path === '/profile' || path === '/checkout' || path === '/contact' || path === '/forgot-password' || path === '/reset-password' || path.startsWith('/product')

  return (
    <div className="app">
      <Navbar setView={setView} currentView={path === '/' ? 'home' : path.slice(1)} />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <section id="home"><Hero setView={setView} /></section>
              <Trust />
              <section id="products"><Categories setView={setView} /></section>
              <FeaturedProducts setView={setView} />
              <WhyFeline />
              <section id="about"><About /></section>
            </>
          } />
          <Route path="/shop" element={<Shop setView={setView} />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<Login setView={setView} />} />
          <Route path="/signup" element={<Signup setView={setView} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isShopOrAuth && (
        <>
          <Contact />
          <CTA setView={setView} />
        </>
      )}

      <Footer setView={setView} />
      <WhatsAppWidget />
    </div>
  )
}



import { CartProvider } from './context/CartContext'
import CartDrawer from './components/CartDrawer'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <ScrollToTop />
        <CartDrawer />
      <Routes>
        {/* /admin/login redirects to the unified /login page.
            The admin portal has no public-facing entry point. */}
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />

        {/* Protected Admin pages */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          } 
        />

        {/* Public client routes */}
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </CartProvider>
    </ErrorBoundary>
  )
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="analytics" element={<AdminPlaceholder title="Analytics & Reports" />} />
        <Route path="homepage" element={<AdminHomepage />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  )
}

export default App
