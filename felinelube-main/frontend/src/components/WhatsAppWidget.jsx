import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { HiX } from 'react-icons/hi'

export default function WhatsAppWidget() {
  const [showTooltip, setShowTooltip] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Show the tooltip popup after 3 seconds
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setShowTooltip(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [isDismissed])

  const handleCloseTooltip = (e) => {
    e.stopPropagation()
    setShowTooltip(false)
    setIsDismissed(true)
  }

  const handleWhatsAppClick = () => {
    window.open('https://api.whatsapp.com/send/?phone=60123315585&text=Hi%20Feline%20Lube%2C%20I%20have%20a%20question%20about...', '_blank')
  }

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', pointerEvents: 'none' }}>
      
      {/* Tooltip Popup */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              marginBottom: '12px',
              padding: '12px 16px',
              borderRadius: '16px',
              background: 'rgba(17, 17, 17, 0.95)',
              border: '1px solid rgba(37, 211, 102, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(37, 211, 102, 0.1)',
              color: '#f0f0f0',
              fontSize: '0.85rem',
              maxWidth: '260px',
              position: 'relative',
              pointerEvents: 'auto',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer'
            }}
            onClick={handleWhatsAppClick}
          >
            <button 
              onClick={handleCloseTooltip}
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                background: 'transparent',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px',
                borderRadius: '50%'
              }}
            >
              <HiX size={12} />
            </button>
            <div style={{ fontWeight: '700', color: '#25D366', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaWhatsapp size={16} /> WhatsApp Support
            </div>
            <div style={{ fontSize: '0.8rem', lineHeight: '1.4', color: '#ccc' }}>
              Hi there! 👋 Need help choosing engine oil? Chat with us live!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{ pointerEvents: 'auto' }}
      >
        <button
          onClick={handleWhatsAppClick}
          onMouseEnter={() => { if (!isDismissed) setShowTooltip(true) }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#25D366',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            position: 'relative'
          }}
        >
          {/* Pulsing ring animation */}
          <div style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            border: '2px solid #25D366',
            opacity: 0.6,
            animation: 'wa-pulse 2s infinite'
          }} />
          <FaWhatsapp size={32} />
        </button>
      </motion.div>

      {/* Style injection for pulse animation */}
      <style>{`
        @keyframes wa-pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.8;
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5);
          }
          70% {
            transform: scale(1.15);
            opacity: 0;
            box-shadow: 0 0 0 10px rgba(37, 211, 102, 0);
          }
          100% {
            transform: scale(0.95);
            opacity: 0;
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }
      `}</style>
    </div>
  )
}
