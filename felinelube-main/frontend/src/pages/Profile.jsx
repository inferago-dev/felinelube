import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineUser, HiOutlineMail, HiOutlineLogout, 
  HiOutlineShoppingBag, HiOutlineHeart, HiOutlineBell,
  HiOutlinePhone, HiOutlineLocationMarker, HiOutlineKey,
  HiOutlineTrash
} from 'react-icons/hi';
import OilCan from '../components/OilCan';
import API_BASE, { authHeaders } from '../api';
import '../styles/Profile.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Settings State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [updateMsg, setUpdateMsg] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);

  // Wishlist State (Local Storage)
  const [wishlist, setWishlist] = useState([]);

  // Notifications State
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!storedUser || !token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch User Profile & Notifications
        const profileRes = await fetch(`${API_BASE}/users/profile`, { headers: authHeaders() });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUser(profileData);
          setFormData({
            name: profileData.name || '',
            email: profileData.email || '',
            phone: profileData.phone || '',
            address: profileData.address || ''
          });
          
          // If no notifications from DB, add a dummy one
          if (profileData.notifications && profileData.notifications.length > 0) {
            setNotifications(profileData.notifications);
          } else {
            setNotifications([{ id: 'dummy1', title: 'Welcome to Feline Lube!', message: 'Thanks for joining. Keep an eye out for exclusive offers.', createdAt: new Date().toISOString() }]);
          }
        } else if ([401, 403, 404].includes(profileRes.status)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        // Fetch Orders
        const ordersRes = await fetch(`${API_BASE}/orders/myorders`, { headers: authHeaders() });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }

        // Load Wishlist from local storage
        const storedWishlist = JSON.parse(localStorage.getItem('feline_wishlist') || '[]');
        setWishlist(storedWishlist);

      } catch (err) {
        console.error('Error fetching profile data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateMsg('');
    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        localStorage.setItem('user', JSON.stringify({ id: updated.id, name: updated.name, email: updated.email }));
        setUpdateMsg('Profile updated successfully!');
        setTimeout(() => setUpdateMsg(''), 3000);
      } else {
        setUpdateMsg('Failed to update profile.');
      }
    } catch (err) {
      setUpdateMsg('Error updating profile.');
    }
  };

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('feline_wishlist', JSON.stringify(updated));
  };

  if (loading) {
    return <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <div className="profile-sidebar__header">
          <div className="profile-sidebar__avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-sidebar__info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="profile-sidebar__menu">
          <button className={`profile-sidebar__item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <HiOutlineUser className="profile-sidebar__item-icon" /> Profile Settings
          </button>
          <button className={`profile-sidebar__item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <HiOutlineShoppingBag className="profile-sidebar__item-icon" /> My Orders
          </button>
          <button className={`profile-sidebar__item ${activeTab === 'wishlist' ? 'active' : ''}`} onClick={() => setActiveTab('wishlist')}>
            <HiOutlineHeart className="profile-sidebar__item-icon" /> Wishlist
          </button>
          <button className={`profile-sidebar__item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
            <HiOutlineBell className="profile-sidebar__item-icon" /> Notifications
          </button>
          <button className="profile-sidebar__item" onClick={handleLogout} style={{ color: 'var(--color-error)' }}>
            <HiOutlineLogout className="profile-sidebar__item-icon" /> Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        <AnimatePresence mode="wait">
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2>Personal Information</h2>
              {updateMsg && <div style={{ marginBottom: '1rem', color: updateMsg.includes('Error') || updateMsg.includes('Failed') ? 'var(--color-error)' : 'var(--color-gold)' }}>{updateMsg}</div>}
              
              <form className="profile-form" onSubmit={handleUpdateProfile}>
                <div className="auth-form-group">
                  <label>Full Name</label>
                  <div className="auth-input-wrapper">
                    <HiOutlineUser className="auth-input-icon" />
                    <input type="text" className="auth-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>Email Address</label>
                  <div className="auth-input-wrapper">
                    <HiOutlineMail className="auth-input-icon" />
                    <input type="email" className="auth-input" value={formData.email} disabled style={{ opacity: 0.6 }} />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>Mobile Number</label>
                  <div className="auth-input-wrapper">
                    <HiOutlinePhone className="auth-input-icon" />
                    <input type="text" className="auth-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+60 12 345 6789" />
                  </div>
                </div>

                <div className="auth-form-group profile-form-full">
                  <label>Shipping Address</label>
                  <div className="auth-input-wrapper" style={{ height: 'auto' }}>
                    <HiOutlineLocationMarker className="auth-input-icon" style={{ top: '15px', transform: 'none' }} />
                    <textarea className="auth-input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={3} placeholder="Full delivery address" style={{ paddingLeft: '40px', paddingTop: '12px' }} />
                  </div>
                </div>

                <div className="profile-actions">
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Save Changes</button>
                  <button type="button" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem' }}>
                    <HiOutlineKey /> Change Password
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2>My Orders</h2>
              {orders.length === 0 ? (
                <p style={{ color: 'var(--admin-text-dim)' }}>You have no past orders.</p>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="profile-order-card">
                    <div className="profile-order-info">
                      <h4>{order.orderNumber}</h4>
                      <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p>Total: RM {order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`admin-badge admin-badge--${order.status === 'DELIVERED' ? 'success' : order.status === 'CANCELLED' ? 'error' : 'warning'}`}>
                        {order.status}
                      </span>
                      <div style={{ marginTop: '1rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>View Invoice</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'wishlist' && (
            <motion.div key="wishlist" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2>My Wishlist</h2>
              {wishlist.length === 0 ? (
                <p style={{ color: 'var(--admin-text-dim)' }}>Your wishlist is empty.</p>
              ) : (
                <div className="profile-wishlist-grid">
                  {wishlist.map(item => (
                    <div key={item.id} className="profile-wishlist-card">
                      <button className="profile-wishlist-remove" onClick={() => removeFromWishlist(item.id)} title="Remove">
                        <HiOutlineTrash />
                      </button>
                      <div style={{ height: '120px', marginBottom: '1rem' }}>
                        <OilCan color={item.slug?.includes('f45') ? '#d4a017' : '#039855'} width="80" />
                      </div>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{item.name}</h4>
                      <p style={{ color: 'var(--color-gold)', fontWeight: 'bold', marginBottom: '1rem' }}>RM {item.price}</p>
                      <button className="btn btn-primary" style={{ width: '100%', padding: '0.5rem' }} onClick={() => navigate(`/product/${item.slug}`)}>
                        View Product
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2>Notifications</h2>
              {notifications.length === 0 ? (
                <p style={{ color: 'var(--admin-text-dim)' }}>You have no new notifications.</p>
              ) : (
                notifications.map(note => (
                  <div key={note.id} className="profile-notification">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4>{note.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)' }}>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p>{note.message}</p>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
