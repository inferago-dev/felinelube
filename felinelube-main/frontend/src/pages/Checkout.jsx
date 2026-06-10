import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineShoppingCart, HiOutlineCheckCircle, HiArrowLeft } from 'react-icons/hi'
import { useCart } from '../context/CartContext'
import API_BASE, { authHeaders } from '../api'
import '../styles/Auth.css' // Reuse auth styling for form

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    paymentMethod: 'COD'
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const shippingCost = cartTotal > 100 ? 0 : 15
  const finalTotal = cartTotal > 0 ? cartTotal + shippingCost : 0

  if (cartItems.length === 0 && !success) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <HiOutlineShoppingCart style={{ fontSize: '4rem', color: 'var(--admin-text-dim)', marginBottom: '1rem' }} />
        <h2>Your cart is empty</h2>
        <button className="btn btn-primary" onClick={() => navigate('/shop')} style={{ marginTop: '1rem' }}>Back to Shop</button>
      </div>
    )
  }

  if (success) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
          <HiOutlineCheckCircle style={{ fontSize: '6rem', color: 'var(--admin-success)', marginBottom: '1rem' }} />
        </motion.div>
        <h2 style={{ marginBottom: '1rem' }}>Order Placed Successfully!</h2>
        <p style={{ color: 'var(--admin-text-dim)', maxWidth: '500px', marginBottom: '2rem' }}>
          Thank you for your order. We have received it and our team will process it shortly. 
          You will receive a confirmation message on your phone number.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/shop')}>Continue Shopping</button>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Format items for backend
    const items = cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.variant.price,
      variantSize: item.variant.size
    }))

    // Get optional user id if logged in
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          ...formData,
          totalAmount: finalTotal,
          items,
          userId: user ? user.id : undefined
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order')
      }

      clearCart()
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem 1rem' }}>
        
        {/* Checkout Form */}
        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ width: '100%' }}
        >
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/shop')} 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <HiArrowLeft /> Back
          </button>
          
          <div className="auth-header" style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.5rem' }}>Checkout</h2>
            <p>Please enter your shipping and contact details.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="auth-input"
                placeholder="John Doe"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required 
              />
            </div>

            <div className="auth-form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                className="auth-input"
                placeholder="+60 12-345 6789"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                required 
              />
            </div>

            <div className="auth-form-group">
              <label>Full Shipping Address</label>
              <textarea 
                className="auth-input"
                placeholder="123 Jalan Ampang, 50450 Kuala Lumpur..."
                rows="3"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required 
              ></textarea>
            </div>

            <div className="auth-form-group">
              <label>Payment Method</label>
              <select 
                className="auth-input"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="BANK_TRANSFER">Bank Transfer (Manual)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Processing...' : 'Place Order Now'}
            </button>
          </form>
        </motion.div>

        {/* Order Summary */}
        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ width: '100%', background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="auth-header" style={{ textAlign: 'left', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Order Summary</h2>
          </div>
          
          <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
            {cartItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--color-gold)', marginRight: '0.5rem' }}>{item.quantity}x</span>
                  {item.name} ({item.variant.size})
                </div>
                <div>RM {(item.variant.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div style={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--admin-text-dim)' }}>
              <span>Subtotal</span>
              <span>RM {cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--admin-text-dim)' }}>
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : `RM ${shippingCost.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#fff' }}>
              <span>Total</span>
              <span>RM {finalTotal.toFixed(2)}</span>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  )
}
