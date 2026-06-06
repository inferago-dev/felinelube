import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiShoppingCart, HiCheckCircle } from 'react-icons/hi'
import { TbShieldCheck, TbFlame, TbDroplet, TbBolt, TbTruck, TbClock } from 'react-icons/tb'
import { productData } from '../data/productData'
import { useLanguage } from '../context/LanguageContext'
import OilCan from '../components/OilCan'
import '../styles/ProductDetails.css'
import FeaturedProducts from './FeaturedProducts'

const ProductDetails = () => {
  const { t, lang } = useLanguage()
  const [qty, setQty] = useState(1)
  const [selectedPkg, setSelectedPkg] = useState('4L')

  const benefits = [
    { icon: <TbShieldCheck />, title: t('why.f1.title'), desc: t('why.f1.desc') },
    { icon: <TbFlame />, title: t('why.f2.title'), desc: t('why.f2.desc') },
    { icon: <TbDroplet />, title: t('why.f3.title'), desc: t('why.f3.desc') },
    { icon: <TbBolt />, title: t('why.f4.title'), desc: t('why.f4.desc') },
    { icon: <TbTruck />, title: t('why.f5.title'), desc: t('why.f5.desc') },
    { icon: <TbClock />, title: t('why.f6.title'), desc: t('why.f6.desc') },
  ]

  return (
    <div className="product-page">
      {/* 2. Hero Section */}
      <section className="prod-hero">
        <motion.div 
          className="prod-gallery"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="prod-gallery__main">
            <OilCan label="FULLY SYNTHETIC" viscosity="5W-40" size={320} />
          </div>
          <div className="prod-gallery__thumbs">
            {[1, 2, 3].map(i => (
              <div key={i} className={`prod-gallery__thumb ${i === 1 ? 'active' : ''}`}>
                <OilCan label="FULLY SYNTHETIC" viscosity="5W-40" size={60} />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="prod-info"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="prod-info__cat">{lang === 'en' ? productData.category : 'Minyak Enjin Sintetik Penuh'}</div>
          <h1 className="prod-info__name">{productData.name}</h1>
          <div className="prod-info__api">{productData.api}</div>
          <div className="prod-info__price">RM {productData.price.toFixed(2)}</div>
          <p className="prod-info__desc">{lang === 'en' ? productData.description : 'Feline F45 adalah minyak enjin sintetik penuh berprestasi tinggi yang direka untuk memberikan perlindungan dan kecekapan maksimum untuk enjin moden.'}</p>
          
          <div className="prod-info__actions">
            <div className="prod-info__qty">
              <span className="specs-label">{lang === 'en' ? 'Quantity' : 'Kuantiti'}:</span>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <div className="qty-val">{qty}</div>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
              </div>
            </div>

            <div className="prod-info__btns">
              <button className="btn btn-primary">{t('products.addToCart')} <HiShoppingCart /></button>
              <button className="btn btn-secondary">{t('products.buyNow')}</button>
            </div>
            
            <div className="about__highlight" style={{ fontSize: '0.8rem' }}>
              <HiCheckCircle style={{ color: '#25D366' }} /> {lang === 'en' ? 'In Stock' : 'Ada Stok'} — {lang === 'en' ? 'Free Shipping in Malaysia' : 'Penghantaran Percuma di Malaysia'}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Specs Table */}
      <section className="prod-specs">
        <div className="section-label" style={{ justifyContent: 'center' }}>Engineering</div>
        <h2 className="section-title" style={{ textAlign: 'center' }}>{t('products.specs')}</h2>
        
        <motion.div 
          className="specs-table"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {productData.specs.map(spec => (
            <div key={spec.label} className="specs-row">
              <span className="specs-label">{spec.label}</span>
              <span className="specs-value">{spec.value}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* 4. Performance Benefits */}
      <section className="why">
        <div className="section-label" style={{ justifyContent: 'center' }}>Performance</div>
        <h2 className="section-title" style={{ textAlign: 'center' }}>{lang === 'en' ? 'Product Benefits' : 'Kelebihan Produk'}</h2>
        <div className="trust__grid" style={{ maxWidth: '1280px', margin: '3rem auto 0' }}>
          {benefits.map((b, i) => (
            <motion.div 
              key={b.title} 
              className="trust__card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="trust__icon-wrap">{b.icon}</div>
              <div className="trust__title">{b.title}</div>
              <p className="trust__desc">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. Packaging Options */}
      <section className="prod-packaging">
        <div className="section-label" style={{ justifyContent: 'center' }}>Packaging</div>
        <h2 className="section-title" style={{ textAlign: 'center' }}>{t('products.packaging')}</h2>
        <div className="pkg-grid">
          {['1L', '4L', '5L', '18L', '200L'].map(pkg => (
            <div 
              key={pkg} 
              className={`pkg-card ${selectedPkg === pkg ? 'active' : ''}`}
              onClick={() => setSelectedPkg(pkg)}
            >
              <div className="pkg-val">{pkg}</div>
              <div className="pkg-label">{lang === 'en' ? 'Genuine Pack' : 'Pek Tulen'}</div>
            </div>
          ))}
        </div>
      </section>

      <FeaturedProducts />

      <section className="cta">
        <div className="cta__container">
          <h2 className="cta__heading">{t('hero.title')} <br /><span className="gold-text">{t('hero.titleGold')}</span></h2>
          <p className="cta__subtext">{t('hero.desc')}</p>
          <div className="prod-info__btns" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary">{t('products.addToCart')} <HiShoppingCart /></button>
            <button className="btn btn-secondary">{t('categories.explore')}</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductDetails
