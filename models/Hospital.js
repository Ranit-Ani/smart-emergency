const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  phone: { type: String, required: true },
  departments: [{ type: String }],
  emergency_services: { type: Boolean, default: true },
  emergency_available: { type: Boolean, default: true },
  rating: { type: Number, default: 4.0, min: 0, max: 5 },
  created_at: { type: Date, default: Date.now }
});

// Index for geo queries
hospitalSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('Hospital', hospitalSchema);
