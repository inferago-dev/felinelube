import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import './WhyFeline.css'

/* ── Floating Particle Canvas ── */
function ParticleCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let W = canvas.offsetWidth
    let H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.6 + 0.15),
      alpha: Math.random() * 0.6 + 0.1,
      life: Math.random(),
    }))

    const tick = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.life += 0.004
        if (p.y < -5 || p.life > 1) {
          p.x = Math.random() * W
          p.y = H + 5
          p.life = 0
          p.alpha = Math.random() * 0.5 + 0.1
        }
        const fade = p.life < 0.2 ? p.life / 0.2 : p.life > 0.8 ? (1 - p.life) / 0.2 : 1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212,160,23,${p.alpha * fade})`
        ctx.fill()
      })
      animId = requestAnimationFrame(tick)
    }
    tick()

    const handleResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('resize', handleResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize) }
  }, [])
  return <canvas ref={canvasRef} className="why__particle-canvas" />
}

/* ── Tech Indicators that orbit the container ── */
const TECH_NODES = [
  { id: 'antiwear', label: 'Anti Wear', value: '99.2%', angle: 330, r: 88 },
  { id: 'thermal', label: 'Thermal Stable', value: '210°C', angle: 30, r: 88 },
  { id: 'cleanliness', label: 'Engine Clean', value: 'A1 Grade', angle: 90, r: 88 },
  { id: 'sludge', label: 'Sludge Free', value: '0 ppm', angle: 150, r: 88 },
  { id: 'fuel', label: 'Fuel Saving', value: '3.5%+', angle: 210, r: 88 },
  { id: 'drain', label: 'Long Drain', value: '10K km', angle: 270, r: 88 },
]

function TechIndicator({ label, value, angle, delay }) {
  const rad = (angle * Math.PI) / 180
  // Position along ellipse (wider horizontally)
  const ex = Math.cos(rad) * 165
  const ey = Math.sin(rad) * 130
  return (
    <motion.div
      className="why__tech-node"
      style={{ '--ex': `${ex}px`, '--ey': `${ey}px` }}
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.12 }}
    >
      <div className="why__tech-value">{value}</div>
      <div className="why__tech-label">{label}</div>
      {/* Connector line SVG */}
      <svg className="why__tech-line" viewBox="0 0 100 60" preserveAspectRatio="none">
        <line
          x1={angle > 180 ? '100' : '0'}
          y1="30"
          x2={angle > 180 ? '60' : '40'}
          y2="30"
          stroke="rgba(212,160,23,0.35)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
      </svg>
    </motion.div>
  )
}

/* ── Main Section ── */
export default function WhyFeline() {
  const { t } = useLanguage()
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.2 })

  const features = [
    {
      id: 'antiwear', icon: '🛡', color: '#D4A017',
      title: t('why.f1.title'), desc: t('why.f1.desc'),
      stat: '99.2%', statLabel: 'Wear Reduction'
    },
    {
      id: 'thermal', icon: '🌡', color: '#FF8C42',
      title: t('why.f2.title'), desc: t('why.f2.desc'),
      stat: '210°C', statLabel: 'Thermal Limit'
    },
    {
      id: 'clean', icon: '✦', color: '#4ECDC4',
      title: t('why.f3.title'), desc: t('why.f3.desc'),
      stat: 'A1', statLabel: 'Cleanliness Grade'
    },
    {
      id: 'sludge', icon: '⬡', color: '#95D44A',
      title: t('why.f4.title'), desc: t('why.f4.desc'),
      stat: '0 ppm', statLabel: 'Sludge Deposit'
    },
    {
      id: 'fuel', icon: '⚡', color: '#6C63FF',
      title: 'Fuel Efficiency', desc: 'Friction-optimised formula reduces fuel consumption by up to 3.5%.',
      stat: '3.5%+', statLabel: 'Fuel Saved'
    },
    {
      id: 'drain', icon: '⏱', color: '#FF6B9D',
      title: 'Long Drain Intervals', desc: 'Extended oil life technology keeps your engine protected 10,000 km longer.',
      stat: '10K km', statLabel: 'Drain Interval'
    },
  ]

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
  const fadeLeft = {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.25, 0.4, 0.25, 1] } }
  }

  return (
    <section className="why" ref={sectionRef}>
      {/* Watermark */}
      <div className="why__bg-text">FELINE</div>

      {/* Section ambience glow */}
      <div className="why__ambient" />

      <div className="why__inner">

        {/* ── LEFT: Features ── */}
        <div className="why__content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label">{t('why.label')}</div>
            <h2 className="section-title">
              {t('why.title')} <span className="gold-text">{t('why.titleGold')}</span>
            </h2>
            <p className="section-subtitle">{t('why.subtitle')}</p>
          </motion.div>

          <motion.div
            className="why__features"
            variants={stagger}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {features.map((f) => (
              <motion.div key={f.id} className="why__feature" variants={fadeLeft}>
                {/* Accent bar */}
                <div className="why__feature-accent" style={{ '--accent': f.color }} />

                <div className="why__feature-body">
                  <div className="why__feature-top">
                    <div className="why__feature-title">{f.title}</div>
                    <div className="why__feature-stat" style={{ color: f.color }}>
                      <span className="why__feature-stat-val">{f.stat}</span>
                      <span className="why__feature-stat-lbl">{f.statLabel}</span>
                    </div>
                  </div>
                  <p className="why__feature-desc">{f.desc}</p>

                  {/* Progress bar */}
                  <div className="why__feature-bar-track">
                    <motion.div
                      className="why__feature-bar-fill"
                      style={{ '--bar-color': f.color }}
                      initial={{ scaleX: 0 }}
                      animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT: Immersive Tech Showcase ── */}
        <motion.div
          className="why__visual"
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <div className="why__showcase">
            <ParticleCanvas />

            {/* Orbiting ring */}
            <motion.div
              className="why__orbit-ring why__orbit-ring--1"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="why__orbit-ring why__orbit-ring--2"
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            />
            <div className="why__orbit-ring why__orbit-ring--3" />

            {/* Central glow */}
            <div className="why__core-glow" />

            {/* Premium Oil Container — central visual */}
            <motion.div
              className="why__container-wrap"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Container body SVG */}
              <svg
                className="why__container-svg"
                viewBox="0 0 200 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1A1A1A" />
                    <stop offset="40%" stopColor="#0D0D0D" />
                    <stop offset="100%" stopColor="#050505" />
                  </linearGradient>
                  <linearGradient id="bandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A87C10" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#F0C040" />
                    <stop offset="100%" stopColor="#A87C10" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient id="shineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                    <stop offset="35%" stopColor="rgba(255,255,255,0.08)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                  <radialGradient id="topGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#2A2A2A" />
                    <stop offset="100%" stopColor="#0A0A0A" />
                  </radialGradient>
                  <filter id="outerGlow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="goldGlow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Main barrel body */}
                <rect x="24" y="44" width="152" height="224" rx="10" fill="url(#bodyGrad)" />

                {/* Side shine */}
                <rect x="24" y="44" width="152" height="224" rx="10" fill="url(#shineGrad)" />

                {/* Gold accent bands */}
                <rect x="24" y="82" width="152" height="7" fill="url(#bandGrad)" filter="url(#goldGlow)" />
                <rect x="24" y="216" width="152" height="7" fill="url(#bandGrad)" filter="url(#goldGlow)" />

                {/* Thin stripe lines */}
                <rect x="24" y="94" width="152" height="1.5" fill="rgba(212,160,23,0.15)" />
                <rect x="24" y="210" width="152" height="1.5" fill="rgba(212,160,23,0.15)" />

                {/* Logo area (glowing rectangle) */}
                <rect x="44" y="118" width="112" height="72" rx="6" fill="rgba(212,160,23,0.06)" stroke="rgba(212,160,23,0.3)" strokeWidth="1" />

                {/* Feline cat-ear silhouette */}
                <path
                  d="M82 142 L90 128 L98 142 M102 142 L110 128 L118 142"
                  stroke="#D4A017"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#goldGlow)"
                />

                {/* FELINE text lines */}
                <rect x="60" y="150" width="80" height="4" rx="2" fill="rgba(212,160,23,0.7)" filter="url(#goldGlow)" />
                <rect x="72" y="160" width="56" height="2.5" rx="1.25" fill="rgba(212,160,23,0.4)" />
                <rect x="76" y="168" width="48" height="2" rx="1" fill="rgba(212,160,23,0.25)" />

                {/* Barrel top ellipse */}
                <ellipse cx="100" cy="44" rx="76" ry="16" fill="url(#topGrad)" stroke="rgba(212,160,23,0.25)" strokeWidth="1.5" />
                <ellipse cx="100" cy="44" rx="58" ry="10" fill="rgba(212,160,23,0.04)" stroke="rgba(212,160,23,0.15)" strokeWidth="1" />

                {/* Nozzle */}
                <rect x="82" y="30" width="36" height="16" rx="4" fill="#111111" stroke="rgba(212,160,23,0.3)" strokeWidth="1" />
                <rect x="88" y="24" width="24" height="10" rx="3" fill="#0D0D0D" stroke="rgba(212,160,23,0.4)" strokeWidth="1" />
                <ellipse cx="100" cy="24" rx="8" ry="4" fill="rgba(212,160,23,0.15)" stroke="rgba(212,160,23,0.6)" strokeWidth="1.5" filter="url(#goldGlow)" />

                {/* Bottom ellipse */}
                <ellipse cx="100" cy="268" rx="76" ry="12" fill="#050505" stroke="rgba(212,160,23,0.15)" strokeWidth="1" />

                {/* Rivets */}
                {[36, 164].map(x => [72, 225].map(y => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#1A1A1A" stroke="rgba(212,160,23,0.4)" strokeWidth="1" />
                )))}

                {/* Oil flow glow lines (animated via CSS) */}
                <path d="M100 268 Q100 280 85 285" stroke="rgba(212,160,23,0.3)" strokeWidth="1.5" className="why__oil-drip" />
              </svg>

              {/* Animated oil flow dots */}
              <div className="why__oil-flow">
                {[0, 1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    className="why__oil-dot"
                    animate={{ y: [0, 40], opacity: [0, 0.8, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.45, ease: 'easeIn' }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Tech indicator nodes */}
            {TECH_NODES.map((node, i) => (
              <TechIndicator key={node.id} {...node} delay={0.3 + i * 0.1} />
            ))}

            {/* Bottom certification badges */}
            <div className="why__certs">
              {['API SN', 'ISO 9001', 'SAE 5W-40'].map(cert => (
                <div key={cert} className="why__cert-badge">
                  <span className="why__cert-dot" />
                  {cert}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
