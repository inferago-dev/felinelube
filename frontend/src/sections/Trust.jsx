import { motion } from 'framer-motion'
import { TbCertificate, TbAtom, TbShieldCheck, TbEngine } from 'react-icons/tb'
import { useLanguage } from '../context/LanguageContext'
import './Trust.css'

export default function Trust() {
  const { t } = useLanguage()

  const trustItems = [
    {
      icon: <TbCertificate />,
      title: t('trust.card1.title'),
      desc: t('trust.card1.desc'),
    },
    {
      icon: <TbAtom />,
      title: t('trust.card2.title'),
      desc: t('trust.card2.desc'),
    },
    {
      icon: <TbShieldCheck />,
      title: t('trust.card3.title'),
      desc: t('trust.card3.desc'),
    },
    {
      icon: <TbEngine />,
      title: t('trust.card4.title'),
      desc: t('trust.card4.desc'),
    },
  ]

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] },
    }),
  }

  return (
    <section className="trust">
      <div className="trust__grid">
        {trustItems.map((item, i) => (
          <motion.div
            key={item.title}
            className="trust__card"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ y: -4 }}
          >
            <div className="trust__icon-wrap">{item.icon}</div>
            <div className="trust__accent" />
            <div className="trust__title">{item.title}</div>
            <p className="trust__desc">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
