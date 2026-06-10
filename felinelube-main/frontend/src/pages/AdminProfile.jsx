import { useState, useEffect } from 'react'
import '../styles/Admin.css'

export default function AdminProfile() {
  const [adminUser, setAdminUser] = useState({ name: '', email: '', role: '' })

  useEffect(() => {
    const userStr = localStorage.getItem('adminUser')
    if (userStr) {
      setAdminUser(JSON.parse(userStr))
    }
  }, [])

  return (
    <div className="admin-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Admin Profile</h1>
        <p style={{ color: 'var(--admin-text-dim)', fontSize: '0.9rem' }}>Manage your account settings.</p>
      </div>

      <div className="admin-card" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--admin-border)' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--admin-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '800', color: 'black' }}>
            {adminUser.name ? adminUser.name.substring(0, 2).toUpperCase() : 'AD'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{adminUser.name}</h2>
            <div style={{ color: 'var(--admin-text-dim)', marginTop: '0.25rem' }}>{adminUser.role}</div>
          </div>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="auth-form-group">
            <label>Name</label>
            <input className="auth-input" type="text" value={adminUser.name} readOnly style={{ opacity: 0.7 }} />
          </div>
          <div className="auth-form-group">
            <label>Email Address</label>
            <input className="auth-input" type="email" value={adminUser.email} readOnly style={{ opacity: 0.7 }} />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-dim)' }}>
            To change your password or email, please contact the database administrator.
          </p>
        </form>
      </div>
    </div>
  )
}
