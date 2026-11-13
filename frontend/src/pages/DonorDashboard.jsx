import { useEffect, useState } from 'react';
import { api } from '../api.js';

const emptyForm = { foodName: '', quantity: '', address: '', expiryHours: '' };

export default function DonorDashboard() {
  const [form, setForm] = useState(emptyForm);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api('/food/mine').then(setListings).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setBusy(true);
    try {
      await api('/food', { method: 'POST', body: form });
      setForm(emptyForm);
      setSuccess('Listing posted. Thank you for reducing food waste!');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1>Donor Dashboard</h1>

      <section className="card">
        <h2>Post surplus food</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={onSubmit} className="grid-form">
          <div>
            <label>Food Name</label>
            <input name="foodName" placeholder="e.g. Veg Biryani" value={form.foodName} onChange={onChange} required />
          </div>
          <div>
            <label>Quantity</label>
            <input name="quantity" placeholder="e.g. 30 Plates" value={form.quantity} onChange={onChange} required />
          </div>
          <div>
            <label>Pickup Address</label>
            <input name="address" value={form.address} onChange={onChange} required />
          </div>
          <div>
            <label>Expiry Window</label>
            <input name="expiryHours" placeholder="e.g. 4 Hours" value={form.expiryHours} onChange={onChange} required />
          </div>
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Posting...' : 'Post Listing'}</button>
        </form>
      </section>

      <section className="card">
        <h2>My Posted Listings</h2>
        {listings.length === 0 ? (
          <p className="muted">You haven't posted anything yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Food</th><th>Quantity</th><th>Pickup Address</th><th>Expiry</th><th>Status</th><th>Claimed By</th></tr>
              </thead>
              <tbody>
                {listings.map((l) => (
                  <tr key={l._id}>
                    <td>{l.foodName}</td>
                    <td>{l.quantity}</td>
                    <td>{l.address}</td>
                    <td>{l.expiryHours}</td>
                    <td><span className={`badge ${l.status}`}>{l.status === 'available' ? 'Available' : 'Claimed'}</span></td>
                    <td>{l.claimedBy ? `${l.claimedBy.name} (${l.claimedBy.phone})` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
