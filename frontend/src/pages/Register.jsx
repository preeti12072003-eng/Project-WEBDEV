import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, homeForRole } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', address: '', role: 'donor',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await register(form);
      navigate(homeForRole(user.role));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card auth-card">
      <h2>Join FoodRescue</h2>
      <p className="muted">Help turn surplus food into meals.</p>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={onSubmit}>
        <label>I am a</label>
        <select name="role" value={form.role} onChange={onChange}>
          <option value="donor">Donor (Canteen, Mess, Restaurant, Event Lawn)</option>
          <option value="receiver">Receiver (NGO, Shelter, Volunteer)</option>
        </select>
        <label>Name / Organisation</label>
        <input name="name" value={form.name} onChange={onChange} required />
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={onChange} required />
        <label>Password (min 6 characters)</label>
        <input name="password" type="password" minLength={6} value={form.password} onChange={onChange} required />
        <label>Phone Number</label>
        <input name="phone" value={form.phone} onChange={onChange} required />
        <label>Address</label>
        <textarea name="address" rows={2} value={form.address} onChange={onChange} required />
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Creating...' : 'Register'}</button>
      </form>
      <p className="muted small">Already registered? <Link to="/login">Login</Link></p>
    </div>
  );
}
