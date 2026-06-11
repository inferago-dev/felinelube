import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight, HiOutlineInformationCircle } from 'react-icons/hi'
import { useLanguage } from '../context/LanguageContext'
import OilCan from '../components/OilCan'
import API_BASE, { SERVER_BASE } from '../api'
import '../sections/FeaturedProducts.css'

export default function FeaturedProducts() {
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE}/products?limit=8`)
        if (res.ok) {
          const json = await res.json()
          const prods = json.data || (Array.isArray(json) ? json : [])
          const featured = prods.filter(p => p.isFeatured).slice(0, 4)
          setFeaturedProducts(featured.length > 0 ? featured : prods.slice(0, 3))
        }
      } catch (err) {
        console.error('Failed to fetch featured products', err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <section className="featured" id="products">
      <div className="container">
        <div className="featured__header">
          <div className="section-label">{t('products.label')}</div>
          <h2 className="section-title">
            {lang === 'en' ? 'Our Complete' : 'Rangkaian'} <span className="gold-text">{lang === 'en' ? 'Product Range' : 'Produk Lengkap'}</span>
          </h2>
          <p className="section-subtitle" style={{ maxWidth: '700px', margin: '1rem auto' }}>
            {lang === 'en' 
              ? 'Discover our full spectrum of high-performance lubricants, from fully synthetic racing oils to heavy-duty industrial solutions.' 
              : 'Temui spektrum penuh pelincir berprestasi tinggi kami, dari minyak perlumbaan sintetik penuh hingga penyelesaian industri tugas berat.'}
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading featured products...</div>
        ) : (
          <div className="featured__grid">
            {featuredProducts.map((product, i) => (
              <motion.div 
                key={product.id}
                className="product-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                onClick={() => navigate(`/product/${product.slug}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-card__visual">
                  <div className="product-card__can" style={{ background: 'var(--color-bg)', padding: '1rem', borderRadius: '8px' }}>
                    {product.image ? (
                      <img 
                        src={`${SERVER_BASE}${product.image}`} 
                        alt={`${product.name} — ${product.grade || product.category}`} 
                        onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-product.png'; }}
                        style={{ width: '100%', height: '200px', objectFit: 'contain' }} 
                      />
                    ) : (
                      <OilCan 
                        accent="#D4A017" 
                        label="FELINE" 
                        viscosity={product.viscosity} 
                        size={180} 
                      />
                    )}
                  </div>
                  <div className="product-card__grade">{product.category}</div>
                </div>

                <div className="product-card__info">
                  <div className="product-card__api">{product.apiRating}</div>
                  <h3 className="product-card__name">{product.name}</h3>
                  <p className="product-card__desc" style={{ 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden' 
                  }}>{product.shortDesc || product.description}</p>
                  
                  <div className="product-card__footer">
                    <span className="product-card__type">{product.viscosity}</span>
                    <button className="product-card__btn" onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/product/${product.slug}`)
                    }}>
                      {t('products.viewDetails')} <HiArrowRight />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>
            {lang === 'en' ? 'Go to Marketplace' : 'Ke Pasaran Jualan'} <HiArrowRight />
          </button>
        </div>
      </div>
    </section>
  )
}
