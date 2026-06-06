// Central API configuration
// Automatically switches between local dev and production
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
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
