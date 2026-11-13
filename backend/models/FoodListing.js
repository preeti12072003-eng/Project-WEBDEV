const mongoose = require('mongoose');

const foodListingSchema = new mongoose.Schema(
  {
    foodName: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, trim: true }, // e.g. "30 Plates"
    address: { type: String, required: true, trim: true }, // pickup address
    expiryHours: { type: String, required: true, trim: true }, // e.g. "4 Hours"
    status: { type: String, enum: ['available', 'claimed'], default: 'available' },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true } 
);

module.exports = mongoose.model('FoodListing', foodListingSchema);
