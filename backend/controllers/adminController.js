const User = require('../models/User');

// GET /api/admin/stats - counts for the summary cards
exports.getStats = async (req, res) => {
  try {
    const [activeDonors, activeReceivers] = await Promise.all([
      User.countDocuments({ role: 'donor', status: 'active' }),
      User.countDocuments({ role: 'receiver', status: 'active' }),
    ]);
    res.json({ activeDonors, activeReceivers });
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch stats', error: err.message });
  }
};

// GET /api/admin/users - every user except admins
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch users', error: err.message });
  }
};

// PATCH /api/admin/users/:id/status - toggle active <-> blocked
exports.toggleStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admin accounts cannot be blocked' });
    }
    user.status = user.status === 'active' ? 'blocked' : 'active';
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Could not update status', error: err.message });
  }
};
