import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  HiOutlineViewGrid, 
  HiOutlineCube, 
  HiOutlineShoppingCart, 
  HiOutlineUsers, 
  HiOutlinePresentationChartBar, 
  HiOutlineHome, 
  HiOutlineCog, 
  HiOutlineLogout,
  HiOutlineSearch,
  HiOutlineBell
} from 'react-icons/hi'
import '../styles/Admin.css'

export default function AdminLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const currentTab = location.pathname.split('/').pop() || 'dashboard'

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HiOutlineViewGrid /> },
    { id: 'products', label: 'Products', icon: <HiOutlineCube /> },
    { id: 'orders', label: 'Orders', icon: <HiOutlineShoppingCart /> },
    { id: 'customers', label: 'Customers', icon: <HiOutlineUsers /> },
    { id: 'analytics', label: 'Analytics', icon: <HiOutlinePresentationChartBar /> },
    { id: 'homepage', label: 'Homepage Control', icon: <HiOutlineHome /> },
    { id: 'settings', label: 'Settings', icon: <HiOutlineCog /> },
  ]

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/')
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.png" alt="Feline Logo" style={{ height: '32px', objectFit: 'contain' }} />
          <div className="admin-sidebar__logo-text" style={{ fontSize: '1.2rem' }}>Admin</div>
        </div>
        
        <nav className="admin-sidebar__menu">
          {menuItems.map(item => (
            <div 
              key={item.id}
              className={`admin-sidebar__item ${currentTab === item.id ? 'active' : ''}`}
              onClick={() => navigate(`/admin/${item.id}`)}
              style={{ cursor: 'pointer' }}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar__menu" style={{ borderTop: '1px solid var(--admin-border)', flex: 'none' }}>
          <div className="admin-sidebar__item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <HiOutlineLogout />
            Logout
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <HiOutlineSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-dim)' }} />
              <input 
                type="text" 
                placeholder="Search analytics, orders..." 
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--admin-border)', 
                  borderRadius: '8px', 
                  padding: '0.6rem 1rem 0.6rem 2.5rem',
                  color: 'white',
                  fontSize: '0.85rem'
                }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div 
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => navigate('/admin/notifications')}
              title="View Notifications"
            >
              <HiOutlineBell style={{ fontSize: '1.4rem', color: 'var(--admin-text-dim)' }} />
              <span style={{ 
                position: 'absolute', 
                top: '-2px', 
                right: '-2px', 
                width: '8px', 
                height: '8px', 
                background: 'var(--admin-error)', 
                borderRadius: '50%',
                border: '2px solid var(--admin-bg)'
              }} />
            </div>
            
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--admin-border)', paddingLeft: '1.5rem', cursor: 'pointer' }}
              onClick={() => navigate('/admin/profile')}
              title="View Profile"
            >
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Admin User</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>Super Admin</div>
              </div>
              <div style={{ width: '36px', height: '36px', background: 'var(--admin-accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'black' }}>
                AU
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        {children}
      </main>
    </div>
  )
}
