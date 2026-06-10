import { useState, useEffect } from 'react'
import API_BASE, { adminAuthHeaders } from '../api'
import '../styles/Admin.css'

export default function AdminHomepage() {
  const [loading, setLoading] = useState(false)
  const [heroTitle, setHeroTitle] = useState('PRECISION LUBRICANTS FOR EVERY MACHINE')
  const [heroSubtitle, setHeroSubtitle] = useState('Experience Feline\'s advanced synthetic technology designed for peak performance and extreme conditions.')
  const [contactEmail, setContactEmail] = useState('support@felinelube.com')
  const [contactPhone, setContactPhone] = useState('+60 12-345 6789')

  useEffect(() => {
    fetchHomepageData()
  }, [])

  const fetchHomepageData = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/homepage/admin/all`, {
        headers: adminAuthHeaders()
      })
      if (!res.ok) return;
      const data = await res.json()
      
      const heroData = data.find(d => d.section === 'Hero')
      if (heroData && heroData.content) {
        setHeroTitle(heroData.content.title || heroTitle)
        setHeroSubtitle(heroData.content.subtitle || heroSubtitle)
      }

      const contactData = data.find(d => d.section === 'Contact')
      if (contactData && contactData.content) {
        setContactEmail(contactData.content.email || contactEmail)
        setContactPhone(contactData.content.phone || contactPhone)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveHero = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/homepage/admin/Hero`, {
        method: 'PUT',
        headers: adminAuthHeaders(),
        body: JSON.stringify({ content: { title: heroTitle, subtitle: heroSubtitle } })
      })
      if (res.ok) alert('Hero section updated!')
    } catch (err) {
      alert('Failed to update')
    }
  }

  const handleSaveContact = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/homepage/admin/Contact`, {
        method: 'PUT',
        headers: adminAuthHeaders(),
        body: JSON.stringify({ content: { email: contactEmail, phone: contactPhone } })
      })
      if (res.ok) alert('Contact info updated!')
    } catch (err) {
      alert('Failed to update')
    }
  }

  return (
    <div className="admin-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Homepage Controls</h1>
        <p style={{ color: 'var(--admin-text-dim)', fontSize: '0.9rem' }}>Easily update the text on your storefront.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
        
        <div className="admin-card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--color-gold)' }}>Hero Section</h2>
          <form onSubmit={handleSaveHero} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="auth-form-group">
              <label>Main Headline</label>
              <input 
                className="auth-input" 
                type="text" 
                value={heroTitle} 
                onChange={(e) => setHeroTitle(e.target.value)} 
              />
            </div>
            <div className="auth-form-group">
              <label>Sub Headline</label>
              <textarea 
                className="auth-input" 
                rows="3" 
                value={heroSubtitle} 
                onChange={(e) => setHeroSubtitle(e.target.value)} 
              />
            </div>
            <button className="btn btn-primary" type="submit" style={{ alignSelf: 'flex-start' }}>Save Hero</button>
          </form>
        </div>

        <div className="admin-card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--color-gold)' }}>Contact Information</h2>
          <form onSubmit={handleSaveContact} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="auth-form-group">
              <label>Support Email</label>
              <input 
                className="auth-input" 
                type="email" 
                value={contactEmail} 
                onChange={(e) => setContactEmail(e.target.value)} 
              />
            </div>
            <div className="auth-form-group">
              <label>Support Phone</label>
              <input 
                className="auth-input" 
                type="text" 
                value={contactPhone} 
                onChange={(e) => setContactPhone(e.target.value)} 
              />
            </div>
            <button className="btn btn-primary" type="submit" style={{ alignSelf: 'flex-start' }}>Save Contact Info</button>
          </form>
        </div>

      </div>
    </div>
  )
}
