const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies the JWT, loads the user, and rejects blocked accounts.
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
    if (!token) return res.status(401).json({ message: 'Not authorized, token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User no longer exists' });
    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Your account has been blocked' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

// Restricts a route to the given roles, e.g. authorize('donor').
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied for your role' });
  }
  next();
};

module.exports = { protect, authorize };
