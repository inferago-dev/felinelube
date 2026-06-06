import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight, HiOutlineInformationCircle } from 'react-icons/hi'
import { products } from '../data/productData'
import { useLanguage } from '../context/LanguageContext'
import OilCan from '../components/OilCan'
import '../sections/FeaturedProducts.css'

export default function FeaturedProducts() {
  const { t, lang } = useLanguage()
  const navigate = useNavigate()

  const getProductSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }

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

        <div className="featured__grid">
          {products.map((product, i) => (
            <motion.div 
              key={product.id}
              className="product-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              onClick={() => navigate(`/product/${getProductSlug(product.name)}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="product-card__visual">
                <div className="product-card__can">
                  <OilCan 
                    accent={product.color} 
                    label={product.imageLabel} 
                    viscosity={product.viscosity} 
                    size={180} 
                  />
                </div>
                <div className="product-card__grade">{product.category}</div>
              </div>

              <div className="product-card__info">
                <div className="product-card__api">{product.api}</div>
                <h3 className="product-card__name">{product.name}</h3>
                <p className="product-card__desc">{product.description}</p>
                
                <div className="product-card__footer">
                  <span className="product-card__type">{product.viscosity}</span>
                  <button className="product-card__btn" onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/product/${getProductSlug(product.name)}`)
                  }}>
                    {t('products.viewDetails')} <HiArrowRight />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>
            {lang === 'en' ? 'Go to Marketplace' : 'Ke Pasaran Jualan'} <HiArrowRight />
          </button>
        </div>
      </div>
    </section>
  )
}
