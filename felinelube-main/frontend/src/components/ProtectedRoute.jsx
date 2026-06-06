import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');

  if (!adminToken || !adminUser) {
    // Redirect to admin login
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
