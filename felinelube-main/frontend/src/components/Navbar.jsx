import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiShoppingCart, HiGlobeAlt, HiMoon, HiSun, HiOutlineUser } from 'react-icons/hi'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang, setLang, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const currentView = location.pathname === '/' ? 'home' : location.pathname.slice(1)

  const navLinks = [
    { label: t('nav.home'), view: 'home', href: '#home', id: 'home' },
    { label: t('nav.products'), view: 'home', href: '#products', id: 'products' },
    { label: t('nav.shop') || 'Shop', view: 'shop', href: '#shop', id: 'shop' },
    { label: t('nav.about'), view: 'home', href: '#about', id: 'about' },
    { label: lang === 'en' ? 'Contact' : 'Hubungi', view: 'contact', href: '#contact', id: 'contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)

      if (currentView === 'home') {
        if (window.scrollY < 200) {
          setActiveSection('home')
          return
        }

        const sections = ['products', 'about', 'contact']
        let found = false
        for (const section of sections) {
          const el = document.getElementById(section)
          if (el) {
            const rect = el.getBoundingClientRect()
            if (rect.top <= 180 && rect.bottom >= 180) {
              setActiveSection(section)
              found = true
              break
            }
          }
        }
        if (!found && window.scrollY < 800) setActiveSection('home')
      } else {
        setActiveSection(currentView)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentView])

  const handleNavClick = (link) => {
    setMobileOpen(false)
    
    const isHome = location.pathname === '/'

    if (link.view === 'home') {
      if (!isHome) {
        navigate('/')
        setTimeout(() => {
          const el = document.querySelector(link.href)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
          }
        }, 150)
      } else {
        const el = document.querySelector(link.href)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    } else {
      navigate(`/${link.view}`)
    }
  }

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ms' : 'en')
  }

  const isLinkActive = (link) => {
    return activeSection === link.id
  }

  const navbarClass = (scrolled || currentView !== 'home') ? 'scrolled' : 'transparent'

  return (
    <>
      <nav className={`navbar ${navbarClass}`}>
        <div className="navbar__inner">
          <motion.div
            className="navbar__logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => handleNavClick({ label: 'Home', view: 'home', href: '#home' })}
            style={{ cursor: 'pointer' }}
          >
            <img src="/logo.png" alt="Feline Lubricants" className="navbar__logo-img" />
          </motion.div>

          <motion.ul
            className="navbar__links"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`navbar__link ${isLinkActive(link) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(link)
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            
            <li className="navbar__icon-link" onClick={toggleTheme} style={{ cursor: 'pointer' }}>
              {theme === 'dark' ? <HiSun className="navbar__cart-icon" /> : <HiMoon className="navbar__cart-icon" />}
            </li>

            <li className="navbar__icon-link" onClick={toggleLang} style={{ cursor: 'pointer' }}>
              <HiGlobeAlt className="navbar__cart-icon" />
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--color-gold)' }}>
                {lang.toUpperCase()}
              </span>
            </li>

            <li className="navbar__icon-link" style={{ cursor: 'pointer' }}>
              <HiShoppingCart className="navbar__cart-icon" />
              <span className="navbar__cart-badge">0</span>
            </li>

            <li 
              className="navbar__icon-link" 
              onClick={() => {
                const isAuth = localStorage.getItem('token');
                navigate(isAuth ? '/profile' : '/login');
              }} 
              style={{ cursor: 'pointer', marginLeft: '5px' }}
              title="Profile / Login"
            >
              <HiOutlineUser className="navbar__cart-icon" />
            </li>
            
            <li>
              <a
                href="#contact"
                className={`navbar__cta ${activeSection === 'contact' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/contact')
                }}
              >
                {t('nav.contact')}
              </a>
            </li>
          </motion.ul>

          <button className="navbar__toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            <span style={{ transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ transform: mobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile-menu open"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`navbar__mobile-link ${isLinkActive(link) ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link)
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className={`navbar__mobile-link ${currentView === 'contact' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                setMobileOpen(false)
                navigate('/contact')
              }}
            >
              {t('nav.contact')}
            </a>
            <div className="navbar__mobile-actions" style={{ display: 'flex', gap: '2rem', padding: '1rem', justifyContent: 'center' }}>
              <div onClick={toggleTheme} style={{ fontSize: '1.5rem', color: 'var(--color-gold)' }}>
                {theme === 'dark' ? <HiSun /> : <HiMoon />}
              </div>
              <div onClick={toggleLang} style={{ fontSize: '1.5rem', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <HiGlobeAlt /> <span style={{ fontSize: '1rem' }}>{lang.toUpperCase()}</span>
              </div>
              <div 
                onClick={() => { setMobileOpen(false); navigate('/login'); }} 
                style={{ fontSize: '1.5rem', color: 'var(--color-gold)', cursor: 'pointer' }}
              >
                <HiOutlineUser />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
