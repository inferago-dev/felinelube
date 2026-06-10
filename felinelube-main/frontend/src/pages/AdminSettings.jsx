import { useState, useEffect } from 'react'
import API_BASE, { adminAuthHeaders } from '../api'
import '../styles/Admin.css'

export default function AdminSettings() {
  const [storeStatus, setStoreStatus] = useState('active')
  const [taxRate, setTaxRate] = useState(0)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(100)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings/admin/all`, {
        headers: adminAuthHeaders()
      })
      if (!res.ok) return;
      const data = await res.json()
      
      data.forEach(setting => {
        if (setting.key === 'storeStatus') setStoreStatus(setting.value)
        if (setting.key === 'taxRate') setTaxRate(parseFloat(setting.value))
        if (setting.key === 'freeShippingThreshold') setFreeShippingThreshold(parseFloat(setting.value))
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const updates = [
        { key: 'storeStatus', value: storeStatus },
        { key: 'taxRate', value: taxRate.toString() },
        { key: 'freeShippingThreshold', value: freeShippingThreshold.toString() }
      ]

      for (let item of updates) {
        await fetch(`${API_BASE}/settings/admin/${item.key}`, {
          method: 'PUT',
          headers: adminAuthHeaders(),
          body: JSON.stringify({ value: item.value })
        })
      }
      
      alert('Settings updated successfully!')
    } catch (err) {
      alert('Failed to update settings')
    }
  }

  return (
    <div className="admin-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>System Settings</h1>
        <p style={{ color: 'var(--admin-text-dim)', fontSize: '0.9rem' }}>Configure global store settings and maintenance modes.</p>
      </div>

      <div className="admin-card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="auth-form-group">
            <label>Store Status</label>
            <select className="auth-input" value={storeStatus} onChange={e => setStoreStatus(e.target.value)}>
              <option value="active">Active (Open for Business)</option>
              <option value="maintenance">Maintenance Mode (Store Closed)</option>
            </select>
            <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-dim)', marginTop: '0.5rem' }}>
              Turning on maintenance mode will prevent users from checking out.
            </p>
          </div>

          <div className="auth-form-group">
            <label>Tax Rate (%)</label>
            <input 
              className="auth-input" 
              type="number" 
              step="0.01"
              value={taxRate} 
              onChange={(e) => setTaxRate(e.target.value)} 
            />
          </div>

          <div className="auth-form-group">
            <label>Free Shipping Threshold (RM)</label>
            <input 
              className="auth-input" 
              type="number" 
              step="0.01"
              value={freeShippingThreshold} 
              onChange={(e) => setFreeShippingThreshold(e.target.value)} 
            />
          </div>

          <button className="btn btn-primary" type="submit" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  )
}
