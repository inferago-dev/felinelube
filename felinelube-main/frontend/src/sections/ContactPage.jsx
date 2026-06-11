import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiMail, HiPhone, HiLocationMarker, HiClock, HiArrowRight } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import API_BASE from '../api'
import '../styles/ContactPage.css'

export default function ContactPage() {
  const { t, lang } = useLanguage()
  const [formState, setFormState] = useState('idle') // idle, sending, success, error
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' })
  const [errors, setErrors] = useState({})

  const validateField = (name, value) => {
    let error = ''
    if (name === 'name') {
      if (!value.trim()) error = 'Name is required'
      else if (value.trim().length < 2) error = 'Name must be at least 2 characters'
      else if (value.trim().length > 100) error = 'Name cannot exceed 100 characters'
    } else if (name === 'email') {
      if (!value.trim()) error = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email address'
    } else if (name === 'message') {
      if (!value.trim()) error = 'Message is required'
      else if (value.trim().length < 10) error = 'Message must be at least 10 characters'
      else if (value.trim().length > 1000) error = 'Message cannot exceed 1000 characters'
    }
    return error
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const isFormValid = () => {
    return (
      !validateField('name', formData.name) &&
      !validateField('email', formData.email) &&
      !validateField('message', formData.message)
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid()) return

    setFormState('sending')
    try {
      const res = await fetch(`${API_BASE}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setFormState('success')
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' })
      } else {
        setFormState('error')
      }
    } catch (err) {
      setFormState('error')
    }
  }

  return (
    <div className="contact-page">
      {/* 1. Header */}
      <section className="contact-header">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-label"
          >
            {lang === 'en' ? 'Get In Touch' : 'Hubungi Kami'}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            {lang === 'en' ? 'Let\'s Power Your' : 'Perkasakan'} <span className="gold-text">{lang === 'en' ? 'Success' : 'Kejayaan Anda'}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="section-subtitle"
          >
            {lang === 'en' 
              ? 'Our technical experts are ready to assist with your industrial and automotive lubrication needs.' 
              : 'Pakar teknikal kami sedia membantu dengan keperluan pelinciran industri dan automotif anda.'}
          </motion.p>
        </div>
      </section>

      <div className="container">
        <div className="contact-grid">
          {/* 2. Contact Form */}
          <motion.div 
            className="contact-form-card"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="card-title">{lang === 'en' ? 'Send an Inquiry' : 'Hantar Pertanyaan'}</h2>
            
            {formState === 'success' ? (
              <motion.div 
                className="form-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="success-icon">✓</div>
                <h3>{lang === 'en' ? 'Message Sent!' : 'Mesej Dihantar!'}</h3>
                <p>{lang === 'en' ? 'We will get back to you within 24 hours.' : 'Kami akan menghubungi anda dalam masa 24 jam.'}</p>
                <button className="btn btn-secondary" onClick={() => setFormState('idle')}>
                  {lang === 'en' ? 'Send Another' : 'Hantar Lagi'}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="premium-form">
                {formState === 'error' && (
                  <div style={{ color: '#ff4d4d', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(255,0,0,0.1)', borderRadius: '4px' }}>
                    Failed to send message. Please try again.
                  </div>
                )}
                <div className="form-row">
                  <div className="form-group">
                    <label>{lang === 'en' ? 'Full Name' : 'Nama Penuh'}</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} required placeholder="John Doe" />
                    {errors.name && <span style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '4px' }}>{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label>{lang === 'en' ? 'Email Address' : 'Alamat Emel'}</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} required placeholder="john@example.com" />
                    {errors.email && <span style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '4px' }}>{errors.email}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label>{lang === 'en' ? 'Subject' : 'Subjek'}</label>
                  <select name="subject" value={formData.subject} onChange={handleChange}>
                    <option>{lang === 'en' ? 'General Inquiry' : 'Pertanyaan Am'}</option>
                    <option>{lang === 'en' ? 'Technical Support' : 'Sokongan Teknikal'}</option>
                    <option>{lang === 'en' ? 'Bulk Purchase' : 'Pembelian Pukal'}</option>
                    <option>{lang === 'en' ? 'Partnership' : 'Kerjasama'}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{lang === 'en' ? 'Message' : 'Mesej'}</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} onBlur={handleBlur} rows="5" required placeholder={lang === 'en' ? 'How can we help you?' : 'Bagaimana kami boleh membantu anda?'}></textarea>
                  {errors.message && <span style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '4px' }}>{errors.message}</span>}
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={formState === 'sending' || !isFormValid()}>
                  {formState === 'sending' ? (lang === 'en' ? 'Sending...' : 'Menghantar...') : (lang === 'en' ? 'Send Message' : 'Hantar Mesej')} 
                  <HiArrowRight />
                </button>
              </form>
            )}
          </motion.div>

          {/* 3. Direct Contact Info */}
          <motion.div 
            className="contact-sidebar"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="contact-methods">
              <div className="method-card">
                <div className="method-icon"><HiPhone /></div>
                <div className="method-info">
                  <h4>{lang === 'en' ? 'Call Us' : 'Hubungi Kami'}</h4>
                  <p>+60 12-331 5585</p>
                </div>
              </div>

              <div className="method-card">
                <div className="method-icon" style={{ background: 'rgba(37, 211, 102, 0.1)', color: '#25D366' }}><FaWhatsapp /></div>
                <div className="method-info">
                  <h4>WhatsApp</h4>
                  <p>Direct Chat Available</p>
                  <a href="https://api.whatsapp.com/send/?phone=60123315585" target="_blank" className="text-link">Chat Now</a>
                </div>
              </div>

              <div className="method-card">
                <div className="method-icon"><HiMail /></div>
                <div className="method-info">
                  <h4>{lang === 'en' ? 'Email Us' : 'Emel Kami'}</h4>
                  <p>info@felinelube.com.my</p>
                </div>
              </div>

              <div className="method-card">
                <div className="method-icon"><HiClock /></div>
                <div className="method-info">
                  <h4>{lang === 'en' ? 'Working Hours' : 'Waktu Kerja'}</h4>
                  <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="hq-card">
              <HiLocationMarker className="hq-icon" />
              <div>
                <h4>{lang === 'en' ? 'Headquarters' : 'Ibu Pejabat'}</h4>
                <p>No. 32-G, Jalan Nautika B U20/B, TSB Commercial Centre, 40160 Shah Alam, Selangor, Malaysia</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
