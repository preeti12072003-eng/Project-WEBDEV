import { Link, useNavigate } from 'react-router-dom';
import { useAuth, homeForRole } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to={user ? homeForRole(user.role) : '/login'} className="brand">
        🍲 FoodRescue Network
      </Link>
      <div className="nav-right">
        {user ? (
          <>
            <span className="muted">
              {user.name} <span className={`badge role-${user.role}`}>{user.role}</span>
            </span>
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
