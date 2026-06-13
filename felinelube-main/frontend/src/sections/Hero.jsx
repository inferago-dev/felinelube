import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiArrowRight, HiPlay } from 'react-icons/hi'
import { useLanguage } from '../context/LanguageContext'
import API_BASE from '../api'
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
  const [dynTitle, setDynTitle] = useState('')
  const [dynSubtitle, setDynSubtitle] = useState('')

  useEffect(() => {
    fetch(`${API_BASE}/homepage/public`)
      .then(res => res.json())
      .then(data => {
        const heroData = data.find(d => d.section === 'Hero')
        if (heroData && heroData.content) {
          if (heroData.content.title) setDynTitle(heroData.content.title)
          if (heroData.content.subtitle) setDynSubtitle(heroData.content.subtitle)
        }
      })
      .catch(console.error)
  }, [])
  
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
            {dynTitle ? dynTitle : (
              <>
                {t('hero.title')}
                <span className="hero__heading-highlight">{t('hero.titleGold')}</span>
              </>
            )}
          </motion.h1>

          <motion.p className="hero__subtext" custom={2} variants={fadeUp} initial="hidden" animate="visible">
            {dynSubtitle || t('hero.desc')}
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

        {/* Right Visual — Oil Barrel */}
        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <div className="hero__barrel-display">
            {/* Glow aura behind barrel */}
            <div className="hero__barrel-glow" />

            {/* Rotating ring decorations */}
            <motion.div className="hero__ring hero__ring--1" animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} />
            <motion.div className="hero__ring hero__ring--2" animate={{ rotate: -360 }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }} />

            {/* Barrel image with float animation */}
            <motion.div className="hero__barrel-wrap" variants={float} animate="animate">
              <img
                src="/oil-barrel.png"
                alt="Feline Industrial Oil Barrel"
                className="hero__barrel-img"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
