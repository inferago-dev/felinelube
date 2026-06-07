import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineMail, HiOutlineLogout } from 'react-icons/hi';
import '../styles/Auth.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="auth-page">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <h2>My Profile</h2>
          <p>Manage your account</p>
        </div>

        <div className="auth-form">
          <div className="auth-form-group">
            <label>Full Name</label>
            <div className="auth-input-wrapper">
              <HiOutlineUser className="auth-input-icon" />
              <input 
                type="text" 
                className="auth-input"
                value={user.name}
                disabled
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label>Email Address</label>
            <div className="auth-input-wrapper">
              <HiOutlineMail className="auth-input-icon" />
              <input 
                type="email" 
                className="auth-input"
                value={user.email}
                disabled
              />
            </div>
          </div>

          <button 
            type="button" 
            className="auth-button" 
            onClick={handleLogout}
            style={{ background: 'var(--color-error)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}
          >
            <HiOutlineLogout /> Log Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
