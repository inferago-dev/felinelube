import { useState, useEffect, useLayoutEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Trust from './sections/Trust'
import Categories from './sections/Categories'
import FeaturedProducts from './sections/FeaturedProducts'
import WhyFeline from './sections/WhyFeline'
import About from './sections/About'
import Certifications from './sections/Certifications'
import Contact from './sections/Contact'
import CTA from './sections/CTA'
import Footer from './components/Footer'
import ProductDetails from './sections/ProductDetails'
import Shop from './sections/Shop'
import ContactPage from './sections/ContactPage'
import Login from './pages/Login'
import Signup from './pages/Signup'

/* Admin Components */
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'

function App() {
  const [view, setView] = useState('home')
  const [adminTab, setAdminTab] = useState('dashboard')

  // Robust Scroll-to-Top on View Change
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    // Secondary backup scroll for slower devices/renders
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 10)
    return () => clearTimeout(timer)
  }, [view])

  // Admin View Logic
  if (view.startsWith('admin')) {
    return (
      <AdminLayout currentTab={adminTab} setTab={setAdminTab}>
        {adminTab === 'dashboard' && <AdminDashboard />}
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'orders' && <AdminOrders />}
      </AdminLayout>
    )
  }

  return (
    <div className="app">
      <Navbar setView={setView} currentView={view} />
      <main>
        {view === 'home' && (
          <>
            <Hero setView={setView} />
            <Trust />
            <Categories setView={setView} />
            <FeaturedProducts setView={setView} />
            <WhyFeline />
            <About />
            <Certifications />
          </>
        )}
        {view === 'shop' && <Shop setView={setView} />}
        {view === 'details' && <ProductDetails />}
        {view === 'contact' && <ContactPage />}
        {view === 'login' && <Login setView={setView} />}
        {view === 'signup' && <Signup setView={setView} />}
      </main>
      
      {/* Universal Bottom Sections (Hidden on Shop and Auth views for cleaner experience) */}
      {view !== 'shop' && view !== 'login' && view !== 'signup' && (
        <>
          <Contact />
          <CTA setView={setView} />
        </>
      )}
      
      <Footer setView={setView} />
      
      {/* Admin hidden access */}
      <div 
        onClick={() => setView('admin')} 
        style={{ position: 'fixed', bottom: 10, left: 10, width: 10, height: 10, opacity: 0, cursor: 'pointer' }} 
      />
    </div>
  )
}

export default App
