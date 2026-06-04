import { motion } from 'framer-motion'
import {
  TbShieldCheck, TbFlame, TbDroplet, TbBolt,
  TbTruck, TbClock
} from 'react-icons/tb'
import { useLanguage } from '../context/LanguageContext'
import './WhyFeline.css'

/* Engine / Molecular SVG Graphic */
function EngineSVG() {
  return (
    <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="150" cy="150" r="130" stroke="rgba(212,160,23,0.1)" strokeWidth="1" />
      <circle cx="150" cy="150" r="105" stroke="rgba(212,160,23,0.08)" strokeWidth="1" strokeDasharray="4 8" />
      <circle cx="150" cy="150" r="75" stroke="rgba(212,160,23,0.12)" strokeWidth="1.5" />
      <circle cx="150" cy="150" r="50" fill="rgba(212,160,23,0.05)" stroke="rgba(212,160,23,0.15)" strokeWidth="1" />
      <rect x="115" y="115" width="70" height="70" rx="8" stroke="rgba(212,160,23,0.25)" strokeWidth="1.5" fill="rgba(212,160,23,0.04)" />
      <rect x="125" y="125" width="50" height="50" rx="5" stroke="rgba(212,160,23,0.4)" strokeWidth="1" fill="rgba(212,160,23,0.07)" />
      <circle cx="150" cy="150" r="16" fill="url(#engGrad)" />
      <circle cx="150" cy="150" r="8" fill="rgba(212,160,23,0.5)" />
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const x1 = 150 + 50 * Math.cos(rad)
        const y1 = 150 + 50 * Math.sin(rad)
        const x2 = 150 + 105 * Math.cos(rad)
        const y2 = 150 + 105 * Math.sin(rad)
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(212,160,23,0.12)" strokeWidth="1" />
      })}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const x = 150 + 130 * Math.cos(rad)
        const y = 150 + 130 * Math.sin(rad)
        return <circle key={angle} cx={x} cy={y} r="3" fill="rgba(212,160,23,0.3)" />
      })}
      <text x="150" y="156" fontFamily="Poppins,sans-serif" fontSize="11" fontWeight="800" fill="rgba(212,160,23,0.7)" letterSpacing="1" textAnchor="middle">ENGINE</text>
      <defs>
        <radialGradient id="engGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8B84B" />
          <stop offset="100%" stopColor="#A87C10" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export default function WhyFeline() {
  const { t } = useLanguage()

  const features = [
    { icon: <TbShieldCheck />, title: t('why.f1.title'), desc: t('why.f1.desc') },
    { icon: <TbFlame />, title: t('why.f2.title'), desc: t('why.f2.desc') },
    { icon: <TbDroplet />, title: t('why.f3.title'), desc: t('why.f3.desc') },
    { icon: <TbBolt />, title: t('why.f4.title'), desc: t('why.f4.desc') },
    { icon: <TbTruck />, title: t('why.f5.title'), desc: t('why.f5.desc') },
    { icon: <TbClock />, title: t('why.f6.title'), desc: t('why.f6.desc') },
  ]

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } },
  }

  return (
    <section className="why">
      <div className="why__bg-text">FELINE</div>

      <div className="why__inner">
        {/* Left: Features */}
        <div className="why__content">
          <div>
            <div className="section-label">{t('why.label')}</div>
            <h2 className="section-title">
              {t('why.title')} <span className="gold-text">{t('why.titleGold')}</span>
            </h2>
            <p className="section-subtitle">
              {t('why.subtitle')}
            </p>
          </div>

          <motion.div
            className="why__features"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((f) => (
              <motion.div key={f.title} className="why__feature" variants={itemVariants}>
                <div className="why__feature-icon">{f.icon}</div>
                <div className="why__feature-body">
                  <div className="why__feature-title">{f.title}</div>
                  <p className="why__feature-desc">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right: Engine Graphic */}
        <motion.div
          className="why__visual"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="why__engine-graphic">
            <motion.div
              className="why__engine-svg-wrap"
              animate={{ rotate: 360 }}
              transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            >
              <EngineSVG />
            </motion.div>
            <div className="why__stat-float why__stat-float--tl">
              <div className="why__stat-float-value">100%</div>
              <div className="why__stat-float-label">{t('why.pureSynthetic')}</div>
            </div>
            <div className="why__stat-float why__stat-float--br">
              <div className="why__stat-float-value">API SN</div>
              <div className="why__stat-float-label">{t('why.certifiedGrade')}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
