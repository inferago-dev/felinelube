// Central API configuration
// Automatically switches between local dev and production
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168');
const API_BASE = isLocal
  ? `http://${window.location.hostname}:5000/api`
  : 'https://felinelube.onrender.com/api'

export default API_BASE

// Helper: get auth headers for regular user
export const authHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// Helper: get auth headers for admin
export const adminAuthHeaders = () => {
  const token = localStorage.getItem('adminToken')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}
