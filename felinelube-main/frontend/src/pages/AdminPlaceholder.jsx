import { motion } from 'framer-motion';
import { HiOutlineLightBulb } from 'react-icons/hi';

export default function AdminPlaceholder({ title }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'white', padding: '2rem', textAlign: 'center' }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ background: 'rgba(212, 160, 23, 0.1)', border: '1px dashed var(--admin-accent)', borderRadius: '16px', padding: '3rem', maxWidth: '500px' }}
      >
        <HiOutlineLightBulb style={{ fontSize: '3.5rem', color: 'var(--admin-accent)', marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>{title}</h2>
        <p style={{ color: 'var(--admin-text-dim)', fontSize: '0.95rem', lineHeight: '1.6' }}>
          This administrative feature is currently under active development. Keep an eye out for system updates!
        </p>
      </motion.div>
    </div>
  );
}
