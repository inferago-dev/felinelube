import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa'
import { HiLocationMarker, HiPhone, HiMail } from 'react-icons/hi'
import { useLanguage } from '../context/LanguageContext'
import './Footer.css'

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, lang } = useLanguage()

  const handleNavClick = (view, href) => {
    const isHome = location.pathname === '/'
    if (view === 'home') {
      if (!isHome) {
        navigate('/')
        if (href) {
          setTimeout(() => {
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
          }, 150)
        }
      } else if (href) {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(`/${view}`)
    }
  }

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          {/* Brand & Map */}
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="gold-text">Feline</span> Lubricants
            </div>
            <p className="footer__desc">{t('footer.brand')}</p>
            
            {/* Embedded Mini Map */}
            <div className="footer__map-mini">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3984.3307155450466!2d101.50309753417969!3d3.0053999423980713!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cdad0d2dda6adf%3A0xf28e56f8ec16f19d!2sFELINE%20GENUINE%20LUBRICANTS%20(M)%20SDN%20BHD!5e0!3m2!1sen!2sin!4v1778930857854!5m2!1sen!2sin" 
                width="100%" 
                height="150" 
                style={{ border: 0, borderRadius: '8px', marginTop: '1.5rem' }} 
                allowFullScreen="" 
                loading="lazy" 
                title="Feline HQ Mini Map"
              />
              <a 
                href="https://www.google.com/maps/place/FELINE+GENUINE+LUBRICANTS+(M)+SDN+BHD/@3.0054,101.5031,17z" 
                target="_blank" 
                className="footer__map-link"
              >
                <HiLocationMarker /> {lang === 'en' ? 'Open in Google Maps' : 'Buka di Google Maps'}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__nav">
            <h4 className="footer__title">{t('footer.company')}</h4>
            <ul>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('home', '#home') }}>{t('nav.home')}</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); handleNavClick('home', '#about') }}>{t('nav.about')}</a></li>
              <li><a href="#products" onClick={(e) => { e.preventDefault(); handleNavClick('home', '#products') }}>{t('nav.products')}</a></li>
              <li><a href="#shop" onClick={(e) => { e.preventDefault(); navigate('/shop') }}>{t('nav.shop')}</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); navigate('/contact') }}>{t('nav.contact')}</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer__nav">
            <h4 className="footer__title">{lang === 'en' ? 'Categories' : 'Kategori'}</h4>
            <ul>
              <li><a href="#products" onClick={(e) => { e.preventDefault(); handleNavClick('home', '#products') }}>{t('categories.cat1.title')}</a></li>
              <li><a href="#products" onClick={(e) => { e.preventDefault(); handleNavClick('home', '#products') }}>{t('categories.cat2.title')}</a></li>
              <li><a href="#products" onClick={(e) => { e.preventDefault(); handleNavClick('home', '#products') }}>{t('categories.cat4.title')}</a></li>
              <li><a href="#products" onClick={(e) => { e.preventDefault(); handleNavClick('home', '#products') }}>{t('categories.cat3.title')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__nav">
            <h4 className="footer__title">{lang === 'en' ? 'Get In Touch' : 'Hubungi Kami'}</h4>
            <ul className="footer__contact-list">
              <li>
                <HiLocationMarker className="gold-text" />
                <span>Shah Alam, Selangor, MY</span>
              </li>
              <li>
                <HiPhone className="gold-text" />
                <span>+60 12-331 5585</span>
              </li>
              <li>
                <HiMail className="gold-text" />
                <span>info@felinelube.com.my</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} Feline Genuine Lubricants. {t('footer.rights')}</p>
          <div className="footer__social">
            <a href="https://www.tiktok.com/@felinelube" target="_blank" className="footer__social-link"><FaTiktok /></a>
            <a href="https://instagram.com/feline_lube" target="_blank" className="footer__social-link"><FaInstagram /></a>
            <a href="https://api.whatsapp.com/send/?phone=60123315585" target="_blank" className="footer__social-link"><FaWhatsapp /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
