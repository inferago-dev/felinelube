import { useState, useEffect } from 'react'
import { HiOutlineBan, HiOutlineCheckCircle, HiOutlineExclamation } from 'react-icons/hi'
import API_BASE, { adminAuthHeaders } from '../api'
import '../styles/Admin.css'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/users/admin/all`, {
        headers: adminAuthHeaders()
      })
      if (!res.ok) throw new Error('Failed to fetch customers')
      const data = await res.json()
      setCustomers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleUpdateStatus = async (id, status, reason = '') => {
    if (!window.confirm(`Are you sure you want to change user status to ${status}?`)) return;

    let banReason = reason;
    if (status !== 'ACTIVE' && !banReason) {
      banReason = window.prompt('Please enter a reason for suspension/ban (optional):');
    }

    try {
      const res = await fetch(`${API_BASE}/users/admin/${id}/status`, {
        method: 'PUT',
        headers: adminAuthHeaders(false),
        body: JSON.stringify({ status, banReason })
      })
      if (res.ok) {
        setCustomers(customers.map(c => c.id === id ? { ...c, status, banReason } : c))
      }
    } catch (err) {
      alert('Failed to update status')
    }
  }

  return (
    <div className="admin-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Customers Management</h1>
        <p style={{ color: 'var(--admin-text-dim)', fontSize: '0.9rem' }}>View registered users, order counts, and manage account statuses.</p>
      </div>

      {loading ? (
        <div className="admin-loading">Loading customers...</div>
      ) : (
        <div className="admin-card" style={{ padding: '0' }}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer Info</th>
                  <th>Contact</th>
                  <th>Orders</th>
                  <th>Joined Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.id} style={{ opacity: customer.status === 'BANNED' ? 0.6 : 1 }}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{customer.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-dim)' }}>ID: {customer.id.substring(0, 8)}...</div>
                    </td>
                    <td>
                      <div>{customer.email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-dim)' }}>{customer.phone || 'No phone'}</div>
                    </td>
                    <td style={{ fontWeight: 'bold' }}>{customer._count?.orders || 0}</td>
                    <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`admin-badge ${
                        customer.status === 'ACTIVE' ? 'admin-badge--success' : 
                        customer.status === 'BANNED' ? 'admin-badge--error' : 
                        'admin-badge--warning'
                      }`}>
                        {customer.status}
                      </span>
                      {customer.banReason && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)', marginTop: '0.25rem', maxWidth: '150px' }}>
                          Reason: {customer.banReason}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {customer.status !== 'ACTIVE' && (
                          <button 
                            className="admin-sidebar__item" 
                            style={{ padding: '0.4rem', border: '1px solid var(--admin-border)', color: 'var(--admin-success)' }} 
                            title="Activate"
                            onClick={() => handleUpdateStatus(customer.id, 'ACTIVE')}
                          >
                            <HiOutlineCheckCircle />
                          </button>
                        )}
                        {customer.status !== 'SUSPENDED' && (
                          <button 
                            className="admin-sidebar__item" 
                            style={{ padding: '0.4rem', border: '1px solid var(--admin-border)', color: 'var(--color-gold)' }} 
                            title="Suspend"
                            onClick={() => handleUpdateStatus(customer.id, 'SUSPENDED')}
                          >
                            <HiOutlineExclamation />
                          </button>
                        )}
                        {customer.status !== 'BANNED' && (
                          <button 
                            className="admin-sidebar__item" 
                            style={{ padding: '0.4rem', border: '1px solid var(--admin-border)', color: 'var(--admin-error)' }} 
                            title="Ban"
                            onClick={() => handleUpdateStatus(customer.id, 'BANNED')}
                          >
                            <HiOutlineBan />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {customers.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-dim)' }}>
                No customers found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
