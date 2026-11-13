import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, homeForRole } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await login(form.email, form.password);
      navigate(homeForRole(user.role)); // redirect based on role
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card auth-card">
      <h2>Welcome back</h2>
      <p className="muted">Log in to share or receive surplus food.</p>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={onChange} required />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={onChange} required />
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Logging in...' : 'Login'}</button>
      </form>
      <p className="muted small">New here? <Link to="/register">Create an account</Link></p>
    </div>
  );
}
