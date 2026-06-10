import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineEyeOff, HiOutlineStar, HiRefresh, HiX, HiSearch, HiFilter } from 'react-icons/hi'
import API_BASE, { adminAuthHeaders } from '../api'
import '../styles/Admin.css'

const categories = ['Engine Oils', 'Gear Oils', 'Hydraulic Oils', 'Bulk Oils'];

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [filterStock, setFilterStock] = useState('All')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const initialForm = {
    name: '',
    slug: '',
    description: '',
    shortDesc: '',
    category: 'Engine Oils',
    apiRating: '',
    viscosity: '',
    price: 0,
    stock: 0,
    isFeatured: false,
    variants: [],
    specs: [],
    features: [],
    restockDate: ''
  }
  const [formData, setFormData] = useState(initialForm)
  const [imageFile, setImageFile] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/products/admin/all`, {
        headers: adminAuthHeaders()
      })
      if (!res.ok) throw new Error('Failed to fetch inventory')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return
    try {
      const res = await fetch(`${API_BASE}/products/admin/${id}`, {
        method: 'DELETE',
        headers: adminAuthHeaders()
      })
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id))
      }
    } catch (err) {
      alert('Failed to delete product')
    }
  }

  const openModal = (product = null) => {
    if (product) {
      setEditingId(product.id)
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        shortDesc: product.shortDesc || '',
        category: product.category || 'Engine Oils',
        apiRating: product.apiRating || '',
        viscosity: product.viscosity || '',
        price: product.price || 0,
        stock: product.stock || 0,
        isFeatured: product.isFeatured || false,
        variants: product.variants || [],
        specs: Array.isArray(product.specs) ? product.specs : [],
        features: product.features || [],
        restockDate: product.restockDate ? product.restockDate.split('T')[0] : ''
      })
    } else {
      setEditingId(null)
      setFormData(initialForm)
    }
    setImageFile(null)
    setPdfFile(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormData(initialForm)
    setImageFile(null)
    setPdfFile(null)
    setEditingId(null)
  }

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants]
    newVariants[index][field] = value
    setFormData({ ...formData, variants: newVariants })
  }

  const addVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { size: '', price: 0, stock: 0 }] })
  }

  const removeVariant = (index) => {
    setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== index) })
  }

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specs]
    newSpecs[index][field] = value
    setFormData({ ...formData, specs: newSpecs })
  }

  const addSpec = () => {
    setFormData({ ...formData, specs: [...formData.specs, { label: '', value: '' }] })
  }

  const removeSpec = (index) => {
    setFormData({ ...formData, specs: formData.specs.filter((_, i) => i !== index) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const data = new FormData()
    data.append('name', formData.name)
    data.append('slug', formData.slug)
    data.append('description', formData.description)
    data.append('shortDesc', formData.shortDesc)
    data.append('category', formData.category)
    data.append('apiRating', formData.apiRating)
    data.append('viscosity', formData.viscosity)
    data.append('price', formData.price)
    data.append('stock', formData.stock)
    data.append('isFeatured', formData.isFeatured)
    data.append('variants', JSON.stringify(formData.variants))
    data.append('specs', JSON.stringify(formData.specs))
    data.append('features', JSON.stringify(formData.features))
    if (formData.restockDate) {
      data.append('restockDate', formData.restockDate)
    }
    
    if (imageFile) data.append('image', imageFile)
    if (pdfFile) data.append('pdf', pdfFile)

    try {
      const url = editingId ? `${API_BASE}/products/admin/${editingId}` : `${API_BASE}/products/admin`
      const method = editingId ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: adminAuthHeaders(true),
        body: data
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to save product')
      }

      await fetchProducts()
      closeModal()
    } catch (err) {
      alert(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.slug.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCat = filterCat === 'All' || p.category === filterCat
      
      let matchesStock = true;
      const totalStock = p.variants && p.variants.length > 0 
        ? p.variants.reduce((acc, v) => acc + parseInt(v.stock), 0) 
        : p.stock;

      if (filterStock === 'Low Stock') matchesStock = totalStock > 0 && totalStock <= 10;
      if (filterStock === 'Out of Stock') matchesStock = totalStock === 0;

      return matchesSearch && matchesCat && matchesStock
    })
  }, [products, searchTerm, filterCat, filterStock])

  return (
    <div className="admin-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Product Management</h1>
          <p style={{ color: 'var(--admin-text-dim)', fontSize: '0.9rem' }}>Manage your catalog, variants, and inventory.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '0 0.5rem', border: '1px solid var(--admin-border)' }}>
            <HiSearch style={{ color: 'var(--admin-text-dim)' }} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', padding: '0.5rem', outline: 'none' }}
            />
          </div>

          <select 
            value={filterCat} 
            onChange={(e) => setFilterCat(e.target.value)}
            style={{ background: 'var(--color-bg)', border: '1px solid var(--admin-border)', color: '#fff', padding: '0.5rem', borderRadius: '4px', outline: 'none' }}
          >
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            value={filterStock} 
            onChange={(e) => setFilterStock(e.target.value)}
            style={{ background: 'var(--color-bg)', border: '1px solid var(--admin-border)', color: '#fff', padding: '0.5rem', borderRadius: '4px', outline: 'none' }}
          >
            <option value="All">All Stock Levels</option>
            <option value="Low Stock">Low Stock (&le; 10)</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <button className="btn btn-secondary" onClick={fetchProducts} style={{ padding: '0.5rem 0.75rem' }} title="Refresh">
            <HiRefresh />
          </button>
          <button className="btn btn-primary" onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <HiOutlinePlus /> Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Syncing database...</div>
      ) : error ? (
        <div className="admin-error-card">
          <h3>Connection Failed</h3>
          <p>{error}</p>
          <button onClick={fetchProducts} className="btn-retry">Retry Connection</button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="admin-error-card" style={{ textAlign: 'center' }}>
          <h3>No Products Found</h3>
          <p>Try adjusting your filters or search.</p>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: '0' }}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Base Price</th>
                  <th>Total Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(prod => {
                  const totalStock = prod.variants && prod.variants.length > 0 ? prod.variants.reduce((acc, v) => acc + parseInt(v.stock), 0) : prod.stock
                  return (
                    <tr key={prod.id}>
                      <td>
                        {prod.image ? (
                          <img src={`http://localhost:5000${prod.image}`} alt={prod.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', background: '#1a1a1a', borderRadius: '4px', border: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--color-gold)' }}>
                            {prod.viscosity}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{prod.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-dim)' }}>{prod.apiRating}</div>
                      </td>
                      <td>{prod.category}</td>
                      <td style={{ fontWeight: '600' }}>RM {prod.price.toFixed(2)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: totalStock > 10 ? 'var(--admin-success)' : totalStock > 0 ? 'var(--color-gold)' : 'var(--admin-error)' }}></div>
                          {totalStock} Units
                        </div>
                        {totalStock === 0 && prod.restockDate && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)', marginTop: '0.25rem' }}>
                            Restock: {new Date(prod.restockDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`admin-badge ${
                          prod.status === 'ACTIVE' ? 'admin-badge--success' : 
                          prod.status === 'SOLD_OUT' ? 'admin-badge--error' : 
                          'admin-badge--warning'
                        }`}>
                          {prod.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="admin-sidebar__item" onClick={() => openModal(prod)} style={{ padding: '0.4rem', border: '1px solid var(--admin-border)' }} title="Edit"><HiOutlinePencilAlt /></button>
                          <button 
                            className="admin-sidebar__item" 
                            style={{ padding: '0.4rem', border: '1px solid var(--admin-border)', color: prod.isFeatured ? 'var(--color-gold)' : 'inherit' }} 
                            title="Feature"
                          >
                            <HiOutlineStar />
                          </button>
                          <button className="admin-sidebar__item" style={{ padding: '0.4rem', border: '1px solid var(--admin-border)' }} title="Hide"><HiOutlineEyeOff /></button>
                          <button 
                            className="admin-sidebar__item" 
                            style={{ padding: '0.4rem', border: '1px solid var(--admin-border)', color: 'var(--admin-error)' }} 
                            title="Delete"
                            onClick={() => handleDelete(prod.id)}
                          >
                            <HiOutlineTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="cart-drawer-overlay" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <motion.div 
              className="admin-card"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={closeModal} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}><HiX /></button>
              
              <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="auth-form-group">
                    <label>Product Name</label>
                    <input className="auth-input" type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="auth-form-group">
                    <label>Slug (URL)</label>
                    <input className="auth-input" type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                  <div className="auth-form-group">
                    <label>Category</label>
                    <select className="auth-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="auth-form-group">
                    <label>API Rating</label>
                    <input className="auth-input" type="text" value={formData.apiRating} onChange={e => setFormData({...formData, apiRating: e.target.value})} />
                  </div>
                  <div className="auth-form-group">
                    <label>Viscosity (e.g. 5W-40)</label>
                    <input className="auth-input" type="text" value={formData.viscosity} onChange={e => setFormData({...formData, viscosity: e.target.value})} />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>Short Description</label>
                  <input className="auth-input" type="text" value={formData.shortDesc} onChange={e => setFormData({...formData, shortDesc: e.target.value})} />
                </div>

                <div className="auth-form-group">
                  <label>Full Description</label>
                  <textarea className="auth-input" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                  <div className="auth-form-group">
                    <label>Base Price (RM)</label>
                    <input className="auth-input" type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                  </div>
                  <div className="auth-form-group">
                    <label>Base Stock</label>
                    <input className="auth-input" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                  </div>
                  <div className="auth-form-group">
                    <label>Restock Date</label>
                    <input className="auth-input" type="date" value={formData.restockDate} onChange={e => setFormData({...formData, restockDate: e.target.value})} />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="auth-form-group">
                    <label>Product Image</label>
                    <input className="auth-input" type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ padding: '0.6rem' }} />
                  </div>
                  <div className="auth-form-group">
                    <label>Datasheet PDF</label>
                    <input className="auth-input" type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])} style={{ padding: '0.6rem' }} />
                  </div>
                </div>

                {/* Variants Section */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--color-gold)' }}>Packaging Variants</h3>
                    <button type="button" className="btn btn-secondary" onClick={addVariant} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>+ Add Variant</button>
                  </div>
                  
                  {formData.variants.map((v, index) => (
                    <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
                      <div className="auth-form-group" style={{ flex: 1 }}>
                        <label>Size (e.g. 4L)</label>
                        <input className="auth-input" type="text" value={v.size} onChange={e => handleVariantChange(index, 'size', e.target.value)} />
                      </div>
                      <div className="auth-form-group" style={{ flex: 1 }}>
                        <label>Price (RM)</label>
                        <input className="auth-input" type="number" step="0.01" value={v.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} />
                      </div>
                      <div className="auth-form-group" style={{ flex: 1 }}>
                        <label>Stock</label>
                        <input className="auth-input" type="number" value={v.stock} onChange={e => handleVariantChange(index, 'stock', e.target.value)} />
                      </div>
                      <button type="button" onClick={() => removeVariant(index)} style={{ padding: '0.8rem', background: 'rgba(255,0,0,0.2)', color: '#ff4d4d', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        <HiOutlineTrash />
                      </button>
                    </div>
                  ))}
                  {formData.variants.length === 0 && <p style={{ fontSize: '0.9rem', color: 'var(--admin-text-dim)' }}>No variants added. Will use base price and stock.</p>}
                </div>

                {/* Specs Section */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--color-gold)' }}>Technical Specs</h3>
                    <button type="button" className="btn btn-secondary" onClick={addSpec} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>+ Add Spec</button>
                  </div>
                  
                  {formData.specs.map((s, index) => (
                    <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
                      <div className="auth-form-group" style={{ flex: 1 }}>
                        <label>Label</label>
                        <input className="auth-input" type="text" value={s.label} onChange={e => handleSpecChange(index, 'label', e.target.value)} />
                      </div>
                      <div className="auth-form-group" style={{ flex: 2 }}>
                        <label>Value</label>
                        <input className="auth-input" type="text" value={s.value} onChange={e => handleSpecChange(index, 'value', e.target.value)} />
                      </div>
                      <button type="button" onClick={() => removeSpec(index)} style={{ padding: '0.8rem', background: 'rgba(255,0,0,0.2)', color: '#ff4d4d', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        <HiOutlineTrash />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (editingId ? 'Update Product' : 'Create Product')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
