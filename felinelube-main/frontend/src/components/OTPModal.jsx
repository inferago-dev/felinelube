import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX } from 'react-icons/hi'
import API_BASE from '../api'

export default function OTPModal({ isOpen, onClose, email, onSuccess }) {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Verification failed')
      
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '400px', position: 'relative' }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
              <HiX size={24} />
            </button>
            <h3 style={{ marginTop: 0, color: 'var(--color-gold)' }}>Verify Email</h3>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1.5rem' }}>An OTP has been sent to {email}. Check your console if running locally.</p>
            
            {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Enter 6-digit OTP" 
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={6}
                required
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#000', color: 'white', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '0.5rem' }}
              />
              <button type="submit" disabled={loading} style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--color-gold)', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
