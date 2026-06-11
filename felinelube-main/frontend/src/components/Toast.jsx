import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === 'success' ? '#4BB543' : '#ff4d4d';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: bgColor,
          color: '#fff',
          padding: '1rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <span>{type === 'success' ? '✓' : '⚠'}</span>
        {message}
        <button 
          onClick={onClose} 
          style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 'auto', fontSize: '1.2rem' }}
        >
          &times;
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
