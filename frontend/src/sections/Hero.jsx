import { motion } from 'framer-motion'
import { HiArrowRight, HiPlay } from 'react-icons/hi'
import { useLanguage } from '../context/LanguageContext'
import './Hero.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.4, 0.25, 1] },
  }),
}

const float = {
  animate: {
    y: [0, -14, 0],
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
  },
}

const glowPulse = {
  animate: {
    opacity: [0.6, 1, 0.6],
    scale: [1, 1.05, 1],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
}

export default function Hero({ setView }) {
  const { t } = useLanguage()
  
  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleExplore = () => {
    setView('home')
    setTimeout(() => {
      document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
  }

  return (
    <section className="hero" id="home">
      {/* Background */}
      <div className="hero__bg">
        <div className="hero__bg-gradient" />
        <div className="hero__bg-grid" />
        <div className="hero__bg-noise" />
        <motion.div className="hero__glow hero__glow--primary" variants={glowPulse} animate="animate" />
        <motion.div className="hero__glow hero__glow--secondary" variants={glowPulse} animate="animate" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Content */}
      <div className="hero__container">
        {/* Left */}
        <div className="hero__content">
          <motion.div className="hero__badge" custom={0} variants={fadeUp} initial="hidden" animate="visible">
            <span className="hero__badge-dot" />
            <span className="hero__badge-text">{t('hero.label')}</span>
          </motion.div>

          <motion.h1 className="hero__heading" custom={1} variants={fadeUp} initial="hidden" animate="visible">
            {t('hero.title')}
            <span className="hero__heading-highlight">{t('hero.titleGold')}</span>
          </motion.h1>

          <motion.p className="hero__subtext" custom={2} variants={fadeUp} initial="hidden" animate="visible">
            {t('hero.desc')}
          </motion.p>

          <motion.div className="hero__actions" custom={3} variants={fadeUp} initial="hidden" animate="visible">
            <button className="btn btn-primary" onClick={handleExplore}>
              {t('hero.cta')} <HiArrowRight />
            </button>
            <button className="btn btn-secondary" onClick={() => scrollTo('#about')}>
              <HiPlay /> {t('nav.about')}
            </button>
          </motion.div>

          <motion.div className="hero__stats" custom={4} variants={fadeUp} initial="hidden" animate="visible">
            {[
              { value: '5', unit: '+', label: 'Product Lines' },
              { value: '10', unit: 'K+', label: 'Satisfied Clients' },
              { value: 'API', unit: '', label: 'Certified' },
            ].map((s) => (
              <div className="hero__stat" key={s.label}>
                <div className="hero__stat-value">
                  {s.value}<span>{s.unit}</span>
                </div>
                <div className="hero__stat-label">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Visual */}
        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <div className="hero__oil-display">
            <motion.div className="hero__ring hero__ring--1" animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} />
            <motion.div className="hero__ring hero__ring--2" animate={{ rotate: -360 }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }} />
            
            <motion.div className="hero__product-wrap" variants={float} animate="animate">
              <svg width="320" height="420" viewBox="0 0 320 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero__product-svg">
                <defs>
                  <linearGradient id="jugGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2A2A2A" />
                    <stop offset="15%" stopColor="#1A1A1A" />
                    <stop offset="40%" stopColor="#0A0A0A" />
                    <stop offset="70%" stopColor="#050505" />
                    <stop offset="90%" stopColor="#1E1E1E" />
                    <stop offset="100%" stopColor="#000000" />
                  </linearGradient>
                  
                  <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFE082" />
                    <stop offset="25%" stopColor="#D4A017" />
                    <stop offset="50%" stopColor="#8A6305" />
                    <stop offset="75%" stopColor="#D4A017" />
                    <stop offset="100%" stopColor="#FFE082" />
                  </linearGradient>

                  <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8A6305" />
                    <stop offset="30%" stopColor="#E8B84B" />
                    <stop offset="70%" stopColor="#D4A017" />
                    <stop offset="100%" stopColor="#5C4203" />
                  </linearGradient>

                  <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="15" stdDeviation="25" floodColor="#D4A017" floodOpacity="0.25" />
                  </filter>

                  <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
                    <feFlood floodColor="#FFFFFF" floodOpacity="0.35" />
                    <feComposite in2="shadowDiff" operator="in" />
                    <feComposite in2="SourceGraphic" operator="over" />
                  </filter>
                </defs>

                <path fillRule="evenodd" clipRule="evenodd"
                      d="M70,90 C70,70 90,60 110,60 L150,55 C160,55 170,45 170,35 L170,30 200,30 200,35 C200,45 210,55 220,60 L240,65 C270,70 280,90 280,120 L280,180 C280,190 270,200 260,200 L250,200 C250,250 250,300 250,340 C250,360 230,370 200,370 L90,370 C60,370 50,350 50,320 L50,120 C50,100 60,90 70,90 Z M220,100 L200,100 C190,100 180,110 180,120 L180,170 C180,180 190,190 200,190 L220,190 C240,190 250,185 250,170 L250,130 C250,110 240,100 220,100 Z" 
                      fill="url(#jugGrad)" filter="url(#dropShadow)" />

                <path d="M55,120 C55,105 60,95 75,95 L95,95 C70,150 70,250 85,360 C60,355 55,340 55,320 Z" fill="#FFFFFF" opacity="0.04" />
                <path d="M280,120 C280,150 280,170 275,190 C270,195 265,200 260,200 C270,200 275,190 278,170 L278,120 C278,100 270,80 255,75 C265,80 280,100 280,120 Z" fill="#FFFFFF" opacity="0.06" />
                <path d="M180,120 C180,140 180,160 183,170 C185,178 190,180 195,180 C190,180 185,175 183,165 L183,120 C183,115 185,110 190,105 C185,108 180,112 180,120 Z" fill="#000000" opacity="0.4" />

                <rect x="185" y="215" width="60" height="3" rx="1.5" fill="#000000" opacity="0.5" />
                <rect x="185" y="230" width="60" height="3" rx="1.5" fill="#000000" opacity="0.5" />
                <rect x="185" y="245" width="60" height="3" rx="1.5" fill="#000000" opacity="0.5" />
                <rect x="185" y="260" width="60" height="3" rx="1.5" fill="#000000" opacity="0.5" />
                <rect x="185" y="275" width="60" height="3" rx="1.5" fill="#000000" opacity="0.5" />
                <rect x="185" y="290" width="60" height="3" rx="1.5" fill="#000000" opacity="0.5" />
                <rect x="185" y="305" width="60" height="3" rx="1.5" fill="#000000" opacity="0.5" />
                <rect x="185" y="320" width="60" height="3" rx="1.5" fill="#000000" opacity="0.5" />
                <rect x="185" y="335" width="60" height="3" rx="1.5" fill="#000000" opacity="0.5" />

                <rect x="167" y="5" width="36" height="6" rx="2" fill="url(#capGrad)" />
                <rect x="165" y="10" width="40" height="24" rx="3" fill="url(#capGrad)" />
                
                <rect x="166" y="10" width="2" height="24" fill="#000000" opacity="0.25" />
                <rect x="172" y="10" width="2" height="24" fill="#000000" opacity="0.15" />
                <rect x="178" y="10" width="2" height="24" fill="#000000" opacity="0.15" />
                <rect x="184" y="10" width="2" height="24" fill="#000000" opacity="0.15" />
                <rect x="190" y="10" width="2" height="24" fill="#000000" opacity="0.15" />
                <rect x="196" y="10" width="2" height="24" fill="#000000" opacity="0.15" />
                <rect x="202" y="10" width="2" height="24" fill="#000000" opacity="0.25" />
                
                <rect x="164" y="32" width="42" height="4" rx="1" fill="#D4A017" />
                
                <rect x="58" y="110" width="119" height="220" rx="14" fill="url(#goldAccent)" filter="url(#innerGlow)" />
                <rect x="62" y="114" width="111" height="212" rx="10" fill="#0A0A0A" />
                
                <path d="M62,130 L173,150 L173,220 L62,280 Z" fill="#131313" />
                
                <path d="M117.5 128 Q124 139 124 144 A6.5 6.5 0 0 1 111 144 Q111 139 117.5 128 Z" fill="url(#goldAccent)" />

                <text x="117.5" y="195" fontFamily="Poppins, sans-serif" fontSize="72" fontWeight="900" fill="url(#goldAccent)" letterSpacing="-4" textAnchor="middle">F</text>
                
                <text x="117.5" y="218" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="800" fill="#D4A017" letterSpacing="4.5" textAnchor="middle">FELINE</text>
                <text x="117.5" y="232" fontFamily="Inter, sans-serif" fontSize="6" fontWeight="500" fill="#888888" letterSpacing="2.5" textAnchor="middle">GENUINE LUBRICANTS</text>
                
                <rect x="87.5" y="246" width="60" height="2" fill="#E63946" />

                <text x="117.5" y="270" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="900" fill="#FFFFFF" letterSpacing="1" textAnchor="middle">5W-40</text>
                <text x="117.5" y="284" fontFamily="Inter, sans-serif" fontSize="7.5" fontWeight="700" fill="#D4A017" letterSpacing="1.5" textAnchor="middle">FULLY SYNTHETIC</text>

                <rect x="72.5" y="300" width="32" height="16" rx="4" fill="#1A1A1A" stroke="#333333" />
                <text x="88.5" y="310.5" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700" fill="#FFFFFF" textAnchor="middle">4L</text>
                
                <rect x="110" y="300" width="55" height="16" rx="4" fill="#D4A017" />
                <text x="137.5" y="310.5" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="800" fill="#000000" textAnchor="middle">API SP / CF</text>
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
