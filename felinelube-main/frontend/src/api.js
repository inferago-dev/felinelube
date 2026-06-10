// Central API configuration
// Automatically switches between local dev and production
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168');
export const SERVER_BASE = isLocal
  ? `http://${window.location.hostname}:5000`
  : 'https://felinelube.onrender.com'
  
const API_BASE = `${SERVER_BASE}/api`

export default API_BASE

// Helper: get auth headers for regular user
export const authHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token')
  const headers = {}
  if (!isFormData) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

// Helper: get auth headers for admin
export const adminAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('adminToken')
  const headers = {}
  if (!isFormData) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}
