import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { HiOutlineClock, HiOutlineLightningBolt, HiOutlineChatAlt2 } from 'react-icons/hi'
import './WhatsAppSection.css'

const WA_LINK = 'https://api.whatsapp.com/send/?phone=60123315585&text=Hi%20Feline%20Lube%2C%20I%20have%20a%20question%20about...'

const features = [
  { icon: <HiOutlineClock />, label: 'Fast Response', desc: 'Reply within minutes during business hours' },
  { icon: <HiOutlineLightningBolt />, label: 'Expert Advice', desc: 'Get the right oil for your engine instantly' },
  { icon: <HiOutlineChatAlt2 />, label: 'Live Support', desc: 'Mon – Sat, 9 AM – 6 PM (MYT)' },
]

export default function WhatsAppSection() {
  return (
    <section className="wa-section">
      {/* Background decorative elements */}
      <div className="wa-section__bg-orb wa-section__bg-orb--left" />
      <div className="wa-section__bg-orb wa-section__bg-orb--right" />

      <div className="wa-section__inner">
        {/* Left — copy */}
        <motion.div
          className="wa-section__content"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="section-label" style={{ color: '#25D366', borderColor: 'rgba(37,211,102,0.3)', background: 'rgba(37,211,102,0.08)' }}>
            Chat With Us
          </div>

          <h2 className="section-title wa-section__title">
            Talk to Our <span className="wa-section__green">Oil Experts</span>
          </h2>

          <p className="wa-section__desc">
            Not sure which lubricant is right for your engine? Our specialists are on WhatsApp — 
            ask anything from viscosity grades to bulk pricing.
          </p>

          <div className="wa-section__features">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                className="wa-section__feature"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="wa-section__feature-icon">{f.icon}</div>
                <div>
                  <div className="wa-section__feature-label">{f.label}</div>
                  <div className="wa-section__feature-desc">{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-section__cta"
            whileHover={{ scale: 1.03, boxShadow: '0 8px 40px rgba(37,211,102,0.45)' }}
            whileTap={{ scale: 0.97 }}
          >
            <FaWhatsapp size={24} />
            Chat on WhatsApp Now
          </motion.a>
        </motion.div>

        {/* Right — visual card */}
        <motion.div
          className="wa-section__visual"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="wa-section__card">
            {/* Chat header */}
            <div className="wa-section__card-header">
              <div className="wa-section__avatar">
                <FaWhatsapp size={22} />
              </div>
              <div>
                <div className="wa-section__card-name">Feline Lube Support</div>
                <div className="wa-section__card-status">
                  <span className="wa-section__online-dot" />
                  Online now
                </div>
              </div>
            </div>

            {/* Chat bubbles */}
            <div className="wa-section__chat">
              <motion.div
                className="wa-section__bubble wa-section__bubble--in"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                viewport={{ once: true }}
              >
                Hi! 👋 Which engine oil do you recommend for a Proton X70?
              </motion.div>

              <motion.div
                className="wa-section__bubble wa-section__bubble--out"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                viewport={{ once: true }}
              >
                For the X70's 1.8T engine we recommend our <strong>Feline F45 5W-30</strong> — fully synthetic, premium formulation for turbo engines. 🔥
              </motion.div>

              <motion.div
                className="wa-section__bubble wa-section__bubble--in"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                viewport={{ once: true }}
              >
                Perfect! Do you offer bulk pricing?
              </motion.div>

              <motion.div
                className="wa-section__bubble wa-section__bubble--out"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                viewport={{ once: true }}
              >
                Yes! Reseller &amp; fleet discounts available. Let me send you our price list 📋
              </motion.div>
            </div>

            {/* Input row */}
            <div className="wa-section__card-input">
              <span className="wa-section__card-placeholder">Type a message…</span>
              <div className="wa-section__send-btn">
                <FaWhatsapp size={18} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
