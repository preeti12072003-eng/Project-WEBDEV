import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ activeDonors: 0, activeReceivers: 0 });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [s, u] = await Promise.all([api('/admin/stats'), api('/admin/users')]);
      setStats(s);
      setUsers(u);
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => { load(); }, []);

  const toggle = async (id) => {
    setError('');
    try {
      await api(`/admin/users/${id}/status`, { method: 'PATCH' });
      load(); // refresh table and counts
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1>Admin Dashboard</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="stat-grid">
        <div className="card stat">
          <span className="muted">Total Active Donors</span>
          <strong>{stats.activeDonors}</strong>
        </div>
        <div className="card stat">
          <span className="muted">Total Active Receivers</span>
          <strong>{stats.activeReceivers}</strong>
        </div>
      </div>

      <section className="card">
        <h2>User Management</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan={5} className="muted">No users yet.</td></tr>
              )}
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge role-${u.role}`}>{u.role}</span></td>
                  <td><span className={`badge ${u.status}`}>{u.status}</span></td>
                  <td>
                    <button
                      className={`btn ${u.status === 'active' ? 'btn-danger' : 'btn-primary'}`}
                      onClick={() => toggle(u._id)}
                    >
                      {u.status === 'active' ? 'Block' : 'Unblock'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
