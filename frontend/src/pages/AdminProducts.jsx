import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineEyeOff, HiOutlineStar, HiRefresh } from 'react-icons/hi'
import '../styles/Admin.css'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:5000/api/products/admin/all')
      if (!res.ok) throw new Error('Failed to fetch inventory')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return
    
    try {
      const res = await fetch(`http://localhost:5000/api/products/admin/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id))
      }
    } catch (err) {
      alert('Failed to delete product')
    }
  }

  return (
    <div className="admin-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Product Management</h1>
          <p style={{ color: 'var(--admin-text-dim)', fontSize: '0.9rem' }}>Manage your lubricant catalog and inventory levels.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={fetchProducts} style={{ padding: '0.75rem' }} title="Refresh">
            <HiRefresh />
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}>
            <HiOutlinePlus /> Add New Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Syncing database...</div>
      ) : error ? (
        <div className="admin-error-card">
          <h3>Connection Failed</h3>
          <p>{error}</p>
          <button onClick={fetchProducts} className="btn-retry">Retry Connection</button>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: '0' }}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>API Rating</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => (
                  <tr key={prod.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', background: '#1a1a1a', borderRadius: '6px', border: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--color-gold)' }}>
                          {prod.viscosity}
                        </div>
                        <div style={{ fontWeight: '600' }}>{prod.name}</div>
                      </div>
                    </td>
                    <td>{prod.category}</td>
                    <td><span style={{ fontSize: '0.8rem', color: 'var(--admin-text-dim)' }}>{prod.apiRating}</span></td>
                    <td style={{ fontWeight: '600' }}>RM {prod.price.toFixed(2)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: prod.stock > 10 ? 'var(--admin-success)' : 'var(--admin-error)' }}></div>
                        {prod.stock} Units
                      </div>
                    </td>
                    <td>
                      <span className={`admin-badge ${
                        prod.status === 'ACTIVE' ? 'admin-badge--success' : 
                        prod.status === 'SOLD_OUT' ? 'admin-badge--error' : 
                        'admin-badge--warning'
                      }`}>
                        {prod.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="admin-sidebar__item" style={{ padding: '0.4rem', border: '1px solid var(--admin-border)' }} title="Edit"><HiOutlinePencilAlt /></button>
                        <button 
                          className="admin-sidebar__item" 
                          style={{ padding: '0.4rem', border: '1px solid var(--admin-border)', color: prod.isFeatured ? 'var(--color-gold)' : 'inherit' }} 
                          title="Feature"
                        >
                          <HiOutlineStar />
                        </button>
                        <button className="admin-sidebar__item" style={{ padding: '0.4rem', border: '1px solid var(--admin-border)' }} title="Hide"><HiOutlineEyeOff /></button>
                        <button 
                          className="admin-sidebar__item" 
                          style={{ padding: '0.4rem', border: '1px solid var(--admin-border)', color: 'var(--admin-error)' }} 
                          title="Delete"
                          onClick={() => handleDelete(prod.id)}
                        >
                          <HiOutlineTrash />
                        </button>
                      </div>
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
