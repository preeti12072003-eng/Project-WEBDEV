const express = require('express');
const {
  createListing,
  getMyListings,
  getAvailable,
  getMyClaimed,
  claimListing,
} = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// Donor routes
router.post('/', authorize('donor'), createListing);
router.get('/mine', authorize('donor'), getMyListings);

// Receiver routes
router.get('/available', authorize('receiver'), getAvailable);
router.get('/claimed', authorize('receiver'), getMyClaimed);
router.patch('/:id/claim', authorize('receiver'), claimListing);

module.exports = router;
