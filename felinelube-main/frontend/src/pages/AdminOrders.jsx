import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HiOutlineChevronRight, HiOutlineFilter, HiOutlinePrinter, HiRefresh, 
  HiArrowLeft, HiOutlinePhone, HiOutlineMail, HiOutlineDocumentText, 
  HiOutlineUpload, HiOutlineDownload, HiOutlineTruck, HiCheckCircle
} from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import API_BASE, { SERVER_BASE, adminAuthHeaders } from '../api'
import '../styles/Admin.css'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Details View State
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [detailsSaving, setDetailsSaving] = useState(false)
  const [formData, setFormData] = useState({
    adminNotes: '',
    courierName: '',
    trackingId: '',
    estimatedDelivery: ''
  })
  const fileInputRef = useRef(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/orders/admin/all`, {
        headers: adminAuthHeaders()
      })
      if (!res.ok) throw new Error('Failed to fetch orders')
      const data = await res.json()
      setOrders(data)
      
      // Update selected order reference if it exists
      if (selectedOrder) {
        const updated = data.find(o => o.id === selectedOrder.id)
        if (updated) setSelectedOrder(updated)
      }
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
      const res = await fetch(`${API_BASE}/orders/admin/${id}/details`, {
        method: 'PUT',
        headers: adminAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        const updated = await res.json()
        setOrders(orders.map(o => o.id === id ? { ...o, status: updated.status } : o))
        if (selectedOrder?.id === id) setSelectedOrder(prev => ({...prev, status: updated.status}))
      }
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const handleSaveDetails = async () => {
    try {
      setDetailsSaving(true)
      const res = await fetch(`${API_BASE}/orders/admin/${selectedOrder.id}/details`, {
        method: 'PUT',
        headers: adminAuthHeaders(),
        body: JSON.stringify(formData)
      })
      if (!res.ok) throw new Error('Failed to save')
      const updated = await res.json()
      setOrders(orders.map(o => o.id === updated.id ? { ...o, ...formData } : o))
      setSelectedOrder(prev => ({ ...prev, ...formData }))
      alert('Order details saved!')
    } catch (err) {
      alert(err.message)
    } finally {
      setDetailsSaving(false)
    }
  }

  const handleUploadInvoice = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('invoice', file)

    try {
      const res = await fetch(`${API_BASE}/orders/admin/${selectedOrder.id}/invoice`, {
        method: 'POST',
        headers: adminAuthHeaders(true),
        body: formData
      })
      if (!res.ok) throw new Error('Failed to upload')
      const updated = await res.json()
      setOrders(orders.map(o => o.id === updated.id ? { ...o, invoiceUrl: updated.invoiceUrl } : o))
      setSelectedOrder(prev => ({ ...prev, invoiceUrl: updated.invoiceUrl }))
      alert('Invoice uploaded successfully!')
    } catch (err) {
      alert(err.message)
    }
  }

  const handlePrintInvoice = () => {
    window.print()
  }

  const openDetails = (order) => {
    setSelectedOrder(order)
    setFormData({
      adminNotes: order.adminNotes || '',
      courierName: order.courierName || '',
      trackingId: order.trackingId || '',
      estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().split('T')[0] : ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeDetails = () => setSelectedOrder(null)

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return 'admin-badge--warning';
      case 'DELIVERED': return 'admin-badge--success';
      case 'CANCELLED': return 'admin-badge--error';
      case 'SHIPPED': return 'admin-badge--success';
      case 'CONFIRMED': return 'admin-badge--success';
      case 'PROCESSING': return 'admin-badge--warning';
      default: return 'admin-badge--warning';
    }
  }

  const renderTimeline = (currentStatus) => {
    const stages = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
    if (currentStatus === 'CANCELLED') {
      return (
        <div style={{ color: 'var(--admin-error)', fontWeight: 'bold', padding: '1rem', background: 'rgba(217, 45, 32, 0.1)', borderRadius: '8px' }}>
          Order Cancelled
        </div>
      )
    }

    const currentIndex = stages.indexOf(currentStatus)

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 0', overflowX: 'auto' }}>
        {stages.map((stage, index) => {
          const isCompleted = index <= currentIndex
          const isActive = index === currentIndex
          return (
            <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flex: 1, minWidth: '100px' }}>
              <div style={{ 
                width: '30px', height: '30px', borderRadius: '50%', 
                background: isCompleted ? 'var(--admin-success)' : 'var(--admin-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: isCompleted ? '#000' : '#fff',
                fontWeight: 'bold', zIndex: 2
              }}>
                {isCompleted && <HiCheckCircle />}
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: isActive ? 'bold' : 'normal', color: isCompleted ? 'var(--admin-success)' : 'var(--admin-text-dim)' }}>
                {stage}
              </div>
              {index < stages.length - 1 && (
                <div style={{
                  position: 'absolute', top: '15px', left: '50%', width: '100%', height: '2px',
                  background: index < currentIndex ? 'var(--admin-success)' : 'var(--admin-border)', zIndex: 1
                }} />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  if (selectedOrder) {
    return (
      <div className="admin-content">
        <button onClick={closeDetails} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: '0.5rem 1rem' }}>
          <HiArrowLeft /> Back to Orders
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          {/* Main Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Header / Timeline */}
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem' }}>Order {selectedOrder.orderNumber}</h2>
                  <p style={{ color: 'var(--admin-text-dim)', fontSize: '0.9rem' }}>
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <select 
                  value={selectedOrder.status} 
                  onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                  className={`admin-badge ${getStatusBadge(selectedOrder.status)}`}
                  style={{ background: 'transparent', border: `1px solid currentColor`, cursor: 'pointer', outline: 'none', padding: '0.5rem 1rem', fontSize: '1rem' }}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="PACKED">PACKED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
              
              <div style={{ borderTop: '1px solid var(--admin-border)', marginTop: '1rem', paddingTop: '1rem' }}>
                {renderTimeline(selectedOrder.status)}
              </div>
            </div>

            {/* Products */}
            <div className="admin-card">
              <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>Items Ordered</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '8px', padding: '5px' }}>
                          <img 
                            src={item.product?.image ? `${SERVER_BASE}${item.product.image}` : 'https://placehold.co/60'} 
                            alt={item.product?.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{item.product?.name || 'Unknown Product'}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>Size: {item.variantSize || 'Base'}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--admin-text-dim)' }}>{item.quantity} x RM {item.price.toFixed(2)}</div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>RM {(item.quantity * item.price).toFixed(2)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--admin-text-dim)' }}>No products attached to this order.</div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid var(--admin-border)', paddingTop: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '2rem', marginBottom: '0.5rem', color: 'var(--admin-text-dim)' }}>
                    <span>Subtotal:</span>
                    <span>RM {selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '2rem', marginBottom: '0.5rem', color: 'var(--admin-text-dim)' }}>
                    <span>Shipping:</span>
                    <span>Free (COD)</span>
                  </div>
                  <div style={{ display: 'flex', gap: '2rem', fontWeight: 'bold', fontSize: '1.3rem', color: 'var(--color-gold)' }}>
                    <span>Total:</span>
                    <span>RM {selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Management */}
            <div className="admin-card">
              <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HiOutlineTruck /> Logistics & Tracking
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label>Courier Name</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. J&T Express, PosLaju"
                    value={formData.courierName}
                    onChange={e => setFormData({...formData, courierName: e.target.value})}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Tracking ID</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. JTE123456789"
                    value={formData.trackingId}
                    onChange={e => setFormData({...formData, trackingId: e.target.value})}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Estimated Delivery</label>
                  <input 
                    type="date" 
                    className="admin-input" 
                    value={formData.estimatedDelivery}
                    onChange={e => setFormData({...formData, estimatedDelivery: e.target.value})}
                  />
                </div>
              </div>
              <button onClick={handleSaveDetails} className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={detailsSaving}>
                {detailsSaving ? 'Saving...' : 'Save Logistics Update'}
              </button>
            </div>
            
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Customer Details */}
            <div className="admin-card">
              <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>Customer Details</h3>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedOrder.customerName}</div>
                <div style={{ color: 'var(--admin-text-dim)', fontSize: '0.9rem', marginTop: '0.2rem' }}>{selectedOrder.customerPhone}</div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-dim)', marginBottom: '0.3rem' }}>Shipping Address</div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {selectedOrder.address}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, '')}?text=Hi ${selectedOrder.customerName}, regarding your order ${selectedOrder.orderNumber}...`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: '#25D366', color: 'white', border: 'none' }}>
                  <FaWhatsapp /> WhatsApp Customer
                </a>
                <a href={`tel:${selectedOrder.customerPhone}`} className="btn btn-secondary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                  <HiOutlinePhone /> Call Customer
                </a>
              </div>
            </div>

            {/* Invoicing */}
            <div className="admin-card">
              <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HiOutlineDocumentText /> Invoice Management
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <button onClick={handlePrintInvoice} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <HiOutlinePrinter /> Print / Generate PDF
                </button>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept="application/pdf,image/*" 
                  onChange={handleUploadInvoice}
                />
                
                <button onClick={() => fileInputRef.current.click()} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <HiOutlineUpload /> Upload External Invoice
                </button>

                {selectedOrder.invoiceUrl && (
                  <a href={`${SERVER_BASE}${selectedOrder.invoiceUrl}`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--color-gold)', color: 'black' }}>
                    <HiOutlineDownload /> Download Saved Invoice
                  </a>
                )}
              </div>
            </div>

            {/* Admin Notes */}
            <div className="admin-card">
              <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>Internal Remarks</h3>
              <textarea 
                className="admin-input" 
                rows="4" 
                placeholder="Add private notes regarding this order..."
                value={formData.adminNotes}
                onChange={e => setFormData({...formData, adminNotes: e.target.value})}
              ></textarea>
              <button onClick={handleSaveDetails} className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={detailsSaving}>
                Save Notes
              </button>
            </div>

          </div>
        </div>
      </div>
    )
  }

  // --- List View ---
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
      ) : orders.length === 0 ? (
        <div className="admin-error-card" style={{ textAlign: 'center' }}>
          <h3>No Orders Yet</h3>
          <p>Orders placed by customers will appear here.</p>
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
                  <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => openDetails(order)}>
                    <td style={{ fontWeight: '700', color: 'var(--admin-accent)' }}>{order.orderNumber}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{order.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)' }}>{order.customerPhone}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {order.items?.length || 0} Product(s)
                    </td>
                    <td style={{ fontWeight: '700' }}>RM {order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={`admin-badge ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--admin-text-dim)', fontSize: '0.85rem' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button 
                        className="admin-sidebar__item" 
                        style={{ padding: '0.4rem', border: '1px solid var(--admin-border)' }}
                        onClick={(e) => { e.stopPropagation(); openDetails(order) }}
                      >
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
