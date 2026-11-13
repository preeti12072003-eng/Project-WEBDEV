const express = require('express');
const { getStats, getUsers, toggleStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id/status', toggleStatus);

module.exports = router;
