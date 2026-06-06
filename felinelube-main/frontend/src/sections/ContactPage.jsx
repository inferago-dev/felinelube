import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiMail, HiPhone, HiLocationMarker, HiClock, HiArrowRight } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import '../styles/ContactPage.css'

export default function ContactPage() {
  const { t, lang } = useLanguage()
  const [formState, setFormState] = useState('idle') // idle, sending, success

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormState('sending')
    setTimeout(() => setFormState('success'), 1500)
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
                <div className="form-row">
                  <div className="form-group">
                    <label>{lang === 'en' ? 'Full Name' : 'Nama Penuh'}</label>
                    <input type="text" required placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label>{lang === 'en' ? 'Email Address' : 'Alamat Emel'}</label>
                    <input type="email" required placeholder="john@example.com" />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>{lang === 'en' ? 'Subject' : 'Subjek'}</label>
                  <select>
                    <option>{lang === 'en' ? 'General Inquiry' : 'Pertanyaan Am'}</option>
                    <option>{lang === 'en' ? 'Technical Support' : 'Sokongan Teknikal'}</option>
                    <option>{lang === 'en' ? 'Bulk Purchase' : 'Pembelian Pukal'}</option>
                    <option>{lang === 'en' ? 'Partnership' : 'Kerjasama'}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{lang === 'en' ? 'Message' : 'Mesej'}</label>
                  <textarea rows="5" required placeholder={lang === 'en' ? 'How can we help you?' : 'Bagaimana kami boleh membantu anda?'}></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={formState === 'sending'}>
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
