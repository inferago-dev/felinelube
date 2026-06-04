import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineChevronRight, HiOutlineFilter, HiOutlinePrinter, HiRefresh } from 'react-icons/hi'
import '../styles/Admin.css'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:5000/api/orders/admin/all')
      if (!res.ok) throw new Error('Failed to fetch orders')
      const data = await res.json()
      setOrders(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
      }
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return 'admin-badge--warning';
      case 'DELIVERED': return 'admin-badge--success';
      case 'CANCELLED': return 'admin-badge--error';
      case 'SHIPPED': return 'admin-badge--success';
      default: return 'admin-badge--warning';
    }
  }

  return (
    <div className="admin-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Order Management</h1>
          <p style={{ color: 'var(--admin-text-dim)', fontSize: '0.9rem' }}>Manage and fulfill Cash on Delivery (COD) orders.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={fetchOrders} style={{ padding: '0.75rem' }} title="Refresh">
            <HiRefresh />
          </button>
          <button className="admin-sidebar__item" style={{ border: '1px solid var(--admin-border)', padding: '0.75rem 1rem' }}>
            <HiOutlineFilter /> Filter
          </button>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HiOutlinePrinter /> Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Fetching live orders...</div>
      ) : error ? (
        <div className="admin-error-card">
          <h3>Connection Failed</h3>
          <p>{error}</p>
          <button onClick={fetchOrders} className="btn-retry">Retry</button>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: '0' }}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: '700', color: 'var(--admin-accent)' }}>{order.orderNumber}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{order.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)' }}>{order.customerPhone}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {order.items.length} Product(s)
                    </td>
                    <td style={{ fontWeight: '700' }}>RM {order.totalAmount.toFixed(2)}</td>
                    <td>
                      <select 
                        value={order.status} 
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`admin-badge ${getStatusBadge(order.status)}`}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', fontWeight: 'inherit' }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td style={{ color: 'var(--admin-text-dim)', fontSize: '0.85rem' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button className="admin-sidebar__item" style={{ padding: '0.4rem', border: '1px solid var(--admin-border)' }}>
                        Details <HiOutlineChevronRight />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
