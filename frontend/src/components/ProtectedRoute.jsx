import { Navigate } from 'react-router-dom';
import { useAuth, homeForRole } from '../context/AuthContext.jsx';

// Only lets the given role through; everyone else is redirected.
export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center muted">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={homeForRole(user.role)} replace />;
  return children;
}
