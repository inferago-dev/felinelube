import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import API_BASE from '../api';
import '../styles/Auth.css';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login as admin');
      }

      // Save token and admin user to localStorage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      }));

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'An error occurred during admin login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-login-page">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <div className="gold-text" style={{ fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            System Administration
          </div>
          <h2>Feline Admin Panel</h2>
          <p>Please enter your credentials to authenticate</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="email">Admin Email</label>
            <div className="auth-input-wrapper">
              <HiOutlineMail className="auth-input-icon" />
              <input 
                type="email" 
                id="email"
                className="auth-input"
                placeholder="admin@felinelube.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required 
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">Password</label>
            <div className="auth-input-wrapper">
              <HiOutlineLockClosed className="auth-input-icon" />
              <input 
                type="password" 
                id="password"
                className="auth-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required 
              />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading} style={{ background: 'var(--color-gold)', color: 'black', fontWeight: 'bold' }}>
            {loading ? 'Authenticating...' : 'Secure Log In'}
          </button>
        </form>

        <div className="auth-footer">
          <span className="auth-link" onClick={() => navigate('/')}>
            Back to Homepage
          </span>
        </div>
      </motion.div>
    </div>
  );
}
