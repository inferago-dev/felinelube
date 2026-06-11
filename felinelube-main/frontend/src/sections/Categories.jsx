import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'
import { TbAtom, TbDroplet, TbEngine, TbGauge, TbTruck } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './Categories.css'

export default function Categories({ setView }) {
  const { t } = useLanguage()
  const navigate = useNavigate()

  const categories = [
    {
      id: 'Fully Synthetic',
      icon: <TbAtom />,
      tag: 'Premium',
      title: t('categories.cat1.title'),
      desc: t('categories.cat1.desc'),
    },
    {
      id: 'Semi Synthetic',
      icon: <TbDroplet />,
      tag: 'Value',
      title: t('categories.cat2.title'),
      desc: t('categories.cat2.desc'),
    },
    {
      id: 'Industrial',
      icon: <TbGauge />,
      tag: 'Industrial',
      title: t('categories.cat3.title'),
      desc: t('categories.cat3.desc'),
    },
    {
      id: 'Heavy Duty',
      icon: <TbTruck />,
      tag: 'HD Series',
      title: t('categories.cat4.title'),
      desc: t('categories.cat4.desc'),
    },
    {
      id: 'All', // Assuming Gear Oil falls under general or all, or map to 'Heavy Duty' if you prefer
      icon: <TbEngine />,
      tag: 'Drivetrain',
      title: t('categories.cat5.title'),
      desc: t('categories.cat5.desc'),
    },
  ]

  const handleExplore = (categoryId) => {
    setView('shop')
    navigate(`/shop?category=${encodeURIComponent(categoryId)}`)
  }

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  }

  const cardAnim = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] } },
  }

  return (
    <section className="categories" id="categories-section">
      <div className="categories__header">
        <div>
          <div className="section-label">{t('categories.label')}</div>
          <h2 className="section-title">
            {t('categories.title')} <span className="gold-text">{t('categories.titleGold')}</span>
          </h2>
        </div>
        <p className="section-subtitle">
          {t('categories.subtitle')}
        </p>
      </div>

      <motion.div
        className="categories__grid"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {categories.map((cat, i) => (
          <motion.div 
            key={cat.id} 
            className="cat-card" 
            variants={cardAnim}
            onClick={() => handleExplore(cat.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="cat-card__glow" />
            <span className="cat-card__number">0{i + 1}</span>
            <div className="cat-card__icon">{cat.icon}</div>
            <div className="cat-card__tag">{cat.tag}</div>
            <h3 className="cat-card__title">{cat.title}</h3>
            <p className="cat-card__desc">{cat.desc}</p>
            <div className="cat-card__link">
              {t('categories.explore')} <HiArrowRight />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
