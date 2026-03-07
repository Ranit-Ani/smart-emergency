const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const auth = require('../middleware/auth');

// Helper: Haversine distance (km)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// GET all hospitals
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ created_at: -1 });
    res.json({ success: true, data: hospitals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET nearby hospitals
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, department, radius = 20 } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng are required' });

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxRadius = parseFloat(radius);

    let query = {};
    if (department && department !== 'any') {
      query.departments = { $regex: new RegExp(department, 'i') };
    }

    const hospitals = await Hospital.find(query);
    const nearby = hospitals
      .map(h => {
        const distance = getDistance(userLat, userLng, h.latitude, h.longitude);
        return { ...h.toObject(), distance: Math.round(distance * 10) / 10 };
      })
      .filter(h => h.distance <= maxRadius)
      .sort((a, b) => a.distance - b.distance);

    res.json({ success: true, data: nearby, count: nearby.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single hospital
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    res.json({ success: true, data: hospital });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add hospital (admin)
router.post('/', auth, async (req, res) => {
  try {
    const hospital = new Hospital(req.body);
    await hospital.save();
    res.status(201).json({ success: true, data: hospital });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update hospital (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    res.json({ success: true, data: hospital });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE hospital (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    res.json({ success: true, message: 'Hospital deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
