import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiShoppingCart, HiCheckCircle } from 'react-icons/hi'
import { TbShieldCheck, TbFlame, TbDroplet, TbBolt, TbTruck, TbClock } from 'react-icons/tb'
import { products } from '../data/productData'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import OilCan from '../components/OilCan'
import '../styles/ProductDetails.css'
import FeaturedProducts from './FeaturedProducts'

const ProductDetails = () => {
  const { slug } = useParams()
  const { t, lang } = useLanguage()
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)
  
  // Find dynamic product by slug or id
  const productData = products.find(p => {
    const pSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return pSlug === slug || p.id.toString() === slug
  }) || products[0]

  const [selectedPkg, setSelectedPkg] = useState('4L')
  
  // When product changes, reset to 4L if it exists, else first variant
  useEffect(() => {
    if (productData.variants) {
      const has4L = productData.variants.some(v => v.size === '4L')
      setSelectedPkg(has4L ? '4L' : productData.variants[0].size)
    }
  }, [productData])

  const selectedVariant = productData.variants?.find(v => v.size === selectedPkg) || { size: '4L', price: productData.price, stock: 100 }

  const benefits = [
    { icon: <TbShieldCheck />, title: t('why.f1.title'), desc: t('why.f1.desc') },
    { icon: <TbFlame />, title: t('why.f2.title'), desc: t('why.f2.desc') },
    { icon: <TbDroplet />, title: t('why.f3.title'), desc: t('why.f3.desc') },
    { icon: <TbBolt />, title: t('why.f4.title'), desc: t('why.f4.desc') },
    { icon: <TbTruck />, title: t('why.f5.title'), desc: t('why.f5.desc') },
    { icon: <TbClock />, title: t('why.f6.title'), desc: t('why.f6.desc') },
  ]

  const handleAddToCart = () => {
    addToCart(productData, selectedVariant, qty);
  }

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
            <OilCan label={productData.imageLabel} viscosity={productData.viscosity} color={productData.color} size={320} />
          </div>
          <div className="prod-gallery__thumbs">
            {[1, 2, 3].map(i => (
              <div key={i} className={`prod-gallery__thumb ${i === 1 ? 'active' : ''}`}>
                <OilCan label={productData.imageLabel} viscosity={productData.viscosity} color={productData.color} size={60} />
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
          <div className="prod-info__cat">{productData.category}</div>
          <h1 className="prod-info__name">{productData.name}</h1>
          <div className="prod-info__api">{productData.api}</div>
          <div className="prod-info__price">RM {selectedVariant.price.toFixed(2)}</div>
          <p className="prod-info__desc">{productData.description}</p>
          
          <div className="prod-info__actions">
            <div className="prod-info__qty">
              <span className="specs-label">{lang === 'en' ? 'Quantity' : 'Kuantiti'}:</span>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <div className="qty-val">{qty}</div>
                <button className="qty-btn" onClick={() => setQty(Math.min(selectedVariant.stock, qty + 1))} disabled={qty >= selectedVariant.stock}>+</button>
              </div>
            </div>

            <div className="prod-info__btns">
              <button 
                className="btn btn-primary" 
                onClick={handleAddToCart}
                disabled={selectedVariant.stock === 0}
              >
                {selectedVariant.stock === 0 ? 'Out of Stock' : t('products.addToCart')} <HiShoppingCart />
              </button>
              <button className="btn btn-secondary">{t('products.buyNow')}</button>
            </div>
            
            <div className="about__highlight" style={{ fontSize: '0.8rem' }}>
              <HiCheckCircle style={{ color: selectedVariant.stock > 0 ? '#25D366' : '#FF4D4D' }} /> 
              {selectedVariant.stock > 10 ? (lang === 'en' ? 'In Stock' : 'Ada Stok') : 
               selectedVariant.stock > 0 ? `Low Stock (${selectedVariant.stock} left)` : 
               'Out of Stock'} — {lang === 'en' ? 'Free Shipping in Malaysia' : 'Penghantaran Percuma di Malaysia'}
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
          {productData.variants?.map(v => (
            <div 
              key={v.size} 
              className={`pkg-card ${selectedPkg === v.size ? 'active' : ''} ${v.stock === 0 ? 'out-of-stock' : ''}`}
              onClick={() => {
                if (v.stock > 0) {
                  setSelectedPkg(v.size);
                  setQty(1);
                }
              }}
              style={{ opacity: v.stock === 0 ? 0.5 : 1, cursor: v.stock === 0 ? 'not-allowed' : 'pointer' }}
            >
              <div className="pkg-val">{v.size}</div>
              <div className="pkg-label" style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>RM {v.price}</div>
              {v.stock === 0 && <div style={{ fontSize: '0.8rem', color: '#ff4d4d', marginTop: '0.5rem' }}>Out of Stock</div>}
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
            <button className="btn btn-primary" onClick={handleAddToCart} disabled={selectedVariant.stock === 0}>
              {selectedVariant.stock === 0 ? 'Out of Stock' : t('products.addToCart')} <HiShoppingCart />
            </button>
            <button className="btn btn-secondary">{t('categories.explore')}</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductDetails
