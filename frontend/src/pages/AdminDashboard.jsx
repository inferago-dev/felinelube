import { motion } from 'framer-motion'
import { HiOutlineCube, HiOutlineShoppingCart, HiOutlineUsers, HiOutlineTrendingUp, HiOutlineBell } from 'react-icons/hi'
import '../styles/Admin.css'

const StatCard = ({ title, value, icon, color, trend }) => (
  <motion.div 
    className="admin-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ color: 'var(--admin-text-dim)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{title}</div>
        <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>{value}</div>
        {trend && (
          <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: trend.startsWith('+') ? 'var(--admin-success)' : 'var(--admin-error)' }}>
            {trend} from last month
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
  const stats = [
    { title: 'Total Revenue', value: 'RM 124,500', icon: <HiOutlineTrendingUp />, color: '212, 160, 23', trend: '+12.5%' },
    { title: 'Total Orders', value: '452', icon: <HiOutlineShoppingCart />, color: '3, 152, 85', trend: '+8.2%' },
    { title: 'Active Users', value: '1,205', icon: <HiOutlineUsers />, color: '30, 144, 255', trend: '+15.3%' },
    { title: 'Low Stock', value: '12 Items', icon: <HiOutlineCube />, color: '217, 45, 32', trend: '-2.4%' },
  ]

  const recentOrders = [
    { id: '#ORD-7542', customer: 'Magesh Arumugam', product: 'F45 SAE 5W-40', amount: 'RM 185.00', status: 'Delivered' },
    { id: '#ORD-7541', customer: 'John Doe', product: 'F55 SAE 15W-40', amount: 'RM 165.00', status: 'Shipped' },
    { id: '#ORD-7540', customer: 'Ahmad Rizal', product: 'F5 Hydraulic Oil', amount: 'RM 220.00', status: 'Pending' },
    { id: '#ORD-7539', customer: 'Sarah Lim', product: 'F45 SAE 5W-40', amount: 'RM 185.00', status: 'Confirmed' },
  ]

  return (
    <div className="admin-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--admin-text-dim)', fontSize: '0.9rem' }}>Welcome back, Administrator.</p>
      </div>

      <div className="admin-stats-grid">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Recent Orders */}
        <div className="admin-card" style={{ padding: '0' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Recent Orders</h3>
            <button className="admin-badge" style={{ background: 'rgba(212, 160, 23, 0.1)', color: 'var(--admin-accent)', border: 'none', cursor: 'pointer' }}>View All</button>
          </div>
          <div className="admin-table-wrap" style={{ border: 'none' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: '600' }}>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.product}</td>
                    <td>{order.amount}</td>
                    <td>
                      <span className={`admin-badge ${
                        order.status === 'Delivered' ? 'admin-badge--success' : 
                        order.status === 'Pending' ? 'admin-badge--warning' : 
                        'admin-badge--success'
                      }`} style={{ opacity: order.status === 'Shipped' ? 0.7 : 1 }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.5rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="admin-sidebar__item" style={{ width: '100%', border: '1px solid var(--admin-border)', justifyContent: 'flex-start' }}>
              <HiOutlineCube /> Add New Product
            </button>
            <button className="admin-sidebar__item" style={{ width: '100%', border: '1px solid var(--admin-border)', justifyContent: 'flex-start' }}>
              <HiOutlineBell /> Send Notification
            </button>
            <button className="admin-sidebar__item" style={{ width: '100%', border: '1px solid var(--admin-border)', justifyContent: 'flex-start' }}>
              <HiOutlineTrendingUp /> Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
