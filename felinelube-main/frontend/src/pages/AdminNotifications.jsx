import { useState, useEffect } from 'react'
import { HiOutlineExclamationCircle, HiOutlineBell } from 'react-icons/hi'
import API_BASE, { adminAuthHeaders } from '../api'
import '../styles/Admin.css'
import { useNavigate } from 'react-router-dom'

export default function AdminNotifications() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/products/admin/all`, {
        headers: adminAuthHeaders()
      })
      if (!res.ok) throw new Error('Failed to fetch inventory')
      const data = await res.json()
      
      const lowStockAlerts = data.filter(p => {
        const totalStock = p.variants && p.variants.length > 0 
          ? p.variants.reduce((acc, v) => acc + parseInt(v.stock), 0) 
          : p.stock;
        return totalStock <= 10;
      }).map(p => ({
        id: p.id,
        title: 'Low Stock Alert',
        message: `${p.name} is running low on stock. Only ${p.variants && p.variants.length > 0 ? p.variants.reduce((acc, v) => acc + parseInt(v.stock), 0) : p.stock} units remaining.`,
        date: new Date().toISOString() // Dynamic alerts, so date is now
      }));

      setAlerts(lowStockAlerts)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>System Notifications</h1>
        <p style={{ color: 'var(--admin-text-dim)', fontSize: '0.9rem' }}>Important alerts and system updates.</p>
      </div>

      <div className="admin-card" style={{ maxWidth: '800px', padding: 0 }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-dim)' }}>
            <HiOutlineBell style={{ fontSize: '3rem', opacity: 0.5, marginBottom: '1rem' }} />
            <p>You have no new notifications.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {alerts.map((alert, i) => (
              <div key={i} style={{ 
                padding: '1.5rem', 
                borderBottom: i !== alerts.length - 1 ? '1px solid var(--admin-border)' : 'none',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}>
                <HiOutlineExclamationCircle style={{ fontSize: '1.5rem', color: 'var(--admin-error)', flexShrink: 0, marginTop: '0.2rem' }} />
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{alert.title}</div>
                  <div style={{ color: 'var(--admin-text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: '1.5' }}>{alert.message}</div>
                  <div style={{ fontSize: '0.75rem', color: '#888' }}>{new Date(alert.date).toLocaleString()}</div>
                  <button className="btn btn-secondary" style={{ marginTop: '1rem', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => navigate('/admin/products')}>
                    Manage Inventory
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
