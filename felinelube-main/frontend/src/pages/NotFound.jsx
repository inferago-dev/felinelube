import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      color: '#fff',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{ fontSize: '6rem', color: 'var(--color-gold)', margin: '0', lineHeight: '1' }}>404</h1>
        <h2 style={{ fontSize: '2rem', margin: '1rem 0' }}>Page Not Found</h2>
        <p style={{ color: '#aaa', maxWidth: '400px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
          We're sorry, the page you requested could not be found. Please go back to the homepage.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="btn btn-primary"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}
