import { useEffect, useState } from 'react';
import { api } from '../api.js';

function FoodCard({ item, action }) {
  return (
    <div className="food-card">
      <h3>{item.foodName}</h3>
      <p><strong>Quantity:</strong> {item.quantity}</p>
      <p><strong>Pickup:</strong> {item.address}</p>
      <p><strong>Expires in:</strong> {item.expiryHours}</p>
      <p className="muted small">
        Donor: {item.donorId?.name} {item.donorId?.phone && `· ${item.donorId.phone}`}
      </p>
      {action}
    </div>
  );
}

export default function ReceiverDashboard() {
  const [available, setAvailable] = useState([]);
  const [claimed, setClaimed] = useState([]);
  const [error, setError] = useState('');
  const [claimingId, setClaimingId] = useState(null);

  const load = async () => {
    try {
      const [a, c] = await Promise.all([api('/food/available'), api('/food/claimed')]);
      setAvailable(a);
      setClaimed(c);
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => { load(); }, []);

  const claim = async (id) => {
    setError('');
    setClaimingId(id);
    try {
      await api(`/food/${id}/claim`, { method: 'PATCH' });
    } catch (err) {
      setError(err.message); // e.g. someone else claimed it first
    } finally {
      setClaimingId(null);
      load(); // always refresh so the list is up to date
    }
  };

  return (
    <>
      <h1>Receiver Dashboard</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <section>
        <h2>Available Food</h2>
        {available.length === 0 ? (
          <p className="muted">No food available right now. Please check back soon.</p>
        ) : (
          <div className="card-grid">
            {available.map((item) => (
              <FoodCard
                key={item._id}
                item={item}
                action={
                  <button
                    className="btn btn-primary"
                    disabled={claimingId === item._id}
                    onClick={() => claim(item._id)}
                  >
                    {claimingId === item._id ? 'Claiming...' : 'Claim Food'}
                  </button>
                }
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>My Claimed Food</h2>
        {claimed.length === 0 ? (
          <p className="muted">You haven't claimed any food yet.</p>
        ) : (
          <div className="card-grid">
            {claimed.map((item) => (
              <FoodCard key={item._id} item={item} action={<span className="badge claimed">Claimed</span>} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
