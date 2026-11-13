// Creates the first admin account. Run once with: npm run seed:admin
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = (process.env.ADMIN_EMAIL || 'admin@foodrescue.com').toLowerCase();

    if (await User.findOne({ email })) {
      console.log('Admin already exists:', email);
    } else {
      await User.create({
        name: process.env.ADMIN_NAME || 'System Admin',
        email,
        password: process.env.ADMIN_PASSWORD || 'Admin@12345',
        phone: '0000000000',
        address: 'Head Office',
        role: 'admin',
      });
      console.log('Admin created:', email);
    }
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
