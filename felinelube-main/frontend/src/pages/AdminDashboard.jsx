import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineCube, HiOutlineShoppingCart, HiOutlineUsers, HiOutlineTrendingUp, HiOutlineBell, HiRefresh } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import API_BASE, { adminAuthHeaders } from '../api'
import '../styles/Admin.css'

const StatCard = ({ title, value, icon, color, sub }) => (
  <motion.div 
    className="admin-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ color: 'var(--admin-text-dim)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{title}</div>
        <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>{value}</div>
        {sub && (
          <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--admin-text-dim)' }}>
            {sub}
          </div>
        )}
      </div>
      <div style={{ 
        background: `rgba(${color}, 0.1)`, 
        color: `rgb(${color})`, 
        padding: '0.75rem', 
        borderRadius: '10px',
        fontSize: '1.5rem'
      }}>
        {icon}
      </div>
    </div>
  </motion.div>
)

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch orders and products in parallel
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${API_BASE}/orders/admin/all`, { headers: adminAuthHeaders() }),
          fetch(`${API_BASE}/products/admin/all`, { headers: adminAuthHeaders() })
        ])

        const orders = ordersRes.ok ? await ordersRes.json() : []
        const products = productsRes.ok ? await productsRes.json() : []

        // Calculate real stats
        const totalRevenue = orders.reduce((sum, o) => 
          o.status !== 'CANCELLED' ? sum + o.totalAmount : sum, 0)
        const pendingOrders = orders.filter(o => o.status === 'PENDING').length
        const lowStockProducts = products.filter(p => p.stock <= 10).length
        const activeProducts = products.filter(p => p.status === 'ACTIVE').length

        setStats([
          { title: 'Total Revenue', value: `RM ${totalRevenue.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`, icon: <HiOutlineTrendingUp />, color: '212, 160, 23', sub: `${orders.length} total orders` },
          { title: 'Pending Orders', value: pendingOrders, icon: <HiOutlineShoppingCart />, color: '3, 152, 85', sub: `${orders.filter(o => o.status === 'DELIVERED').length} delivered` },
          { title: 'Active Products', value: activeProducts, icon: <HiOutlineCube />, color: '30, 144, 255', sub: `${products.length} total in catalog` },
          { title: 'Low Stock Alert', value: `${lowStockProducts} Items`, icon: <HiOutlineBell />, color: '217, 45, 32', sub: '≤10 units remaining' },
        ])

        // Show 5 most recent orders
        setRecentOrders(orders.slice(0, 5))
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return 'admin-badge--warning'
      case 'DELIVERED': return 'admin-badge--success'
      case 'CANCELLED': return 'admin-badge--error'
      case 'SHIPPED': return 'admin-badge--success'
      case 'CONFIRMED': return 'admin-badge--success'
      default: return 'admin-badge--warning'
    }
  }

  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}')

  return (
    <div className="admin-content">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--admin-text-dim)', fontSize: '0.9rem' }}>
            Welcome back, {adminUser.name || 'Administrator'}.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading live data...</div>
      ) : (
        <>
          <div className="admin-stats-grid">
            {stats?.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            {/* Recent Orders */}
            <div className="admin-card" style={{ padding: '0' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Recent Orders</h3>
                <button 
                  className="admin-badge" 
                  style={{ background: 'rgba(212, 160, 23, 0.1)', color: 'var(--admin-accent)', border: 'none', cursor: 'pointer' }}
                  onClick={() => navigate('/admin/orders')}
                >
                  View All
                </button>
              </div>
              {recentOrders.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-dim)' }}>
                  No orders yet. They will appear here when customers place orders.
                </div>
              ) : (
                <div className="admin-table-wrap" style={{ border: 'none' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id}>
                          <td style={{ fontWeight: '600', color: 'var(--admin-accent)' }}>{order.orderNumber}</td>
                          <td>{order.customerName}</td>
                          <td>RM {order.totalAmount.toFixed(2)}</td>
                          <td>
                            <span className={`admin-badge ${getStatusBadge(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td style={{ color: 'var(--admin-text-dim)', fontSize: '0.8rem' }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="admin-card">
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.5rem' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button 
                  className="admin-sidebar__item" 
                  style={{ width: '100%', border: '1px solid var(--admin-border)', justifyContent: 'flex-start' }}
                  onClick={() => navigate('/admin/products')}
                >
                  <HiOutlineCube /> Manage Products
                </button>
                <button 
                  className="admin-sidebar__item" 
                  style={{ width: '100%', border: '1px solid var(--admin-border)', justifyContent: 'flex-start' }}
                  onClick={() => navigate('/admin/orders')}
                >
                  <HiOutlineShoppingCart /> View All Orders
                </button>
                <button 
                  className="admin-sidebar__item" 
                  style={{ width: '100%', border: '1px solid var(--admin-border)', justifyContent: 'flex-start' }}
                  onClick={() => navigate('/admin/analytics')}
                >
                  <HiOutlineTrendingUp /> Analytics & Reports
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
