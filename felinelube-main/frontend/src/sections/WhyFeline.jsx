import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import './WhyFeline.css'

const FEATURES = [
  {
    id: 'antiwear',
    num: '01',
    title: 'Anti Wear Protection',
    desc: 'Molecular barrier technology reduces metal-to-metal contact, dramatically cutting friction and wear in critical engine components.',
    metric: '99.2%',
    unit: 'Wear Reduction',
  },
  {
    id: 'thermal',
    num: '02',
    title: 'Thermal Stability',
    desc: 'Advanced base oils maintain optimal viscosity from cold starts to peak operating temperatures exceeding 210°C.',
    metric: '210°C',
    unit: 'Rated Limit',
  },
  {
    id: 'clean',
    num: '03',
    title: 'Engine Cleanliness',
    desc: 'Detergent-dispersant additives neutralise acids and keep pistons, rings, and cylinder walls immaculately clean.',
    metric: 'A1',
    unit: 'Piston Deposit Grade',
  },
  {
    id: 'sludge',
    num: '04',
    title: 'Sludge Prevention',
    desc: 'Proprietary dispersant package holds combustion by-products in suspension, preventing harmful sludge buildup.',
    metric: '0 ppm',
    unit: 'Sludge Deposit',
  },
  {
    id: 'fuel',
    num: '05',
    title: 'Fuel Efficiency',
    desc: 'Low-friction formulation reduces parasitic drag on engine internals, delivering measurable fuel savings on every journey.',
    metric: '3.5%+',
    unit: 'Fuel Saving',
  },
  {
    id: 'drain',
    num: '06',
    title: 'Long Drain Intervals',
    desc: 'High-performance additive chemistry maintains protective properties far beyond conventional oil service intervals.',
    metric: '10K km',
    unit: 'Drain Interval',
  },
]

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
})

export default function WhyFeline() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section className="wf" ref={ref}>
      {/* Subtle top rule */}
      <div className="wf__rule" />

      <div className="wf__wrap">
        {/* ════════════════ LEFT ════════════════ */}
        <div className="wf__left">
          {/* Header */}
          <motion.div
            className="wf__header"
            variants={fade(0)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <span className="wf__eyebrow">{t('why.label')}</span>
            <h2 className="wf__title">
              {t('why.title')}{' '}
              <em className="wf__title-em">{t('why.titleGold')}</em>
            </h2>
            <p className="wf__lead">{t('why.subtitle')}</p>
          </motion.div>

          {/* Feature list */}
          <div className="wf__list">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.id}
                className="wf__item"
                variants={fade(0.08 + i * 0.07)}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
              >
                <div className="wf__item-left">
                  <span className="wf__num">{f.num}</span>
                  <div className="wf__item-text">
                    <div className="wf__item-title">{f.title}</div>
                    <p className="wf__item-desc">{f.desc}</p>
                  </div>
                </div>
                <div className="wf__item-metric">
                  <div className="wf__metric-val">{f.metric}</div>
                  <div className="wf__metric-unit">{f.unit}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cert strip */}
          <motion.div
            className="wf__certs"
            variants={fade(0.65)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {['JASO MA2', 'ISO 9001:2015', 'SAE 5W-40 / 15W-40', 'ISO 14001'].map(c => (
              <div key={c} className="wf__cert">
                <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                  <circle cx="3.5" cy="3.5" r="3.5" fill="#22c55e" />
                </svg>
                {c}
              </div>
            ))}
          </motion.div>
        </div>

        {/* ════════════════ RIGHT — Product Visual ════════════════ */}
        <motion.div
          className="wf__right"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Glow behind bottle */}
          <div className="wf__glow" />

          {/* Floating stat cards */}
          <motion.div
            className="wf__badge wf__badge--tl"
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="wf__badge-val">100%</div>
            <div className="wf__badge-lbl">Full Synthetic</div>
          </motion.div>

          <motion.div
            className="wf__badge wf__badge--br"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <div className="wf__badge-val">Premium</div>
            <div className="wf__badge-lbl">Certified Grade</div>
          </motion.div>

          <motion.div
            className="wf__badge wf__badge--tr"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <div className="wf__badge-val">210°C</div>
            <div className="wf__badge-lbl">Thermal Rated</div>
          </motion.div>

          {/* The product image */}
          <motion.img
            src="/why-visual.png"
            alt="Feline Premium Lubricant"
            className="wf__product-img"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Bottom reflection gradient */}
          <div className="wf__reflection" />
        </motion.div>
      </div>
    </section>
  )
}
