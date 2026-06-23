import { motion } from 'framer-motion'
import { TbCertificate, TbShieldCheck, TbWorldCheck } from 'react-icons/tb'
import { useLanguage } from '../context/LanguageContext'
import './Certifications.css'

export default function Certifications() {
  const { t } = useLanguage()

  const certs = [
    {
      icon: <TbCertificate />,
      code: 'ISO 9001:2015',
      title: t('certs.item1.title'),
      desc: t('certs.item1.desc'),
    },
    {
      icon: <TbShieldCheck />,
      code: 'CERTIFIED',
      title: t('certs.item2.title'),
      desc: t('certs.item2.desc'),
    },
    {
      icon: <TbWorldCheck />,
      code: 'ISO 14001:2015',
      title: t('certs.item3.title'),
      desc: t('certs.item3.desc'),
    },
  ]

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] } },
  }

  return (
    <section className="certs">
      <div className="certs__bg" />
      
      <div className="certs__header">
        <div className="section-label" style={{ justifyContent: 'center' }}>{t('certs.label')}</div>
        <h2 className="section-title">
          {t('certs.title')} <span className="gold-text">{t('certs.titleGold')}</span>
        </h2>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          {t('certs.desc')}
        </p>
      </div>

      <motion.div 
        className="certs__grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {certs.map((cert) => (
          <motion.div key={cert.code} className="cert-card" variants={cardVariants}>
            <div className="cert-card__icon">{cert.icon}</div>
            <div className="cert-card__code">{cert.code}</div>
            <h3 className="cert-card__title">{cert.title}</h3>
            <p className="cert-card__desc">{cert.desc}</p>
            <div className="cert-card__badge">
              <span className="cert-card__badge-dot" />
              {t('certs.verified')}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
