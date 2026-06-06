import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiSearch, HiFilter, HiShoppingCart, HiArrowRight, HiChevronDown, HiRefresh } from 'react-icons/hi'
import { useLanguage } from '../context/LanguageContext'
import OilCan from '../components/OilCan'
import '../styles/Shop.css'

const categories = ['All', 'Fully Synthetic', 'Semi Synthetic', 'Mineral', 'Heavy Duty', 'Industrial', 'Motorcycle']

export default function Shop({ setView }) {
  const { t, lang } = useLanguage()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('All')
  const [sortBy, setSortBy] = useState('Newest')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Fetch Live Products from Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await fetch('https://felinelube-production.up.railway.app/api/products')
        if (!res.ok) throw new Error('Failed to fetch products')
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        console.error('Fetch Error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
        const matchesCat = activeCat === 'All' || p.category === activeCat
        return matchesSearch && matchesCat
      })
      .sort((a, b) => {
        if (sortBy === 'Price: Low to High') return a.price - b.price
        if (sortBy === 'Price: High to Low') return b.price - a.price
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
  }, [products, search, activeCat, sortBy])

  // Map backend data to OilCan props
  const getOilCanProps = (product) => {
    const colorMap = {
      'Fully Synthetic': '#D4A017',
      'Semi Synthetic': '#9A9A9A',
      'Heavy Duty': '#1E1E1E',
      'Industrial': '#444'
    }
    return {
      accent: colorMap[product.category] || '#D4A017',
      label: 'FELINE',
      viscosity: product.viscosity,
      size: 180
    }
  }

  return (
    <div className="shop-page">
      <section className="shop-header">
        <div className="container">
          <div className="section-label">{t('nav.products')}</div>
          <h1 className="section-title">{lang === 'en' ? 'Feline Marketplace' : 'Pasaran Feline'}</h1>
          <p className="section-subtitle">
            {lang === 'en' 
              ? 'Explore our complete range of industrial-grade lubricants engineered for maximum performance.' 
              : 'Terokai rangkaian lengkap pelincir gred industri kami yang direka untuk prestasi maksimum.'}
          </p>
        </div>
      </section>

      <div className="container">
        <div className="shop-controls">
          <div className="search-bar">
            <HiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder={lang === 'en' ? 'Search products...' : 'Cari produk...'} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="shop-actions">
            <div className="sort-dropdown">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <HiChevronDown className="select-icon" />
            </div>
            
            <button className="filter-toggle" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <HiFilter /> <span>{lang === 'en' ? 'Categories' : 'Kategori'}</span>
            </button>
          </div>
        </div>

        <div className="shop-layout">
          <aside className={`shop-sidebar ${isFilterOpen ? 'open' : ''}`}>
            <h3 className="sidebar-title">{lang === 'en' ? 'Filter by Category' : 'Tapis mengikut Kategori'}</h3>
            <div className="cat-list">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`cat-item ${activeCat === cat ? 'active' : ''}`}
                  onClick={() => setActiveCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          <main className="shop-grid">
            {loading ? (
              <div className="shop-loading">
                <HiRefresh className="spin" />
                <p>Syncing Marketplace...</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, i) => (
                  <motion.div 
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="product-card"
                    onClick={() => setView('details')}
                  >
                    <div className="product-card__visual">
                      <div className="product-card__can">
                        <OilCan {...getOilCanProps(product)} />
                      </div>
                      <div className="product-card__grade">{product.category}</div>
                    </div>

                    <div className="product-card__info">
                      <div className="product-card__api">{product.apiRating}</div>
                      <h3 className="product-card__name">{product.name}</h3>
                      <div className="product-card__price">RM {product.price.toFixed(2)}</div>
                      
                      <div className="product-card__actions">
                        <button className="btn-cart"><HiShoppingCart /> {t('products.addToCart')}</button>
                        <button className="btn-details" onClick={() => setView('details')}>
                          <HiArrowRight />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="no-results">
                <h3>{lang === 'en' ? 'No products found' : 'Tiada produk dijumpai'}</h3>
                <p>{lang === 'en' ? 'Try adjusting your filters or search' : 'Cuba tukar penapis atau carian anda'}</p>
              </div>
            )}
            
            {error && (
              <div className="no-results error">
                <h3>Connection Error</h3>
                <p>Could not connect to the backend server. Make sure it is running.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
