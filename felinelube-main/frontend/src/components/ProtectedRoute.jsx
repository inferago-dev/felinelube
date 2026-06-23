import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import API_BASE, { adminAuthHeaders } from '../api';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/settings/admin/all`, { headers: adminAuthHeaders() });
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    verifySession();
  }, []);

  useEffect(() => {
    if (isAuthenticated !== true) return;

    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      // 60 minutes = 3600000 ms
      timeout = setTimeout(() => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login', { replace: true });
        alert('Your session has expired. Please log in again.');
      }, 3600000);
    };

    resetTimer();
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [isAuthenticated, navigate]);

  if (isAuthenticated === null) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: 'var(--color-gold)' }}>
        Loading session...
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
