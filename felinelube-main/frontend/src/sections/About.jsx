import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import './About.css'

// Placeholder industrial truck image
const truckImg = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1200'

export default function About() {
  const { t } = useLanguage()

  const metrics = [
    { value: '10', unit: 'K+', label: t('hero.label') },
    { value: '5', unit: '+', label: t('nav.products') },
    { value: '15', unit: '+', label: 'Years Experience' },
    { value: 'MY', unit: '', label: 'Manufactured' },
  ]

  const highlights = [
    t('about.point1'),
    t('about.point2'),
    t('about.point3'),
    t('about.point4'),
    t('about.point5'),
  ]

  const fadeLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] } },
  }

  const fadeRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] } },
  }

  return (
    <section className="about" id="about">
      <div className="about__inner">
        {/* Left Content */}
        <motion.div
          className="about__content"
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div>
            <div className="section-label">{t('about.label')}</div>
            <h2 className="section-title">
              {t('about.title')} <span className="gold-text">{t('about.titleGold')}</span>
            </h2>
          </div>

          <div className="about__body">
            <p className="about__para">{t('about.para1')}</p>
            <p className="about__para">{t('about.para2')}</p>
          </div>

          <div className="about__highlights">
            {highlights.map((point) => (
              <div key={point} className="about__highlight">
                <span className="about__highlight-dot" />
                {point}
              </div>
            ))}
          </div>

          <div>
            <button
              className="btn btn-primary"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('about.cta')}
            </button>
          </div>
        </motion.div>

        {/* Right Visual */}
        <motion.div
          className="about__visual"
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="about__image-wrap">
            <img src={truckImg} alt="Feline Distribution Fleet" className="about__truck-img" />
            <div className="about__image-overlay" />
          </div>

          <div className="about__metric-grid">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                className="about__metric"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="about__metric-value">
                  {m.value}<span>{m.unit}</span>
                </div>
                <div className="about__metric-label">{m.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="about__country">
            <div className="about__country-icon">🇲🇾</div>
            <div className="about__country-text">
              <strong>Malaysia — Logistics Hub</strong>
              <span>Ensuring quality lubricants reach every engine</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
