import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineUsers, HiOutlineEye } from 'react-icons/hi'
import { TbFlame } from 'react-icons/tb'
import API_BASE from '../api'

export default function SocialProofWidget() {
  const [stats, setStats] = useState({
    registeredCount: 154,
    activeViewers: 14,
    activeLoggedIn: 6
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/public-stats`)
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (err) {
        console.error('Failed to fetch public stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()

    // Refresh every 30 seconds for live updates
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(212, 160, 23, 0.15)',
        borderRadius: '12px',
        padding: '1.25rem',
        margin: '1.5rem 0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        backdropFilter: 'blur(8px)'
      }}
    >
      {/* 1. Active Viewers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TbFlame style={{ color: '#FF4D4D', fontSize: '1.25rem' }} />
          <span style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#FF4D4D',
            top: '-2px',
            right: '-2px',
            animation: 'pulse-red 2s infinite'
          }} />
        </div>
        <div style={{ color: 'var(--color-text)' }}>
          <span style={{ fontWeight: '700', color: '#FF4D4D' }}>{stats.activeViewers} people</span> are viewing this page right now
        </div>
      </div>

      {/* 2. Registered Users */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
        <HiOutlineUsers style={{ color: 'var(--color-gold)', fontSize: '1.25rem' }} />
        <div style={{ color: 'var(--color-text)' }}>
          Join <span style={{ fontWeight: '700', color: 'var(--color-gold)' }}>{stats.registeredCount}+ customers</span> registered on Feline Lube
        </div>
      </div>

      {/* 3. Logged-in Users */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <HiOutlineEye style={{ color: '#25D366', fontSize: '1.25rem' }} />
          <span style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#25D366',
            top: '-2px',
            right: '-2px',
            animation: 'pulse-green 2s infinite'
          }} />
        </div>
        <div style={{ color: 'var(--color-text)' }}>
          <span style={{ fontWeight: '700', color: '#25D366' }}>{stats.activeLoggedIn} users</span> currently logged in and shopping
        </div>
      </div>

      <style>{`
        @keyframes pulse-red {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.7);
          }
          70% {
            transform: scale(1.3);
            box-shadow: 0 0 0 6px rgba(255, 77, 77, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(255, 77, 77, 0);
          }
        }
        @keyframes pulse-green {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
          }
          70% {
            transform: scale(1.3);
            box-shadow: 0 0 0 6px rgba(37, 211, 102, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }
      `}</style>
    </motion.div>
  )
}
