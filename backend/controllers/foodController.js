const FoodListing = require('../models/FoodListing');

// POST /api/food  (donor) - create a new listing
exports.createListing = async (req, res) => {
  try {
    const { foodName, quantity, address, expiryHours } = req.body;
    if (!foodName || !quantity || !address || !expiryHours) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const listing = await FoodListing.create({
      foodName,
      quantity,
      address,
      expiryHours,
      donorId: req.user._id,
    });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Could not create listing', error: err.message });
  }
};

// GET /api/food/mine  (donor) - listings posted by the logged-in donor
exports.getMyListings = async (req, res) => {
  try {
    const listings = await FoodListing.find({ donorId: req.user._id })
      .populate('claimedBy', 'name phone')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch listings', error: err.message });
  }
};

// GET /api/food/available  (receiver) - all open listings
exports.getAvailable = async (req, res) => {
  try {
    const listings = await FoodListing.find({ status: 'available' })
      .populate('donorId', 'name phone')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch listings', error: err.message });
  }
};

// GET /api/food/claimed  (receiver) - listings claimed by the logged-in receiver
exports.getMyClaimed = async (req, res) => {
  try {
    const listings = await FoodListing.find({ claimedBy: req.user._id })
      .populate('donorId', 'name phone')
      .sort({ updatedAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch claimed food', error: err.message });
  }
};

// PATCH /api/food/:id/claim  (receiver) - claim a listing
// The status check lives inside the query, so two receivers clicking at the
// same moment can never both win: only one update matches 'available'.
exports.claimListing = async (req, res) => {
  try {
    const listing = await FoodListing.findOneAndUpdate(
      { _id: req.params.id, status: 'available' },
      { status: 'claimed', claimedBy: req.user._id },
      { new: true }
    ).populate('donorId', 'name phone');

    if (!listing) {
      return res.status(409).json({ message: 'Sorry, this food was already claimed or does not exist' });
    }
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Could not claim food', error: err.message });
  }
};
