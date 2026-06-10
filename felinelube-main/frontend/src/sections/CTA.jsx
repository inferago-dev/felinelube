import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import './CTA.css'

export default function CTA({ setView }) {
  const { t } = useLanguage()
  
  const handleExplore = () => {
    setView('home')
    setTimeout(() => {
      document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
  }

  return (
    <section className="cta" id="final-cta">
      <div className="cta__bg" />
      <div className="cta__grid-overlay" />
      <motion.div 
        className="cta__glow"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <div className="cta__container">
        <motion.h2 
          className="cta__heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {t('cta.title')} <br />
          <span className="gold-text">{t('cta.titleGold')}</span>
        </motion.h2>
        
        <motion.p 
          className="cta__subtext"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {t('cta.subtext')}
        </motion.p>
        
        <motion.div 
          className="cta__actions"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <button className="btn btn-primary" onClick={handleExplore}>
            {t('cta.btnProducts')} <HiArrowRight />
          </button>
          <a 
            href="https://api.whatsapp.com/send/?phone=60123315585&text&type=phone_number&app_absent=0" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary"
            style={{ borderColor: '#25D366', color: '#25D366' }}
          >
            <FaWhatsapp /> WhatsApp
          </a>
          <a 
            href="https://instagram.com/feline_lube?igshid=YmMyMTA2M2Y=" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary"
            style={{ borderColor: '#D4A017', color: '#D4A017' }}
          >
            <FaInstagram /> Instagram
          </a>
          <a 
            href="https://www.tiktok.com/@felinelube?_t=8a0BGxYL7kg&_r=1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary"
            style={{ borderColor: '#D4A017', color: '#D4A017' }}
          >
            <FaTiktok /> TikTok
          </a>
        </motion.div>
      </div>
    </section>
  )
}
