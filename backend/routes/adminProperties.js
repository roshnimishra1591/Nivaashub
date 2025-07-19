import express from 'express';
import Property from '../models/Property.js';
const router = express.Router();

// Get all properties (with optional status/search filters)
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    const properties = await Property.find(filter).populate('owner');
    res.json({ properties });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch properties', error: err.message });
  }
});

// Get a single property by ID
router.get('/property/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    // Check if property is membersOnly
    if (property.membersOnly) {
      // Check for user token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Membership required to view this property.' });
      }
      const token = authHeader.split(' ')[1];
      const jwt = await import('jsonwebtoken').then(m => m.default);
      const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
      let userId;
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
      }
      // Check if user is a member
      const User = (await import('../models/User.js')).default;
      const user = await User.findById(userId);
      if (!user || !user.isMember) {
        return res.status(403).json({ message: 'Membership required to view this property.' });
      }
    }
    res.json({ property });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
